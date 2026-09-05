# Transfer to Another Line – Support Snap Event Behavior Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 527 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ReassignSnapEB_2pages_new_2.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ReassignSnapEB_2pages_new_2.pdf>) |
| **People** | author — · PE Claire Wang · dev Eric |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | snap event behavior · transfer to another line · route reassignment · event transfer · calibration points · spanning event · non spanning event · point event |
| **Tools** | — |

## Summary

Test plan for the Transfer to Another Line method focusing on Snap Event Behavior in linear referencing. Covers testing with various route and event configurations including spanning, non-spanning, and point events, with scenarios involving transfer of entire routes, partial routes, calibration points, measure changes, and route renaming. Includes automation and verification steps to ensure correct event behavior and data integrity after reassignment.

## Related documents

<!-- related:begin -->
- [Transfer to Another Line – Support Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/transfer-to-another-line-support-snap-eb-rh-apr-2023-08.md>) — similar text 0.68 · 6 title words · 3 filename words · same kind/surface/pe/dev/folder <!-- rel:526 s=11.198 -->
- [Reassign - Transfer to Another Line with StayPut and Retire Event Behavior - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/5140-reassign-transfer-to-another-line-with-stayput-and-retire-eb.md>) — similar text 0.23 · 5 title words · 1 filename word · same kind/dev/folder <!-- rel:528 s=6.564 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5141-reassign-route-transfer-to-another-line-method-support-move.md>) — similar text 0.18 · 6 title words · 1 filename word · same kind/folder <!-- rel:533 s=6.223 -->
- [Support Event Behaviors for New Reassign Method: Transfer to another line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-for-new-reassign-method-transfer-to-another-line.md>) — similar text 0.26 · 5 title words · 1 filename word · same surface <!-- rel:572 s=4.841 -->
- [Relocate Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/relocate-events.md>) — similar text 0.39 · 1 filename word · same kind/surface/folder <!-- rel:521 s=4.182 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)
<!-- docs:end -->

---

## Overview
                                         1

Transfer to another line – Support
       Snap Event Behavior
            – Test Plan

https://devtopia.esri.com/ArcGISPro/ps
-location-referencing/issues/5143

PE: Claire Wang
Dev: Eric
2
Data:
                                                                             3
•   Test with FS in Pro
•   Test on a mix of RH and APR data, but line network only. No PoM is required
•   Test with projected data (make few cases in unprojected data that has routes on beginning and end of a line, with sparse vertices at lease 1 mile from each other)
•   Test line events (spanning and non-spanning) and point events
•   Test snap event behavior only
•   Test with “Transfer to another line” method only
•   Test time slicing
•   Test transferring entire route, multiple entire routes, partial route, and combinations
•   Test renaming target route(s) or not
•   Test changing measure(s) on target route(s) or not
•   Test transferring calibration points or not
•   Test both simple and few complex shapes
•   Test few cases with concurrencies
•   Test events that cover entire reassigned portion, more than reassigned portion, and shorter than reassigned portion
•   Test events on begin-end, begin-middle, middle-middle, and middleend of routes
                                                                                      4

Automation
•    Add to existing for projected data; create a new set under the same category (APR Python Tests) for cases in unprojected data
•    Runs in Python in Feature Service
•    Automations on existing event behaviors are unlikely to fail. However, if there is any, please fix. Depending on the scope, fixing automation can be logged as separate issues.

Documentation
•    Add a few examples to Reassign route event behavior topic to cover this
     Reassign method
                               Candidates for GCS testing: 1; 5-v2; 8b
Verification                   (repeat for pt, span, and nonspan
1.   Verify edit log (the changed routes (rows) in xml, pay attention to effective date)
2.   Verify for existing methods in Reassign, and Realign, snap still works the say it is today (Existing EB automation can help)
3.   Ensure shape, measure, and LRS attributes for all time slices on events are correct after running AEB
4.   Verify a new event record is created if event changes line-ship (the line that the routes with the event belong to)
5.   Verify source routes are recalibrated downstream and calibrate event behavior will apply to the downstream events if Recalibrate source routes downstream checked

## Test Cases

### TC-P01 — Transfer To New Line – Transfer 3 Entire Simple Routes; Transfer CP (case 1) <!-- src: S6 · page 4 · case 1 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures
       keep original route name/id
                                                                                          CW58_1A

### TC-P02 — Transfer To New Line - 2 Separate Transfers; Transfer CP; Keep Original Measures <!-- src: S6 · page 4 · case 1-b -->

- **Group:** Spanning Events
        partial routes change route name/id                                               CW55_1A

### TC-P03 — Transfer To New Line – Transfer 3 Entire Simple Routes; Not Transfer CP <!-- src: S6 · page 4 · case 2 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes; not transfer CP; change measures
       change 1 route name/id                                                             CW52_1A

### TC-P04 — Transfer To New Line – Transfer 1 Entire Simple Route; Transfer CP (case 3) <!-- src: S6 · page 4 · case 3 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures
       keep original route name/id                                                        CW49_1A

### TC-P05 — Transfer To New Line – Transfer 1 Entire Simple Route; Transfer CP (case 3-b) <!-- src: S6 · page 4 · case 3-b -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original route name/id; effective date is route start date CW46_1A

### TC-P06 — Transfer To New Line – Transfer 1 Entire Loop; Transfer CP; Change Measures <!-- src: S6 · page 4 · case 4 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 1 entire loop; transfer CP; change measures; keep original route name/id loopCW4_1A

### TC-P07 — Transfer To New Line – Transfer 0.5+1+0.5 Simple Routes; Transfer CP (case 5) <!-- src: S6 · page 4 · case 5 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id (2 variations for source recalibration) CW40_1A CW37_1A

### TC-P08 — Transfer To New Line – Transfer 0.5 Route; Transfer CP; Change Measures (case 5-b) <!-- src: S6 · page 4 · case 5-b -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 0.5 route; transfer CP; change measures; partial route changes route name/id; recalibrate source downstream CW34_1A

### TC-P09 — Transfer To New Line – Transfer 0.5+1 Simple Routes; Transfer CP (case 6) <!-- src: S6 · page 4 · case 6 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to change route name/id CW31_1A

### TC-P10 — Transfer To New Line (case 7) <!-- src: S6 · page 4 · case 7 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes that have concurrent routes that have events; transfer CP; change measures on 1 route; change 1 route name/id CW28_1A

### TC-P11 — Transfer To New Line – Transfer 1+0.5 Simple Routes (case 8) <!-- src: S6 · page 4 · case 8 -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP; change measures on 0.5 route; partial routes have to change route name/id CW25_1A

### TC-P12 — Transfer To New Line – Transfer 3 Simple Routes (case 8-b) <!-- src: S6 · page 4 · case 8-b -->

- **Group:** Spanning Events
- **Case:** Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not transfer CP CW22_1A

### TC-P13 — Transfer To New Line – Transfer 3 Entire Simple Routes; Transfer CP (case 9) <!-- src: S6 · page 5 · case 9 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original
6 route name/id
                                                                                                    CW58_1A

### TC-P14 — Transfer To New Line - 2 Separate Transfers; Transfer CP (case 9-b) <!-- src: S6 · page 5 · case 9-b -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line - 2 separate transfers; transfer CP; keep original measures; partial routes change name/id CW55_1A

### TC-P15 — Transfer To New Line - Transfer 1 Entire Simple Route; Not Transfer CP <!-- src: S6 · page 5 · case 10 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line - transfer 1 entire simple route; not transfer CP; keep original measures; keep original route name/id CW19_1A

### TC-P16 — Transfer To New Line – Transfer 0.5+1+0.5 Simple Routes; Transfer CP (case 11) <!-- src: S6 · page 5 · case 11 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id (2 variations for source recalibration)
                                                                                    CW40_1A CW37_1A

### TC-P17 — Transfer To New Line – Transfer 0.5 Route; Transfer CP; Change Measures (case 11-b) <!-- src: S6 · page 5 · case 11-b -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 0.5 route; transfer CP; change measures; partial route change route name/id; recalibrate source downstream
                                                                                                    CW34_1A

### TC-P18 — Transfer To New Line – Transfer 0.5+1 Simple Routes; Transfer CP (case 12) <!-- src: S6 · page 5 · case 12 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to change route name/id
                                                                                                    CW31_1A

### TC-P19 — Transfer To New Line (case 13) <!-- src: S6 · page 5 · case 13 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes that have concurrent routes that have events
      transfer CP; change measures on 1 route; change 1 route name/id                               CW28_1A

### TC-P20 — Transfer To New Line – Transfer 1+0.5 Simple Routes (case 14) <!-- src: S6 · page 5 · case 14 -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP; change measures on 0.5 route
      partial routes have to change route name/id
                                                                                                    CW25_1A

### TC-P21 — Transfer To New Line – Transfer 3 Simple Routes (case 14-b) <!-- src: S6 · page 5 · case 14-b -->

- **Group:** Non-spanning Events
- **Case:** Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices
        not transfer CP

### TC-P22 — Transfer To New Line – Transfer 3 Entire Simple Routes; Transfer CP (case 15) <!-- src: S6 · page 5 · case 15 -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original route name/id
                                                                                                    CW58_1A

### TC-P23 — Transfer To New Line - 2 Separate Transfers; Transfer CP (case 15-b) <!-- src: S6 · page 5 · case 15-b -->

- **Group:** Point Events
- **Case:** Transfer to New Line - 2 separate transfers; transfer CP; keep original measures; partial routes change route name/id CW55_1A

### TC-P24 — Transfer To New Line – Transfer 1 Entire Simple Route; Not Transfer CP <!-- src: S6 · page 5 · case 16 -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep original route name/id CW19_1A

### TC-P25 — Transfer To New Line – Transfer 1 Entire Simple Route; Transfer CP (case 16-b) <!-- src: S6 · page 5 · case 16-b -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original route name/id; effective date is route start date CW46_1A

### TC-P26 — Transfer To New Line – Transfer 0.5+1 Simple Routes; Not Transfer CP <!-- src: S6 · page 5 · case 17 -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial routes have to change route name/id CW16_1A

### TC-P27 — Transfer To New Line – Transfer 0.5 Route; Transfer CP; Change Measures (case 17-b) <!-- src: S6 · page 5 · case 17-b -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 0.5 route; transfer CP; change measures; partial route changes route name.id; recalibrate source downstream CW34_1A

### TC-P28 — Transfer To New Line (case 18) <!-- src: S6 · page 5 · case 18 -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 3 entire simple routes that have concurrent routes that have events
      transfer CP; change measures on 1 route; change 1 route name/id                               CW28_1A

### TC-P29 — Transfer To New Line – Transfer 1+0.5 Simple Routes (case 19) <!-- src: S6 · page 5 · case 19 -->

- **Group:** Point Events
- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP; change measures on 0.5 route
      partial routes have to change route name/id                                                   CW25_1A

## Other content
There is no negative case (Loc error)
Legend

    4                    3              2                                 0       1                          4
0                                                                                                                2                       8
                                                                              8
                     1A, 100                                                          3B, 300
1

                  Route

                                                                                                                                         3C, 300
                                                                2B, 200

                                                                                                   1C, 100
        2A, 200

                  direction                                                   5
                                Route name
                                & line order
                                                                                                                 5

                   3A, 300                  3       1B, 100          5                                           6
                                                                                                                        2C, 200
2                                                                             4                                                           6
    0                           3       4                                                                    2            3          4

Calibration point

                                       Each color represents a different line

                                    Source Start and End

                                                     Spanning Event

                                                Non-spanning Event

                        Point Event
         Rname                 Line Name           Line Order   From Date                To Date                 From M       To M
         1A                    Red                 100          1/1/2000                 null                    2            4
    Route table
    Event ID                 From Date          To Date From Route ID To Route ID From M                             To M Location Error
    Event1                   1/1/2000           <Null> R1             R3          7                                  90   No Error
    Event table
                                                                                      8
                                                                          0-0.3 rt
                                                                       0.25-0.75 rt
                                                                        0.5-1 rt
                                                                          1 rt
                                                                        0.3+1 rt
                                                                        1+0.5 rt
                                                                      0.5+1+0.5 rt

          0
              4      3          2
                                            4      3          2
                                                                          3 rt
                                        0

          1
                  1A, 100               1
                                                1A, 100
                                                                          0-0.3 rt
2A, 200

                                                                       0.25-0.75 rt
                                                                        0.5-1 rt
                  3A, 300                       3A, 300                   1 rt
                                    3
          2
              0             3   4       2
                                                                  3
                                                                        0.3+1 rt
                                            0             3   4

                                                                        1+0.5 rt
                                                                      0.5+1+0.5 rt
                                                                           3 rt

middle on boundary
1/4 start end
Test case 1: Transfer to New Line – transfer 3 entire simple routes;                                                          9 transfer CP; keep original measures; keep original route name/id

      Before
                4           3           2                                0        1                         4
            0                                                                                                   2                       8
                                                                             8
                                                                                      3B, 300
            1
                         1A, 100

                                                                                                                                        3C, 300
                                                               2B, 200

                                                                                                  1C, 100
2A, 200

                                                                             5

                         3A, 300                                                                                5

                                            3     1B, 100           5                                           6
                                                                                                                     2C, 200
            2                                                                4                                                           6
                0                  3    4                                                                   2           3           4

                Rname           Line Name       Line Order    From Date                To Date              From M          To M
                1A              Red             100           1/1/2000                 null                 2               4
                2A              Red             200           1/1/2000                 null                 0               2
                3A              Red             300           1/1/2000                 null                 0               4
                1B              Blue            100           1/1/2000                 null                 3               5
                2B              Blue            200           1/1/2000                 null                 4               8
                3B              Blue            300           1/1/2000                 null                 0               4
                1C              Gray            100           1/1/2000                 null                 2               6
                2C              Gray            200           1/1/2000                 null                 2               4
                3C              Gray            300           1/1/2000                 null                 6               8

          Event ID        From Date         To Date   From Route ID              To Route ID     From M             To M    Location Error
          S1              1/1/2000          <Null>    1A                         1A              2                  2.5     No Error
          S2              1/1/2000          <Null>    2A                         2A              1                  1.5     No Error
          S3              1/1/2000          <Null>    1A                         1A              3                  4       No Error
          S4              1/1/2000          <Null>    3A                         3A              0                  4       No Error
          S5              1/1/2000          <Null>    2A                         3A              1.75               4       No Error
          S6              1/1/2000          <Null>    1A                         2A              2                  1.25    No Error
          S7              1/1/2000          <Null>    1A                         3A              3                  2       No Error
          S8              1/1/2000          <Null>    1A                         3A              2                  4       No Error

          Showing this event for once to indicate events on other lines will not be affected

          Event ID        From Date         To Date From Route ID To Route ID From M                                To M Location Error
          S_blue          1/1/2000          <Null> 1B             2B          4                                     5    No Error

                                Effective date is 1/1/2020
                                Recal downstream unchecked
Test case 1: Transfer to New Line – transfer 3 entire simple routes;                                                   10 transfer CP; keep original measures; keep original route name/id

      After
              4           3          2                                0       1                       4
          0                                                                                               2                    8
                                                                          8
                                                                                  3B, 300
          1
                       1A, 100

                                                                                                                               3C, 300
                                                            2B, 200

                                                                                            1C, 100
2A, 200

                                                                          5

                       3A, 300                                                                            5

                                         3       1B, 100         5                                        6
                                                                                                              2C, 200
          2                                                               4                                                     6
              0                  3   4                                                                2          3         4

             Rname     Line Name Line Order From Date To Date         From M     To M
             1A        Red         100       1/1/2000    1/1/2020     2          4
             2A        Red         200       1/1/2000    1/1/2020     0          2
             3A        Red         300       1/1/2000    1/1/2020     0          4
             1A        Teal        100       1/1/2020    null         2          4
             2A        Teal        200       1/1/2020    null         0          2
             3A        Teal        300       1/1/2020    null         0          4
             1B        Blue        100       1/1/2000    null         3          5
             2B        Blue        200       1/1/2000    null         4          8
             3B        Blue        300       1/1/2000    null         0          4
             1C        Gray        100       1/1/2000    null         2          6
             2C        Gray        200       1/1/2000    null         2          4
             3C        Gray        300       1/1/2000    null         6          8
          Event ID From Date To Date   From Route ID To Route ID From M     To M Location Error
          S1       1/1/2000   1/1/2020 1A            1A          2          2.5   No Error
          S2       1/1/2000   1/1/2020 2A            2A          1          1.5   No Error
          S3       1/1/2000   1/1/2020 1A            1A          3          4     No Error
          S4       1/1/2000   1/1/2020 3A            3A          0          4     No Error
          S5       1/1/2000   1/1/2020 2A            3A          1.75       4     No Error
          S6       1/1/2000   1/1/2020 1A            2A          2          1.25 No Error
          S7       1/1/2000   1/1/2020 1A            3A          3          2     No Error
          S8       1/1/2000   1/1/2020 1A            3A          2          4     No Error
          S1       1/1/2020   <Null>   1A            1A          2          2.5   No Error
          S2       1/1/2020   <Null>   2A            2A          1          1.5   No Error
          S3       1/1/2020   <Null>   1A            1A          3          4     No Error
          S4       1/1/2020   <Null>   3A            3A          0          4     No Error
          S5       1/1/2020   <Null>   2A            3A          1.75       4     No Error
          S6       1/1/2020   <Null>   1A            2A          2          1.25 No Error
          S7       1/1/2020   <Null>   1A            3A          3          2     No Error
          S8       1/1/2020   <Null>   1A            3A          2          4     No Error
          Event ID       From Date           To Date From Route ID To Route ID From M                         To M Location Error
          S_blue         1/1/2000            <Null> 1B             2B          4                              5    No Error
Test case 1-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                   11 keep original measures; partial routes change route name/id

Before
     4           3          2                               0        1                         4
                                                                                                   2                      8
                                                                8
                                                                         3B, 300
 5

                                                                                                                          3C, 300
                                                  2B, 200

                                                                                     1C, 100
              1A, 100                                           5

                                                                                                   5

                                3     1B, 100          5                                           6
                                                                                                        2C, 200
 6                                                              4                                                          6
                        7   8                                                                  2          3           4

     Rname           Line Name      Line Order   From Date                To Date              From M         To M
     1A              Red            100          1/1/2000                 null                 2              8
     1B              Blue           100          1/1/2000                 null                 3              5
     2B              Blue           200          1/1/2000                 null                 4              8
     3B              Blue           300          1/1/2000                 null                 0              4
     1C              Gray           100          1/1/2000                 null                 2              6
     2C              Gray           200          1/1/2000                 null                 2              4
     3C              Gray           300          1/1/2000                 null                 6              8

Event ID       From Date        To Date   From Route ID             To Route ID     From M             To M   Location Error
S1             1/1/2000         <Null>    1A                        1A              2                  2.5    No Error
S2             1/1/2000         <Null>    1A                        1A              5                  5.5    No Error
S3             1/1/2000         <Null>    1A                        1A              3                  4      No Error
S4             1/1/2000         <Null>    1A                        1A              6                  8      No Error
S5             1/1/2000         <Null>    1A                        1A              5.75               8      No Error
S6             1/1/2000         <Null>    1A                        1A              2                  5.25   No Error
S7             1/1/2000         <Null>    1A                        1A              3                  6.5    No Error
S8             1/1/2000         <Null>    1A                        1A              2                  8      No Error

                     First transfer is 1/1/2020
                     Second transfer is 1/1/2030
                     Recal downstream unchecked
Test case 1-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                                      12 keep original measures; partial routes change route name/id

        After
                    4             3           2                                   0        1                         4
               4                                                                                                         2                                  8
                                                                                      8
                                                                                               3B, 300
1A_reassign,

               5
                             1A, 100

                                                                                                                                                            3C, 300
                                                                        2B, 200

                                                                                                           1C, 100
                                                                                      5
100

                          1A_reassign_reassign,
                                                                                                                         5
                          100
                                                  3      1B, 100             5                                           6
                                                                                                                               2C, 200
               6                                                                      4                                                                      6
                    6                   7     8                                                                      2               3                  4

                    Rname             Line Name       Line Order      From Date                 To Date              From M              To M
                    1A                Red             100             1/1/2000                  1/1/2020             2                   8
                    1A                Red             100             1/1/2020                  null                 2                   4
                    1A_reassign       Teal            100             1/1/2020                  1/1/2030             4                   8
                    1A_reassign       Teal            100             1/1/2030                  null                 4                   6
1A_reassign_      Yellow          100             1/1/2030                  null                 6                   8 reassign
                    1B                Blue            100             1/1/2000                  null                 3                   5
                    2B                Blue            200             1/1/2000                  null                 4                   8
                    3B                Blue            300             1/1/2000                  null                 0                   4
                    1C                Gray            100             1/1/2000                  null                 2                   6
                    2C                Gray            200             1/1/2000                  null                 2                   4
                    3C                Gray            300             1/1/2000                  null                 6                   8
               Event ID       From Date       To Date       From Route ID                 To Route ID From M                  To M           Location Error
               S1             1/1/2000        <Null>        1A                            1A          2                       2.5            No Error
               S2             1/1/2000        1/1/2020      1A                            1A          5                       5.5            No Error
               S2             1/1/2020        <Null>        1A_reassign                   1A_reassign 5                       5.5            No Error
               S3             1/1/2000        <Null>        1A                            1A          3                       4              No Error
               S4             1/1/2000        1/1/2020      1A                            1A          6                       8              No Error
               S4             1/1/2020        1/1/2030      1A_reassign                   1A_reassign 6                       8              No Error
               S4             1/1/2030        null          1A_reassign_reassign 1A_reassign_reassign 6                       8              No Error
               S5             1/1/2000        1/1/2020      1A                   1A                   5.75                    8              No Error
               S5             1/1/2020        1/1/2030      1A_reassign          1A_reassign          5.75                    8              No Error
               S5             1/1/2030        null          1A_reassign          1A_reassign          5.75                    6              No Error
S5             1/1/2030        null          1A_reassign_reassi 1A_reassign_reassi 6                           8              No Error gn                            gn
               S6             1/1/2000        1/1/2020      1A                            1A          2                       5.25           No Error
               S6             1/1/2020        <Null>        1A                            1A          2                       4              No Error
               S6             1/1/2020        <Null>        1A_reassign                   1A_reassign 4                       5.25           No Error
               S7             1/1/2000        1/1/2020      1A                            1A          3                       6.5            No Error
               S7             1/1/2020        null          1A                            1A          3                       4              No Error
               S7             1/1/2020        1/1/2030      1A_reassign                   1A_reassign 4                       6.5            No Error
               S7             1/1/2030        null          1A_reassign                   1A_reassign 4                       6              No Error
               S7             1/1/2030        null          1A_reassign_reassign 1A_reassign_reassign 6                       6.5            No Error
               S8             1/1/2000        1/1/2020      1A                   1A                   2                       8              No Error
               S8             1/1/2020        null          1A                   1A                   2                       4              No Error
               S8             1/1/2020        1/1/2030      1A_reassign          1A_reassign          4                       8              No Error
               S8             1/1/2030        null          1A_reassign          1A_reassign          4                       6              No Error
               S8             1/1/2030        null          1A_reassign_reassign 1A_reassign_reassign 6                       8              No Error
Test case 2: Transfer to New Line – transfer 3 entire simple routes; not                                                   13 transfer CP; change measures; change 1 route name/id

      Before
               4           3          2                               0        1                         4
           0                                                                                                 2                      8
                                                                          8
                                                                                   3B, 300
           1
                        1A, 100

                                                                                                                                    3C, 300
                                                            2B, 200

                                                                                               1C, 100
2A, 200

                                                                          5

                        3A, 300                                                                              5

                                          3     1B, 100          5                                           6
                                                                                                                  2C, 200
           2                                                              4                                                          6
               0                  3   4                                                                  2          3           4

               Rname           Line Name      Line Order   From Date                To Date              From M         To M
               1A              Red            100          1/1/2000                 null                 2              4
               2A              Red            200          1/1/2000                 null                 0              2
               3A              Red            300          1/1/2000                 null                 0              4
               1B              Blue           100          1/1/2000                 null                 3              5
               2B              Blue           200          1/1/2000                 null                 4              8
               3B              Blue           300          1/1/2000                 null                 0              4
               1C              Gray           100          1/1/2000                 null                 2              6
               2C              Gray           200          1/1/2000                 null                 2              4
               3C              Gray           300          1/1/2000                 null                 6              8

          Event ID       From Date        To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1             1/1/2000         <Null>    1A                        1A              2                  2.5    No Error
          S2             1/1/2000         <Null>    2A                        2A              1                  1.5    No Error
          S3             1/1/2000         <Null>    1A                        1A              3                  4      No Error
          S4             1/1/2000         <Null>    3A                        3A              0                  4      No Error
          S5             1/1/2000         <Null>    2A                        3A              1.75               4      No Error
          S6             1/1/2000         <Null>    1A                        2A              2                  1.25   No Error
          S7             1/1/2000         <Null>    1A                        3A              3                  2      No Error
          S8             1/1/2000         <Null>    1A                        3A              2                  4      No Error

                               Effective date is 1/1/2020
                               Recal downstream unchecked
Test case 2: Transfer to New Line – transfer 3 entire simple routes; not                                   14 transfer CP; change measures; change 1 route name/id

      After
           6                       2                         0       1                       4
                                                                                                 2                 8
          1                                                      8
                                                                         3B, 300
                       1A, 100

                                                                                                                   3C, 300
                                                   2B, 200

                                                                                   1C, 100
2A, 200

                                                                 5

                     3A_new, 300                                                                 5

                                   3     1B, 100        5                                        6
                                                                                                     2C, 200
                                                                 4                                                  6
          3
              0                    8                                                         2         3       4

             Rname      Line Name Line Order From Date To Date         From M     To M
             1A         Red         100       1/1/2000    1/1/2020     2          4
             2A         Red         200       1/1/2000    1/1/2020     0          2
             3A         Red         300       1/1/2000    1/1/2020     0          4
             1A         Teal        100       1/1/2020    null         2          6
             2A         Teal        200       1/1/2020    null         1          3
             3A_new     Teal        300       1/1/2020    null         0          8
             1B         Blue        100       1/1/2000    null         3          5
             2B         Blue        200       1/1/2000    null         4          8
             3B         Blue        300       1/1/2000    null         0          4
             1C         Gray        100       1/1/2000    null         2          6
             2C         Gray        200       1/1/2000    null         2          4
             3C         Gray        300       1/1/2000    null         6          8
          Event ID From Date To Date    From Route ID To Route ID From M     To M Location Error
          S1        1/1/2000   1/1/2020 1A            1A          2          2.5   No Error
          S2        1/1/2000   1/1/2020 2A            2A          1          1.5   No Error
          S3        1/1/2000   1/1/2020 1A            1A          3          4     No Error
          S4        1/1/2000   1/1/2020 3A            3A          0          4     No Error
          S5        1/1/2000   1/1/2020 2A            3A          1.75       4     No Error
          S6        1/1/2000   1/1/2020 1A            2A          2          1.25 No Error
          S7        1/1/2000   1/1/2020 1A            3A          3          2     No Error
          S8        1/1/2000   1/1/2020 1A            3A          2          4     No Error
          S1        1/1/2020   <Null>   1A            1A          2          3     No Error
          S2        1/1/2020   <Null>   2A            2A          1.5        2.5   No Error
          S3        1/1/2020   <Null>   1A            1A          4          6     No Error
          S4        1/1/2020   <Null>   3A_new        3A_new      0          8     No Error
          S5        1/1/2020   <Null>   2A            3A_new      2.5        8     No Error
          S6        1/1/2020   <Null>   1A            2A          2          2     No Error
          S7        1/1/2020   <Null>   1A            3A_new      4          4     No Error
          S8        1/1/2020   <Null>   1A            3A_new      2          8     No Error
Test case 3: Transfer to New Line – transfer 1 entire simple route;                                                       15 transfer CP; keep original measures; keep original route name/id
      Before
               4          3          2                               0        1                         4
           0                                                                                                2                      8
                                                                         8
                                                                                  3B, 300
           1
                       1A, 100

                                                                                                                                   3C, 300
                                                           2B, 200

                                                                                              1C, 100
2A, 200

                                                                         5

                       3A, 300                                                                              5

                                         3     1B, 100          5                                           6
                                                                                                                 2C, 200
           2                                                             4                                                          6
               0                 3   4                                                                  2          3           4

               Rname          Line Name      Line Order   From Date                To Date              From M         To M
               1A             Red            100          1/1/2000                 null                 2              4
               2A             Red            200          1/1/2000                 null                 0              2
               3A             Red            300          1/1/2000                 null                 0              4
               1B             Blue           100          1/1/2000                 null                 3              5
               2B             Blue           200          1/1/2000                 null                 4              8
               3B             Blue           300          1/1/2000                 null                 0              4
               1C             Gray           100          1/1/2000                 null                 2              6
               2C             Gray           200          1/1/2000                 null                 2              4
               3C             Gray           300          1/1/2000                 null                 6              8

          Event ID       From Date       To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1             1/1/2000        <Null>    3A                        3A              3                  4      No Error
          S2             1/1/2000        <Null>    3A                        3A              1                  3      No Error
          S3             1/1/2000        <Null>    3A                        3A              0                  2      No Error
          S4             1/1/2000        <Null>    3A                        3A              0                  4      No Error
          S5             1/1/2000        <Null>    2A                        3A              1.75               4      No Error
          S6             1/1/2000        <Null>    1A                        2A              2                  1.25   No Error
          S7             1/1/2000        <Null>    1A                        3A              3                  2      No Error
          S8             1/1/2000        <Null>    1A                        3A              2                  4      No Error

                              Effective date is 1/1/2020
                              Recal downstream unchecked
Test case 3: Transfer to New Line – transfer 1 entire simple route;                                               16 transfer CP; keep original measures; keep original route name/id
      After
               4          3          2                           0       1                       4
           0                                                                                         2                     8
                                                                     8
                                                                             3B, 300
           1
                       1A, 100

                                                                                                                           3C, 300
                                                       2B, 200

                                                                                       1C, 100
2A, 200

                                                                     5

                       3A, 100                                                                       5

                                         3   1B, 100        5                                        6
                                                                                                         2C, 200
           2                                                         4                                                      6
               0                 3   4                                                           2         3           4

             Rname      Line Name Line Order From Date To Date          From M                                 To M
             1A         Red          100       1/1/2000     null        2                                      4
             2A         Red          200       1/1/2000     null        0                                      2
             3A         Red          300       1/1/2000     1/1/2020    0                                      4
             3A         Teal         100       1/1/2020     null        0                                      4
             1B         Blue         100       1/1/2000     null        3                                      5
             2B         Blue         200       1/1/2000     null        4                                      8
             3B         Blue         300       1/1/2000     null        0                                      4
             1C         Gray         100       1/1/2000     null        2                                      6
             2C         Gray         200       1/1/2000     null        2                                      4
             3C         Gray         300       1/1/2000     null        6                                      8
          Event ID From Date To Date     From Route ID To Route ID From M    To M                              Location Error
          S1       1/1/2000    1/1/2020 3A             3A          3         4                                 No Error
          S1       1/1/2020    null      3A            3A          3         4                                 No Error
          S2       1/1/2000    1/1/2020 3A             3A          1         3                                 No Error
          S2       1/1/2020    null      3A            3A          1         3                                 No Error
          S3       1/1/2000    1/1/2020 3A             3A          0         2                                 No Error
          S3       1/1/2020    null      3A            3A          0         2                                 No Error
          S4       1/1/2000    1/1/2020 3A             3A          0         4                                 No Error
          S4       1/1/2020    null      3A            3A          0         4                                 No Error
          S5       1/1/2000    1/1/2020 2A             3A          1.75      4                                 No Error
          S5       1/1/2020    null      2A            2A          1.75      2                                 No Error
          S5       1/1/2020    null      3A            3A          0         4                                 No Error
          S6       1/1/2000    <Null>    1A            2A          2         1.25                              No Error
          S7       1/1/2000    1/1/2020 1A             3A          3         2                                 No Error
          S7       1/1/2020    null      1A            2A          3         2                                 No Error
          S7       1/1/2020    null      3A            3A          0         2                                 No Error
          S8       1/1/2000    1/1/2020 1A             3A          2         4                                 No Error
          S8       1/1/2020    null      1A            2A          2         2                                 No Error
          S8       1/1/2020    null      3A            3A          0         4                                 No Error
                   Test case 3-b: Transfer to New Line – transfer 1 entire simple route; transfer
CP; keep original measures; keep original route name/id; effective date is     17 route start date
      Before
               4           3          2                               0        1                         4
           0                                                                                                 2                      8
                                                                          8
                                                                                   3B, 300
           1
                        1A, 100

                                                                                                                                    3C, 300
                                                            2B, 200

                                                                                               1C, 100
2A, 200

                                                                          5

                        3A, 300                                                                              5

                                          3     1B, 100          5                                           6
                                                                                                                  2C, 200
           2                                                              4                                                          6
               0                  3   4                                                                  2          3           4

               Rname           Line Name      Line Order   From Date                To Date              From M         To M
               1A              Red            100          1/1/2000                 null                 2              4
               2A              Red            200          1/1/2000                 null                 0              2
               3A              Red            300          1/1/2000                 null                 0              4
               1B              Blue           100          1/1/2000                 null                 3              5
               2B              Blue           200          1/1/2000                 null                 4              8
               3B              Blue           300          1/1/2000                 null                 0              4
               1C              Gray           100          1/1/2000                 null                 2              6
               2C              Gray           200          1/1/2000                 null                 2              4
               3C              Gray           300          1/1/2000                 null                 6              8

          Event ID       From Date        To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1             1/1/2000         <Null>    3A                        3A              3                  4      No Error
          S2             1/1/2000         <Null>    3A                        3A              1                  3      No Error
          S3             1/1/2000         <Null>    3A                        3A              0                  2      No Error
          S4             1/1/2000         <Null>    3A                        3A              0                  4      No Error
          S5             1/1/2000         <Null>    2A                        3A              1.75               4      No Error
          S6             1/1/2000         <Null>    1A                        2A              2                  1.25   No Error
          S7             1/1/2000         <Null>    1A                        3A              3                  2      No Error
          S8             1/1/2000         <Null>    1A                        3A              2                  4      No Error

                               Effective date is 1/1/2000
                               Recal downstream unchecked
                   Test case 3-b: Transfer to New Line – transfer 1 entire simple route; transfer
CP; keep original measures; keep original route name/id; effective date is     18 route start date
      After
               4           3          2                               0        1                         4
           0                                                                                                 2                      8
                                                                          8
                                                                                   3B, 300
           1
                        1A, 100

                                                                                                                                    3C, 300
                                                            2B, 200

                                                                                               1C, 100
2A, 200

                                                                          5

                        3A, 100                                                                              5

                                          3     1B, 100          5                                           6
                                                                                                                  2C, 200
           2                                                              4                                                          6
               0                  3   4                                                                  2          3           4

               Rname           Line Name      Line Order   From Date                To Date              From M         To M
               1A              Red            100          1/1/2000                 null                 2              4
               2A              Red            200          1/1/2000                 null                 0              2
               3A              Teal           100          1/1/2000                 null                 0              4
               1B              Blue           100          1/1/2000                 null                 3              5
               2B              Blue           200          1/1/2000                 null                 4              8
               3B              Blue           300          1/1/2000                 null                 0              4
               1C              Gray           100          1/1/2000                 null                 2              6
               2C              Gray           200          1/1/2000                 null                 2              4
               3C              Gray           300          1/1/2000                 null                 6              8
          Event ID       From Date        To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1             1/1/2000         <Null>    3A                        3A              3                  4      No Error
          S2             1/1/2000         <Null>    3A                        3A              1                  3      No Error
          S3             1/1/2000         <Null>    3A                        3A              0                  2      No Error
          S4             1/1/2000         <Null>    3A                        3A              0                  4      No Error
          S5             1/1/2000         <Null>    2A                        2A              1.75               2      No Error
          S5             1/1/2000         <Null>    3A                        3A              0                  4      No Error
          S6             1/1/2000         <Null>    1A                        2A              2                  1.25   No Error
          S7             1/1/2000         <Null>    1A                        2A              3                  2      No Error
          S7             1/1/2000         <Null>    3A                        3A              0                  2      No Error
          S8             1/1/2000         <Null>    1A                        2A              2                  2      No Error
          S8             1/1/2000         <Null>    3A                        3A              0                  4      No Error
Test case 4: Transfer to New Line - transfer 1 entire loop;                                                                         19 transfer CP; change measures; keep original route name/id
          Before
               4          3                    2                               0        1                         4
           0                                                                                                          2                      8
                                                                                   8
                                           2                                                3B, 300
           1
                       2A, 200

                                                                                                                                             3C, 300
                                 1A, 100

                                                                     2B, 200

                                                                                                        1C, 100
3A, 300

                                                                                   5

                       4A, 400                                                                                        5

                                           0       3     1B, 100          5                                           6
                                                                                                                           2C, 200
           2                                                                       4                                                          6
               0                 3             4                                                                  2          3           4

               Rname          Line Name                Line Order   From Date                To Date              From M         To M
               1A             Red                      100          1/1/2000                 null                 0              2
               2A             Red                      200          1/1/2000                 null                 2              4
               3A             Red                      300          1/1/2000                 null                 0              2
               4A             Red                      400          1/1/2000                 null                 0              4
               1B             Blue                     100          1/1/2000                 null                 3              5
               2B             Blue                     200          1/1/2000                 null                 4              8
               3B             Blue                     300          1/1/2000                 null                 0              4
               1C             Gray                     100          1/1/2000                 null                 2              6
               2C             Gray                     200          1/1/2000                 null                 2              4
               3C             Gray                     300          1/1/2000                 null                 6              8
          Event ID       From Date                 To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1             1/1/2000                  <Null>    1A                        1A              0                  0.5    No Error
          S2             1/1/2000                  <Null>    3A                        3A              1                  1.5    No Error
          S3             1/1/2000                  <Null>    2A                        2A              3                  4      No Error
          S4             1/1/2000                  <Null>    4A                        4A              0                  4      No Error
          S5             1/1/2000                  <Null>    3A                        4A              1.75               4      No Error
          S6             1/1/2000                  <Null>    1A                        2A              0                  3      No Error
          S7             1/1/2000                  <Null>    1A                        4A              1                  2      No Error
          S8             1/1/2000                  <Null>    1A                        4A              0                  4      No Error

                              Effective date is 1/1/2020
                              Recal downstream unchecked
Test case 4: Transfer to New Line - transfer 1 entire loop;                                                             20 transfer CP; change measures; keep original route name/id
          After
               6          4                    2                           0       1                       4
           2                                                                                                   2                 8
                                                                               8
                                           8                                           3B, 300
           3           2A, 200

                                                                                                                                 3C, 300
                                 1A, 100

                                                                 2B, 200

                                                                                                 1C, 100
3A, 300

                                                                               5

                       4A, 400                                                                                 5

                                           0       3   1B, 100        5                                        6
                                                                                                                   2C, 200
           4                                                                   4                                                  6
               2                               4                                                           2         3       4
                                 3.5

             Rname      Line Name Line Order From Date To Date         From M    To M
             1A         Red         100       1/1/2000    1/1/2020     0         2
             2A         Red         200       1/1/2000    1/1/2020     2         4
             3A         Red         300       1/1/2000    1/1/2020     0         2
             4A         Red         400       1/1/2000    1/1/2020     0         4
             1A         Teal        100       1/1/2020    null         0         8
             2A         Teal        200       1/1/2020    null         2         6
             3A         Teal        300       1/1/2020    null         2         4
             4A         Teal        400       1/1/2020    null         2         4
             1B         Blue        100       1/1/2000    null         3         5
             2B         Blue        200       1/1/2000    null         4         8
             3B         Blue        300       1/1/2000    null         0         4
             1C         Gray        100       1/1/2000    null         2         6
             2C         Gray        200       1/1/2000    null         2         4
             3C         Gray        300       1/1/2000    null         6         8
          Event ID From Date To Date    From Route ID To Route ID From M    To M Location Error
          S1       1/1/2000    1/1/2020 1A            1A          0         0.5  No Error
          S2       1/1/2000    1/1/2020 3A            3A          1         1.5  No Error
          S3       1/1/2000    1/1/2020 2A            2A          3         4    No Error
          S4       1/1/2000    1/1/2020 4A            4A          0         4    No Error
          S5       1/1/2000    1/1/2020 3A            4A          1.75      4    No Error
          S6       1/1/2000    1/1/2020 1A            2A          0         3    No Error
          S7       1/1/2000    1/1/2020 1A            4A          1         2    No Error
          S8       1/1/2000    1/1/2020 1A            4A          0         4    No Error
          S1       1/1/2020    <Null>   1A            1A          0         2    No Error
          S2       1/1/2020    <Null>   3A            3A          3         3.5  No Error
          S3       1/1/2020    <Null>   2A            2A          4         6    No Error
          S4       1/1/2020    <Null>   4A            4A          2         4    No Error
          S5       1/1/2020    <Null>   3A            4A          3.75      4    No Error
          S6       1/1/2020    <Null>   1A            2A          0         4    No Error
          S7       1/1/2020    <Null>   1A            4A          4         3    No Error
          S8       1/1/2020    <Null>   1A            4A          0         4    No Error
              Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer
              CP; keep original measures; partial routes have to change route name/id                                                  21

          Before
                                                                2
          0
              4                  3           2                            1C, 100               4
                                                                                                    4
                                                                    1

                                                      3B, 300
          1            1A, 100
2A, 200

                                                                                      2C, 200
                                 5        2B, 200          8
                          5                                         0                               5
                       1B, 100

                                                 7

          2
                           4                                                                        8     3C, 300
              0                       3      4                                                                         3
                                                                                                2
                     3A, 300
                  Rname      Line Name               Line Order           From Date             To Date       From M       To M
                  1A         Red                     100                  1/1/2000              null          2            4
                  2A         Red                     200                  1/1/2000              null          0            2
                  3A         Red                     300                  1/1/2000              null          0            4
                  1B         Blue                    100                  1/1/2000              null          3            5
                  2B         Blue                    200                  1/1/2000              null          4            8
                  3B         Blue                    300                  1/1/2000              null          0            4
                  1C         Gray                    100                  1/1/2000              null          2            6
                  2C         Gray                    200                  1/1/2000              null          2            4
                  3C         Gray                    300                  1/1/2000              null          6            8

          Event ID               From Date       To Date            From Route ID   To Route ID           From M    To M   Location Error
          S1                     1/1/2000        <Null>             1A              1A                    2         2.5    No Error
          S2                     1/1/2000        <Null>             2A              2A                    1         1.5    No Error
          S3                     1/1/2000        <Null>             1A              1A                    3         4      No Error
          S4                     1/1/2000        <Null>             3A              3A                    0         4      No Error
          S5                     1/1/2000        <Null>             2A              3A                    1.75      4      No Error
          S6                     1/1/2000        <Null>             1A              2A                    2         1.25   No Error
          S7                     1/1/2000        <Null>             1A              3A                    3         2      No Error
          S8                     1/1/2000        <Null>             1A              3A                    2         4      No Error

                                     Effective date is 1/1/2020
This case has 2 variations. Recal downstream unchecked in result1, and checked in result 2
Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id – without recalibrate source downstream
                                                                                                                                                22
          After
                                                                      2
          0
              4                      3             2                            1C, 100                4
                                                                                                           4
                                                                          1

                                                            3B, 300
          1           1A_reassign, 1A, 100
                      100
2A, 200

                                                                                             2C, 200
                                     5         2B, 200           8
                              5                                           0                                5
                           1B, 100

                                                       7

                                         3A, 200
          2
                               4
                                                                                                           8      3C, 300
              0                      2     3       4
                                                                                                       2                       3
                  3A_reassign,
                  300

                  Rname                   Line Name        Line Order            From Date             To Date        From M       To M
                  1A                      Red              100                   1/1/2000              1/1/2020       2            4
                  1A                      Red              100                   1/1/2020              null           2            3
                  2A                      Red              200                   1/1/2000              1/1/2020       0            2
                  3A                      Red              300                   1/1/2000              1/1/2020       0            4
                  3A                      Red              200                   1/1/2020              null           2            4
                  1A_reassign             Teal             100                   1/1/2020              null           3            4
                  2A                      Teal             200                   1/1/2020              null           0            2
                  3A_reassign             Teal             300                   1/1/2020              null           0            2
                  1B                      Blue             100                   1/1/2000              null           3            5
                  2B                      Blue             200                   1/1/2000              null           4            8
                  3B                      Blue             300                   1/1/2000              null           0            4
                  1C                      Gray             100                   1/1/2000              null           2            6
                  2C                      Gray             200                   1/1/2000              null           2            4
                  3C                      Gray             300                   1/1/2000              null           6            8
          Event ID            From Date            To Date                From Route ID   To Route ID              From M   To M   Location Error
          S1                  1/1/2000             <Null>                 1A              1A                       2        2.5    No Error
          S2                  1/1/2000             1/1/2020               2A              2A                       1        1.5    No Error
          S2                  1/1/2020             null                   2A              2A                       1        1.5    No Error
          S3                  1/1/2000             1/1/2020               1A              1A                       3        4      No Error
          S3                  1/1/2020             null                   1A_reassign     1A_reassign              3        4      No Error
          S4                  1/1/2000             1/1/2020               3A              3A                       0        4      No Error
          S4                  1/1/2020             null                   3A_reassign     3A_reassign              0        2      No Error
          S4                  1/1/2020             null                   3A              3A                       2        4      No Error
          S5                  1/1/2000             1/1/2020               2A              3A                       1.75     4      No Error
          S5                  1/1/2020             null                   2A              3A_reassign              1.75     2      No Error
          S5                  1/1/2020             null                   3A              3A                       2        4      No Error
          S6                  1/1/2000             1/1/2020               1A              2A                       2        1.25   No Error
          S6                  1/1/2020             null                   1A              1A                       2        3      No Error
          S6                  1/1/2020             null                   1A_reassign     2A                       3        1.25   No Error
          S7                  1/1/2000             1/1/2020               1A              3A                       3        2      No Error
          S7                  1/1/2020             null                   1A_reassign     3A_reassign              3        2      No Error
          S8                  1/1/2000             1/1/2020               1A              3A                       2        4      No Error
          S8                  1/1/2020             null                   1A              3A                       2        4      No Error
          S8                  1/1/2020             null                   1A_reassign     3A_reassign              3        2      No Error
Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id – recalibrate source downstream
                                                                                                                                                23
          After
                                                                      2
          0
              4                      3             2                            1C, 100                4
                                                                                                           4
                                                                          1

                                                            3B, 300
          1           1A_reassign, 1A, 100
                      100
2A, 200

                                                                                             2C, 200
                                     5         2B, 200           8
                              5                                           0                                5
                           1B, 100

                                                       7

                                         3A, 200
          2
                               4
                                                                                                           8      3C, 300
              0                      0     1       2                                                                           3
                                                                                                       2
                  3A_reassign,
                  300

                  Rname                   Line Name        Line Order            From Date             To Date        From M       To M
                  1A                      Red              100                   1/1/2000              1/1/2020       2            4
                  1A                      Red              100                   1/1/2020              null           2            3
                  2A                      Red              200                   1/1/2000              1/1/2020       0            2
                  3A                      Red              300                   1/1/2000              1/1/2020       0            4
                  3A                      Red              200                   1/1/2020              null           0            2
                  1A_reassign             Teal             100                   1/1/2020              null           3            4
                  2A                      Teal             200                   1/1/2020              null           0            2
                  3A_reassign             Teal             300                   1/1/2020              null           0            2
                  1B                      Blue             100                   1/1/2000              null           3            5
                  2B                      Blue             200                   1/1/2000              null           4            8
                  3B                      Blue             300                   1/1/2000              null           0            4
                  1C                      Gray             100                   1/1/2000              null           2            6
                  2C                      Gray             200                   1/1/2000              null           2            4
                  3C                      Gray             300                   1/1/2000              null           6            8
          Event ID            From Date            To Date                From Route ID   To Route ID              From M   To M   Location Error
          S1                  1/1/2000             <Null>                 1A              1A                       2        2.5    No Error
          S2                  1/1/2000             1/1/2020               2A              2A                       1        1.5    No Error
          S2                  1/1/2020             null                   2A              2A                       1        1.5    No Error
          S3                  1/1/2000             1/1/2020               1A              1A                       3        4      No Error
          S3                  1/1/2020             null                   1A_reassign     1A_reassign              3        4      No Error
          S4                  1/1/2000             1/1/2020               3A              3A                       0        4      No Error
          S4                  1/1/2020             null                   3A_reassign     3A_reassign              0        2      No Error
          S4                  1/1/2020             null                   3A              3A                       0        2      No Error
          S5                  1/1/2000             1/1/2020               2A              3A                       1.75     4      No Error
          S5                  1/1/2020             null                   2A              3A_reassign              1.75     2      No Error
          S5                  1/1/2020             null                   3A              3A                       0        2      No Error
          S6                  1/1/2000             1/1/2020               1A              2A                       2        1.25   No Error
          S6                  1/1/2020             null                   1A              1A                       2        3      No Error
          S6                  1/1/2020             null                   1A_reassign     2A                       3        1.25   No Error
          S7                  1/1/2000             1/1/2020               1A              3A                       3        2      No Error
          S7                  1/1/2020             null                   1A_reassign     3A_reassign              3        2      No Error
          S8                  1/1/2000             1/1/2020               1A              3A                       2        4      No Error
          S8                  1/1/2020             null                   1A              3A                       2        2      No Error
          S8                  1/1/2020             null                   1A_reassign     3A_reassign              3        2      No Error
24
Test case 5-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                        25 change measures; partial route changes route name/id; recalibrate source downstream
      Before
               4          3          2                               0        1                         4
           0                                                                                                2                      8
                                                                         8
                                                                                  3B, 300
           1
                       1A, 100

                                                                                                                                   3C, 300
                                                           2B, 200

                                                                                              1C, 100
2A, 200

                                                                         5

                       3A, 300                                                                              5

                                         3     1B, 100          5                                           6
                                                                                                                 2C, 200
           2                                                             4                                                          6
               0                 3   4                                                                  2          3           4

               Rname          Line Name      Line Order   From Date                To Date              From M         To M
               1A             Red            100          1/1/2000                 null                 2              4
               2A             Red            200          1/1/2000                 null                 0              2
               3A             Red            300          1/1/2000                 null                 0              4
               1B             Blue           100          1/1/2000                 null                 3              5
               2B             Blue           200          1/1/2000                 null                 4              8
               3B             Blue           300          1/1/2000                 null                 0              4
               1C             Gray           100          1/1/2000                 null                 2              6
               2C             Gray           200          1/1/2000                 null                 2              4
               3C             Gray           300          1/1/2000                 null                 6              8

          Event ID      From Date        To Date   From Route ID             To Route ID     From M             To M   Location Error
          S1            1/1/2000         <Null>    2A                        2A              0                  1.1    No Error
          S2            1/1/2000         <Null>    2A                        2A              1                  1.5    No Error
          S3            1/1/2000         <Null>    2A                        2A              1.25               2      No Error
          S4            1/1/2000         <Null>    2A                        2A              0                  2      No Error
          S5            1/1/2000         <Null>    2A                        3A              1.75               4      No Error
          S6            1/1/2000         <Null>    1A                        2A              2                  1.25   No Error
          S7            1/1/2000         <Null>    1A                        3A              3                  2      No Error
          S8            1/1/2000         <Null>    1A                        3A              2                  4      No Error

                              Effective date is 1/1/2020
                              Recal downstream checked
Test case 5-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                                 26 change measures; partial route changes route name/id; recalibrate source downstream
           After
                      4              3           2                               0        1                         4
                 10                                                                                                     2                          8
                                                                                     8
                                                                                              3B, 300
2A_reassign,

                 11            1A, 100

                                                                                                                                                   3C, 300
                                                                       2B, 200

                                                                                                          1C, 100
100

                                                                                     5
               11.4
                 0
2A, 200

                               3A, 300                                                                                  5

                                                     3      1B, 100         5                                           6
                                                                                                                              2C, 200
                                                                                     4                                                              6
                0.6
                      0                    3     4                                                                  2            3             4

                      Rname              Line Name       Line Order   From Date                To Date              From M           To M
                      1A                 Red             100          1/1/2000                 null                 2                4
                      2A                 Red             200          1/1/2000                 1/1/2020             0                2
                      2A                 Red             200          1/1/2020                 null                 0                0.6
                      3A                 Red             300          1/1/2000                 null                 0                4
                      2A_reassign        Teal            100          1/1/2020                 null                 10               11.4
                      1B                 Blue            100          1/1/2000                 null                 3                5
                      2B                 Blue            200          1/1/2000                 null                 4                8
                      3B                 Blue            300          1/1/2000                 null                 0                4
                      1C                 Gray            100          1/1/2000                 null                 2                6
                      2C                 Gray            200          1/1/2000                 null                 2                4
                      3C                 Gray            300          1/1/2000                 null                 6                8
               Event ID             From Date    To Date       From Route ID             To Route ID      From M             To M    Location Error
               S1                   1/1/2000     1/1/2020      2A                        2A               0                  1.1     No Error
               S1                   1/1/2020     <Null>        2A_reassign               2A_reassign      10                 11.1    No Error
               S2                   1/1/2000     1/1/2020      2A                        2A               1                  1.5     No Error
               S2                   1/1/2020     <Null>        2A_reassign               2A_reassign      11                 11.4    No Error
               S2                   1/1/2020     <Null>        2A                        2A               0                  0.1     No Error
               S3                   1/1/2000     1/1/2020      2A                        2A               1.25               2       No Error
               S3                   1/1/2020     <Null>        2A_reassign               2A_reassign      11.25              11.4    No Error
               S3                   1/1/2020     <Null>        2A                        2A               0                  0.6     No Error
               S4                   1/1/2000     1/1/2020      2A                        2A               0                  2       No Error
               S4                   1/1/2020     <Null>        2A_reassign               2A_reassign      10                 11.4    No Error
               S4                   1/1/2020     <Null>        2A                        2A               0                  0.6     No Error
               S5                   1/1/2000     1/1/2020      2A                        3A               1.75               4       No Error
               S5                   1/1/2020     <Null>        2A                        3A               0.3                4       No Error
               S6                   1/1/2000     1/1/2020      1A                        2A               2                  1.25    No Error
               S6                   1/1/2020     <Null>        1A                        1A               2                  4       No Error
               S6                   1/1/2020     <Null>        2A_reassign               2A_reassign      10                 11.25   No Error
               S7                   1/1/2000     1/1/2020      1A                        3A               3                  2       No Error     get a new
S7                   1/1/2000     <Null>        1A                        3A               3                  2       No Error     record as length
               S7                   1/1/2020     <Null>        2A_reassign               2A_reassign      10                 11.4    No Error     changed
               S8                   1/1/2000     1/1/2020      1A                        3A               2                  4       No Error
               S8                   1/1/2000     <Null>        1A                        3A               2                  4       No Error
               S8                   1/1/2020     <Null>        2A_reassign               2A_reassign      10                 11.4    No Error
        Test case 6: Transfer to New Line – transfer 0.5+1 simple routes; transfer
        CP; change measures; partial routes have to change route name/id

    Before
                   4               3             2                   0       1                       4
               0                                                                                         2                           8
                                                                         8
                                                                                 3B, 300
               1
                                 1A, 100

                                                                                                                                     3C, 300
                       2A, 200

                                                                                           1C, 100
3    1B, 100   5

                                 3A, 300                 5
                                                                                                         5

                                                                                                         6
                                                                                                                    2C, 200
               2                                     4                                                                                6
                   0                      3      4                                                   2                3          4

       Rname           Line Name           Line Order        From Date       To Date       From M                    To M
       1A              Red                 100               1/1/2000        null          2                         4
       2A              Red                 200               1/1/2000        null          0                         2
       3A              Red                 300               1/1/2000        null          0                         4
       1B              Blue                100               1/1/2000        null          3                         5
       2B              Blue                200               1/1/2000        null          4                         8
       3B              Blue                300               1/1/2000        null          0                         4
       1C              Gray                100               1/1/2000        null          2                         6
       2C              Gray                200               1/1/2000        null          2                         4
       3C              Gray                300               1/1/2000        null          6                         8

    Event ID       From Date           To Date       From Route ID   To Route ID       From M                To M    Location Error
    S1             1/1/2000            <Null>        3A              3A                3                     4       No Error
    S2             1/1/2000            <Null>        2A              2A                1                     1.5     No Error
    S3             1/1/2000            <Null>        3A              3A                0                     2       No Error
    S4             1/1/2000            <Null>        3A              3A                0                     4       No Error
    S5             1/1/2000            <Null>        2A              3A                1.75                  4       No Error
    S6             1/1/2000            <Null>        1A              2A                2                     1.25    No Error
    S7             1/1/2000            <Null>        1A              3A                3                     2       No Error
    S8             1/1/2000            <Null>        1A              3A                2                     4       No Error

                       Effective date is 1/1/2020
                       Recal downstream unchecked
        Test case 6: Transfer to New Line – transfer 0.5+1 simple routes; transfer
        CP; change measures; partial routes have to change route name/id
    After                    4                3            2                 0       1                          4
                         0                                                                                          2                          8
                                                                                 8
                                                                                         3B, 300

                                 2A, 200
                         1
                                            1A, 100

                                                                                                                                               3C, 300
                                                                                                      1C, 100
3     1B, 100 1.25 5
                         2
          2A_reassign,

                                                                                                                    5
                                           3A, 200                 5
                                                                                                                               2C, 200
          100

                                                                                                                    6
                         3                                     4                                                                                6
                             0                                                                                  2                3         4
                                                     6     8

       Rname       Line Name                          Line Order       From Date     To Date         From M                     To M
       1A          Red                                100              1/1/2000      null            2                          4
       2A          Red                                200              1/1/2000      1/1/2020        0                          2
       2A          Red                                200              1/1/2020      null            0                          1.25
       3A          Red                                300              1/1/2000      1/1/2020        0                          4
       2A_reassign Teal                               100              1/1/2020      null            2                          3
       3A          Teal                               200              1/1/2020      null            0                          8
       1B          Blue                               100              1/1/2000      null            3                          5
       2B          Blue                               200              1/1/2000      null            4                          8
       3B          Blue                               300              1/1/2000      null            0                          4
       1C          Gray                               100              1/1/2000      null            2                          6
       2C          Gray                               200              1/1/2000      null            2                          4
       3C          Gray                               300              1/1/2000      null            6                          8
    Event ID             From Date           To Date       From Route ID      To Route ID          From M               To M    Location Error
    S1                   1/1/2000            1/1/2020      3A                 3A                   3                    4       No Error
    S1                   1/1/2020            null          3A                 3A                   6                    8       No Error
    S2                   1/1/2000            <Null>        2A                 2A                   1                    1.5     No Error
    S2                   1/1/2020            null          2A                 2A                   1                    1.25    No Error
    S2                   1/1/2020            null          2A_reassign        2A_reassign          2                    2.5     No Error
    S3                   1/1/2000            1/1/2020      3A                 3A                   0                    2       No Error
    S3                   1/1/2020            <Null>        3A                 3A                   0                    4       No Error
    S4                   1/1/2000            1/1/2020      3A                 3A                   0                    4       No Error
    S4                   1/1/2020            <Null>        3A                 3A                   0                    8       No Error
    S5                   1/1/2000            1/1/2020      2A                 3A                   1.75                 4       No Error
    S5                   1/1/2020            <Null>        2A_reassign        3A                   2.75                 8       No Error
    S6                   1/1/2000            1/1/2020      1A                 2A                   2                    1.25    No Error
    S6                   1/1/2020            <Null>        1A                 2A                   2                    1.25    No Error
    S7                   1/1/2000            1/1/2020      1A                 3A                   3                    2       No Error
    S7                   1/1/2020            <Null>        1A                 2A                   3                    1.25    No Error
    S7                   1/1/2020            <Null>        2A_reassign        3A                   2                    4       No Error
    S8                   1/1/2000            1/1/2020      1A                 3A                   2                    4       No Error
    S8                   1/1/2020            <Null>        1A                 2A                   2                    1.25    No Error
    S8                   1/1/2020            <Null>        2A_reassign        3A                   2                    8       No Error
Test case 7: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                            29 route; change 1 route name/id
     Before
            4                 3          2                                0       1                           4
        0                                                                                                         2                             8
20                                                                            8
                                                                                      3B, 300
        1
                           1A, 100
                 2A, 200

                                                                                                                                                3C, 300
                                                                2B, 200

                                                                                                    1C, 100
                                                                              5

                           3A, 300                                                                                5

                                          3        1B, 100           5                                            6
                                                                                                                          2C, 200
23      2                                                                     4                                                                  6
            0                        3   4                                                                    2                3            4
            23                           30

                 Rname               Line Name     Line Order       From Date             To Date                     From M         To M
                 1A                  Red           100              1/1/2000              null                        2              4
                 2A                  Red           200              1/1/2000              null                        0              2
                 3A                  Red           300              1/1/2000              null                        0              4
                 Conc1               Orange        100              1/1/2000              null                        20             30
                 1B                  Blue          100              1/1/2000              null                        3              5
                 2B                  Blue          200              1/1/2000              null                        4              8
                 3B                  Blue          300              1/1/2000              null                        0              4
                 1C                  Gray          100              1/1/2000              null                        2              6
                 2C                  Gray          200              1/1/2000              null                        2              4
                 3C                  Gray          300              1/1/2000              null                        6              8
       Event ID              From Date        To Date   From Route ID             To Route ID   From M                   To M      Location Error
       S1                    1/1/2000         <Null>    1A                        1A            2                        2.5       No Error
       S2                    1/1/2000         <Null>    2A                        2A            1                        1.5       No Error
       S3                    1/1/2000         <Null>    1A                        1A            3                        4         No Error
       S4                    1/1/2000         <Null>    3A                        3A            0                        4         No Error
       S5                    1/1/2000         <Null>    2A                        3A            1.75                     4         No Error
       S6                    1/1/2000         <Null>    1A                        2A            2                        1.25      No Error
       S7                    1/1/2000         <Null>    1A                        3A            3                        2         No Error
       S8                    1/1/2000         <Null>    1A                        3A            2                        4         No Error
       Event ID              From Date        To Date From Route ID To Route ID From M                                   To M Location Error
       Sconc                 1/1/2000         <Null> Conc1          Conc1       21.5                                     30   No Error

                                  Effective date is 1/1/2020
                                  Recal downstream unchecked
Test case 7: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                                 30 route; change 1 route name/id
     After
            4                     3           2                                0        1                         4
        0                                                                                                             2                              8
20                                                                                 8
                                                                                            3B, 300
        1
                               1A, 100
                     2A, 200

                                                                                                                                                     3C, 300
                                                                     2B, 200

                                                                                                        1C, 100
                                                                                   5

                           3A_new, 300                                                                                5

                                              3         1B, 100           5                                           6
                                                                                                                              2C, 200
23      2                                                                          4                                                                  6
            2                            8    10                                                                  2                 3            4
                23                           30

                     Rname               Line Name      Line Order       From Date              To Date                   From M          To M
                     1A                  Red            100              1/1/2000               1/1/2020                  2               4
                     2A                  Red            200              1/1/2000               1/1/2020                  0               2
                     3A                  Red            300              1/1/2000               1/1/2020                  0               4
                     1A                  Teal           100              1/1/2020               null                      2               4
                     2A                  Teal           200              1/1/2020               null                      0               2
                     3A_new              Teal           300              1/1/2020               null                      2               10
                     Conc1               Orange         100              1/1/2000               null                      20              30
                     1B                  Blue           100              1/1/2000               null                      3               5
                     2B                  Blue           200              1/1/2000               null                      4               8
                     3B                  Blue           300              1/1/2000               null                      0               4
                     1C                  Gray           100              1/1/2000               null                      2               6
                     2C                  Gray           200              1/1/2000               null                      2               4
                     3C                  Gray           300              1/1/2000               null                      6               8
      Event ID                 From Date     To Date      From Route ID                To Route ID    From M                 To M       Location Error
      S1                       1/1/2000      1/1/2020     1A                           1A             2                      2.5        No Error
      S2                       1/1/2000      1/1/2020     2A                           2A             1                      1.5        No Error
      S3                       1/1/2000      1/1/2020     1A                           1A             3                      4          No Error
      S4                       1/1/2000      1/1/2020     3A                           3A             0                      4          No Error
      S5                       1/1/2000      1/1/2020     2A                           3A             1.75                   4          No Error
      S6                       1/1/2000      1/1/2020     1A                           2A             2                      1.25       No Error
      S7                       1/1/2000      1/1/2020     1A                           3A             3                      2          No Error
      S8                       1/1/2000      1/1/2020     1A                           3A             2                      4          No Error
      S1                       1/1/2020      <Null>       1A                           1A             2                      2.5        No Error
      S2                       1/1/2020      <Null>       2A                           2A             1                      1.5        No Error
      S3                       1/1/2020      <Null>       1A                           1A             3                      4          No Error
      S4                       1/1/2020      <Null>       3A_new                       3A_new         2                      10         No Error
      S5                       1/1/2020      <Null>       2A                           3A_new         1.75                   10         No Error
      S6                       1/1/2020      <Null>       1A                           2A             2                      1.25       No Error
      S7                       1/1/2020      <Null>       1A                           3A_new         3                      6          No Error
      S8                       1/1/2020      <Null>       1A                           3A_new         2                      10         No Error
      Event ID                  From Date         To Date From Route ID To Route ID From M                                  To M Location Error
      Sconc                     1/1/2000          <Null> Conc1          Conc1       21.5                                    30   No Error
Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
31 change measures on 0.5 route; partial routes have to change route name/id
                                             Conc1, 100
Before                                       2000-null

                               15                                                  10

                                                                                                2
                                    4                   3                      2                              1C, 100                4
              15               0                                                                                                         4   In 2000, create 1A
                                                                                                1
                                                                                                                                             In 2010, create 2A

                                                                                                    3B, 300
                               1              1A, 100                                                                                        In 2015, create 3A and conc1
                   2010-null

                                              2000-2020                             2B,7200 8                                                In 2020, retire1A
 Conc2, 200

                   2A, 200

                                                                                                                           2C, 200
 2015-null

                                                        5
                                                    5       1B, 100                                                                      5   In 2025, transfer part 2A &
3A, recal downstream unchecked

                               2
                                                    4                               3A, 300                                              8       3C, 300
              20
                                    0                                  3       4 2015-null                                                                      3
                                                                                                                                     2
       Rname                            Line Name                     Line Order         From Date            To Date            From M               To M
       1A                               Red                           100                1/1/2000             1/1/2020           2                    4
       2A                               Red                           200                1/1/2010             1/1/2020           0                    2
       3A                               Red                           300                1/1/2015             1/1/2020           0                    4
       2A                               Red                           100                1/1/2020             null               0                    2
       3A                               Red                           200                1/1/2020             null               0                    4
       Conc1                            Orange                        100                1/1/2000             null               10                   15
       Conc2                            Orange                        200                1/1/2015             null               15                   20
       1B                               Blue                          100                1/1/2000             null               3                    5
       2B                               Blue                          200                1/1/2000             null               4                    8
       3B                               Blue                          300                1/1/2000             null               0                    4
       1C                               Gray                          100                1/1/2000             null               2                    6
       2C                               Gray                          200                1/1/2000             null               2                    4
       3C                               Gray                          300                1/1/2000             null               6                    8
Event ID                 From Date             To Date                       From Route ID                To Route ID    From M              To M     Location Error
S1                       1/1/2000              <Null>                        1A                           1A             2                   2.5      No Error
S2                       1/1/2010              <Null>                        2A                           2A             1                   1.5      No Error
S3                       1/1/2000              <Null>                        1A                           1A             3                   4        No Error
S4                       1/1/2015              <Null>                        3A                           3A             0                   4        No Error
S5                       1/1/2010              1/1/2015                      2A                           2A             1.75                2        No Error
S5                       1/1/2015              <Null>                        2A                           3A             1.75                4        No Error
S6                       1/1/2000              1/1/2010                      1A                           1A             2                   4        No Error
S6                       1/1/2010              <Null>                        1A                           2A             2                   1.25     No Error
S7                       1/1/2000              1/1/2010                      1A                           1A             3                   4        No Error
S7                       1/1/2010              1/1/2015                      1A                           2A             3                   2        No Error
S7                       1/1/2015              <Null>                        1A                           3A             3                   2        No Error
S8                       1/1/2000              1/1/2010                      1A                           1A             2                   4        No Error
S8                       1/1/2010              1/1/2015                      1A                           2A             2                   2        No Error
S8                       1/1/2015              <Null>                        1A                           3A             2                   4        No Error

Event ID                 From Date              To Date                      From Route ID                To Route ID    From M                To M   Location Error
Sconc1                   1/1/2000               1/1/2015                     Conc1                        Conc1          10                    15     No Error
Sconc1                   1/1/2015               <Null>                       Conc1                        Conc2          10                    16     No Error
Sconc2                   1/1/2015               <Null>                       Conc2                        Conc2          17.5                  20     No Error
Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
32 change measures on 0.5 route; partial routes have to change route name/id

After - routes
               Conc1, 100
               2000-null 15                                        10
                                                                                                                               In 2000, create 1A
                                                                                                                               In 2010, create 2A
                                                                                   2
                                0
                                    4           3                  2                             1C, 100               4
                                                                                                                               In 2015, create 3A and conc1
               15                                                                                                          4
                                                                                                                               In 2020, retire1A
                    2025-null

                                           1A, 100                                 1

                                                                                       3B, 300
                    2A, 100

                                1                                                                                              In 2025, transfer part 2A &
                                           2000-2020
                                                                                                                               3A, recal downstream
                                                                       2B,7200 8
 Conc2, 200

2C, 200 unchecked
 2015-null

                            1.25                5
                                            5                                                                              5
                                2
                                                    1B, 100
                2A_reassign,

                2025-null
                100

                                            4                          3A, 200                                             8       3C, 300
               20               3
                                    0                         3    4 2025-null                                                                    3
                                                                                                                       2

              Rname                     Line Name             Line Order     From Date            To Date                  From M         To M
              1A                        Red                   100            1/1/2000             1/1/2020                 2              4
              2A                        Red                   200            1/1/2010             1/1/2015                 0              2
              3A                        Red                   300            1/1/2015             1/1/2020                 0              4
              2A                        Red                   100            1/1/2020             1/1/2025                 0              2
              3A                        Red                   200            1/1/2020             1/1/2025                 0              4
              2A                        Red                   100            1/1/2025             null                     0              1.25
              2A_reassign               Teal                  100            1/1/2025             null                     2              3
              3A                        Teal                  200            1/1/2025             null                     0              4
              Conc1                     Orange                100            1/1/2000             null                     10             15
              Conc2                     Orange                200            1/1/2015             null                     15             20
              1B                        Blue                  100            1/1/2000             null                     3              5
              2B                        Blue                  200            1/1/2000             null                     4              8
              3B                        Blue                  300            1/1/2000             null                     0              4
              1C                        Gray                  100            1/1/2000             null                     2              6
              2C                        Gray                  200            1/1/2000             null                     2              4
              3C                        Gray                  300            1/1/2000             null                     6              8
Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
33 change measures on 0.5 route; partial routes have to change route name/id

After - Events
              Conc1, 100
              2000-null 15                                      10

                                                                               2                                           In 2000, create 1A
                                   4        3                  2                             1C, 100               4
              15               0                                                                                       4   In 2010, create 2A
                   2025-null

                                       1A, 100                                 1
                                                                                                                           In 2015, create 3A and conc1

                                                                                   3B, 300
                   2A, 100

                               1
                                       2000-2020                                                                           In 2020, retire1A
                                                                   2B,7200 8                                               In 2025, transfer part 2A &
 Conc2, 200

                                                                                                         2C, 200
 2015-null

                           1.25             5
                                        5                                                                              5   3A, recal downstream
2 unchecked
                                                1B, 100
               2A_reassign,

               2025-null
               100

                                        4                        3A, 200                                               8       3C, 300
              20               3
                                   0                      3    4 2025-null                                                                    3
                                                                                                                   2

Event ID                 From Date     To Date                From Route ID              To Route ID   From M              To M     Location Error
S1                       1/1/2000      1/1/2020               1A                         1A            2                   2.5      No Error
S2                       1/1/2010      1/1/2025               2A                         2A            1                   1.5      No Error
S2                       1/1/2025      <Null>                 2A                         2A            1                   1.25     No Error
S2                       1/1/2025      <Null>                 2A_reassign                2A_reassign   2                   2.5      No Error
S3                       1/1/2000      1/1/2020               1A                         1A            3                   4        No Error
S4                       1/1/2015      1/1/2025               3A                         3A            0                   4        No Error
S4                       1/1/2025      <Null>                 3A                         3A            0                   4        No Error
S5                       1/1/2010      1/1/2015               2A                         2A            1.75                2        No Error
S5                       1/1/2015      1/1/2025               2A                         3A            1.75                4        No Error
S5                       1/1/2025      <Null>                 2A_reassign                3A            2.75                4        No Error
S6                       1/1/2000      1/1/2010               1A                         1A            2                   4        No Error
S6                       1/1/2010      1/1/2020               1A                         2A            2                   1.25     No Error
S6                       1/1/2020      <Null>                 2A                         2A            0                   1.25     No Error
S7                       1/1/2000      1/1/2010               1A                         1A            3                   4        No Error
S7                       1/1/2010      1/1/2015               1A                         2A            3                   2        No Error
S7                       1/1/2015      1/1/2020               1A                         3A            3                   2        No Error
S7                       1/1/2020      1/1/2025               2A                         3A            0                   2        No Error
S7                       1/1/2025      <Null>                 2A                         2A            0                   1.25     No Error
S7                       1/1/2025      <Null>                 2A_reassign                3A            2                   2        No Error
S8                       1/1/2000      1/1/2010               1A                         1A            2                   4        No Error
S8                       1/1/2010      1/1/2015               1A                         2A            2                   2        No Error
S8                       1/1/2015      1/1/2020               1A                         3A            2                   4        No Error
S8                       1/1/2020      1/1/2025               2A                         3A            0                   4        No Error
S8                       1/1/2025      <Null>                 2A                         2A            0                   1.25     No Error
S8                       1/1/2025      <Null>                 2A_reassign                3A            2                   4        No Error
Event ID                 From Date     To Date                From Route ID             To Route ID    From M                To M   Location Error
Sconc1                   1/1/2000      1/1/2015               Conc1                     Conc1          10                    15     No Error
Sconc1                   1/1/2015      <Null>                 Conc1                     Conc2          10                    16     No Error
Sconc2                   1/1/2015      <Null>                 Conc2                     Conc2          17.5                  20     No Error
34
Test case 8-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple                          35 time slices; not transfer CP

Before
                4        3            2                              0       1                       4
            0                                                                                            2                           8
                                                                         8
                                                                                 3B, 300
            1
                     1A, 100
2010-null

                                                                                                                                     3C, 300
                     2000-null

                                                           2B, 200

                                                                                           1C, 100
2A, 200

                                                                         5

                      3A, 300
                      2020-null                                                                          5

                                          3     1B, 100         5                                        6
                                                                                                                    2C, 200
            2                                                            4                                                            6
                0               3     4                                                              2                3          4

        Rname          Line Name          Line Order   From Date             To Date       From M                    To M
        1A             Red                100          1/1/2000              null          2                         4
        2A             Red                200          1/1/2010              null          0                         2
        3A             Red                300          1/1/2015              null          0                         4
        1B             Blue               100          1/1/2000              null          3                         5
        2B             Blue               200          1/1/2000              null          4                         8
        3B             Blue               300          1/1/2000              null          0                         4
        1C             Gray               100          1/1/2000              null          2                         6
        2C             Gray               200          1/1/2000              null          2                         4
        3C             Gray               300          1/1/2000              null          6                         8
  Event ID          From Date       To Date    From Route ID         To Route ID       From M                To M    Location Error
  S1                1/1/2000        <Null>     1A                    1A                2                     2.5     No Error
  S2                1/1/2010        <Null>     2A                    2A                1                     1.5     No Error
  S3                1/1/2000        <Null>     1A                    1A                3                     4       No Error
  S4                1/1/2020        <Null>     3A                    3A                0                     4       No Error
  S5                1/1/2020        <Null>     2A                    3A                1.75                  4       No Error
  S6                1/1/2010        <Null>     1A                    2A                2                     1.25    No Error
  S7                1/1/2020        <Null>     1A                    3A                3                     2       No Error
  S8                1/1/2020        <Null>     1A                    3A                2                     4       No Error

                       Effective date is 1/1/2030
                       Recal downstream unchecked
Test case 8-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple             36 time slices; not transfer CP

After
                4                 2                             0       1                       4
            0                                                                                       2                   8
                                                                    8
                                                                            3B, 300
                     1A, 100
2030-null

                     2030-null

                                                                                                                        3C, 300
                                                                                      1C, 100
                                                      2B, 200
2A, 200

                                                                    5

                      3A, 300
                      2030-null                                                                     5

                                      3   1B, 100          5                                        6
                                                                                                        2C, 200
            2                                                       4                                                    6
                0                 4                                                             2         3         4

     Rname              Line Name Line Order From Date To Date         From M                           To M
     1A                 Red        100        1/1/2000    1/1/2030     2                                4
     2A                 Red        200        1/1/2010    1/1/2030     0                                2
     3A                 Red        300        1/1/2015    1/1/2030     0                                4
     1A                 Teal       100        1/1/2030    null         2                                4
     2A                 Teal       200        1/1/2030    null         0                                2
     3A                 Teal       300        1/1/2030    null         0                                4
     1B                 Blue       100        1/1/2000    null         3                                5
     2B                 Blue       200        1/1/2000    null         4                                8
     3B                 Blue       300        1/1/2000    null         0                                4
     1C                 Gray       100        1/1/2000    null         2                                6
     2C                 Gray       200        1/1/2000    null         2                                4
     3C                 Gray       300        1/1/2000    null         6                                8
  Event ID          From Date To Date   From Route ID To Route ID From M     To M                       Location Error
  S1                1/1/2000 1/1/2030 1A              1A          2          2.5                        No Error
  S2                1/1/2010 1/1/2030 2A              2A          1          1.5                        No Error
  S3                1/1/2000 1/1/2030 1A              1A          3          4                          No Error
  S4                1/1/2020 1/1/2030 3A              3A          0          4                          No Error
  S5                1/1/2020 1/1/2030 2A              3A          1.75       4                          No Error
  S6                1/1/2010 1/1/2030 1A              2A          2          1.25                       No Error
  S7                1/1/2020 1/1/2030 1A              3A          3          2                          No Error
  S8                1/1/2020 1/1/2030 1A              3A          2          4                          No Error
  S1                1/1/2030    <Null> 1A             1A          2         2.5                         No Error
  S2                1/1/2030    <Null> 2A             2A          0.5       1.25                        No Error
  S3                1/1/2030    <Null> 1A             1A          3         4                           No Error
  S4                1/1/2030    <Null> 3A             3A          0         4                           No Error
  S5                1/1/2030    <Null> 2A             3A          1.5       4                           No Error
  S6                1/1/2030    <Null> 1A             2A          2         1                           No Error
  S7                1/1/2030    <Null> 1A             3A          3         2                           No Error
  S8                1/1/2030    <Null> 1A             3A          2         4                           No Error
Test case 9: Transfer to New Line – transfer 3 entire simple routes;                                                             37 transfer CP; keep original measures; keep original route name/id

      Before
                4           3           2                                 0       1                        4
            0                                                                                                  2                           8
                                                                              8
                                                                                      3B, 300
            1
                         1A, 100

                                                                                                                                           3C, 300
                                                                2B, 200

                                                                                                 1C, 100
2A, 200

                                                                              5

                         3A, 300                                                                               5

                                            3     1B, 100            5                                         6
                                                                                                                          2C, 200
            2                                                                 4                                                             6
                0                  3    4                                                                  2                3          4

                Rname           Line Name       Line Order    From Date                To Date             From M               To M
                1A              Red             100           1/1/2000                 null                2                    4
                2A              Red             200           1/1/2000                 null                0                    2
                3A              Red             300           1/1/2000                 null                0                    4
                1B              Blue            100           1/1/2000                 null                3                    5
                2B              Blue            200           1/1/2000                 null                4                    8
                3B              Blue            300           1/1/2000                 null                0                    4
                1C              Gray            100           1/1/2000                 null                2                    6
                2C              Gray            200           1/1/2000                 null                2                    4
                3C              Gray            300           1/1/2000                 null                6                    8
          Event ID          From Date           To Date      Route ID                     From M                   To M     Location Error
          S1                1/1/2000            <Null>       1A                           2                        2.5      No Error
          S2                1/1/2000            <Null>       2A                           1                        1.5      No Error
          S3                1/1/2000            <Null>       1A                           3                        4        No Error
          S4                1/1/2000            <Null>       3A                           0                        4        No Error
          S5a               1/1/2000            <Null>       2A                           1.75                     2        No Error
          S5b               1/1/2000            <Null>       3A                           0                        4        No Error
          S6a               1/1/2000            <Null>       1A                           2                        4        No Error
          S6b               1/1/2000            <Null>       2A                           0                        1.25     No Error
          S7a               1/1/2000            <Null>       1A                           3                        4        No Error
          S7b               1/1/2000            <Null>       2A                           0                        2        No Error
          S7c               1/1/2000            <Null>       3A                           0                        2        No Error
          S8a               1/1/2000            <Null>       1A                           2                        4        No Error
          S8b               1/1/2000            <Null>       2A                           0                        2        No Error
          S8c               1/1/2000            <Null>       3A                           0                        4        No Error

          Showing this event for once to indicate events on other lines will not be affected

          Event ID        From Date To Date From Route ID To Route ID From M                                         To M Location Error
          S_blue          1/1/2000      <Null> 1B         2B          4                                              5    No Error
                              Effective date is 1/1/2020
                              Recal downstream unchecked
Test case 9: Transfer to New Line – transfer 3 entire simple routes;                                                                                      38 transfer CP; keep original measures; keep original route name/id
      After
                4           3               2                                         0         1                            4
            0                                                                                                                    2                                  8
                                                                                          8
                                                                                                    3B, 300
            1
                         1A, 100

                                                                                                                                                                    3C, 300
                                                                            2B, 200

                                                                                                                   1C, 100
2A, 200

                                                                                          5

                         3A, 300                                                                                                 5

                                                3             1B, 100            5                                               6
                                                                                                                                             2C, 200
            2                                                                             4                                                                          6
                0                  3        4                                                                                2                 3                4

                Rname           Line Name              Line Order         From Date                  To Date                 From M                To M
                1A              Red                    100                1/1/2000                   1/1/2020                2                     4
                2A              Red                    200                1/1/2000                   1/1/2020                0                     2
                3A              Red                    300                1/1/2000                   1/1/2020                0                     4
                1A              Teal                   100                1/1/2020                   null                    2                     4
                2A              Teal                   200                1/1/2020                   null                    0                     2
                3A              Teal                   300                1/1/2020                   null                    0                     4
                1B              Blue                   100                1/1/2000                   null                    3                     5
                2B              Blue                   200                1/1/2000                   null                    4                     8
                3B              Blue                   300                1/1/2000                   null                    0                     4
                1C              Gray                   100                1/1/2000                   null                    2                     6
                2C              Gray                   200                1/1/2000                   null                    2                     4
                3C              Gray                   300                1/1/2000                   null                    6                     8
          Event ID        From Date                 To Date             Route ID                        From M                       To M      Location Error
          S1              1/1/2000                  1/1/2020            1A                              2                            2.5       No Error
          S2              1/1/2000                  1/1/2020            2A                              1                            1.5       No Error
          S3              1/1/2000                  1/1/2020            1A                              3                            4         No Error
          S4              1/1/2000                  1/1/2020            3A                              0                            4         No Error
          S5a             1/1/2000                  1/1/2020            2A                              1.75                         2         No Error
          S5b             1/1/2000                  1/1/2020            3A                              0                            4         No Error
          S6a             1/1/2000                  1/1/2020            1A                              2                            4         No Error
          S6b             1/1/2000                  1/1/2020            2A                              0                            1.25      No Error
          S7a             1/1/2000                  1/1/2020            1A                              3                            4         No Error
          S7b             1/1/2000                  1/1/2020            2A                              0                            2         No Error
          S7c             1/1/2000                  1/1/2020            3A                              0                            2         No Error
          S8a             1/1/2000                  1/1/2020            1A                              2                            4         No Error
          S8b             1/1/2000                  1/1/2020            2A                              0                            2         No Error
          S8c             1/1/2000                  1/1/2020            3A                              0                            4         No Error
          S1              1/1/2020                  <Null>              1A                              2                            2.5       No Error
          S2              1/1/2020                  <Null>              2A                              1                            1.5       No Error
          S3              1/1/2020                  <Null>              1A                              3                            4         No Error
          S4              1/1/2020                  <Null>              3A                              0                            4         No Error
          S5a             1/1/2020                  <Null>              2A                              1.75                         2         No Error
          S5b             1/1/2020                  <Null>              3A                              0                            4         No Error
          S6a             1/1/2020                  <Null>              1A                              2                            4         No Error
          S6b             1/1/2020                  <Null>              2A                              0                            1.25      No Error
          S7a             1/1/2020                  <Null>              1A                              3                            4         No Error
          S7b             1/1/2020                  <Null>              2A                              0                            2         No Error
          S7c             1/1/2020                  <Null>              3A                              0                            2         No Error
          S8a             1/1/2020                  <Null>              1A                              2                            4         No Error
          S8b             1/1/2020                  <Null>              2A                              0                            2         No Error
          S8c             1/1/2020                  <Null>              3A                              0                            4         No Error
            Event ID       From Date                To Date      From Route ID                To Route ID       From M                To M     Location Error
            S_blue         1/1/2000                 <Null>       1B                           2B                4                     5        No Error
Test case 9-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                         39 keep original measures; partial routes change route name/id

Before
     4           3           2                                 0       1                        4
                                                                                                    2                           8
                                                                   8
                                                                           3B, 300
 5

                                                                                                                                3C, 300
                                                     2B, 200

                                                                                      1C, 100
              1A, 100                                              5

                                                                                                    5

                                 3     1B, 100            5                                         6
                                                                                                               2C, 200
 6                                                                 4                                                             6
                        7    8                                                                  2                3          4

     Rname           Line Name       Line Order    From Date                To Date             From M               To M
     1A              Red             100           1/1/2000                 null                2                    8
     1B              Blue            100           1/1/2000                 null                3                    5
     2B              Blue            200           1/1/2000                 null                4                    8
     3B              Blue            300           1/1/2000                 null                0                    4
     1C              Gray            100           1/1/2000                 null                2                    6
     2C              Gray            200           1/1/2000                 null                2                    4
     3C              Gray            300           1/1/2000                 null                6                    8
Event ID         From Date           To Date      Route ID                     From M                   To M     Location Error
S1               1/1/2000            <Null>       1A                           2                        2.5      No Error
S2               1/1/2000            <Null>       1A                           5                        5.5      No Error
S3               1/1/2000            <Null>       1A                           3                        4        No Error
S4               1/1/2000            <Null>       1A                           6                        8        No Error
S5               1/1/2000            <Null>       1A                           5.75                     8        No Error
S6               1/1/2000            <Null>       1A                           2                        5.25     No Error
S7               1/1/2000            <Null>       1A                           3                        6.5      No Error
S8               1/1/2000            <Null>       1A                           2                        8        No Error

                     First transfer is 1/1/2020
                     Second transfer is 1/1/2030
                     Recal downstream unchecked
Test case 9-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                                            40 keep original measures; partial routes change route name/id
        After
                    4                 3               2                                 0       1                              4
                4                                                                                                                  2                              8
                                                                                            8
                                                                                                    3B, 300
1A_reassign,

                5
                                1A, 100

                                                                                                                                                                  3C, 300
                                                                              2B, 200

                                                                                                                     1C, 100
                                                                                            5
100

                             1A_reassign_reassign,
                                                                                                                                   5
                             100
                                                          3     1B, 100            5                                               6
                                                                                                                                              2C, 200
                6                                                                           4                                                                      6
                    6                         7       8                                                                        2                3             4

                        Rname               Line Name         Line Order     From Date               To Date                   From M               To M
                        1A                  Red               100            1/1/2000                1/1/2020                  2                    8
                        1A                  Red               100            1/1/2020                null                      2                    4
                        1A_reassign         Teal              100            1/1/2020                1/1/2030                  4                    8
                        1A_reassign         Teal              100            1/1/2030                null                      4                    6
1A_reassign_        Yellow            100            1/1/2030                null                      6                    8 reassign
                        1B                  Blue              100            1/1/2000                null                      3                    5
                        2B                  Blue              200            1/1/2000                null                      4                    8
                        3B                  Blue              300            1/1/2000                null                      0                    4
                        1C                  Gray              100            1/1/2000                null                      2                    6
                        2C                  Gray              200            1/1/2000                null                      2                    4
                        3C                  Gray              300            1/1/2000                null                      6                    8
               Event ID                   From Date           To Date      Route ID                         From M                     To M      Location Error
               S1                         1/1/2000            <Null>       1A                               2                          2.5       No Error
               S2                         1/1/2000            1/1/2020     1A                               5                          5.5       No Error
               S2                         1/1/2020            <Null>       1A_reassign                      5                          5.5       No Error
               S3                         1/1/2000            <Null>       1A                               3                          4         No Error
               S4                         1/1/2000            1/1/2020     1A                               6                          8         No Error
               S4                         1/1/2020            1/1/2030     1A_reassign                      6                          8         No Error
               S4                         1/1/2030            null         1A_reassign_reassign             6                          8         No Error
               S5                         1/1/2000            1/1/2020     1A                               5.75                       8         No Error
               S5                         1/1/2020            1/1/2030     1A_reassign                      5.75                       8         No Error
               S5                         1/1/2030            null         1A_reassign                      5.75                       6         No Error
               S5                         1/1/2030            null         1A_reassign_reassign             6                          8         No Error
               S6                         1/1/2000            1/1/2020     1A                               2                          5.25      No Error
               S6                         1/1/2020            null         1A                               2                          4         No Error
               S6                         1/1/2020            <Null>       1A_reassign                      4                          5.25      No Error
               S7                         1/1/2000            <Null>       1A                               3                          6.5       No Error
               S7                         1/1/2020            null         1A                               3                          4         No Error
               S7                         1/1/2020            1/1/2030     1A_reassign                      4                          6.5       No Error
               S7                         1/1/2030            null         1A_reassign                      4                          6         No Error
               S7                         1/1/2030            null         1A_reassign_reassign             6                          6.5       No Error
               S8                         1/1/2000            1/1/2020     1A                               2                          8         No Error
               S8                         1/1/2020            <Null>       1A                               2                          4         No Error
               S8                         1/1/2020            1/1/2030     1A_reassign                      4                          8         No Error
               S8                         1/1/2030            null         1A_reassign                      4                          6         No Error
               S8                         1/1/2030            null         1A_reassign_reassign             6                          8         No Error
Test case 10: Transfer to New Line – transfer 1 entire simple route; not                                                         41 transfer CP; keep original measures; keep original route name/id

      Before
               4           3           2                                 0       1                        4
           0                                                                                                  2                           8
                                                                             8
                                                                                     3B, 300
           1
                        1A, 100

                                                                                                                                          3C, 300
                                                               2B, 200

                                                                                                1C, 100
2A, 200

                                                                             5

                        3A, 300                                                                               5

                                           3     1B, 100            5                                         6
                                                                                                                         2C, 200
           2                                                                 4                                                             6
               0                  3    4                                                                  2                3          4

               Rname           Line Name       Line Order    From Date                To Date             From M               To M
               1A              Red             100           1/1/2000                 null                2                    4
               2A              Red             200           1/1/2000                 null                0                    2
               3A              Red             300           1/1/2000                 null                0                    4
               1B              Blue            100           1/1/2000                 null                3                    5
               2B              Blue            200           1/1/2000                 null                4                    8
               3B              Blue            300           1/1/2000                 null                0                    4
               1C              Gray            100           1/1/2000                 null                2                    6
               2C              Gray            200           1/1/2000                 null                2                    4
               3C              Gray            300           1/1/2000                 null                6                    8
          Event ID         From Date           To Date      Route ID                     From M                   To M     Location Error
          S1               1/1/2000            <Null>       3A                           3                        4        No Error
          S2               1/1/2000            <Null>       3A                           1                        3        No Error
          S3               1/1/2000            <Null>       3A                           0                        2        No Error
          S4               1/1/2000            <Null>       3A                           0                        4        No Error
          S5a              1/1/2000            <Null>       2A                           1.75                     2        No Error
          S5b              1/1/2000            <Null>       3A                           0                        4        No Error
          S6a              1/1/2000            <Null>       1A                           2                        4        No Error
          S6b              1/1/2000            <Null>       2A                           0                        1.25     No Error
          S7a              1/1/2000            <Null>       1A                           3                        4        No Error
          S7b              1/1/2000            <Null>       2A                           0                        2        No Error
          S7c              1/1/2000            <Null>       3A                           0                        2        No Error
          S8a              1/1/2000            <Null>       1A                           2                        4        No Error
          S8b              1/1/2000            <Null>       2A                           0                        2        No Error
          S8c              1/1/2000            <Null>       3A                           0                        4        No Error

                               Effective date is 1/1/2020
                               Recal downstream unchecked
Test case 10: Transfer to New Line – transfer 1 entire simple route; not                                                            42 transfer CP; keep original measures; keep original route name/id

      After
               4           3           2                                  0       1                          4
           0                                                                                                     2                           8
                                                                              8
                                                                                      3B, 300
           1
                        1A, 100

                                                                                                                                             3C, 300
                                                                2B, 200

                                                                                                   1C, 100
2A, 200

                                                                              5

                        3A, 100                                                                                  5

                                           3       1B, 100           5                                           6
                                                                                                                            2C, 200
           2                                                                  4                                                               6
               0                       4                                                                     2                3          4

               Rname           Line Name        Line Order     From Date               To Date               From M               To M
               1A              Red              100            1/1/2000                null                  2                    4
               2A              Red              200            1/1/2000                null                  0                    2
               3A              Red              300            1/1/2000                1/1/2020              0                    4
               3A              Teal             100            1/1/2020                null                  0                    4
               1B              Blue             100            1/1/2000                null                  3                    5
               2B              Blue             200            1/1/2000                null                  4                    8
               3B              Blue             300            1/1/2000                null                  0                    4
               1C              Gray             100            1/1/2000                null                  2                    6
               2C              Gray             200            1/1/2000                null                  2                    4
               3C              Gray             300            1/1/2000                null                  6                    8
          Event ID         From Date           To Date       Route ID                     From M                     To M     Location Error
          S1               1/1/2000            1/1/2020      3A                           3                          4        No Error
          S1               1/1/2020            <Null>        3A                           3                          4        No Error
          S2               1/1/2000            1/1/2020      3A                           1                          3        No Error
          S2               1/1/2020            <Null>        3A                           1                          3        No Error
          S3               1/1/2000            1/1/2020      3A                           0                          2        No Error
          S3               1/1/2020            <Null>        3A                           0                          2        No Error
          S4               1/1/2000            1/1/2020      3A                           0                          4        No Error
          S4               1/1/2020            <Null>        3A                           0                          4        No Error
          S5a              1/1/2000            <Null>        2A                           1.75                       2        No Error
          S5b              1/1/2000            1/1/2020      3A                           0                          4        No Error
          S5b              1/1/2020            <Null>        3A                           0                          4        No Error
          S6a              1/1/2000            <Null>        1A                           2                          4        No Error
          S6b              1/1/2000            <Null>        2A                           0                          1.25     No Error
          S7a              1/1/2000            <Null>        1A                           3                          4        No Error
          S7b              1/1/2000            <Null>        2A                           0                          2        No Error
          S7c              1/1/2000            1/1/2020      3A                           0                          2        No Error
          S7c              1/1/2020            <Null>        3A                           0                          2        No Error
          S8a              1/1/2000            <Null>        1A                           2                          4        No Error
          S8b              1/1/2000            <Null>        2A                           0                          2        No Error
          S8c              1/1/2000            1/1/2020      3A                           0                          4        No Error
          S8c              1/1/2020            <Null>        3A                           0                          4        No Error
              Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer
              CP; keep original measures; partial routes have to change route name/id                                                             43

          Before
                                                                 2
          0
              4                  3            2                           1C, 100               4
                                                                                                    4
                                                                     1

                                                       3B, 300
          1            1A, 100
2A, 200

                                                                                      2C, 200
                                 5         2B, 200          8
                          5                                          0                              5
                       1B, 100

                                                  7

          2
                           4                                                                        8       3C, 300
              0                        3      4                                                                              3
                                                                                                2
                     3A, 300
                  Rname      Line Name                Line Order          From Date             To Date          From M            To M
                  1A         Red                      100                 1/1/2000              null             2                 4
                  2A         Red                      200                 1/1/2000              null             0                 2
                  3A         Red                      300                 1/1/2000              null             0                 4
                  1B         Blue                     100                 1/1/2000              null             3                 5
                  2B         Blue                     200                 1/1/2000              null             4                 8
                  3B         Blue                     300                 1/1/2000              null             0                 4
                  1C         Gray                     100                 1/1/2000              null             2                 6
                  2C         Gray                     200                 1/1/2000              null             2                 4
                  3C         Gray                     300                 1/1/2000              null             6                 8
          Event ID                   From Date        To Date            Route ID                       From M        To M       Location Error
          S1                         1/1/2000         <Null>             1A                             2             2.5        No Error
          S2                         1/1/2000         <Null>             2A                             1             1.5        No Error
          S3                         1/1/2000         <Null>             1A                             3             4          No Error
          S4                         1/1/2000         <Null>             3A                             0             4          No Error
          S5a                        1/1/2000         <Null>             2A                             1.75          2          No Error
          S5b                        1/1/2000         <Null>             3A                             0             4          No Error
          S6a                        1/1/2000         <Null>             1A                             2             4          No Error
          S6b                        1/1/2000         <Null>             2A                             0             1.25       No Error
          S7a                        1/1/2000         <Null>             1A                             3             4          No Error
          S7b                        1/1/2000         <Null>             2A                             0             2          No Error
          S7c                        1/1/2000         <Null>             3A                             0             2          No Error
          S8a                        1/1/2000         <Null>             1A                             2             4          No Error
          S8b                        1/1/2000         <Null>             2A                             0             2          No Error
          S8c                        1/1/2000         <Null>             3A                             0             4          No Error

                                      Effective date is 1/1/2020
This case has 2 variations for recal downstream option.
Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id – without recalibrate source downstream                                   44
          After                                                                 Rname       Line   Line    From       To Date    From M   To M
              4                      3             2                    2                   Name   Order   Date
          0                                                                     1A          Red    100     1/1/2000   1/1/2020   2        4
                                                                            1
                                                                                1A          Red    100     1/1/2020   null       2        3

                                                              3B, 300
          1           1A_reassign, 1A, 100                                      2A          Red    200     1/1/2000   1/1/2020   0        2
                      100                                                       3A          Red    300     1/1/2000   1/1/2020   0        4
                                                                                3A          Red    200     1/1/2020   null       2        4
2A, 200

                                     5         2B, 200             8
                                                                                1A_reassign Teal   100     1/1/2020   null       3        4
                              5                                             0
                                                                                2A          Teal   200     1/1/2020   null       0        2
                           1B, 100

                                                       7
                                                                                3A_reassign Teal   300     1/1/2020   null       0        2
                                                                                1B          Blue   100     1/1/2000   null       3        5
                                         3A, 200                                2B          Blue   200     1/1/2000   null       4        8
                               4
          2                                                Gray                 3B          Blue   300     1/1/2000   null       0        4
              0                      2     3       4       line                 1C          Gray   100     1/1/2000   null       2        6
                  3A_reassign,                                                  2C          Gray   200     1/1/2000   null       2        4
300 hidden               3C          Gray   300     1/1/2000   null       6        8

          Event ID                       From Date           To Date             Route ID            From M       To M      Location Error
          S1                             1/1/2000            <Null>              1A                  2            2.5       No Error
          S2                             1/1/2000            1/1/2020            2A                  1            1.5       No Error
          S2                             1/1/2020            <Null>              2A                  1            1.5       No Error
          S3                             1/1/2000            1/1/2020            1A                  3            4         No Error
          S3                             1/1/2020            <Null>              1A_reassign         3            4         No Error
          S4                             1/1/2000            1/1/2020            3A                  0            4         No Error
          S4                             1/1/2020            <Null>              3A_reassign         0            2         No Error
          S4                             1/1/2020            <Null>              3A                  2            4         No Error
          S5a                            1/1/2000            1/1/2020            2A                  1.75         2         No Error
          S5a                            1/1/2020            <Null>              2A                  1.75         2         No Error
          S5b                            1/1/2000            1/1/2020            3A                  0            4         No Error
          S5b                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S5b                            1/1/2020            <Null>              3A                  2            4         No Error
          S6a                            1/1/2000            1/1/2020            1A                  2            4         No Error
          S6a                            1/1/2020            <Null>              1A                  2            3         No Error
          S6a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S6b                            1/1/2000            1/1/2020            2A                  0            1.25      No Error
          S6b                            1/1/2020            <Null>              2A                  0            1.25      No Error
          S7a                            1/1/2000            1/1/2020            1A                  3            4         No Error
          S7a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S7b                            1/1/2000            1/1/2020            2A                  0            2         No Error
          S7b                            1/1/2020            <Null>              2A                  0            2         No Error
          S7c                            1/1/2000            1/1/2020            3A                  0            2         No Error
          S7c                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S8a                            1/1/2000            1/1/2020            1A                  2            4         No Error
          S8a                            1/1/2020            <Null>              1A                  2            3         No Error
          S8a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S8b                            1/1/2000            1/1/2020            2A                  0            2         No Error
          S8b                            1/1/2020            <Null>              2A                  0            2         No Error
          S8c                            1/1/2000            1/1/2020            3A                  0            4         No Error
          S8c                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S8c                            1/1/2020            <Null>              3A                  2            4         No Error
Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name – recalibrate source downstream                                              45
          After                                                                 Rname       Line   Line    From       To Date    From M   To M
              4                      3             2                    2                   Name   Order   Date
          0                                                                     1A          Red    100     1/1/2000   1/1/2020   2        4
                                                                            1
                                                                                1A          Red    100     1/1/2020   null       2        3

                                                              3B, 300
          1           1A_reassign, 1A, 100                                      2A          Red    200     1/1/2000   1/1/2020   0        2
                      100                                                       3A          Red    300     1/1/2000   1/1/2020   0        4
                                                                                3A          Red    200     1/1/2020   null       0        2
2A, 200

                                     5         2B, 200             8
                                                                                1A_reassign Teal   100     1/1/2020   null       3        4
                              5                                             0
                                                                                2A          Teal   200     1/1/2020   null       0        2
                           1B, 100

                                                       7
                                                                                3A_reassign Teal   300     1/1/2020   null       0        2
                                                                                1B          Blue   100     1/1/2000   null       3        5
                                         3A, 200                                2B          Blue   200     1/1/2000   null       4        8
                               4
          2                                                Gray                 3B          Blue   300     1/1/2000   null       0        4
              0                      0     1       2       line                 1C          Gray   100     1/1/2000   null       2        6
                  3A_reassign,                                                  2C          Gray   200     1/1/2000   null       2        4
300 hidden               3C          Gray   300     1/1/2000   null       6        8

          Event ID                       From Date           To Date             Route ID            From M       To M      Location Error
          S1                             1/1/2000            <Null>              1A                  2            2.5       No Error
          S2                             1/1/2000            1/1/2020            2A                  1            1.5       No Error
          S2                             1/1/2020            <Null>              2A                  1            1.5       No Error
          S3                             1/1/2000            1/1/2020            1A                  3            4         No Error
          S3                             1/1/2020            <Null>              1A_reassign         3            4         No Error
          S4                             1/1/2000            1/1/2020            3A                  0            4         No Error
          S4                             1/1/2020            <Null>              3A_reassign         0            2         No Error
          S4                             1/1/2020            <Null>              3A                  0            2         No Error
          S5a                            1/1/2000            1/1/2020            2A                  1.75         2         No Error
          S5a                            1/1/2020            <Null>              2A                  1.75         2         No Error
          S5b                            1/1/2000            1/1/2020            3A                  0            4         No Error
          S5b                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S5b                            1/1/2020            <Null>              3A                  0            2         No Error
          S6a                            1/1/2000            1/1/2020            1A                  2            4         No Error
          S6a                            1/1/2020            <Null>              1A                  2            3         No Error
          S6a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S6b                            1/1/2000            1/1/2020            2A                  0            1.25      No Error
          S6b                            1/1/2020            <Null>              2A                  0            1.25      No Error
          S7a                            1/1/2000            1/1/2020            1A                  3            4         No Error
          S7a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S7b                            1/1/2000            1/1/2020            2A                  0            2         No Error
          S7b                            1/1/2020            <Null>              2A                  0            2         No Error
          S7c                            1/1/2000            1/1/2020            3A                  0            2         No Error
          S7c                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S8a                            1/1/2000            1/1/2020            1A                  2            4         No Error
          S8a                            1/1/2020            <Null>              1A                  2            3         No Error
          S8a                            1/1/2020            <Null>              1A_reassign         3            4         No Error
          S8b                            1/1/2000            1/1/2020            2A                  0            2         No Error
          S8b                            1/1/2020            <Null>              2A                  0            2         No Error
          S8c                            1/1/2000            1/1/2020            3A                  0            4         No Error
          S8c                            1/1/2020            <Null>              3A_reassign         0            2         No Error
          S8c                            1/1/2020            <Null>              3A                  0            2         No Error
46
Test case 11-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                             47 change measures; partial route changes route name/id; recalibrate source downstream
      Before
               4          3           2                                 0       1                        4
           0                                                                                                 2                           8
                                                                            8
                                                                                    3B, 300
           1
                       1A, 100

                                                                                                                                         3C, 300
                                                              2B, 200

                                                                                               1C, 100
2A, 200

                                                                            5

                       3A, 300                                                                               5

                                          3     1B, 100            5                                         6
                                                                                                                        2C, 200
           2                                                                4                                                             6
               0                 3    4                                                                  2                3          4

               Rname          Line Name       Line Order    From Date                To Date             From M               To M
               1A             Red             100           1/1/2000                 null                2                    4
               2A             Red             200           1/1/2000                 null                0                    2
               3A             Red             300           1/1/2000                 null                0                    4
               1B             Blue            100           1/1/2000                 null                3                    5
               2B             Blue            200           1/1/2000                 null                4                    8
               3B             Blue            300           1/1/2000                 null                0                    4
               1C             Gray            100           1/1/2000                 null                2                    6
               2C             Gray            200           1/1/2000                 null                2                    4
               3C             Gray            300           1/1/2000                 null                6                    8
          Event ID        From Date           To Date      Route ID                     From M                   To M     Location Error
          S1              1/1/2000            <Null>       2A                           0                        1.1      No Error
          S2              1/1/2000            <Null>       2A                           1                        1.5      No Error
          S3              1/1/2000            <Null>       2A                           1.25                     2        No Error
          S4              1/1/2000            <Null>       2A                           0                        2        No Error
          S5a             1/1/2000            <Null>       2A                           1.75                     2        No Error
          S5b             1/1/2000            <Null>       3A                           0                        4        No Error
          S6a             1/1/2000            <Null>       1A                           2                        4        No Error
          S6b             1/1/2000            <Null>       2A                           0                        1.25     No Error
          S7a             1/1/2000            <Null>       1A                           3                        4        No Error
          S7b             1/1/2000            <Null>       2A                           0                        2        No Error
          S7c             1/1/2000            <Null>       3A                           0                        2        No Error
          S8a             1/1/2000            <Null>       1A                           2                        4        No Error
          S8b             1/1/2000            <Null>       2A                           0                        2        No Error
          S8c             1/1/2000            <Null>       3A                           0                        4        No Error

                              Effective date is 1/1/2020
                              Recal downstream checked
Test case 11-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                                        48 change measures; partial route changes route name/id; recalibrate source downstream
           After
                      4             3           2                                    0       1                          4
                 10                                                                                                         2                              8
                                                                                         8
                                                                                                 3B, 300
2A_reassign,

                 11            1A, 100

                                                                                                                                                           3C, 300
                                                                           2B, 200

                                                                                                              1C, 100
100

                                                                                         5
               11.4
                 0
2A, 200

                               3A, 300                                                                                      5

                                                    3        1B, 100            5                                           6
                                                                                                                                        2C, 200
                                                                                         4                                                                  6
                0.6
                      0                   3     4                                                                       2                 3            4

                      Rname             Line Name         Line Order     From Date                To Date               From M                To M
                      1A                Red               100            1/1/2000                 null                  2                     4
                      2A                Red               200            1/1/2000                 1/1/2020              0                     2
                      2A                Red               200            1/1/2020                 null                  0                     0.6
                      3A                Red               300            1/1/2000                 null                  0                     4
                      2A_reassign       Teal              100            1/1/2020                 null                  10                    11.4
                      1B                Blue              100            1/1/2000                 null                  3                     5
                      2B                Blue              200            1/1/2000                 null                  4                     8
                      3B                Blue              300            1/1/2000                 null                  0                     4
                      1C                Gray              100            1/1/2000                 null                  2                     6
                      2C                Gray              200            1/1/2000                 null                  2                     4
                      3C                Gray              300            1/1/2000                 null                  6                     8
               Event ID             From Date           To Date        Route ID                      From M                     To M      Location Error
               S1                   1/1/2000            1/1/2020       2A                            0                          1.1       No Error
               S1                   1/1/2020            <Null>         2A_reassign                   10                         11.1      No Error
               S2                   1/1/2000            1/1/2020       2A                            1                          1.5       No Error
               S2                   1/1/2020            <Null>         2A_reassign                   11                         11.4      No Error
               S2                   1/1/2020            <Null>         2A                            0                          0.1       No Error
               S3                   1/1/2000            1/1/2020       2A                            1.25                       2         No Error
               S3                   1/1/2020            <Null>         2A_reassign                   11.25                      11.4      No Error
               S3                   1/1/2020            <Null>         2A                            0                          0.6       No Error
               S4                   1/1/2000            1/1/2020       2A                            0                          2         No Error
               S4                   1/1/2020            <Null>         2A_reassign                   10                         11.4      No Error
               S4                   1/1/2020            <Null>         2A                            0                          0.6       No Error
               S5a                  1/1/2000            1/1/2020       2A                            1.75                       2         No Error
               S5a                  1/1/2020            <Null>         2A                            0.3                        0.6       No Error
               S5b                  1/1/2000            <Null>         3A                            0                          4         No Error
               S6a                  1/1/2000            <Null>         1A                            2                          4         No Error
               S6b                  1/1/2000            1/1/2020       2A                            0                          1.25      No Error
               S6b                  1/1/2020            <Null>         2A_reassign                   10                         11.25     No Error
               S7a                  1/1/2000            <Null>         1A                            3                          4         No Error
               S7c                  1/1/2000            <Null>         3A                            0                          2         No Error
               S7b                  1/1/2000            1/1/2020       2A                            0                          2         No Error
               S7b                  1/1/2020            <Null>         2A_reassign                   10                         11.4      No Error
               S7b                  1/1/2020            <Null>         2A                            0                          0.6       No Error
               S8a                  1/1/2000            <Null>         1A                            2                          4         No Error
               S8b                  1/1/2000            1/1/2020       2A                            0                          2         No Error
               S8b                  1/1/2020            <Null>         2A_reassign                   10                         11.4      No Error
               S8b                  1/1/2020            <Null>         2A                            0                          0.6       No Error
               S8c                  1/1/2000            <Null>         3A                            0                          4         No Error
        Test case 12: Transfer to New Line – transfer 0.5+1 simple routes; transfer
        CP; change measures; partial routes have to change route name/id

    Before
                   4                 3            2                      0       1                       4
               0                                                                                             2                        8
                                                                             8
                                                                                     3B, 300
               1
                                   1A, 100

                                                                                                                                      3C, 300
                         2A, 200

                                                                                               1C, 100
3    1B, 100   5

                                   3A, 300                5
                                                                                                             5

                                                                                                             6
                                                                                                                 2C, 200
               2                                      4                                                                                6
                   0                     3       4                                                       2          3             4

       Rname            Line Name            Line Order        From Date         To Date       From M              To M
       1A               Red                  100               1/1/2000          null          2                   4
       2A               Red                  200               1/1/2000          null          0                   2
       3A               Red                  300               1/1/2000          null          0                   4
       1B               Blue                 100               1/1/2000          null          3                   5
       2B               Blue                 200               1/1/2000          null          4                   8
       3B               Blue                 300               1/1/2000          null          0                   4
       1C               Gray                 100               1/1/2000          null          2                   6
       2C               Gray                 200               1/1/2000          null          2                   4
       3C               Gray                 300               1/1/2000          null          6                   8
    Event ID           From Date             To Date          Route ID                From M         To M        Location Error
    S1                 1/1/2000              <Null>           3A                      3              4           No Error
    S2                 1/1/2000              <Null>           2A                      1              1.5         No Error
    S3                 1/1/2000              <Null>           3A                      0              2           No Error
    S4                 1/1/2000              <Null>           3A                      0              4           No Error
    S5a                1/1/2000              <Null>           2A                      1.75           2           No Error
    S5b                1/1/2000              <Null>           3A                      0              4           No Error
    S6a                1/1/2000              <Null>           1A                      2              4           No Error
    S6b                1/1/2000              <Null>           2A                      0              1.25        No Error
    S7a                1/1/2000              <Null>           1A                      3              4           No Error
    S7b                1/1/2000              <Null>           2A                      0              2           No Error
    S7c                1/1/2000              <Null>           3A                      0              2           No Error
    S8a                1/1/2000              <Null>           1A                      2              4           No Error
    S8b                1/1/2000              <Null>           2A                      0              2           No Error
    S8c                1/1/2000              <Null>           3A                      0              4           No Error

                        Effective date is 1/1/2020
                        Recal downstream unchecked
        Test case 12: Transfer to New Line – transfer 0.5+1 simple routes; transfer
        CP; change measures; partial routes have to change route name/id
    After                    4                  3             2                         0       1                       4
                         0                                                                                                  2                        8
                                                                                            8
                                                                                                    3B, 300

                                   2A, 200
                         1
                                              1A, 100

                                                                                                                                                     3C, 300
                                                                                                              1C, 100
3     1B, 100 1.25 5
                         2
          2A_reassign,

                                                                                                                            5
                                             3A, 200                  5
                                                                                                                                 2C, 200
          100

                                                                                                                            6
                         3                                        4                                                                                   6
                             0                                                                                          2           3            4
                                                        6     8

       Rname                       Line Name            Line Order          From Date           To Date       From M              To M
       1A                          Red                  100                 1/1/2000            null          2                   4
       2A                          Red                  200                 1/1/2000            1/1/2020      0                   2
       2A                          Red                  200                 1/1/2020            null          0                   1.25
       3A                          Red                  300                 1/1/2000            1/1/2020      0                   4
       2A_reassign                 Teal                 100                 1/1/2020            null          2                   3
       3A                          Teal                 200                 1/1/2020            null          0                   8
       1B                          Blue                 100                 1/1/2000            null          3                   5
       2B                          Blue                 200                 1/1/2000            null          4                   8
       3B                          Blue                 300                 1/1/2000            null          0                   4
       1C                          Gray                 100                 1/1/2000            null          2                   6
       2C                          Gray                 200                 1/1/2000            null          2                   4
       3C                          Gray                 300                 1/1/2000            null          6                   8
    Event ID                     From Date             To Date            Route ID                   From M         To M        Location Error
    S1                           1/1/2000              1/1/2020           3A                         3              4           No Error
    S1                           1/1/2020              <Null>             3A                         6              8           No Error
    S2                           1/1/2000              1/1/2020           2A                         1              1.5         No Error
    S2                           1/1/2020              <Null>             2A                         1              1.25        No Error
    S2                           1/1/2020              <Null>             2A_reassign                2              2.5         No Error
    S3                           1/1/2000              1/1/2020           3A                         0              2           No Error
    S3                           1/1/2020              <Null>             3A                         0              4           No Error
    S4                           1/1/2000              1/1/2020           3A                         0              4           No Error
    S4                           1/1/2020              <Null>             3A                         0              8           No Error
    S5a                          1/1/2000              1/1/2020           2A                         1.75           2           No Error
    S5a                          1/1/2020              <Null>             2A_reassign                2.75           8           No Error
    S5b                          1/1/2000              1/1/2020           3A                         0              4           No Error
    S5b                          1/1/2020              <Null>             3A                         0              8           No Error
    S6a                          1/1/2000              <Null>             1A                         2              4           No Error
    S6b                          1/1/2000              <Null>             2A                         0              1.25        No Error
    S7a                          1/1/2000              <Null>             1A                         3              4           No Error
    S7b                          1/1/2000              1/1/2020           2A                         0              2           No Error
    S7b                          1/1/2020              <Null>             2A                         0              1.25        No Error
    S7b                          1/1/2020              <Null>             2A_reassign                2              3           No Error
    S7c                          1/1/2000              1/1/2020           3A                         0              2           No Error
    S7c                          1/1/2020              <Null>             3A                         0              4           No Error
    S8a                          1/1/2000              <Null>             1A                         2              4           No Error
    S8b                          1/1/2000              1/1/2020           2A                         0              2           No Error
    S8b                          1/1/2020              <Null>             2A                         0              1.25        No Error
    S8b                          1/1/2020              <Null>             2A_reassign                2              3           No Error
    S8c                          1/1/2000              1/1/2020           3A                         0              4           No Error
    S8c                          1/1/2020              <Null>             3A                         0              8           No Error
Test case 13: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                                 51 route; change 1 route name/id
     Before
            4                 3           2                                   0       1                           4
        0                                                                                                             2                              8
20                                                                                8
                                                                                          3B, 300
        1
                           1A, 100
                 2A, 200

                                                                                                                                                     3C, 300
                                                                    2B, 200

                                                                                                        1C, 100
                                                                                  5

                           3A, 300                                                                                    5

                                              3       1B, 100            5                                            6
                                                                                                                              2C, 200
23      2                                                                         4                                                                   6
            0                        3    4                                                                       2                3             4
            23                           30

                 Rname               Line Name         Line Order       From Date             To Date                     From M          To M
                 1A                  Red               100              1/1/2000              null                        2               4
                 2A                  Red               200              1/1/2000              null                        0               2
                 3A                  Red               300              1/1/2000              null                        0               4
                 Conc1               Orange            100              1/1/2000              null                        20              30
                 1B                  Blue              100              1/1/2000              null                        3               5
                 2B                  Blue              200              1/1/2000              null                        4               8
                 3B                  Blue              300              1/1/2000              null                        0               4
                 1C                  Gray              100              1/1/2000              null                        2               6
                 2C                  Gray              200              1/1/2000              null                        2               4
                 3C                  Gray              300              1/1/2000              null                        6               8
       Event ID                   From Date          To Date    Route ID                       From M                      To M        Location Error
       S1                         1/1/2000           <Null>     1A                             2                           2.5         No Error
       S2                         1/1/2000           <Null>     2A                             1                           1.5         No Error
       S3                         1/1/2000           <Null>     1A                             3                           4           No Error
       S4                         1/1/2000           <Null>     3A                             0                           4           No Error
       S5a                        1/1/2000           <Null>     2A                             1.75                        2           No Error
       S5b                        1/1/2000           <Null>     3A                             0                           4           No Error
       S6a                        1/1/2000           <Null>     1A                             2                           4           No Error
       S6b                        1/1/2000           <Null>     2A                             0                           1.25        No Error
       S7a                        1/1/2000           <Null>     1A                             3                           4           No Error
       S7b                        1/1/2000           <Null>     2A                             0                           2           No Error
       S7c                        1/1/2000           <Null>     3A                             0                           2           No Error
       S8a                        1/1/2000           <Null>     1A                             2                           4           No Error
       S8b                        1/1/2000           <Null>     2A                             0                           2           No Error
       S8c                        1/1/2000           <Null>     3A                             0                           4           No Error
       Event ID              From Date            To Date From Route ID To Route ID From M                                   To M Location Error
       Sconc                 1/1/2000             <Null> Conc1          Conc1       21.5                                     30   No Error
                                  Effective date is 1/1/2020
                                  Recal downstream unchecked
Test case 13: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                                  52 route; change 1 route name/id
     After
            4                     3           2                               0       1                           4
        0                                                                                                             2                               8
20                                                                                8
                                                                                          3B, 300
        1
                               1A, 100
                     2A, 200

                                                                                                                                                      3C, 300
                                                                    2B, 200

                                                                                                        1C, 100
                                                                                  5

                           3A_new, 300                                                                                5

                                               3       1B, 100           5                                            6
                                                                                                                                 2C, 200
23      2                                                                         4                                                                    6
            2                            8    10                                                                  2                3              4
                23                            30

                     Rname               Line Name     Line Order       From Date             To Date                     From M           To M
                     1A                  Red           100              1/1/2000              null                        2                4
                     2A                  Red           200              1/1/2000              null                        0                2
                     3A                  Red           300              1/1/2000              null                        0                4
                     1A                  Teal          100              1/1/2020              null                        2                4
                     2A                  Teal          200              1/1/2020              null                        0                2
                     3A_new              Teal          300              1/1/2020              null                        2                10
                     Conc1               Orange        100              1/1/2000              null                        20               30
                     1B                  Blue          100              1/1/2000              null                        3                5
                     2B                  Blue          200              1/1/2000              null                        4                8
                     3B                  Blue          300              1/1/2000              null                        0                4
                     1C                  Gray          100              1/1/2000              null                        2                6
                     2C                  Gray          200              1/1/2000              null                        2                4
                     3C                  Gray          300              1/1/2000              null                        6                8
      Event ID                    From Date          To Date     Route ID                     From M                      To M     Location Error
      S1                          1/1/2000           <Null>      1A                           2                           2.5      No Error
      S2                          1/1/2000           <Null>      2A                           1                           1.5      No Error
      S3                          1/1/2000           <Null>      1A                           3                           4        No Error
      S4                          1/1/2000           1/1/2020    3A                           0                           4        No Error
      S4                          1/1/2020           <Null>      3A_new                       2                           10       No Error
      S5a                         1/1/2000           <Null>      2A                           1.75                        2        No Error
      S5b                         1/1/2000           1/1/2020    3A                           0                           4        No Error
      S4                          1/1/2020           <Null>      3A_new                       2                           10       No Error
      S6a                         1/1/2000           <Null>      1A                           2                           4        No Error
      S6b                         1/1/2000           <Null>      2A                           0                           1.25     No Error
      S7a                         1/1/2000           <Null>      1A                           3                           4        No Error
      S7b                         1/1/2000           <Null>      2A                           0                           2        No Error
      S7c                         1/1/2000           1/1/2020    3A                           0                           2        No Error
      S7c                         1/1/2020           <Null>      3A_new                       2                           6        No Error
      S8a                         1/1/2000           <Null>      1A                           2                           4        No Error
      S8b                         1/1/2000           <Null>      2A                           0                           2        No Error
      S8c                         1/1/2000           1/1/2020    3A                           0                           4        No Error
      S8c                         1/1/2020           <Null>      3A_new                       2                           10       No Error
      Event ID                  From Date         To Date From Route ID To Route ID From M                                   To M Location Error
      Sconc                     1/1/2000          <Null> Conc1          Conc1       21.5                                     30   No Error
Test case 14: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
53 change measures on 0.5 route; partial routes have to change route name/id
                                             Conc1, 100
Before                                       2000-null

                               15                                                  10

                                                                                                2
                                    4                   3                      2                              1C, 100                4
              15               0                                                                                                         4    In 2000, create 1A
                                                                                                1
                                                                                                                                              In 2010, create 2A

                                                                                                    3B, 300
                               1              1A, 100                                                                                         In 2015, create 3A and conc1
                   2010-null

                                              2000-2020                             2B,7200 8                                                 In 2020, retire1A
 Conc2, 200

                   2A, 200

                                                                                                                           2C, 200
 2015-null

                                                        5
                                                    5       1B, 100                                                                      5    In 2025, transfer part 2A &
3A, recal downstream unchecked

                               2
                                                    4                               3A, 300                                              8          3C, 300
              20
                                    0                                  3       4 2015-null                                                                       3
                                                                                                                                     2
       Rname                            Line Name                     Line Order         From Date            To Date            From M                 To M
       1A                               Red                           100                1/1/2000             1/1/2020           2                      4
       2A                               Red                           200                1/1/2010             1/1/2020           0                      2
       3A                               Red                           300                1/1/2015             1/1/2020           0                      4
       2A                               Red                           100                1/1/2020             null               0                      2
       3A                               Red                           200                1/1/2020             null               0                      4
       Conc1                            Orange                        100                1/1/2000             null               10                     15
       Conc2                            Orange                        200                1/1/2015             null               15                     20
       1B                               Blue                          100                1/1/2000             null               3                      5
       2B                               Blue                          200                1/1/2000             null               4                      8
       3B                               Blue                          300                1/1/2000             null               0                      4
       1C                               Gray                          100                1/1/2000             null               2                      6
       2C                               Gray                          200                1/1/2000             null               2                      4
       3C                               Gray                          300                1/1/2000             null               6                      8

Event ID                           From Date                   To Date                  Route ID                  From M                     To M     Location Error
S1                                 1/1/2000                    <Null>                   1A                        2                          2.5      No Error
S2                                 1/1/2010                    <Null>                   2A                        1                          1.5      No Error
S3                                 1/1/2000                    <Null>                   1A                        3                          4        No Error
S4                                 1/1/2015                    <Null>                   3A                        0                          4        No Error
S5a                                1/1/2010                    <Null>                   2A                        1.75                       2        No Error
S5b                                1/1/2015                    <Null>                   3A                        0                          4        No Error
S6a                                1/1/2000                    <Null>                   1A                        2                          4        No Error
S6b                                1/1/2010                    <Null>                   2A                        0                          1.25     No Error
S7a                                1/1/2000                    <Null>                   1A                        3                          4        No Error
S7b                                1/1/2010                    <Null>                   2A                        0                          2        No Error
S7c                                1/1/2015                    <Null>                   3A                        0                          2        No Error
S8a                                1/1/2000                    <Null>                   1A                        2                          4        No Error
S8b                                1/1/2010                    <Null>                   2A                        0                          2        No Error
S8c                                1/1/2015                    <Null>                   3A                        0                          4        No Error

Event ID                 From Date              To Date                      From Route ID                To Route ID    From M                 To M    Location Error
Sconc1                   1/1/2000               1/1/2015                     Conc1                        Conc1          10                     15      No Error
Sconc1                   1/1/2015               <Null>                       Conc1                        Conc2          10                     16      No Error
Sconc2                   1/1/2015               <Null>                       Conc2                        Conc2          17.5                   20      No Error
Test case 14: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
54 change measures on 0.5 route; partial routes have to change route name/id

After - routes
               Conc1, 100
               2000-null 15                                         10
                                                                                                                                In 2000, create 1A
                                                                                                                                In 2010, create 2A
                                                                                    2
                                0
                                    4            3                  2                             1C, 100               4
                                                                                                                                In 2015, create 3A and conc1
               15                                                                                                           4
                                                                                                                                In 2020, retire1A
                    2025-null

                                           1A, 100                                  1

                                                                                        3B, 300
                    2A, 100

                                1                                                                                               In 2025, transfer part 2A &
                                           2000-2020
                                                                                                                                3A, recal downstream
                                                                        2B,7200 8
 Conc2, 200

2C, 200 unchecked
 2015-null

                            1.25                 5
                                            5                                                                               5
                                2
                                                     1B, 100
                2A_reassign,

                2025-null
                100

                                             4                          3A, 200                                             8       3C, 300
               20               3
                                    0                          3    4 2025-null                                                                    3
                                                                                                                        2

              Rname                     Line Name              Line Order     From Date            To Date                  From M         To M
              1A                        Red                    100            1/1/2000             1/1/2020                 2              4
              2A                        Red                    200            1/1/2010             1/1/2015                 0              2
              3A                        Red                    300            1/1/2015             1/1/2020                 0              4
              2A                        Red                    100            1/1/2020             1/1/2025                 0              2
              3A                        Red                    200            1/1/2020             1/1/2025                 0              4
              2A                        Red                    100            1/1/2025             null                     0              1.25
              2A_reassign               Teal                   100            1/1/2025             null                     2              3
              3A                        Teal                   200            1/1/2025             null                     0              4
              Conc1                     Orange                 100            1/1/2000             null                     10             15
              Conc2                     Orange                 200            1/1/2015             null                     15             20
              1B                        Blue                   100            1/1/2000             null                     3              5
              2B                        Blue                   200            1/1/2000             null                     4              8
              3B                        Blue                   300            1/1/2000             null                     0              4
              1C                        Gray                   100            1/1/2000             null                     2              6
              2C                        Gray                   200            1/1/2000             null                     2              4
              3C                        Gray                   300            1/1/2000             null                     6              8
Test case 14: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
55 change measures on 0.5 route; partial routes have to change route name/id

After - Events
              Conc1, 100
              2000-null 15                                            10

                                                                                      2                                            In 2000, create 1A
                                    4              3                  2                             1C, 100               4
              15               0                                                                                              4    In 2010, create 2A
                   2025-null

                                          1A, 100                                     1
                                                                                                                                   In 2015, create 3A and conc1

                                                                                          3B, 300
                   2A, 100

                               1
                                          2000-2020                                                                                In 2020, retire1A
                                                                          2B,7200 8                                                In 2025, transfer part 2A &
 Conc2, 200

                                                                                                                2C, 200
 2015-null

                           1.25                    5
                                           5                                                                                  5    3A, recal downstream
2 unchecked
                                                       1B, 100
               2A_reassign,

               2025-null
               100

                                               4                        3A, 200                                               8          3C, 300
              20               3
                                   0                             3    4 2025-null                                                                     3
                                                                                                                          2

Event ID                           From Date              To Date           Route ID                   From M                     To M     Location Error
S1                                 1/1/2000               1/1/2020          1A                         2                          2.5      No Error
S2                                 1/1/2010               1/1/2025          2A                         1                          1.5      No Error
S2                                 1/1/2025               <Null>            2A                         1                          1.25     No Error
S2                                 1/1/2025               <Null>            2A_reassign                2                          2.5      No Error
S3                                 1/1/2000               1/1/2020          1A                         3                          4        No Error
S4                                 1/1/2015               1/1/2025          3A                         0                          4        No Error
S4                                 1/1/2025               <Null>            3A                         0                          4        No Error
S5a                                1/1/2010               1/1/2025          2A                         1.75                       2        No Error
S5a                                1/1/2025               <Null>            2A_reassign                2.75                       3        No Error
S5b                                1/1/2015               1/1/2025          3A                         0                          4        No Error
S5b                                1/1/2025               <Null>            3A                         0                          4        No Error
S6a                                1/1/2000               1/1/2020          1A                         2                          4        No Error
S6b                                1/1/2010               <Null>            2A                         0                          1.25     No Error
S7a                                1/1/2000               1/1/2020          1A                         3                          4        No Error
S7b                                1/1/2010               1/1/2025          2A                         0                          2        No Error
S7b                                1/1/2025               <Null>            2A                         0                          1.25     No Error
S7b                                1/1/2025               <Null>            2A_reassign                2                          3        No Error
S7c                                1/1/2015               1/1/2025          3A                         0                          2        No Error
S7c                                1/1/2025               <Null>            3A                         0                          2        No Error
S8a                                1/1/2000               1/1/2020          1A                         2                          4        No Error
S8b                                1/1/2010               1/1/2025          2A                         0                          2        No Error
S8b                                1/1/2025               <Null>            2A                         0                          1.25     No Error
S8b                                1/1/2025               <Null>            2A_reassign                2                          3        No Error
S8c                                1/1/2015               1/1/2025          3A                         0                          4        No Error
S8c                                1/1/2025               <Null>            3A                         0                          4        No Error
Event ID                 From Date         To Date                   From Route ID             To Route ID    From M                 To M    Location Error
Sconc1                   1/1/2000          1/1/2015                  Conc1                     Conc1          10                     15      No Error
Sconc1                   1/1/2015          <Null>                    Conc1                     Conc2          10                     16      No Error
Sconc2                   1/1/2015          <Null>                    Conc2                     Conc2          17.5                   20      No Error
56
Test case 14-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not transfer CP
                                                                                                                                       57
   Before
                4      3          2                                  0       1                         4
            0                                                                                              2                      8
                                                                         8
                                                                                 3B, 300
            1
                    1A, 100
2010-null

                                                                                                                                  3C, 300
                    2000-null

                                                           2B, 200

                                                                                             1C, 100
2A, 200

                                                                         5

                    3A, 300
                    2020-null                                                                              5

                                      3       1B, 100           5                                          6
                                                                                                                  2C, 200
            2                                                            4                                                         6
                0           2     4                                                                    2            3         4

            Rname      Line Name          Line Order    From Date                To Date       From M               To M
            1A         Red                100           1/1/2000                 null          2                    4
            2A         Red                200           1/1/2010                 null          0                    2
            3A         Red                300           1/1/2015                 null          0                    4
            1B         Blue               100           1/1/2000                 null          3                    5
            2B         Blue               200           1/1/2000                 null          4                    8
            3B         Blue               300           1/1/2000                 null          0                    4
            1C         Gray               100           1/1/2000                 null          2                    6
            2C         Gray               200           1/1/2000                 null          2                    4
            3C         Gray               300           1/1/2000                 null          6                    8
      Event ID       From Date            To Date      Route ID                     From M                 To M   Location Error
      S1a            1/1/2000             <Null>       1A                           2                      2.5    No Error
      S1b            1/1/2020             <Null>       3A                           2                      4      No Error
      S2a            1/1/2000             <Null>       1A                           2.5                    3.5    No Error
      S2b            1/1/2020             <Null>       3A                           1                      3      No Error
      S3a            1/1/2000             <Null>       1A                           3                      4      No Error
      S3b            1/1/2020             <Null>       3A                           0                      1.2    No Error
      S4a            1/1/2000             <Null>       1A                           2                      4      No Error
      S4b            1/1/2020             <Null>       3A                           0                      4      No Error

                       Effective date is 1/1/2030
                       Recal downstream unchecked
Test case 14-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not transfer CP
                                                                                                                                      58
   After
                4                 2                                  0       1                        4
            0                                                                                             2                      8
                                                                         8
                                                                                 3B, 300
                    1A, 100
2030-null

                                                                                                                                 3C, 300
                    2030-null

                                                           2B, 200

                                                                                            1C, 100
2A, 200

                                                                         5

                    3A, 300
                    2030-null                                                                             5

                                      3       1B, 100           5                                         6
                                                                                                                 2C, 200
            2                                                            4                                                        6
                0                 4                                                                   2            3         4

            Rname      Line Name          Line Order    From Date                To Date      From M               To M
            1A         Red                100           1/1/2000                 1/1/2030     2                    4
            2A         Red                200           1/1/2010                 1/1/2030     0                    2
            3A         Red                300           1/1/2015                 1/1/2030     0                    4
            1A         Teal               100           1/1/2030                 null         2                    4
            2A         Teal               200           1/1/2030                 null         0                    2
            3A         Teal               300           1/1/2030                 null         0                    4
            1B         Blue               100           1/1/2000                 null         3                    5
            2B         Blue               200           1/1/2000                 null         4                    8
            3B         Blue               300           1/1/2000                 null         0                    4
            1C         Gray               100           1/1/2000                 null         2                    6
            2C         Gray               200           1/1/2000                 null         2                    4
            3C         Gray               300           1/1/2000                 null         6                    8
      Event ID       From Date            To Date      Route ID                    From M                 To M   Location Error
      S1a            1/1/2000             1/1/2030     1A                          2                      2.5    No Error
      S1b            1/1/2020             1/1/2030     3A                          2                      4      No Error
      S2a            1/1/2000             1/1/2030     1A                          2.5                    3.5    No Error
      S2b            1/1/2020             1/1/2030     3A                          1                      3      No Error
      S3a            1/1/2000             1/1/2030     1A                          3                      4      No Error
      S3b            1/1/2020             1/1/2030     3A                          0                      1.2    No Error
      S4a            1/1/2000             1/1/2030     1A                          2                      4      No Error
      S4b            1/1/2020             1/1/2030     3A                          0                      4      No Error
      S1a            1/1/2030             <Null>       1A                          2                      2.5    No Error
      S1b            1/1/2030             <Null>       3A                          3                      4      No Error
      S2a            1/1/2030             <Null>       1A                          2.5                    3.5    No Error
      S2b            1/1/2030             <Null>       3A                          1.5                    3.5    No Error
      S3a            1/1/2030             <Null>       1A                          3                      4      No Error
      S3b            1/1/2030             <Null>       3A                          0                      2      No Error
      S4a            1/1/2030             <Null>       1A                          2                      4      No Error
      S4b            1/1/2030             <Null>       3A                          0                      4      No Error
Test case 15: Transfer to New Line – transfer 3 entire simple routes;                                                           59 transfer CP; keep original measures; keep original route name/id

      Before
               4               3          2                               0       1                         4
           0                                                                                                    2                        8
                                                                              8
                                                                                      3B, 300
           1
                         1A, 100

                                                                                                                                         3C, 300
                                                                2B, 200

                                                                                                  1C, 100
2A, 200

                                                                              5

                         3A, 300                                                                                5

                                              3     1B, 100          5                                          6
                                                                                                                     2C, 200
           2                                                                  4                                                           6
               0                     3    4                                                                 2           3            4

               Rname               Line Name      Line Order   From Date               To Date              From M          To M
               1A                  Red            100          1/1/2000                null                 2               4
               2A                  Red            200          1/1/2000                null                 0               2
               3A                  Red            300          1/1/2000                null                 0               4
               1B                  Blue           100          1/1/2000                null                 3               5
               2B                  Blue           200          1/1/2000                null                 4               8
               3B                  Blue           300          1/1/2000                null                 0               4
               1C                  Gray           100          1/1/2000                null                 2               6
               2C                  Gray           200          1/1/2000                null                 2               4
               3C                  Gray           300          1/1/2000                null                 6               8
                   Event ID         From Date        To Date     Route ID                       Measure             Location Error
                   Star1            1/1/2000         <Null>      3A                             2                   No Error
                   Star2            1/1/2000         <Null>      1A                             2                   No Error
                   Star3            1/1/2000         <Null>      1A                             2.5                 No Error
                   Star4            1/1/2000         <Null>      2A                             0                   No Error
                   Star5            1/1/2000         <Null>      2A                             2                   No Error
          Showing these events for once to indicate events on other lines will not be affected

          Event ID            From Date To Date From Route ID To Route ID From M    To M Location Error
          S_blue              1/1/2000    <Null> 1B           2B          4         5       No Error
          Event ID              From Date    To Date Route ID        Measure     Location Error
          Star_blue             1/1/2000     <Null>  2B              6.5         No Error

                                   Effective date is 1/1/2020
                                   Recal downstream unchecked
Test case 15: Transfer to New Line – transfer 3 entire simple routes;                                                               60 transfer CP; keep original measures; keep original route name/id
      After
                4               3           2                                 0       1                         4
            0                                                                                                       2                         8
                                                                                  8
                                                                                          3B, 300
            1
                          1A, 100

                                                                                                                                              3C, 300
                                                                    2B, 200

                                                                                                      1C, 100
2A, 200

                                                                                  5

                          3A, 300                                                                                   5

                                                3      1B, 100           5                                          6
                                                                                                                          2C, 200
            2                                                                     4                                                            6
                0                     3     4                                                                   2            3            4

                Rname               Line Name       Line Order     From Date               To Date              From M           To M
                1A                  Red             100            1/1/2000                1/1/2020             2                4
                2A                  Red             200            1/1/2000                1/1/2020             0                2
                3A                  Red             300            1/1/2000                1/1/2020             0                4
                1A                  Teal            100            1/1/2020                null                 2                4
                2A                  Teal            200            1/1/2020                null                 0                2
                3A                  Teal            300            1/1/2020                null                 0                4
                1B                  Blue            100            1/1/2000                null                 3                5
                2B                  Blue            200            1/1/2000                null                 4                8
                3B                  Blue            300            1/1/2000                null                 0                4
                1C                  Gray            100            1/1/2000                null                 2                6
                2C                  Gray            200            1/1/2000                null                 2                4
                3C                  Gray            300            1/1/2000                null                 6                8

                    Event ID         From Date          To Date      Route ID                       Measure              Location Error
                    Star1            1/1/2000           1/1/2020     3A                             2                    No Error
                    Star2            1/1/2000           1/1/2020     1A                             2                    No Error
                    Star3            1/1/2000           1/1/2020     1A                             2.5                  No Error
                    Star4            1/1/2000           1/1/2020     2A                             0                    No Error
                    Star5            1/1/2000           1/1/2020     2A                             2                    No Error
                    Star1            1/1/2020           <Null>       3A                             2                    No Error
                    Star2            1/1/2020           <Null>       1A                             2                    No Error
                    Star3            1/1/2020           <Null>       1A                             2.5                  No Error
                    Star4            1/1/2020           <Null>       2A                             0                    No Error
                    Star5            1/1/2020           <Null>       2A                             2                    No Error

          Showing these events for once to indicate events on other lines will not be affected

          Event ID             From Date To Date From Route ID To Route ID From M    To M Location Error
          S_blue               1/1/2000    <Null> 1B           2B          4         5       No Error
          Event ID               From Date    To Date Route ID        Measure     Location Error
          Star_blue              1/1/2000     <Null>  2B              6.5         No Error
Test case 15-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                      61 keep original measures; partial routes get new route name/id

Before
     4              3          2                               0       1                         4
                                                                                                     2                        8
                                                                   8
                                                                           3B, 300
 5

                                                                                                                              3C, 300
                                                     2B, 200

                                                                                       1C, 100
                1A, 100                                            5

                                                                                                     5

                                   3     1B, 100          5                                          6
                                                                                                          2C, 200
 6                                                                 4                                                           6
                          7    8                                                                 2           3            4

     Rname              Line Name      Line Order   From Date               To Date              From M          To M
     1A                 Red            100          1/1/2000                null                 2               8
     1B                 Blue           100          1/1/2000                null                 3               5
     2B                 Blue           200          1/1/2000                null                 4               8
     3B                 Blue           300          1/1/2000                null                 0               4
     1C                 Gray           100          1/1/2000                null                 2               6
     2C                 Gray           200          1/1/2000                null                 2               4
     3C                 Gray           300          1/1/2000                null                 6               8
         Event ID        From Date        To Date     Route ID                       Measure             Location Error
         Star1           1/1/2000         <Null>      1A                             6.5                 No Error
         Star2           1/1/2000         <Null>      1A                             2                   No Error
         Star3           1/1/2000         <Null>      1A                             2.5                 No Error
         Star4           1/1/2000         <Null>      1A                             4                   No Error
         Star5           1/1/2000         <Null>      1A                             6                   No Error

                        First transfer is 1/1/2020
                        Second transfer is 1/1/2030
                        Recal downstream unchecked
Test case 15-b: Transfer to New Line – 2 separate transfers; transfer CP;                                                           62 keep original measures; partial routes get new route name/id
        After
                   4                 3           2                               0       1                         4
               4                                                                                                       2                         8
                                                                                     8
                                                                                             3B, 300
1A_reassign,

               5
                               1A, 100

                                                                                                                                                 3C, 300
                                                                       2B, 200

                                                                                                         1C, 100
                                                                                     5
100

                            1A_reassign_reassign,
                                                                                                                       5
                            100
                                                     3     1B, 100          5                                          6
                                                                                                                             2C, 200
               6                                                                     4                                                            6
                   6                       7     8                                                                 2            3            4

                       Rname             Line Name       Line Order   From Date               To Date              From M           To M
                       1A                Red             100          1/1/2000                1/1/2020             2                8
                       1A                Red             100          1/1/2020                null                 2                4
                       1A_reassign       Teal            100          1/1/2020                1/1/2030             4                8
                       1A_reassign       Teal            100          1/1/2030                null                 4                6
1A_reassign_      Yellow          100          1/1/2030                null                 6                8 reassign
                       1B                Blue            100          1/1/2000                null                 3                5
                       2B                Blue            200          1/1/2000                null                 4                8
                       3B                Blue            300          1/1/2000                null                 0                4
                       1C                Gray            100          1/1/2000                null                 2                6
                       2C                Gray            200          1/1/2000                null                 2                4
                       3C                Gray            300          1/1/2000                null                 6                8

                       Event ID           From Date       To Date       Route ID                       Measure              Location Error
                       Star1              1/1/2000        1/1/2020      1A                             6.5                  No Error
                       Star1              1/1/2020        1/1/2030      1A_reassign                    6.5                  No Error
                       Star1              1/1/2030        <Null>        1A_reassign_reassign           6.5                  No Error
                       Star2              1/1/2000        <Null>        1A                             2                    No Error
                       Star3              1/1/2000        <Null>        1A                             2.5                  No Error
                       Star4              1/1/2000        1/1/2020      1A                             4                    No Error
                       Star4              1/1/2020        <Null>        1A_reassign                    4                    No Error
                       Star5              1/1/2000        1/1/2020      1A                             6                    No Error
                       Star5              1/1/2020        1/1/2030      1A_reassign                    6                    No Error
                       Star5              1/1/2030        <Null>        1A_reassign_reassign           6                    No Error
Test case 16: Transfer to New Line – transfer 1 entire simple route; not                                                       63 transfer CP; keep original measures; keep original route name/id

      Before
              4              3          2                               0       1                         4
          0                                                                                                   2                        8
                                                                            8
                                                                                    3B, 300
          1
                        1A, 100

                                                                                                                                       3C, 300
                                                              2B, 200

                                                                                                1C, 100
2A, 200

                                                                            5

                        3A, 300                                                                               5

                                            3     1B, 100          5                                          6
                                                                                                                   2C, 200
          2                                                                 4                                                           6
              0                    3    4                                                                 2           3            4

              Rname              Line Name      Line Order   From Date               To Date              From M          To M
              1A                 Red            100          1/1/2000                null                 2               4
              2A                 Red            200          1/1/2000                null                 0               2
              3A                 Red            300          1/1/2000                null                 0               4
              1B                 Blue           100          1/1/2000                null                 3               5
              2B                 Blue           200          1/1/2000                null                 4               8
              3B                 Blue           300          1/1/2000                null                 0               4
              1C                 Gray           100          1/1/2000                null                 2               6
              2C                 Gray           200          1/1/2000                null                 2               4
              3C                 Gray           300          1/1/2000                null                 6               8
                  Event ID        From Date        To Date     Route ID                       Measure             Location Error
                  Star1           1/1/2000         <Null>      3A                             2                   No Error
                  Star2           1/1/2000         <Null>      1A                             2                   No Error
                  Star3           1/1/2000         <Null>      3A                             1                   No Error
                  Star4           1/1/2000         <Null>      3A                             4                   No Error
                  Star5           1/1/2000         <Null>      2A                             2                   No Error

                                 Effective date is 1/1/2020
                                 Recal downstream unchecked
Test case 16: Transfer to New Line – transfer 1 entire simple route; not                                                        64 transfer CP; keep original measures; keep original route name/id

      After
              4              3          2                                0       1                         4
          0                                                                                                    2                        8
                                                                             8
                                                                                     3B, 300
          1
                        1A, 100
                                         Will it

                                                                                                                                        3C, 300
                                                               2B, 200

                                                                                                 1C, 100
2A, 200

                                        snap to
                                                                             5
                                          1B?

                        3A, 100                                                                                5

                                            3      1B, 100          5                                          6
                                                                                                                    2C, 200
          2                                                                  4                                                           6
              0                         4                                                                  2           3            4

              Rname              Line Name      Line Order    From Date               To Date              From M          To M
              1A                 Red            100           1/1/2000                null                 2               4
              2A                 Red            200           1/1/2000                null                 0               2
              3A                 Red            300           1/1/2000                1/1/2020             0               4
              3A                 Teal           100           1/1/2020                null                 0               4
              1B                 Blue           100           1/1/2000                null                 3               5
              2B                 Blue           200           1/1/2000                null                 4               8
              3B                 Blue           300           1/1/2000                null                 0               4
              1C                 Gray           100           1/1/2000                null                 2               6
              2C                 Gray           200           1/1/2000                null                 2               4
              3C                 Gray           300           1/1/2000                null                 6               8
                  Event ID        From Date        To Date      Route ID                       Measure             Location Error
                  Star1           1/1/2000         1/1/2020     3A                             2                   No Error
                  Star1           1/1/2020         <Null>       3A                             2                   No Error
                  Star2           1/1/2000         <Null>       1A                             2                   No Error
                  Star3           1/1/2000         1/1/2020     3A                             1                   No Error
                  Star3           1/1/2020         <Null>       3A                             1                   No Error
                  Star4           1/1/2000         1/1/2020     3A                             4                   No Error
                  Star4           1/1/2020         <Null>       3A                             4                   No Error
                  Star5           1/1/2000         <Null>       2A                             2 ??                No Error
Test case 16-b: Transfer to New Line – transfer 1 entire simple route;                                                         65 transfer CP; keep original measures; keep original route name/id; effective date is route start date
      Before
              4              3          2                               0       1                         4
          0                                                                                                   2                        8
                                                                            8
                                                                                    3B, 300
          1
                        1A, 100

                                                                                                                                       3C, 300
                                                              2B, 200

                                                                                                1C, 100
2A, 200

                                                                            5

                        3A, 300                                                                               5

                                            3     1B, 100          5                                          6
                                                                                                                   2C, 200
          2                                                                 4                                                           6
              0                    3    4                                                                 2           3            4

              Rname              Line Name      Line Order   From Date               To Date              From M          To M
              1A                 Red            100          1/1/2000                null                 2               4
              2A                 Red            200          1/1/2000                null                 0               2
              3A                 Red            300          1/1/2000                null                 0               4
              1B                 Blue           100          1/1/2000                null                 3               5
              2B                 Blue           200          1/1/2000                null                 4               8
              3B                 Blue           300          1/1/2000                null                 0               4
              1C                 Gray           100          1/1/2000                null                 2               6
              2C                 Gray           200          1/1/2000                null                 2               4
              3C                 Gray           300          1/1/2000                null                 6               8
                  Event ID        From Date        To Date     Route ID                       Measure             Location Error
                  Star1           1/1/2000         <Null>      3A                             2                   No Error
                  Star2           1/1/2000         <Null>      1A                             2                   No Error
                  Star3           1/1/2000         <Null>      3A                             1                   No Error
                  Star4           1/1/2000         <Null>      3A                             4                   No Error
                  Star5           1/1/2000         <Null>      2A                             2                   No Error

                                 Effective date is 1/1/2000
                                 Recal downstream unchecked
Test case 16-b: Transfer to New Line – transfer 1 entire simple route;                                              66 transfer CP; keep original measures; keep original route name/id; effective date is route start date
      After
              4           3          2                                0       1                       4
          0                                                                                               2                 8
                                                                          8
                                                                                  3B, 300
          1
                       1A, 100
                                       Will it

                                                                                                                            3C, 300
                                                            2B, 200

                                                                                            1C, 100
2A, 200

                                      snap to
                                                                          5
                                        1B?

                       3A, 100                                                                            5

                                         3       1B, 100         5                                        6
                                                                                                              2C, 200
          2                                                               4                                                  6
              0                  3   4                                                                2         3       4

              Rname           Line Name   Line Order       From Date               To Date     From M      To M
              1A              Red         100              1/1/2000                null        2           4
              2A              Red         200              1/1/2000                null        0           2
              3A              Teal        100              1/1/2000                null        0           4
              1B              Blue        100              1/1/2000                null        3           5
              2B              Blue        200              1/1/2000                null        4           8
              3B              Blue        300              1/1/2000                null        0           4
              1C              Gray        100              1/1/2000                null        2           6
              2C              Gray        200              1/1/2000                null        2           4
              3C              Gray        300              1/1/2000                null        6           8
               Event ID         From Date     To Date        Route ID                     Measure    Location Error
               Star1            1/1/2000      <Null>         3A                           2          No Error
               Star2            1/1/2000      <Null>         1A                           2          No Error
               Star3            1/1/2000      <Null>         3A                           1          No Error
               Star4            1/1/2000      <Null>         3A                           4          No Error
               Star5            1/1/2000      <Null>         2A                           2 ??       No Error
Test case 17: Transfer to New Line – transfer 0.5+1 simple routes; not                                                   67 transfer CP; change measures; partial routes have to change route name/id

    Before
                    4                   3            2                 0       1                       4
               0                                                                                           2                        8
                                                                           8
                                                                                   3B, 300
               1
                                      1A, 100

                                                                                                                                    3C, 300
                            2A, 200

                                                                                             1C, 100
3    1B, 100 1.25
                        5

                                      3A, 300                5
                                                                                                           5

                                                                                                           6
                                                                                                                   2C, 200
               2                                         4                                                                           6
                    0                       3       4                                                  2              3         4

      Rname                 Line Name           Line Order       From Date     To Date       From M                  To M
      1A                    Red                 100              1/1/2000      null          2                       4
      2A                    Red                 200              1/1/2000      null          0                       2
      3A                    Red                 300              1/1/2000      null          0                       4
      1B                    Blue                100              1/1/2000      null          3                       5
      2B                    Blue                200              1/1/2000      null          4                       8
      3B                    Blue                300              1/1/2000      null          0                       4
      1C                    Gray                100              1/1/2000      null          2                       6
      2C                    Gray                200              1/1/2000      null          2                       4
      3C                    Gray                300              1/1/2000      null          6                       8
       Event ID                From Date           To Date        Route ID             Measure                 Location Error
       Star1                   1/1/2000            <Null>         3A                   2                       No Error
       Star2                   1/1/2000            <Null>         2A                   1.25                    No Error
       Star3                   1/1/2000            <Null>         2A                   1.4375                  No Error
       Star4                   1/1/2000            <Null>         2A                   0                       No Error
       Star5                   1/1/2000            <Null>         2A                   2                       No Error

                            Effective date is 1/1/2020
                            Recal downstream unchecked
Test case 17: Transfer to New Line – transfer 0.5+1 simple routes; not                                                          68 transfer CP; change measures; partial routes have to change route name/id

    After
                             4                             2                  0        1                       4
                         0                                                                                         2                        8
                                                                                   8
                                 2A, 200                                                   3B, 300
                                            1A, 100

                                                                                                                                            3C, 300
                                                                                                     1C, 100
3     1B, 100 1.25 5
                         2
          2A_reassign,

                                                                                                                   5
                                           3A, 200                 5
                                                                                                                           2C, 200
          100

                                                                                                                   6
                         3                                     4                                                                             6
                             0                                                                                 2              3         4
                                                           8

       Rname                     Line Name            Line Order       From Date       To Date       From M                  To M
       1A                        Red                  100              1/1/2000        null          2                       4
       2A                        Red                  200              1/1/2000        1/1/2020      0                       2
       2A                        Red                  200              1/1/2020        null          0                       1.25
       3A                        Red                  300              1/1/2000        1/1/2020      0                       4
       2A_reassign               Teal                 100              1/1/2020        null          2                       3
       3A                        Teal                 200              1/1/2020        null          0                       8
       1B                        Blue                 100              1/1/2000        null          3                       5
       2B                        Blue                 200              1/1/2000        null          4                       8
       3B                        Blue                 300              1/1/2000        null          0                       4
       1C                        Gray                 100              1/1/2000        null          2                       6
       2C                        Gray                 200              1/1/2000        null          2                       4
       3C                        Gray                 300              1/1/2000        null          6                       8
        Event ID                      From Date          To Date        Route ID               Measure                 Location Error
        Star1                         1/1/2000           1/1/2020       3A                     2                       No Error
        Star1                         1/1/2020           <Null>         3A                     4                       No Error
        Star2                         1/1/2000           1/1/2020       2A                     1.25                    No Error
        Star2                         1/1/2020           <Null>         2A_reassign            2                       No Error
        Star3                         1/1/2000           1/1/2020       2A                     1.4375                  No Error
        Star3                         1/1/2020           <Null>         2A_reassign            2.25                    No Error
        Star4                         1/1/2000           <Null>         2A                     0                       No Error
        Star5                         1/1/2000           1/1/2020       2A                     2                       No Error
        Star5                         1/1/2020           <Null>         2A_reassign            3                       No Error
Test case 17-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                            69 change measures; partial route gets new route name/id; recalibrate source downstream
      Before
              4              3          2                               0       1                         4
          0                                                                                                   2                        8
                                                                            8
                                                                                    3B, 300
          1
                        1A, 100

                                                                                                                                       3C, 300
                                                              2B, 200

                                                                                                1C, 100
2A, 200

                                                                            5

                        3A, 300                                                                               5

                                            3     1B, 100          5                                          6
                                                                                                                   2C, 200
          2                                                                 4                                                           6
              0                    3    4                                                                 2           3            4

              Rname              Line Name      Line Order   From Date               To Date              From M          To M
              1A                 Red            100          1/1/2000                null                 2               4
              2A                 Red            200          1/1/2000                null                 0               2
              3A                 Red            300          1/1/2000                null                 0               4
              1B                 Blue           100          1/1/2000                null                 3               5
              2B                 Blue           200          1/1/2000                null                 4               8
              3B                 Blue           300          1/1/2000                null                 0               4
              1C                 Gray           100          1/1/2000                null                 2               6
              2C                 Gray           200          1/1/2000                null                 2               4
              3C                 Gray           300          1/1/2000                null                 6               8
                  Event ID        From Date        To Date     Route ID                       Measure             Location Error
                  Star1           1/1/2000         <Null>      3A                             2                   No Error
                  Star2           1/1/2000         <Null>      2A                             1.25                No Error
                  Star3           1/1/2000         <Null>      2A                             1.4375              No Error
                  Star4           1/1/2000         <Null>      2A                             0                   No Error
                  Star5           1/1/2000         <Null>      2A                             2                   No Error

                                 Effective date is 1/1/2020
                                 Recal downstream checked
Test case 17-b: Transfer to New Line – transfer 0.5 route; transfer CP;                                                                70 change measures; partial route gets new route name/id; recalibrate source downstream
           After
                      4              3           2                                 0       1                         4
                 10                                                                                                      2                         8
                                                                                       8
                                                                                               3B, 300
2A_reassign,

                 11             1A, 100

                                                                                                                                                   3C, 300
                                                                         2B, 200

                                                                                                           1C, 100
100

                                                                                       5
               11.4
                0
2A, 200

                                3A, 300                                                                                  5

                                                     3      1B, 100           5                                          6
                                                                                                                               2C, 200
                                                                                       4                                                            6
                0.6
                      0                    3     4                                                                   2            3            4

                      Rname              Line Name       Line Order     From Date               To Date              From M           To M
                      1A                 Red             100            1/1/2000                null                 2                4
                      2A                 Red             200            1/1/2000                1/1/2020             0                2
                      2A                 Red             200            1/1/2020                null                 0                0.6
                      3A                 Red             300            1/1/2000                null                 0                4
                      2A_reassign        Teal            100            1/1/2020                null                 10               11.4
                      1B                 Blue            100            1/1/2000                null                 3                5
                      2B                 Blue            200            1/1/2000                null                 4                8
                      3B                 Blue            300            1/1/2000                null                 0                4
                      1C                 Gray            100            1/1/2000                null                 2                6
                      2C                 Gray            200            1/1/2000                null                 2                4
                      3C                 Gray            300            1/1/2000                null                 6                8

                          Event ID        From Date          To Date      Route ID                       Measure              Location Error
                          Star1           1/1/2000           <Null>       3A                             2                    No Error
                          Star2           1/1/2000           1/1/2020     2A                             1.25                 No Error
                          Star2           1/1/2020           <Null>       2A_reassign                    11.25                No Error
                          Star3           1/1/2000           1/1/2020     2A                             1.4375               No Error
                          Star3           1/1/2020           <Null>       2A                             0.0375               No Error
                          Star4           1/1/2000           1/1/2020     2A                             0                    No Error
                          Star4           1/1/2020           <Null>       2A_reassign                    10                   No Error
                          Star5           1/1/2000           1/1/2020     2A                             2                    No Error
                          Star5           1/1/2020           <Null>       2A                             0.6                  No Error
Test case 18: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                         71 route; change 1 route name/id
     Before
            4                 3          2                              0       1                           4
        0                                                                                                       2                            8
20                                                                          8
                                                                                    3B, 300
        1
                           1A, 100
                 2A, 200

                                                                                                                                             3C, 300
                                                              2B, 200

                                                                                                  1C, 100
                                                                            5

                           3A, 300                                                                              5

                                             3   1B, 100           5                                            6
                                                                                                                        2C, 200
23      2                                                                   4                                                                 6
            0                        3   4                                                                  2                3           4
            23                           30

                 Rname               Line Name   Line Order       From Date             To Date                     From M        To M
                 1A                  Red         100              1/1/2000              null                        2             4
                 2A                  Red         200              1/1/2000              null                        0             2
                 3A                  Red         300              1/1/2000              null                        0             4
                 Conc1               Orange      100              1/1/2000              null                        20            30
                 1B                  Blue        100              1/1/2000              null                        3             5
                 2B                  Blue        200              1/1/2000              null                        4             8
                 3B                  Blue        300              1/1/2000              null                        0             4
                 1C                  Gray        100              1/1/2000              null                        2             6
                 2C                  Gray        200              1/1/2000              null                        2             4
                 3C                  Gray        300              1/1/2000              null                        6             8
            Event ID              From Date      To Date      Route ID                        Measure                 Location Error
            Star1                 1/1/2000       <Null>       3A                              2                       No Error
            Star2                 1/1/2000       <Null>       1A                              2                       No Error
            Star3                 1/1/2000       <Null>       1A                              2.5                     No Error
            Star4                 1/1/2000       <Null>       2A                              0                       No Error
            Star5                 1/1/2000       <Null>       2A                              2                       No Error

            Event ID              From Date      To Date      Route ID                        Measure                 Location Error
            Star_conc             1/1/2000       <Null>       Conc1                           22                      No Error

                                  Effective date is 1/1/2020
                                  Recal downstream unchecked
Test case 18: Transfer to New Line – transfer 3 entire simple routes; source line has concurrent routes that have events; transfer CP; change measures on 1                                                                              72 route; change 1 route name/id
     After
            4                     3           2                             0       1                           4
        0                                                                                                           2                             8
20                                                                              8
                                                                                        3B, 300
        1
                               1A, 100
                     2A, 200

                                                                                                                                                  3C, 300
                                                                  2B, 200

                                                                                                      1C, 100
                                                                                5

                           3A_new, 300                                                                              5

                                               3     1B, 100           5                                            6
                                                                                                                             2C, 200
23      2                                                                       4                                                                  6
            2                            8    10                                                                2                3            4
                23                            30

                     Rname               Line Name   Line Order       From Date             To Date                     From M         To M
                     1A                  Red         100              1/1/2000              null                        2              4
                     2A                  Red         200              1/1/2000              null                        0              2
                     3A                  Red         300              1/1/2000              null                        0              4
                     1A                  Teal        100              1/1/2020              null                        2              4
                     2A                  Teal        200              1/1/2020              null                        0              2
                     3A_new              Teal        300              1/1/2020              null                        2              10
                     Conc1               Orange      100              1/1/2000              null                        20             30
                     1B                  Blue        100              1/1/2000              null                        3              5
                     2B                  Blue        200              1/1/2000              null                        4              8
                     3B                  Blue        300              1/1/2000              null                        0              4
                     1C                  Gray        100              1/1/2000              null                        2              6
                     2C                  Gray        200              1/1/2000              null                        2              4
                     3C                  Gray        300              1/1/2000              null                        6              8

                 Event ID                From Date    To Date      Route ID                       Measure                   Location Error
                 Star1                   1/1/2000     1/1/2020     3A                             2                         No Error
                 Star1                   1/1/2020     <Null>       3A_new                         6                         No Error
                 Star2                   1/1/2000     1/1/2020     1A                             2                         No Error
                 Star2                   1/1/2020     <Null>       1A                             2                         No Error
                 Star3                   1/1/2000     1/1/2020     1A                             2.5                       No Error
                 Star3                   1/1/2020     <Null>       1A                             2.5                       No Error
                 Star4                   1/1/2000     1/1/2020     2A                             0                         No Error
                 Star4                   1/1/2020     <Null>       2A                             0                         No Error
                 Star5                   1/1/2000     1/1/2020     2A                             2                         No Error
                 Star5                   1/1/2020     <Null>       2A                             2                         No Error

                 Event ID                From Date    To Date      Route ID                       Measure                   Location Error
                 Star_conc               1/1/2000     <Null>       Conc1                          22                        No Error
Test case 19: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
73 change measures on 0.5 route; partial routes have to change route name/id

                                                                       Conc1, 100
Before                                                                 2000-null
                               15                                                  10

                                                                                                 2
                               0
                                    4                   3                      2                               1C, 100                 4
                                                                                                                                               In 2000, create 1A
              15                                                                                                                           4
                                                                                                 1                                             In 2010, create 2A

                                                                                                     3B, 300
                               1              1A, 100                                                                                          In 2015, create 3A and conc1
                                                                                                                                               In 2020, retire1A
                   2010-null

                                              2000-2020                             2B,7200 8
 Conc2, 200

                   2A, 200

                                                                                                                             2C, 200
                                                                                                                                               In 2025, transfer part 2A &
 2015-null

                                                        5
                                                    5                                                                                      5
                                                                                                                                               3A, recal downstream
                                                            1B, 100

                                                                                                                                               unchecked

                               2
                                                    4                               3A, 300                                                8       3C, 300
              20
                                    0                                  3       4 2015-null                                                                        3
                                                                                                                                       2
       Rname                            Line Name                     Line Order         From Date             To Date             From M               To M
       1A                               Red                           100                1/1/2000              1/1/2020            2                    4
       2A                               Red                           200                1/1/2010              1/1/2020            0                    2
       3A                               Red                           300                1/1/2015              1/1/2020            0                    4
       2A                               Red                           100                1/1/2020              null                0                    2
       3A                               Red                           200                1/1/2020              null                0                    4
       Conc1                            Orange                        100                1/1/2000              null                10                   15
       Conc2                            Orange                        200                1/1/2015              null                15                   20
       1B                               Blue                          100                1/1/2000              null                3                    5
       2B                               Blue                          200                1/1/2000              null                4                    8
       3B                               Blue                          300                1/1/2000              null                0                    4
       1C                               Gray                          100                1/1/2000              null                2                    6
       2C                               Gray                          200                1/1/2000              null                2                    4
       3C                               Gray                          300                1/1/2000              null                6                    8
          Event ID                        From Date                        To Date            Route ID                    Measure                Location Error
          Star1                           1/1/2015                         <Null>             3A                          2                      No Error
          Star2                           1/1/2010                         <Null>             2A                          1.25                   No Error
          Star3                           1/1/2010                         <Null>             2A                          1.4375                 No Error
          Star4                           1/1/2000                         <Null>             1A                          4                      No Error
          Star5                           1/1/2010                         <Null>             2A                          2                      No Error

         Event ID                        From Date                         To Date            Route ID                    Measure                Location Error
         Star_conc                       1/1/2000                          <Null>             Conc1                       12.5                   No Error
Test case 19: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that have events; routes on source line have multiple time slices; transfer CP;
74 change measures on 0.5 route; partial routes have to change route name/id

After
              Conc1, 100
              2000-null 15                                              10
                                                                                                                                    In 2000, create 1A
                                                                                       2
                               0
                                   4             3                     2                             1C, 100                4
                                                                                                                                    In 2010, create 2A
              15                                                                                                                4
                                                                                                                                    In 2015, create 3A and conc1
                   2025-null

                                            1A, 100                                    1

                                                                                           3B, 300
                   2A, 100

                               1
                                            2000-2020                                                                               In 2020, retire1A
                                                                                                                                    In 2025, transfer part 2A &
                                                                           2B,7200 8
 Conc2, 200

                                                                                                                  2C, 200
 2015-null

                           1.25                  5                                                                                  3A, recal downstream
                                             5                                                                                  5
                               2                                                                                                    unchecked
                                                     1B, 100
               2A_reassign,

               2025-null
               100

                                             4                           3A, 200                                                8       3C, 300
              20               3
                                   0                            3      4 2025-null                                                                     3
                                                                                                                            2

       Rname                           Line Name               Line Order      From Date             To Date            From M               To M
       1A                              Red                     100             1/1/2000              1/1/2020           2                    4
       2A                              Red                     200             1/1/2010              1/1/2015           0                    2
       3A                              Red                     300             1/1/2015              1/1/2020           0                    4
       2A                              Red                     100             1/1/2020              1/1/2025           0                    2
       3A                              Red                     200             1/1/2020              1/1/2025           0                    4
       2A                              Red                     100             1/1/2025              null               0                    1.25
       2A_reassign                     Teal                    100             1/1/2025              null               2                    3
       3A                              Teal                    200             1/1/2025              null               0                    4
       Conc1                           Orange                  100             1/1/2000              null               10                   15
       Conc2                           Orange                  200             1/1/2015              null               15                   20
       1B                              Blue                    100             1/1/2000              null               3                    5
       2B                              Blue                    200             1/1/2000              null               4                    8
       3B                              Blue                    300             1/1/2000              null               0                    4
       1C                              Gray                    100             1/1/2000              null               2                    6
       2C                              Gray                    200             1/1/2000              null               2                    4
       3C                              Gray                    300             1/1/2000              null               6                    8
          Event ID                      From Date                   To Date      Route ID                      Measure                Location Error
          Star1                         1/1/2000                    1/1/2020     3A                            2                      No Error
          Star1                         1/1/2020                    <Null>       3A                            2                      No Error
          Star2                         1/1/2000                    1/1/2020     2A                            1.25                   No Error
          Star2                         1/1/2020                    <Null>       2A_reassign                   2                      No Error
          Star3                         1/1/2000                    1/1/2020     2A                            1.4375                 No Error
          Star3                         1/1/2020                    <Null>       2A_reassign                   2.25                   No Error
          Star4                         1/1/2000                    1/1/2020     1A                            4                      No Error
          Star5                         1/1/2000                    1/1/2020     2A                            2                      No Error
          Star5                         1/1/2020                    <Null>       2A_reassign                   3                      No Error

         Event ID                       From Date                   To Date      Route ID                      Measure                Location Error
         Star_conc                      1/1/2000                    <Null>       Conc1                         12.5                   No Error
