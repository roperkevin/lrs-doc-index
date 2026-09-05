# Bug Verification and Regression Testing for Append Routes, Append Events, and Generate Intersections Tools

| Field | Value |
| --- | --- |
| **Doc** | 498 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Bug_Regression_testing (2) 2.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/Bug_Regression_testing%20(2)%202.pdf>) |
| **People** | author — · PE Claire Wang · dev Rahul |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | append routes · append events · generate intersections · bug verification · regression testing · route transfer · event transfer · conflict prevention |
| **Tools** | Append Routes · Append Events · Generate Intersections · AEB |

## Summary

This document outlines bug verification and regression testing workflows for Append Routes GP & REST, Append Events GP & REST, and Generate Intersections REST tools. It includes detailed test cases for data conditions involving route reassignment and transfer scenarios, with steps for verifying results and comparing outputs between tools. The testing ensures proper handling of route and event data under various conditions including route name changes, measure changes, and partial route transfers.

## Related documents

<!-- related:begin -->
- [Bug Verification and Regression Testing for Append Routes, Append Events, and Generate Intersections Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/bug-verification-and-regression-testing-for-append-routes-2023-09-2.md>) — similar text 1.00 · 6 title words · 2 filename words · same kind/surface/pe/dev/folder <!-- rel:499 s=11.903 -->
- [Bug Verification and Regression Testing for Append Routes, Append Events, and Generate Intersections Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/bug-verification-and-regression-testing-for-append-routes-2023-09-3.md>) — similar text 1.00 · 6 title words · 2 filename words · same kind/surface/pe/dev/folder <!-- rel:500 s=11.407 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1.md>) — similar text 0.08 · 1 title word · 1 filename word · same kind/surface <!-- rel:115 s=3.352 -->
- [64 bit OID GP Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5509-64-bit-oid-gp.md>) — similar text 0.10 · 1 title word · same kind/surface/pe <!-- rel:467 s=2.99 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5141-reassign-route-transfer-to-another-line-method-support-move.md>) — similar text 0.09 · same kind/surface <!-- rel:533 s=2.173 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com) · [AEB](https://www.google.com/search?q=%22AEB%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Affected tools discovered in spike – bug verification and regression testing
Background

Rahul, Nathan, and Claire have decided that:
1. For the bugs that are going to be fixed on this issue, we'll do a deeper than normal bug verification and will take the testing further for those tools as some tools just fail with this condition as of now without the fix. We will have separate cases for bug verification vs.
    regression testing.
2. We'll include this data condition in our regression test data and perform routine testing using these routes to see if everything is operating normally for the tools for which there have been no reported issues.
Claire has provided the following cases and workflow to test each case for 1 above. Rahul will plan for regression testing data (2 above).
Affected Tools

•Append Routes GP & REST

•Append Events GP & REST

•Generate Intersections REST

•AEB with conflict prevention
Append Routes GP & REST remember to test both tools!
  Workflow
  You can create data with the following steps:
  1.        Run reassign-transfer for each case below
  2.        Verify results
  3.        Export routes to fgdb
  4.        Delete routes in the network, with Delete CP/CL/Event boxes checked
  5.        Append routes from fgdb to network using GP tool/REST. Compare results with
            Reassign results
a. To get the parameters, use Fiddler to capture the REST call when you run the GP tool in Pro. The parameters look like this uploadItemId               i6845a9ed-52c9-4bad-a533-74f5dc239462
                              [{"sourceField":"Text","targetField":"Text"},{"sourceField":"Numeric","target
Field":"Numeric"},{"sourceField":"ShortInt2","targetField":"ShortInt2"},{"sou fieldMap rceField":"Text2","targetField":"Text2"},{"sourceField":"Short2","targetField
":"Short2"}] loadType                   add loadField                  routeId routeIdFieldName           RouteId routeNameFieldName         RouteName fromDateFieldName          FromDate toDateFieldName            ToDate lineIdFieldName            LineId lineNameFieldName          LineName lineOrderFieldName         LineOrder f                          json gdbVersion                 ROADS.REST2 sessionId                  {5486D0E2-0E8E-4CC8-A5E0-049277AC07D4}

       Bug verification –
       1.     Verify the case in bug description (transfer to existing line)
       2.     Test Transfer all routes to a new line
       Regression testing –
1.     Transfer all routes to existing line, change 1 route name, change another route’s measures
2.     Transfer all routes to a new line, change 1 route name, change another route’s measures
3.     Transfer 0.5+2 routes to existing line, change 1 route name, change another route’s measures
4.     Transfer 0.5+1+0.5 routes to a new line, change 1 route name, change another route’s measures, recalibrate downstream
       5.     Transfer a partial route to a new line, use a retired route’s name
6.     Negative case: same routes on different lines but overlapping time slices
       Test Generate CP and Generate Routes after routes are appended
Append Events GP & REST remember to test both tools!
  Workflow
  You can create data with the following steps:

  1.        Add events to routes before reassignment. Test with all Reassign Event Behaviors
  2.        Run reassign-transfer for each case below
  3.        Run AEB
  4.        Verify results
  5.        Export events to fgdb
  6.        Delete events in the network
  7.        Append events from fgdb to network using GP tool/REST. Compare results with AEB results
              a. To get the parameters, use Fiddler to capture the REST call when you run the GP tool in
Pro. The parameters look like this returnServiceEditsOption originalAndCurrentFeatures returnEditMoment                                               TRUE uploadItemId             i72cb1759-01c8-4022-8d3c-9180123dd3d8
                            [{"sourceField":"FromDate","targetField":"FromDate"},{"sourceField":"ToDate",
"targetField":"ToDate"},{"sourceField":"EventId","targetField":"EventId"},{"sour ceField":"RouteId","targetField":"RouteId"},{"sourceField":"RouteName","targe tField":"RouteName"},{"sourceField":"Measure","targetField":"Measure"},{"sou rceField":"RefMethod","targetField":"RefMethod"},{"sourceField":"RefLocation fieldMap                 ","targetField":"RefLocation"},{"sourceField":"RefOffset","targetField":"RefOffs et"},{"sourceField":"Text","targetField":"Text"},{"sourceField":"Numeric","targe tField":"Numeric"},{"sourceField":"ShortInt2","targetField":"ShortInt2"},{"sourc eField":"AttributeDomain","targetField":"AttributeDomain"},{"sourceField":"Ra ngeDomain","targetField":"RangeDomain"},{"sourceField":"Text2","targetField"
:"Text2"},{"sourceField":"Short2","targetField":"Short2"}] loadType                 add f                        json gdbVersion               ROADS.REST1 sessionId                {E7F47A01-7338-4D79-8423-33F9AA341621}

       It is fine that events on unaffected portion get multiple time slices because unlike AEB, Append
       Events uses routes’ time slices.
       Bug verification –
       1.     Verify the case in bug description (transfer to existing line)
       2.     Test Transfer all routes to a new line with no route name change
3.     Transfer all routes to a new line with 1 route name changed and another route’s measures changed
       4.     Merge multiple routes to adjacent route
       Regression testing –
       1.     Transfer all routes to a new line, change 1 route name, change another route’s measures
       2.     Transfer 0.5+2 routes to existing line, change 1 route name, change another route’s measures
3.     Transfer 0.5+1+0.5 routes to a new line, change 1 route name, change another route’s measures, recalibrate downstream
       4.     Transfer a partial route to a new line, use a retired route’s name
       5.     In source event table, make some events have only 1 time slice (e.g. they should have 2000-
2020 and 2020-null, now you delete the 2020-null and change the first one 2000-null) see how these events can get correct time slices
       6.     Test other route editing tools as the fix is not for reassign transfer only
              1.    Merge to adjacent route
              2.    Form a new route by splitting, merging, and renaming
              3.    Retire
              4.    Realign

       7.     Verify Loc Errors for applicable Events
Generate Intersections REST
REST only
  Workflow
  You can create data with the following steps:

1.     Create intersecting routes. Create scenarios for intersecting routes in reassign transfer data condition, and scenarios for intersecting routes with a simple time slice (no reassign transfer data condition)
  2.     In a child version, run Generate Intersections GP tool in Pro and capture the REST call
  3.     Verify results (they should be fine)
4.     Run the REST tool, the parameters look like this parentNetworkLayerDefi nition                   {"objectIds":[19593,19595,40934,40935,40937,40938],"time":[]} startDate                                                                                         0 onlyGenerateForRoutesE ditedByCurrentUser                                        FALSE gdbVersion               ROADS.generate sessionId                {D1C92D97-1988-4A1B-8A0B-E78DFDE2D161} returnServiceEditsOption originalAndCurrentFeatures returnEditMoment                                          TRUE f                        json

       Bug verification –
1. Verify the case in bug description (transfer to existing line) It already has the 2 different scenarios (step 4)
2. Test Transfer all routes to an existing line with no route name change
       Regression testing –
1. Transfer all routes to a new line, keep original route name and measures
2. Transfer 0.5+2 routes to existing line, change 1 route name, change another route’s measures
3. Transfer a partial route to a new line, use a retired route’s name
