# Consider Route Dominance in Append Events (add method) – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#1488](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1488) |
| **Source** | [AppendEventsDominant_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AppendEventsDominant_testplan.pptx>) |
| **Edited** | 2024-11-20 20:08 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Consider Route Dominance in Append Events (add method) – Test Plan"
source_file: "AppendEventsDominant_testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AppendEventsDominant_testplan.pptx"
doc_id: 279
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Claire"
dev: "Michael"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2024-11-20T20:08:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route dominance", "append events", "concurrency", "conflict prevention", "event appending", "route locking", "spanning line event", "dominant route"]
tools: ["Append Events"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#1488"]
related: [{"doc":278,"file":"consider-route-dominance-in-append-events-test-plan__doc278.md","s":8.219},{"doc":156,"file":"allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md","s":5.526},{"doc":360,"file":"add-point-event-to-dominant-route-in-arcgis-pro-test-plan__doc360.md","s":5.249},{"doc":126,"file":"append-events-date-optional-test-plan__doc126.md","s":4.687},{"doc":549,"file":"append-events-load-events-by-routename-test-plan__doc549.md","s":4.674}]
```
-->

## Summary

Test plan for the Append Events tool enhancement to include an optional parameter for appending events to dominant routes. Covers functionality for concurrency logic, route dominance determination, event appending behavior, conflict prevention with route locking, and various positive and negative test cases including point, line, spanning events, and complex route shapes. Includes test data scenarios, verification steps, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/consider-route-dominance-in-append-events-test-plan__doc278.md>) — similar text 0.54 · 5 title words · 4 filename words · same kind/folder <!-- rel:278 -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/allow-append-events-to-run-when-locks-are-present-test-plan__doc156.md>) — similar text 0.23 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:156 -->
- [Add Point Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-to-dominant-route-in-arcgis-pro-test-plan__doc360.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:360 -->
- [Append Events Date Optional Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-date-optional-test-plan__doc126.md>) — similar text 0.14 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:126 -->
- [Append Events: Load Events by RouteName Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-events-load-events-by-routename-test-plan__doc549.md>) — similar text 0.21 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:549 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Consider Route Dominance in Append Events (add method) – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/1488

PE: Claire
Dev: Michael

## Slide 2

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc708_slide2.svg)

Test UI:
Add a parameter to the Append Events tool “Append events to dominant routes”

This parameter would be optional and placed last in the list of parameters for the tool

![image1.png](../media/doc708_image1.png)

## Slide 3

Test Functionality

- Option is unchecked by default. When checked, all records being appended should be checked against the concurrency logic (spatial and temporal) to identify the dominant route
  - If there is no concurrent section, append the event with input Route/Measure
  - If an event record is completely on a concurrent section and the source Route/Measures are on the dominant route, append the event with input Route/Measure
  - If an event record is completely on a concurrent section and the source Route/Measures are on the subordinate route, translate the route/measure to the dominant route and append it onto the dominant route
    - Provide info in text output “The source event record with OID # was appended onto the dominant route (list of RouteID(s)).”
  - If the event record is on multiple or a mix of concurrent/non concurrent sections, determine which route to append for each section
    - Provide info in text output “The source event record with OID # was split into # of sections appended onto the following dominant routes (list of RouteID(s)).”

## Slide 4

Test Functionality

  - For any concurrent sections with DominantError 4 (can happen to target route, or both input and target route): (One of two conditions were present in the concurrent section: the route was not calibrated in the concurrent section or the centerline that composes the concurrent section did not align with the geometry of the route.), append event onto the input Route/Measure
    - Provide info in text output “The concurrent section couldn’t be calculated, so the event was placed on the input Route “RouteID”.”
- If the event is added to the dominant route that has complex shape and self intersections
  - Point event – add to any measure at the self intersection (e.g. case 4 6 8)
  - Line event – must preserve the shape as if it is drawn on input route, and then determine the measures on target route based on the shape (e.g. case 4 8)
- Make sure event always go with target route direction even it can be different from input route’s direction

## Slide 5

Test Functionality

- With conflict prevention, lock all target routes that the event is eventually appended to. If input route does not get any event, don’t lock it.
- When there’s existing lock:
  - Input route is the target route and it is locked – do not append anything, fail the tool and let users know target route is locked just like what we do now
  - Input route is not target route. Input route is locked and target route is not locked – append successfully
  - Event is going to split to append on different routes, some or all of the target routes are locked --- do not append anything and fail the tool. Let users know which target routes are locked, and instead of input route, these routes are target route because they are dominant.

So the entire process in locking routes in conflict prevention is –

- Run the concurrency/dominant logic for the first time and check if any of the NECESSARY routes are locked. – if any route is locked, then the tool fails now
- If locks are good, append events via concurrency/dominant logic (this is the second time it runs) and lock these routes

## Slide 6

Test Data

- Test with RH, and APR data
- Test in fgdb, sde and FS
- Test with point, spanning and non-spanning line events
- Test simple routes, gapped routes, and routes with complex shapes
- Test the 5 scenarios mentioned before. Only need to sanity test for (a) – when there is no concurrency
- Test with spatial and temporal concurrencies
- Test add method only
- Test conflict prevention
- Test in python and model builder
- Test dark mode for the checkbox
- Test accessibility and i18n
Verification

- Verify the checkbox is added to Append Events tool
- Verify the checkbox is unchecked by default
- Verify the tool identifies the correct dominant route and the result events are appended to the correct Route/Measure
- Verify new messages in text output for different scenarios

## Slide 7

Automation
Add to AppendEvents APR Python automation
Better also add to these

Documentation
Update the documentation for the gp tool.  Add usage notes about what this parameter does and how it can result in splitting of source events.
Add graphics to https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/create-and-modify-lrs-events.htm no need to go super detailed

![image2.png](../media/doc708_image2.png)

## Slide 8 — Positive cases

  - Point events
  - Simple input route has no concurrency. Add the event on this route.
  - Simple input route is the dominant route over the only one time slice. Add the event on this route.
  - Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and convert measures.
  - Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures.
  - Looped input route has different concurrencies over time. Add the event to dominant route in each time slice and convert measures.
  - Input route is the subordinate route over all time slices. Dominant route is a lollipop. Add the event on dominant route and convert measures.
  - Branched input route has different concurrencies over time. The target dominant routes are also complex shapes. Add the event to dominant route in each time slice and convert measures.
  - Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route.
  - Both input and concurrent routes are not calibrated. Add the event to input route and after running Generate Events, show corresponding loc error.

## Slide 9 — Positive cases

  - Non spanning Line events
  - Simple input route has no concurrency. Add the event on this route.
  - Simple input route is the dominant route over the only one time slice. Add the event on this route.
  - Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and convert measures.
  - Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures.
  - Looped input route has different concurrencies over time. The dominant routes are simple route, looped route and barbell route. Add the event to dominant route in each time slice and convert measures.
  - Input route is the subordinate route over all time slices. Dominant route is a lollipop. Add the event on dominant route and convert measures.
  - Branched input route has different concurrencies over time. The target dominant routes are also complex shapes. Add the event to dominant route in each time slice and convert measures.
  - Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route.

## Slide 10 — Positive cases

  - Spanning Line events
  - Simple input routes have no concurrency. Add the event on these routes.
  - Simple input routes are the dominant route over the only one time slice. Add the event on these routes.
  - Simple input routes are the subordinate route over all time slices. Add the event on dominant routes and convert measures.
  - Simple input routes have different concurrencies over time. The dominant routes are simple route, gapped route and 3D route. Add the event to dominant routes in each time slice and convert measures.
  - Lines have many routes, some in opposite direction.
  - Both input and concurrent routes are not calibrated. Add the event to input route and after running Generate Events, show corresponding loc error.
  - Conflict Prevention cases
  - Add point event. Input route is the target route and it is locked – do not append anything, fail the tool and let users know target route is locked just like what we do now.
  - Add line event. Input route is not target route. Input route is locked and target route is not locked – append successfully.
  - Add line event. Event is going to split to append on different routes, some or all of the target routes are locked --- do not append anything and fail the tool. Let users know which target routes are locked, and instead of input route, they are target route because they are dominant. (this is the only negative case added by this user story?)

## Slide 11 — Positive 1: Simple input route has no concurrency. Add the event on this route.

![Diagram drawn from the slide's own shapes: 2 nodes (0, 4), 2 connectors.](../media/doc708_slide11_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 0 |  | 2000 | 2020 |
| Point2 | {Route1- | 4 |  | 2000 | null |
| Line1 | {Route1- | 2 | 8 | 2000 | null |

![Diagram drawn from the slide's own shapes: 2 nodes (0, 4), 2 connectors.](../media/doc708_slide11_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 0 |  | 2000 | 2020 |
| Point2 | {Route1- | 4 |  | 2000 | null |
| Line1 | {Route1- | 2 | 8 | 2000 | null |

## Slide 12 — Positive 2: Simple input route is the dominant route over the only one time slice. Add the event on this route.

![Diagram drawn from the slide's own shapes: 2 nodes (0, 4), 3 connectors.](../media/doc708_slide12_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 0 |  | 2000 | 2020 |
| Point2 | {Route1- | 4 |  | 2000 | null |
| Line1 | {Route1- | 2 | 8 | 2000 | null |

![Diagram drawn from the slide's own shapes: 2 nodes (0, 4), 3 connectors.](../media/doc708_slide12_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 0 |  | 2000 | 2020 |
| Point2 | {Route1- | 4 |  | 2000 | null |
| Line1 | {Route1- | 2 | 8 | 2000 | null |

## Slide 13 — Positive 3: Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes

![Diagram drawn from the slide's own shapes: 3 nodes (0, 4, 8), 5 connectors.](../media/doc708_slide13_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 0 |  | 2000 | 2020 |
| Point2 | {Route2- | 4 |  | 2000 | null |
| Point3 | {Route2- | 8 |  | 2000 | null |
| Line1 | {Route2- | 0 | 10 | 2000 | null |

![Diagram drawn from the slide's own shapes: 4 nodes (0, 4, 29, This line event does not break into 3 segments), 6 connectors.](../media/doc708_slide13_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 0 |  | 2000 | 2020 |
| Point2 | {Route2- | 4 |  | 2000 | null |
| Point3 | {Route1- | 29 |  | 2000 | null |
| Line1 | {Route2- | 0 | 5 | 2000 | null |
| Line1 | {Route1- | 23 | 33 | 2000 | null |

This line event does not break into 3 segments

## Slide 14

Positive 4: Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures

![Diagram drawn from the slide's own shapes: 2 nodes (2, 3), 10 connectors.](../media/doc708_slide14_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 2 |  | 2000 | 2020 |
| Point2 | {Route2- | 3 |  | 2000 | null |
| Line1 | {Route2- | 0 | 10 | 2000 | null |

![Diagram drawn from the slide's own shapes: 3 nodes (3, 1, 11), 15 connectors.](../media/doc708_slide14_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 1 |  | 2000 | 2010 |
| Point1 | {Route1- | 11 |  | 2010 | 2020 |
| Point2 | {Route2- | 3 |  | 2000 | null |
| Line1 | {Route2- | 0 | 1 | 2000 | null |
| Line1 | {Route1- | 0 | 1 | 2000 | 2010 |
| Line1 | {Route1- | 10 | 11 | 2010 | 2020 |
| Line1 | {Route2- | 3 | 4.5 | 2000 | null |
| Line1 | {Route1- | 3.5 | 4.5 | 2000 | 2010 |
| Line1 | {Route1- | 13.5 | 14.5 | 2010 | 2020 |
| Line1 | {Route1- | 5 | 7 | 2000 | 2010 |
| Line1 | {Route1- | 15 | 17 | 2010 | 2020 |

## Slide 15

Positive 5: Looped input route has different concurrencies over time. Add the event to dominant route in each time slice and convert measures.

![Diagram drawn from the slide's own shapes: 12 nodes (0, 8, 2, 6), 44 connectors.](../media/doc708_slide15.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route3- | 0 |  | 2000 | 2020 |
| Point2 | {Route3- | 8 |  | 2000 | null |
| Point3 | {Route3- | 2 |  | 2000 | null |
| Point4 | {Route3- | 6 |  | 2000 | null |
| Line1 | {Route3- | 0 | 8 | 2000 | null |

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 1 |  | 2000 | 2010 |
| Point1 | {Route1- | Prefer 4 (0 &12 also fine) |  | 2010 | 2020 |
| Point2 | {Route2- | 1 (the only option) |  | 2000 | 2010 |
| Point2 | {Route1- | Prefer12 (0 &4 also fine) |  | 2010 | null |
| Point3 | {Route2- | 3 |  | 2000 | 2010 |
| Point3 | {Route1- | 6 |  | 2010 | null |
| Point4 | {Route3- | 6 |  | 2000 | 2010 |
| Point4 | {Route1- | 10 |  | 2010 | null |
| Line1 | {Route3- | 4 | 8 | 2000 | 2010 |
| Line1 | {Route2- | 1 | 5 | 2000 | 2010 |
| Line1 | {Route1- | 4 (can’t be 0 or 12) | 12 (can’t be 0 or 4) | 2010 | null |

## Slide 16

Positive 6: Input route is the subordinate route over all time slices. Dominant route is a lollipop. Add the event on dominant route and convert measures.

![Diagram drawn from the slide's own shapes: 3 nodes (0, 4, 9), 18 connectors.](../media/doc708_slide16_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route3- | 0 |  | 2000 | 2020 |
| Point2 | {Route3- | 4 |  | 2000 | null |
| Point3 | {Route2- | 9 |  | 2000 | null |
| Line1 | {Route3- | 0 | 6 | 2000 | null |
| Line2 | {Route2- | 0 | 9 | 2000 | null |

![Diagram drawn from the slide's own shapes: 3 nodes (6, 14, 14), 19 connectors.](../media/doc708_slide16_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 6 |  | 2000 | 2020 |
| Point2 | {Route1- | 2 or 14, no preference |  | 2000 | null |
| Point3 | {Route1- | Prefer 14, 2 is fine |  | 2000 | null |
| Line1 | {Route1- | 2 | 6 | 2000 | null |
| Line1 | {Route1- | 12 | 14 | 2000 | null |
| Line2 | {Route1- | 3 | 4 | 2000 | null |
| Line2 | {Route1- | 6 | 14 | 2000 | null |

## Slide 17

Positive 7: Branched input route has different concurrencies over time. The target dominant routes are also complex shapes. Add the event to dominant route in each time slice and convert measures.

![Diagram drawn from the slide's own shapes: 3 nodes (2, 0, 6), 13 connectors.](../media/doc708_slide17_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route3- | 0 |  | 2000 | null |
| Point2 | {Route3- | 2 |  | 2000 | 2010 |
| Point3 | {Route2- | 6 |  | 2000 | null |
| Line1 | {Route3- | 0 | 6 | 2000 | null |
| Line2 | {Route2- | 4 | 6 | 2035 | null |

![Measured route diagram drawn from the slide's own shapes, measures 0 to 30.](../media/doc708_slide17_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route3- | 0 |  | 2000 | null |
| Point2 | {Route2- | 14 |  | 2000 | 2010 |
| Point3 | {Route2- | 10 or 30, no preference |  | 2000 | 2020 |
| Point3 | {Route3- | 6 |  | 2020 | 2030 |
| Point3 | {Route1- | 100 |  | 2030 | null |
| Line1 | {Route3- | 0 | 4 | 2000 | 2020 |
| Line1 | {Route2- | 10 | 14 | 2000 | 2020 |
| Line1 | {Route3- | 0 | 6 | 2020 | 2030 |
| Line1 | {Route3- | 0 | 1 | 2030 | null |
| Line1 | {Route3- | 2 | 4 | 2030 | null |
| Line1 | {Route1- | 100 | 103 | 2030 | null |
| Line2 | {Route1- | 100 | 102 | 2035 | null |

Merge into 1 or not?
Test what happens in add event in the same scenario and do the same

## Slide 18

Positive 8: Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route.

![Diagram drawn from the slide's own shapes: 3 nodes (2, 1, 8), 17 connectors.](../media/doc708_slide18_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 1 |  | 2000 | 2020 |
| Point2 | {Route2- | 2 |  | 2000 | null |
| Point3 | {Route2- | 8 |  | 2000 | null |
| Line1 | {Route2- | 0 | 16 | 2000 | null |
| Line2 | {Route1- | 0 | 9 | 2010 | 2020 |

![Diagram drawn from the slide's own shapes: 3 nodes (3, 1, 9), 19 connectors.](../media/doc708_slide18_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route2- | 1 |  | 2000 | 2020 |
| Point2 | {Route1- | 3 or 15, no preference |  | 2000 | null |
| Point3 | {Route1- | 9 |  | 2000 | null |
| Line1 | {Route2- | 0 | 2 | 2000 | null |
| Line1 | {Route1- | 3 | 15 | 2000 | null |
| Line1 | {Route2- | 14 | 16 | 2000 | null |
| Line2 | {Route1- | 0 | 9 | 2010 | 2020 |

## Slide 19 — Spanning Positive 1: Simple input routes have no concurrency. Add the event on these routes.

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route1- | 0 | {Route2- | 100 | 2000 | null |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route1- | 0 | {Route2- | 100 | 2000 | null |

[figure: Input · Result · {Route1- · 0 · 100 · {Route2- · L1 · 50]

## Slide 20 — Spanning Positive 2: Simple input routes are the dominant route over the only one time slice. Add the event on these

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route1- | 0 | {Route2- | 100 | 2000 | null |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route1- | 0 | {Route2- | 100 | 2000 | null |

[figure: Input · {Route3- · {Route1- · 0 · 100 · {Route2- · L1 · 50 · L2 · 200 · Result]

## Slide 21 — Spanning Positive 3: Simple input routes are the subordinate route over all time slices. Add the event on dominant

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route5- | 100 | {Route6- | 200 | 2000 | null |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route5- | 150 | {Route6- | 200 | 2000 | 2020 |
| Line1 | {Route3- | 0 | {Route3- | 50 | 2000 | 2020 |
| Line1 | {Route3- | 0 | {Route3- | 30 | 2020 | null |
| Line1 | {Route4- | 80 | {Route4- | 100 | 2020 | null |
| Line1 | {Route1- | 0 | {Route2- | 80 | 2020 | null |

[figure: Input · {Route5- 2000-null · {Route3- 2000-null · 0 · 100 · L1 · 50 · L2 · 200 · Result (2000-2020) · {Route1- 2020-null · L3 · 20 · 80 · {Route4- 2020-null · {Route2- 2020-null · {Route6- 2000-null · 160 · Result (2020-null)]

## Slide 22 — Spanning Positive 4: Simple input routes have different concurrencies over time. The dominant routes are looped route,

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route6- | 100 | {Route7- | 200 | 2000 | null |

[figure: Input · {Route6- 2000-null · {Route5- 2000-null · L4 · 100 · 200 · {Route1- 2030-null · L2 · {Route2- 2020-null · {Route7- 2000-null · 160 · L3 · 0 · 40 · 10 · 50 · 30 · 70 · 80 · 140 · 188 · 333.3 · 20 · {Route3- 2020-null · …]

## Slide 23 — Spanning Positive 4: Simple input routes have different concurrencies over time. The dominant routes are looped route,

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | {Route6- | 120 | {Route6- | 130 | 2000 | 2020 |
| Line1 | {Route6- | 150 | {Route7- | 180 | 2000 | 2020 |
| Line1 | {Route5- | 10 | {Route5- | 70 | 2000 | 2020 |
| Line1 | {Route5- | 10 | {Route5- | 30 | 2020 | 2030 |
| Line1 | {Route2- | 0 | {Route3- | 40 | 2020 | 2030 |
| Line1 | {Route4- | 188 | {Route4- | 333.3 | 2020 | 2030 |
| Line1 | {Route1- | 0 | {Route1- | 40 | 2030 | null |
| Line1 | {Route3- | 30 | {Route3- | 40 | 2030 | null |
| Line1 | {Route4- | 188 | {Route4- | 333.3 | 2030 | null |

[figure: {Route6- 2000-null · {Route5- 2000-null · L4 · 100 · 200 · L2 · {Route2- 2020-null · {Route7- 2000-null · 160 · L3 · 0 · 40 · 10 · 50 · 30 · 70 · 80 · 140 · 188 · 333.3 · 20 · {Route3- 2020-null · {Route4- 2020-null · Result (2000-2020) · …]

## Slide 24 — Spanning Positive 5: Lines have many routes, some in opposite direction.

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | L3R1 | 100 | L3R6 | 100 | 2000 | null |
| Line2 | L2R4 | -15 | L2R3 | 100 | 2000 | null |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | L1R1 | 100 | L1R4 | 60 | 2000 | null |
| Line2 | L1R1 | ~115 | L1R2 | ~80 | 2000 | null |

[figure: 24 · Input · R1 · 100 · L2 · 200 · 50 · L3 · L1 · 160 · 0 · 36.52 · 88 · 150 · 60 · -30 · Result · R6 · R4 · R2 · R3 · R5]

## Slide 25 — Point Positive 9 & Spanning Positive 6: Both input and concurrent routes are not calibrated. Add the event to input

![Diagram drawn from the slide's own shapes: 3 nodes (50, 100, 200), 5 connectors.](../media/doc708_slide25_fig1.svg)

| EventID | From RID | From M | To RID | To M | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | {Route5- | 50 |  |  | 2000 | null |
| Point2 | {Route5- | 100 |  |  | 2000 | null |
| Point3 | {Route6- | 200 |  |  | 2000 | null |
| Line1 | {Route5- | 100 | {Route6- | 200 | 2000 | null |

Result after generating events

![Diagram drawn from the slide's own shapes: 3 nodes (50, 100, 200), 5 connectors.](../media/doc708_slide25_fig2.svg)

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | LocError |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Point1 | {Route5- | 50 |  |  | 2000 | null | something |
| Point2 | {Route5- | 100 |  |  | 2000 | null | something |
| Point3 | {Route6- | 200 |  |  | 2000 | null | something |
| Line1 | {Route5- | 100 | {Route6- | 200 | 2000 | null | something |

## Slide 26 — Conflict Prevention 1 - negative: Add point event. Input route is the target route and it is locked – do not append

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 4 |  | 2000 | null |

[figure: Input · Result · {Route1- · 0 · 10 · 4]

![image3.png](../media/doc708_image3.png) ![image5.png](../media/doc708_image5.png)

## Slide 27

![Diagram drawn from the slide's own shapes: 3 nodes (0, 4, 9), 18 connectors.](../media/doc708_slide27_fig1.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route3- | 0 |  | 2000 | 2020 |
| Point2 | {Route3- | 4 |  | 2000 | null |
| Point3 | {Route2- | 9 |  | 2000 | null |
| Line1 | {Route3- | 0 | 6 | 2000 | null |
| Line2 | {Route2- | 0 | 9 | 2000 | null |

![Diagram drawn from the slide's own shapes: 3 nodes (6, 14, 14), 19 connectors.](../media/doc708_slide27_fig2.svg)

| EventID | RID | Measure | ToMeasure | FromDate | ToDate |
| --- | --- | --- | --- | --- | --- |
| Point1 | {Route1- | 6 |  | 2000 | 2020 |
| Point2 | {Route1- | 2 or 14, no preference |  | 2000 | null |
| Point3 | {Route1- | Prefer 14, 2 is fine |  | 2000 | null |
| Line1 | {Route1- | 2 | 6 | 2000 | null |
| Line1 | {Route1- | 12 | 14 | 2000 | null |
| Line2 | {Route1- | 3 | 4 | 2000 | null |
| Line2 | {Route1- | 6 | 14 | 2000 | null |

Conflict Prevention 2: Add line event. Input route is not target route. Input route is locked and target route is not locked – append successfully.

![image3.png](../media/doc708_image3.png)

## Slide 28 — Conflict Prevention 3 – negative: Add line event. Event is going to split to append on different routes, some or all of

[figure: Input · {Route6- 2000-null · {Route5- 2000-null · L4 · 100 · 200 · {Route1- 2030-null · L2 · {Route2- 2020-null · {Route7- 2000-null · 160 · L3 · 0 · 40 · 10 · 50 · 30 · 70 · 80 · 140 · 188 · 333.3 · 20 · {Route3- 2020-null · …]

![image3.png](../media/doc708_image3.png) ![image6.png](../media/doc708_image6.png)
