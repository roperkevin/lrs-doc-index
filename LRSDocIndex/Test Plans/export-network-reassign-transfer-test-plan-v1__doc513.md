# Export Network Reassign Transfer Test Plan V1

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [ExportNetwork_ReassignTransfer_TestPlanV1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExportNetwork_ReassignTransfer_TestPlanV1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Export Network Reassign Transfer Test Plan V1"
source_file: "ExportNetwork_ReassignTransfer_TestPlanV1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExportNetwork_ReassignTransfer_TestPlanV1.pdf"
doc_id: 513
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["reassign route", "route transfer", "route measures", "route name change", "time slices", "postmile", "route states", "linear referencing"]
tools: []
products: []
issues: []
related: [{"doc":528,"file":"reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md","s":4.787},{"doc":533,"file":"reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md","s":3.818},{"doc":34,"file":"reassign-route-ai-assistant-test-plan__doc34.md","s":3.621},{"doc":535,"file":"reassign-ui-existing-line-test-plan__doc535.md","s":3.248},{"doc":542,"file":"reassign-routes-to-another-line-with-original-route-id-name-maintenance-rest__doc542.md","s":3.22}]
```
-->

## Summary

Test plan for reassigning routes and transferring route segments within an Esri Linear Referencing System. Covers scenarios including transfer to existing lines, transfer to new lines with measure and route name changes, handling multiple time slices, and use of retired route names as output routes. Includes transaction logs, route state changes, and expected outputs for validation.

## Related documents

<!-- related:begin -->
- [Reassign - Transfer to Another Line with StayPut and Retire Event Behavior - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md>) — similar text 0.07 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:528 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md>) — similar text 0.08 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:533 -->
- [Reassign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-ai-assistant-test-plan__doc34.md>) — similar text 0.03 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:34 -->
- [Reassign UI Existing Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-ui-existing-line-test-plan__doc535.md>) — similar text 0.06 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:535 -->
- [Reassign Routes to Another Line with Original Route ID/Name Maintenance - REST Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-routes-to-another-line-with-original-route-id-name-maintenance-rest__doc542.md>) — similar text 0.09 · 1 title word · 1 filename word · same kind/folder <!-- rel:542 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)
<!-- docs:end -->

---

1033
REST

                                                                           CP
                                                      Source
                                                      Routes

                                                         Route
                                                         Name

Edit Log
<?xml version="1.0"?> <RouteEditModel
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
SchemaVersion="3"><RouteEditActivity xsi:type="ReassignRouteInfo" RouteId=“1A"
ToRouteId=“3A" OperationTime="2010-12-31T00:00:00"
DoNotApplyEventBehaviors="false" IsPerformDownstreamCalibration="false"
IsPerformDownstreamReassignedCalibration="false"><RouteStates><RouteState
RouteId="1A" FirstM="2" LastM="4" LineOrder="100"
IsReversed="false"/><RouteState RouteId=“2A" FirstM="0" LastM="2"
LineOrder="200" IsReversed="false"/><RouteState RouteId=“3A" FirstM="0"
LastM="4" LineOrder="300"
IsReversed="false"/></RouteStates><SourceReassignedPortion FromRouteId="1A"
FromMeasure="2" ToRouteId=“3A" ToMeasure="4"/><TargetReassignedPortion
FromRouteId="1A" FromMeasure="2" ToRouteId=“3A"
ToMeasure="4"/><ReassignedSegments><ReassignSegment OldFromMeasure="2"
OldToMeasure="4" NewFromMeasure="2" NewToMeasure="4" MeasureOffset="NaN"
SourceRouteId="1A" TargetRouteId="1A"/><ReassignSegment OldFromMeasure="0"
OldToMeasure="2" NewFromMeasure="0" NewToMeasure="2" MeasureOffset="NaN"
SourceRouteId=“2A" TargetRouteId=“2A"/><ReassignSegment OldFromMeasure="0"
OldToMeasure="4" NewFromMeasure="0" NewToMeasure="4" MeasureOffset="NaN"
SourceRouteId=“3A"
TargetRouteId=“3A"/></ReassignedSegments><ReassignedRouteStates/></RouteEditActi
vity></RouteEditModel>

                                                                            1034
Transfer to the line on right, no change

                      10                                             42
                                                                                                             Transaction Date   08/22/2023

                  100

                                                                 300
                                                                                                             Editing Date       12/31/2010

                        1/1/2000 - Null

                                                                       1/1/2000 - Null
                  1A

                                                                 3A
                  20 2A        200                                        32
                   12  1/1/2000 - Null
                                                                     22

    R Name   L NAME                       From                Date                       To Date                 Line Order

    1A       L0                           1/1/2000                                       Null                    100

    2A       L0                           1/1/2000                                       Null                    200

    3A       L0                           1/1/2000                                       Null                    300

                                          10                                             42
                        100

                                                                      300
                                           12/31/2010- Null

                                                                                          12/31/2010- Null
                        1A

                                                                      3A

                         20 2A        200                                                   32
                          12 12/31/2010- Null
                                                                                22

    R Name   L NAME                       From                Date                       To Date                 Line Order

    1A       L0                           1/1/2000                                       12/31/2010              100

    2A       L0                           1/1/2000                                       12/31/2010              200

    3A       L0                           1/1/2000                                       12/31/2010              300

    1A       L1                           12/31/2010                                     Null                    100

    2A       L1                           12/31/2010                                     Null                    200

    3A       L1                           12/31/2010                                     Null                    300

                                                                                                                                             1035
Transaction       Activity             From           To           From                   To
Date              Type                 Route          Route        Date                   Date

08/22/2023        Reassign Route       1A             3A           12/31/2010             Null

         Last Invoked Time             LRS Time                       Last LRS Time
Input
         08/20/2023

Output     From Date      To Date           Line ID        Order      Start M         End M
1A        1/1/2000       12/31/2010     L0                 100        10             20
2A        1/1/2000       12/31/2010     L0                 200        12             22
3A        1/1/2000       12/31/2010     L0                 300        32             42
1A        12/31/2010     Null           L1                 100        10             20
2A        12/31/2010     Null           L1                 200        12             22
3A        12/31/2010     Null           L1                 300        32             42

                                              Can retire this
                                              test case

         Last Invoked Time             LRS Time                        Last LRS Time
Input
         12/29/2010

Output       From Date       To Date          Line ID         Order        Start M         End M
1A        1/1/2000        12/31/2010         L0              100           10             20
2A        1/1/2000        12/31/2010         L0              200           12             22
3A        1/1/2000        12/31/2010         L0              300           32             42
1A        12/31/2010      Null               L1              100           10             20
2A        12/31/2010      Null               L1              200           12             22
3A        12/31/2010      Null               L1              300           32             42

                                                                                                 1036
Transaction      Activity              From           To            From                  To
Date             Type                  Route          Route         Date                  Date

08/22/2023       Reassign Route        1A             3A            12/31/2010            Null

         Last Invoked Time             LRS Time                       Last LRS Time
Input
         08/20/2023              1/1/2010                        12/29/2007

Output     From Date      To Date           Line ID        Order      Start M         End M
1A        1/1/2000       12/31/2010     L0                 100        10             20
2A        1/1/2000       12/31/2010     L0                 200        12             22
3A        1/1/2000       12/31/2010     L0                 300        32             42
1A        12/31/2010     Null           L1                 100        10             20
2A        12/31/2010     Null           L1                 200        12             22
3A        12/31/2010     Null           L1                 300        32             42

         Last Invoked Time             LRS Time                        Last LRS Time
Input
         08/21/2023              1/1/2015                        12/30/2010

Output       From Date       To Date          Line ID         Order        Start M         End M
1A         1/1/2000       12/31/2010         L0               100          10             20
2A         1/1/2000       12/31/2010         L0               200          12             22
3A         1/1/2000       12/31/2010         L0               300          32             42
1A         12/31/2010     Null               L1               100          10             20
2A         12/31/2010     Null               L1               200          12             22
3A         12/31/2010     Null               L1               300          32             42

                                                                                                 1037
X

    1038
Transfer to a new Line, change measures and Route Names

                                                                                                                    Transaction Date   08/22/2023

                             10                                             42                                      Editing Date       12/31/2010

                         100

                                                                        300
                               1/1/2000 - Null

                                                                              1/1/2000 - Null
                         1A

                                                                        3A
                         20 2A        200                                        32
                          12  1/1/2000 - Null
                                                                            22

           R Name   L NAME                       From                Date                       To Date              Line Order

           1A       L0                           1/1/2000                                       Null                 100

           2A       L0                           1/1/2000                                       Null                 200

           3A       L0                           1/1/2000                                       Null                 300

                                                 10                                             33
                               100

                                                                             300
                                                  12/31/2010- Null

                                                                                                 12/31/2010- Null
                               1AX

                                                                              3AX

                                30 2AX       200                                                   32
                                 15 12/31/2010- Null
                                                                                       22

           R Name   L NAME                       From                Date                       To Date              Line Order

           1A       L0                           1/1/2000                                       12/31/2010           100

           2A       L0                           1/1/2000                                       12/31/2010           200

           3A       L0                           1/1/2000                                       12/31/2010           300

           1AX      X                            12/31/2010                                     Null                 100

           2AX      X                            12/31/2010                                     Null                 200

           3AX      X                            12/31/2010                                     Null                 300

                                                                                                                                             1039
Transaction       Activity             From           To           From                   To
Date              Type                 Route          Route        Date                   Date

08/22/2023        Reassign Route       1A             3A           12/31/2010             Null

         Last Invoked Time             LRS Time                       Last LRS Time
Input
         08/20/2023

Output     From Date      To Date           Line ID        Order      Start M         End M
1A        1/1/2000       12/31/2010     L0                 100        10             20
2A        1/1/2000       12/31/2010     L0                 200        12             22
3A        1/1/2000       12/31/2010     L0                 300        32             42
1AX       12/31/2010     Null           X                  100        10             30
2AX       12/31/2010     Null           X                  200        15             22
3AX       12/31/2010     Null           X                  300        32             33

                                                 We can retire this
                                                 case

         Last Invoked Time             LRS Time                        Last LRS Time
Input
         12/29/2010

Output       From Date       To Date          Line ID         Order        Start M         End M
1A        1/1/2000        12/31/2010         L0              100           10             20
2A        1/1/2000        12/31/2010         L0              200           12             22
3A        1/1/2000        12/31/2010         L0              300           32             42
1AX       12/31/2010      Null               X               100           10             30
2AX       12/31/2010      Null               X               200           15             22
3AX       12/31/2010      Null               X               300           32             33

                                                                                                 1040
Transaction      Activity              From           To            From                  To
Date             Type                  Route          Route         Date                  Date

08/22/2023       Reassign Route        1A             3A            12/31/2010            Null

         Last Invoked Time             LRS Time                       Last LRS Time
Input
         08/20/2023              1/1/2010                        12/29/2007

Output     From Date      To Date           Line ID        Order      Start M         End M
1A        1/1/2000       12/31/2010     L0                 100        10             20
2A        1/1/2000       12/31/2010     L0                 200        12             22
3A        1/1/2000       12/31/2010     L0                 300        32             42
1AX       12/31/2010     Null           X                  100        10             30
2AX       12/31/2010     Null           X                  200        15             22
3AX       12/31/2010     Null           X                  300        32             33

         Last Invoked Time             LRS Time                        Last LRS Time
Input
         08/21/2023              1/1/2015                        12/30/2010

Output       From Date       To Date          Line ID         Order        Start M         End M
1A         1/1/2000       12/31/2010         L0               100          10             20
2A         1/1/2000       12/31/2010         L0               200          12             22
3A         1/1/2000       12/31/2010         L0               300          32             42
1AX        12/31/2010     Null               X                100          10             30
2AX        12/31/2010     Null               X                200          15             22
3AX        12/31/2010     Null               X                300          32             33

                                                                                                 1041
               X

Ask Nathan for the Pima county data that
supports lines to test concurrency.

                                           1042
     Transfer 1.5 routes to a new Line

                                                                                                          Transaction Date   08/22/2023

                   10                                             42                                      Editing Date       12/31/2010

               100

                                                              300
                     1/1/2000 - Null

                                                                    1/1/2000 - Null
               1A

                                                              3A
               20 2A        200                                        32
                12  1/1/2000 - Null
                                                                  22

R Name    L NAME                       From                Date                       To Date              Line Order

1A        L0                           1/1/2000                                       Null                 100

2A        L0                           1/1/2000                                       Null                 200

3A        L0                           1/1/2000                                       Null                 300

                                       10                                             42
                     100

                                                                    200
                                        12/31/2010- Null

                                                                                       12/31/2010- Null
                     1A

                                                                   3A

                                 18 2AX
                      20 2A                     32
                       15 12/31/2010- Null     28
                                           100
                           200 24
R Name    L NAME                       From                Date                       To Date              Line Order

1A        L0                           1/1/2000                                       Null                 100

2A        L0                           1/1/2000                                       12/31/2010           200

3A        L0                           1/1/2000                                       12/31/2010           300

2A        L0                           12/31/2010                                     Null                 200

2AX       X                            12/31/2010                                     Null                 100

3AX       X                            12/31/2010                                     Null                 200

                                                                                                                                   1043
                                                2010 in these
                                                cases
Transaction       Activity             From         To          From             To
Date              Type                 Route        Route       Date             Date

08/22/2023        Reassign Route       2A           3A          12/31/2010       Null

                                                                                 18

         Last Invoked Time             LRS Time                     Last LRS Time
Input
         08/20/2023

Output       From Date       To Date        Line ID         Order      Start M      End M
3A        1/1/2000       12/31/2010         L0            300        32          42
3A        12/31/2000     Null               X             200        32          42
2A        12/31/2000     Null               L0            200        15          24
2AX       12/31/2000     Null               X             100        24          28
2A        1/1/2000       12/31/2010         L0            200        12          22

                                 2010 in these
                                 cases

         Last Invoked Time             LRS Time                     Last LRS Time
Input
         08/21/2023             1/1/2015                     12/30/2010

Output       From Date       To Date        Line ID         Order      Start M      End M
3A        1/1/2000       12/31/2010         L0            300        32          42
3A        12/31/2000     Null               X             200        32          42
2A        12/31/2000     Null               L0            200        15          24
2AX       12/31/2000     Null               X             100        24          28

                                                                                        1044
Transfer 1.5 routes to existing line on left

                                                                                                                        Transaction Date   08/22/2023

                      3                                                    2                                            Editing Date       12/31/2010

                  100

                                                                         300
                          1/1/2000 - Null

                                                                               1/1/2000 - Null
                  1A

                                                                         3A
                  5                 2A                             200           0
                      4                         1/1/2000 - Null
                                                                          8

   R Name   L NAME                          From                   Date                          To Date                 Line Order

   1A       L0                              1/1/2000                                             Null                    100

   2A       L0                              1/1/2000                                             Null                    200

   3A       L0                              1/1/2000                                             Null                    300

                                            3                                                    2
                          400

                                                                               200
                                                12/31/2010- Null

                                                                                                     12/31/2010- Null
                          1A

                                                                              3A

                           5                      2AX 6 2A              0
                            4                                         2
                                                 12/31/2010- Null
                                                                  100
                                                  500 0
   R Name   L NAME                          From                   Date                          To Date                 Line Order

   1A       L0                              1/1/2000                                             12/31/2010              100

   1A       L01                             12/31/2010                                           Null                    400

   2A       L0                              1/1/2000                                             12/31/2010              200

   3A       L0                              1/1/2000                                             12/31/2010              300

   3A       L0                              12/31/2010                                           Null                    200

   2AX      L01                             12/31/2010                                           Null                    500

   2A       L0                              12/31/2010                                           Null                    100

                                                                                                                                                 1045
Transaction       Activity             From       To          From             To
Date              Type                 Route      Route       Date             Date

08/22/2023        Reassign Route       1A         2A          12/31/2010       Null

         Last Invoked Time             LRS Time                   Last LRS Time
Input
         08/20/2023

Output       From Date       To Date        Line ID       Order      Start M       End M
1A        1/1/2000       12/31/2010         L0         100           3         5
2A        12/31/2010     Null               L0         100           4         6
1A        12/31/2010     Null               L01        400           3         5
2A        1/1/2000       12/31/2010         L0         200           4         8
2AX       12/31/2010     Null               L01        500           4         6

         Last Invoked Time             LRS Time                   Last LRS Time
Input
         08/21/2023             1/1/2015                   12/30/2010

Output       From Date       To Date        Line ID       Order      Start M       End M
1A        1/1/2000       12/31/2010         L0         100         3           5
2A        12/31/2000     Null               L0         100         4           6
1A        12/31/2000     Null               L01        400         3           5
2AX       12/31/2000     Null               L01        500         4           6

                                                                                      1046
New Line: Using a retired route name as the output route

                                                                                                                Transaction Date   08/22/2023

                             2                                               4                                  Editing Date       12/31/2010

                         100

                                                                           300
                                 1/1/2000 - Null

                                                                                 1/1/2000 - Null
                         1A

                                                                           3A
                         4                 2A                     200               0
                             0                           1/1/2000 - Null
                                                                            2

           R Name   L NAME                              From       Date                            To Date       Line Order

           1A       L0                                  1/1/2000                                   Null          100

           2A       L0                                  1/1/2000                                   Null          200

           3A       L0                                  1/1/2000                                   Null          300

                                 3                                              4
                         1A-T 100

                                                                           200
                                     12/31/2010- Null

                                                                                    12/31/2010- Null
                                                                           3A

                         5                          2A            100                 0
                             0                          12/31/2010- Null    2

           R Name   L NAME                              From       Date                            To Date       Line Order

           1A       L0                                  1/1/2000                                   12/31/2010    100

           2A       L0                                  1/1/2000                                   12/31/2010    200

           3A       L0                                  1/1/2000                                   12/31/2010    300

           1A-T     LT                                  12/31/2010                                 Null          100

           2A       L0                                  12/31/2010                                 Null          100

           3A       L0                                  12/31/2010                                 Null          200

                                                                                                                                         1047
 Transaction       Activity             From       To         From                To
 Date              Type                 Route      Route      Date                Date

 08/22/2023        Reassign Route       1A         1A         12/31/2010          Null

         Last Invoked Time              LRS Time                   Last LRS Time
Input
         08/20/2023

Output        From Date       To Date         Line ID      Order        Start M       End M
1A         1/1/2000       12/31/2010         L0         100          2            4
1A-T       12/31/2010     Null               LT         100          3            5

         Last Invoked Time              LRS Time                   Last LRS Time
Input
         08/21/2023              1/1/2015                   12/30/2010

Output     From Date          To Date        Line ID    Order        Start M          End M
1A        1/1/2000        12/31/2010         L0         100         2             4
1A-T      12/31/2010      Null               LT         100         3             5

                                                                                         1048
New Line: Routes have multiple time slices

                                                                                 Transaction Date   08/22/2023

                                           42                                    Editing Date       12/31/2022

                                         200
                                               1/1/2000 - Null
                                         3A
                      2A        100              32
                 12    1/1/2000 - Null
                                           22

   R Name   L NAME     From      Date                              To Date        Line Order

   1A       L0         1/1/2000                                    1/1/2020       100

   2A       L0         1/1/2000                                    1/1/2020       200

   3A       L0         1/1/2000                                    1/1/2020       300

   2A       L0         1/1/2020                                    Null           100

   3A       L0         1/1/2020                                    Null           200

                                           42
                                         200
                                               12/31/2022 - Null
                                         3A

                      2A        100              32
                                                                                1/1/2020
                 12    12/31/2022 - Null
                                           22

   R Name   L NAME     From      Date                              To Date        Line Order

   2A       L0         1/1/2000                                    12/31/2022     100

   3A       L0         1/1/2000                                    12/31/2022     200

   2A       LX         12/31/2022                                  Null           100

   3A       LX         12/31/2022                                  Null           100

                                                                                                          1049
                                                  1/1/2020

 Transaction       Activity             From          To           From             To
 Date              Type                 Route         Route        Date             Date

 08/22/2023        Reassign Route       2A            3A           12/31/2022       Null

         Last Invoked Time              LRS Time                      Last LRS Time
Input
         08/20/2023

Output        From Date       To Date         Line ID         Order       Start M     End M
2A         1/1/2000       12/31/2022         L0              100          12        22
3A         1/1/2000       12/31/2022         L0              200          32        42
2A         12/31/2022     Null               LX              100          12        22
3A         12/31/2022     null               LX              200          32        42

                                 1/1/2020

         Last Invoked Time              LRS Time                      Last LRS Time
Input
         08/21/2023               1/1/2015                     12/30/2010

Output     From Date          To Date        Line ID         Order     Start M       End M
2A        1/1/2000        12/31/2022         L0              100       12           22
3A        1/1/2000        12/31/2022         L0              200       32           42
2A        12/31/2022      Null               LX              100       12           22
3A        12/31/2022      null               LX              200       32           42

                                                                                           1050
Postmile: Part of a route to a new line

                       10                                               42
                                                                                                                   Transaction Date   08/22/2023

                  100

                                                                       100
                                                                                                                   Editing Date       12/31/2010

                          1/1/2000 - Null

                                                                             1/1/2000 - Null
                     1A

                                                                       1A
                     20 2A          200 32
                      12  1/1/2000 - Null
                                          22

   R Name    L NAME                         From                 Date                          To Date                 Line Order

   1A        L0                             1/1/2000                                           Null                    100

   2A        L0                             1/1/2000                                           Null                    200

                                            10                                                 42
                        100

                                                                            100
                                             12/31/2010- Null

                                                                                                12/31/2010- Null
                          1A

                                                                             1A

                           20 2A        200                                                       32
                            12 12/31/2010- Null
                                                                                      22

  R Name    L NAME                 From                         Date           To Date                                Line Order

  1A        L0                     1/1/2000                                    12/31/2010                             100

  1A        L0                     12/31/2010                                  Null                                   100

  2A        L0                     1/1/2000                                    Null                                   200

  1AX       LX                     12/31/2010                                  Null                                   100

                                                                                                                                                   1051
Transaction      Activity             From           To           From              To
Date             Type                 Route          Route        Date              Date

08/22/2023       Reassign Route       1A             1A           12/31/2010        Null

         Last Invoked Time            LRS Time                      Last LRS Time
Input
         08/20/2023

Output     From Date      To Date          Line ID        Order     Start M     End M
1A        12/31/2010    Null            L0                100      10          20
1A        1/1/2000      12/31/2010      L0                100      10          42
1AX       12/31/2010    Null            LX                100      32          42

                                                      change new route
                                                      names

               Reassign more
               than one route for
               source in both
               PoM and Line
               Networks
                                                     Middle routes
                                                     should be
                                                     considered for
                                                     testing

                          Test with more
                          than one retired
                          route

                                                                                           1052
