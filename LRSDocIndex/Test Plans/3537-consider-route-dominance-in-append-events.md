# Consider Route Dominance in Append Events Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 278 · Test Plan · Other |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#3537](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3537) |
| **Source** | [AppendEventsDominant_OtherMethods_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AppendEventsDominant_OtherMethods_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev — |
| **Edited** | 2024-11-25 21:38 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route dominance · append events · retire overlaps · retire by eventid · replace by eventid · concurrency · conflict prevention · spanning event · gapped route · looped route · branched route · alpha route |
| **Tools** | Append Events |

## Summary

Test plan for verifying the Append Events tool behavior with route dominance logic using Retire Overlaps, Retire by EventID, and Replace by EventID methods. Covers testing with various route types, concurrency scenarios, conflict prevention, and different data sources including RH and APR data in fgdb, sde, and feature services. Includes detailed test scenarios for point, line, spanning, gapped, looped, branched, and alpha routes with expected event appending and measure conversion outcomes.

## Related documents

<!-- related:begin -->
- [Consider Route Dominance in Append Events (add method) – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/1488-consider-route-dominance-in-append-events-add-method.md>) — similar text 0.54 · 5 title words · 4 filename words · same kind/folder <!-- rel:279 s=8.219 -->
- [Add Point Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3916-add-point-event-to-dominant-route-in-pro.md>) — similar text 0.24 · 1 title word · 2 filename words · same kind/folder <!-- rel:360 s=5.403 -->
- [Allow Append Events to Run When Locks Are Present - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/6640-allow-append-events-to-run-when-locks-are-present.md>) — similar text 0.24 · 2 title words · 3 filename words · same kind/pe/folder <!-- rel:156 s=5.306 -->
- [Add Line Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-to-dominant-route-in-pro.md>) — similar text 0.12 · 1 title word · 2 filename words · same kind/folder <!-- rel:358 s=4.185 -->
- [Add Point and non-Spanning Line Event to Dominant Route in Experience Builder – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24792-add-point-and-non-spanning-line-event-to-dominant-route.md>) — similar text 0.17 · 1 title word · 2 filename words · same kind/folder <!-- rel:169 s=4.159 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-retirement.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Consider Route Dominance in Append Events (Retire Overlaps, Retire by EventID, Replace by EventID methods) – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3537

PE: Lakshmi
Dev:

### Slide 2 <!-- slide 2 -->

Test Data

- Test with RH and APR data
- Test in fgdb, sde and FS
- Test with point, spanning and non-spanning line events
- Test simple routes, gapped routes, and routes with complex shapes
- Test with spatial and temporal concurrencies
- Test Retire overlaps , Retire by EventID and Replace by EventID Methods
- Test conflict prevention
- Test with input feature class and feature table
- Test in python and model builder
Verification

- Verify the tool identifies the correct dominant route and the result events are appended to the correct Route/Measure for each of the different methods of append chosen.
- Verify new messages related to dominant route appear in the text output.

Automation

- Add to Append Events APR Python automation
Documentation

- Update the documentation for the gp tool.  Add usage notes about what this parameter does and how it can result in splitting of source events.
- Add graphics and explanation to https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/create-and-modify-lrs-events.htm.

### Slide 3 <!-- slide 3 -->

Test Scenarios
If the option  is “Append events to the dominant route “enabled when the tool is run, all records being appended should be checked against the concurrency logic (spatial and temporal) to identify the dominant route. Verify for all methods except add.

- Default is unchecked. When checked –
  - If there is no concurrent section, append the event with input Route/Measure  as per the chosen method.
  - If an event record is completely on a concurrent section and the source Route/Measures are on the dominant route, append the event with input Route/Measure as per the chosen method
  - If an event record is completely on a concurrent section and the source Route/Measures are on the subordinate route, translate the route/measure to the dominant route and append it onto the dominant route as per the chosen method.
    - Provide info text output “The source event record with OID # was appended onto the dominant route (list of RouteID(s)).”
  - If the event record is on multiple or a mix of concurrent/non concurrent sections, determine which route to append as per the chosen method  for each section
    - Provide info text output “The source event record with OID # was split into # of sections appended onto the following dominant routes (list of RouteID(s)).”

## Test Cases

### TC-U01 — If the Event Is Added To the Dominant Route That Has Complex Shape and Self <!-- src: S1 · slide 4 · case 2 -->

- **Case:** If the event is added to the dominant route that has complex shape and self intersections

Test Scenarios cntd..

  - For any concurrent sections with Dominant route being not calibrated, append event onto the Route/Measure which ever is properly calibrated.
    - Provide info  in text output “The concurrent section couldn’t be calculated, so the event was placed on the input Route “RouteID”.”
    - f)   If both input and concurrent routes are not calibrated. Add the event to input route and after running Generate Events, show corresponding loc error

  - Point event – add to any measure at the self intersection
  - Line event – must preserve the shape as if it is drawn on input route, and then determine the measures on target route based on the shape
  - Make sure event always go with target route direction even it can be different from input route’s direction

### TC-U02 — A. With Conflict Prevention <!-- src: S1 · slide 5 · case 3 -->

- **Case:** a. With conflict prevention, lock all target routes that the event is eventually appended to. If the provided input route does not get any event, don’t lock it. (Locks are acquired only for the required routes)

Test Scenarios cntd..
      b.  When there’s existing lock: (test for all methods except add )

  - Input route is the target route, and it is locked – do not append anything, fail the tool and let users know target route is locked
  - Input route is not target route. Input route is locked, and target route is not locked – append successfully
  - Event is going to split to append on different routes, some or all the target routes are locked --- do not append anything and fail the tool. Let users know which target routes(dominant) are locked.
  - Dominant route is the target route and is locked by the same user in the same version – append the events and do not acquire any new lock.

### TC-U03 — Simple input route has no concurrency. Add the event on this route. (case 1b) <!-- src: S2 · slide 7 · case 1b -->

- **Case:** Simple input route has no concurrency. Add the event on this route. – Replace by EventID (Not required)

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 4 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | Signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

[figure: Input · Result · R1 · 0 · 10 · 4 · 1 · 5]

![Figure 2 — 1b : Simple input route has no concurrency. Add the event on this route. – Replace by EventID (Not required)](../media/3537-consider-route-dominance-in-append-events/fig-02-slide-07-1b-simple-input-route-has-no-concurrency.svg)

### TC-U04 — Simple input route has no concurrency. Add the event on this route. (case 1c) <!-- src: S2 · slide 8 · case 1c -->

- **Case:** Simple input route has no concurrency. Add the event on this route. – Retire overlaps 2 (Not required) 010 nu

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 2 | 8 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R1 | 2 | 5 | 1/1/2020 | null | Interstate |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

[figure: Input · Result · R1 · 0 · 10]

![Figure 3 — 1c : Simple input route has no concurrency. Add the event on this route. – Retire overlaps 2 (Not required) 010 nu](../media/3537-consider-route-dominance-in-append-events/fig-03-slide-08-1c-simple-input-route-has-no-concurrency.svg)

### TC-U05 — Simple input route is the dominant route over the only one time slice. Add (case 2b) <!-- src: S2 · slide 10 · case 2b -->

- **Case:** Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Replace by

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 4 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | Signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

[figure: Input · Result · R1 · 0 · 10 · 4 · 1 · 5 · R2]

![Figure 5 — 2b : Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Replace by](../media/3537-consider-route-dominance-in-append-events/fig-05-slide-10-2b-simple-input-route-is-the-dominant.svg)

### TC-U06 — Simple input route is the dominant route over the only one time slice. Add (case 2c) <!-- src: S2 · slide 11 · case 2c -->

- **Case:** Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Retire

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R1 | 2 | 8 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R1 | 2 | 5 | 1/1/2020 | null | Interstate |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

[figure: Input · Result · R1 · 0 · 10 · 5 · R2]

![Figure 6 — 2c : Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Retire](../media/3537-consider-route-dominance-in-append-events/fig-06-slide-11-2c-simple-input-route-is-the-dominant.svg)

### TC-U07 — Simple input route is neither the most dominant nor the most subordinate. Add (case 3a) <!-- src: S2 · slide 12 · case 3a -->

- **Case:** Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and

Route and events from LRS

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R2 | 4 |  | 1/1/2000 | null | Stop Sign |
| Point3 | R2 | 8 |  | 1/1/2000 | null | Stop sign |
| Line1 | R2 | 0 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 1 |  | 1/1/2010 | null | signal |
| Point2 | R2 | 5 |  | 1/1/2020 | null | signal |
| Point3 | R2 | 8 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| Point1 | R2 | 1 |  | 1/1/2010 | 1/1/2020 | signal |
| Point1 | R2 | 1 |  | 1/1/2020 | null | signal |
| Point2 | R2 | 4 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 23 |  | 1/1/2020 | null | signal |
| Point3 | R2 | 8 |  | 1/1/2000 | 1/1/2020 | Stop sign |
| Point3 | R1 | 29 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R2 | 0 | 5 | 1/1/2020 | null | Local |
| Line1 | R1 | 23 | 33 | 1/1/2020 | null | Local |

[figure: Input · Result · R2 · 0 · 10 · 4 · R3 · 30 · 32.5 · 8 · R4 · R1 · 40 · 42.5 · 23 · 33 · 1 · 29]

![Figure 7 — 3a : Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and](../media/3537-consider-route-dominance-in-append-events/fig-07-slide-12-3a-simple-input-route-is-neither.svg)

### TC-U08 — Simple input route is neither the most dominant nor the most subordinate. Add (case 3b) <!-- src: S2 · slide 13 · case 3b -->

- **Case:** Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and

Route and events from LRS

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R2 | 4 |  | 1/1/2000 | null | Stop Sign |
| Point3 | R2 | 8 |  | 1/1/2000 | null | Stop sign |
| Line1 | R2 | 0 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 1 |  | 1/1/2010 | null | signal |
| Point2 | R2 | 5 |  | 1/1/2020 | null | signal |
| Point3 | R2 | 8 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 1 |  | 1/1/2010 | null | signal |
| Point2 | R1 | 23 |  | 1/1/2020 | null | signal |
| Point3 | R1 | 29 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 5 | 1/1/2020 | null | Local |
| Line1 | R1 | 23 | 33 | 1/1/2020 | null | Local |

[figure: Input · Result · R2 · 0 · 10 · 4 · R3 · 30 · 32.5 · 8 · R4 · R1 · 40 · 42.5 · 23 · 33 · 1 · 29]

![Figure 8 — 3b : Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and](../media/3537-consider-route-dominance-in-append-events/fig-08-slide-13-3b-simple-input-route-is-neither.svg)

### TC-U09 — Simple input route is neither the most dominant nor the most subordinate. Add (case 3c) <!-- src: S2 · slide 14 · case 3c -->

- **Case:** Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and

Route and events from LRS

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 10 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R2 | 0 | 5 | 1/1/2020 | null | Local |
| Line1 | R1 | 23 | 33 | 1/1/2020 | null | Local |

[figure: Input · Result · R2 · 0 · 10 · R3 · 30 · 32.5 · R4 · R1 · 40 · 42.5 · 23 · 33]

![Figure 9 — 3c : Simple input route is neither the most dominant nor the most subordinate. Add the event on dominant routes and](../media/3537-consider-route-dominance-in-append-events/fig-09-slide-14-3c-simple-input-route-is-neither.svg)

### TC-U10 — Gapped Input Route Is the Subordinate Route Over All Time Slices. Add the Event (case 4a) <!-- src: S1 · slide 15 · case 4a -->

- **Case:** Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures Retire by EventID

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 2 |  | 1/1/2000 | null | Stop Sign |
| Point2 | R2 | 3 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R2 | 0 | 2 | 1/1/2000 | null | Interstate |
| Line1 | R2 | 3 | 6 | 1/1/2000 | null | Interstate |
| Line1 | R2 | 7 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 2 |  | 1/1/2005 | 1/1/2010 | signal |
| Point2 | R2 | 3 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 2 |  | 1/1/2000 | 1/1/2005 | Stop Sign |
| Point1 | R1 | 1 |  | 1/1/2005 | 1/1/2010 | signal |
| Point2 | R2 | 3 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R2 | 3 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R2 | 0 | 1 | 1/1/2020 | null | Local |
| Line1 | R2 | 3 | 4.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 10 | 11 | 1/1/2020 | null | Local |
| Line1 | R1 | 13.5 | 14.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 15 | 17 | 1/1/2020 | null | Local |

[figure: R1 [2000-2010] · R2 · Result · 0 · 1 · 3.5 · 7 · 2 · 10 · 6 · 3 · R1[2010-null] · 11 · 13.5 · 17 · Input]

![Figure 10 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-10-slide-15-route-and-events-from-lrs.svg)

### TC-U11 — Gapped Input Route Is the Subordinate Route Over All Time Slices. Add the Event (case 4b) <!-- src: S1 · slide 16 · case 4b -->

- **Case:** Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures Replace by EventID

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 2 |  | 1/1/2000 | null | Stop Sign |
| Point2 | R2 | 3 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R2 | 0 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R2 | 2 |  | 1/1/2005 | null | signal |
| Point2 | R2 | 3 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2005 | 1/1/2010 | signal |
| Point1 | R1 | 11 |  | 1/1/2010 | null | signal |
| Point2 | R2 | 3 |  | 1/1/2020 | null | signal |
| Line1 | R2 | 0 | 1 | 1/1/2020 | null | Local |
| Line1 | R2 | 3 | 4.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 10 | 11 | 1/1/2020 | null | Local |
| Line1 | R1 | 13.5 | 14.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 15 | 17 | 1/1/2020 | null | Local |

[figure: R1 [2000-2010] · R2 · Result · 0 · 1 · 3.5 · 7 · 2 · 10 · 6 · 3 · R1[2010-null] · 11 · 13.5 · 17 · Input]

![Figure 11 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-11-slide-16-route-and-events-from-lrs.svg)

### TC-U12 — Gapped Input Route Is the Subordinate Route Over All Time Slices. Add the Event (case 4c) <!-- src: S1 · slide 17 · case 4c -->

- **Case:** Gapped input route is the subordinate route over all time slices. Add the event on dominant route and convert measures - Retire overlaps

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 2 | 1/1/2000 | null | Interstate |
| Line1 | R2 | 3 | 6 | 1/1/2000 | null | Interstate |
| Line1 | R2 | 7 | 10 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 10 | 1/1/2020 | Null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Line1 | R2 | 0 | 2 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R2 | 3 | 6 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R2 | 0 | 1 | 1/1/2020 | null | Local |
| Line1 | R2 | 3 | 4.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 10 | 11 | 1/1/2020 | null | Local |
| Line1 | R1 | 13.5 | 14.5 | 1/1/2020 | null | Local |
| Line1 | R1 | 15 | 17 | 1/1/2020 | null | Local |

[figure: R1 [2000-2010] · R2 · Result · 0 · 1 · 3.5 · 7 · 2 · 10 · 6 · 3 · R1[2010-null] · 11 · 13.5 · 17 · Input]

![Figure 12 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-12-slide-17-route-and-events-from-lrs.svg)

### TC-U13 — Looped Input Route Has Different Concurrencies Over Time. Add the Event (case 5) <!-- src: S1 · slide 18 · case 5 -->

- **Case:** Looped input route has different concurrencies over time. Add the event to dominant route in each time slice and convert measures.

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| P2 | R3 | 8 |  | 1/1/2000 | null | Stop Sign |
| P3 | R3 | 2 |  | 1/1/2000 | null | Stop Sign |
| P4 | R3 | 6 |  | 1/1/2000 | null | Stop Sign |
| L1 | R3 | 0 | 8 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2010 | null | Signal |
| P2 | R3 | 8 |  | 1/1/2020 | null | Signal |
| P3 | R3 | 3 |  | 1/1/2020 | null | Signal |
| P4 | R3 | 6 |  | 1/1/2020 | null | Signal |
| L1 | R3 | 0 | 8 | 1/1/2000 | null | Local |

[figure: R3[2000-null] · R1[2010-null] · R2[2000-null] · Input · 0 · 8 · 2 · 6 · 4 · 1 · 3 · 5 · 10 · 12]

![Figure 13 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-13-slide-18-route-and-events-from-lrs.svg)

### TC-U14 — Retire by EventID (case 5a) <!-- src: S2 · slide 19 · case 5a -->

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| P1* | R1 | 0 |  | 1/1/2010 | 1/1/2020 | Signal |
| P1* | R1 | 0 |  | 1/1/2020 | null | Signal |
| P2 | R3 | 8 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| P2* | R1 | 12 |  | 1/1/2020 | null | Signal |
| P3 | R3 | 2 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| P3 | R1 | 7 |  | 1/1/2020 | null | Signal |
| P4 | R3 | 6 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| P4 | R1 | 10 |  | 1/1/2020 | null | Signal |
| L1 | R3 | 0 | 4 | 1/1/2000 | 1/1/2010 | Local |
| L1 | R3 | 6.5 | 8 | 1/1/2000 | 1/1/2010 | Local |
| L1 | R2 | 0 | 3 | 1/1/2000 | 1/1/2010 | Local |
| L1 | R1 | 4 | 12 | 1/1/2010 | null | Local |

- - measure can be anyone of the values (0,4,12)

[figure: Result · 0 · 8 · 2 · 4 · 6 · 1 · 3 · 5 · 10 · 12 · R3[2000-null] · R1[2010-null] · R2[2000-null] · 7]

![Figure 14 — 5a. Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-14-slide-19-5a-retire-by-eventid.svg)

### TC-U15 — Replace by EventID (case 5b) <!-- src: S2 · slide 20 · case 5b -->

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1* | R1 | 0 |  | 1/1/2010 | null | Signal |
| P2* | R1 | 12 |  | 1/1/2020 | null | Signal |
| P3 | R1 | 7 |  | 1/1/2020 | null | Signal |
| P4 | R1 | 10 |  | 1/1/2020 | null | Signal |
| L1 | R1 | 4 | 12 | 1/1/2010 | null | Local |
| L1 | R3 | 0 | 4 | 1/1/2000 | 1/1/2010 | Local |
| L1 | R3 | 6.5 | 8 | 1/1/2000 | 1/1/2010 | Local |
| L1 | R2 | 0 | 3 | 1/1/2000 | 1/1/2010 | Local |

- - measure can be anyone of the values (0,4,12)

[figure: Result · 0 · 8 · 2 · 4 · 6 · 1 · 3 · 5 · 10 · 12 · R3[2000-null] · R1[2010-null] · R2[2000-null] · 7]

![Figure 15 — 5b. Replace by EventID](../media/3537-consider-route-dominance-in-append-events/fig-15-slide-20-5b-replace-by-eventid.svg)

### TC-U16 — Looped Input Route Has Different Concurrencies Over Time. Add the Event (case 5c) <!-- src: S1 · slide 21 · case 5c -->

- **Case:** Looped input route has different concurrencies over time. Add the event to dominant route(orange color ) in each time slice and convert measures. – Retire overlaps

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 8 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 8 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 8 | 1/1/2000 | 1/1/2020 | Interstate |
| L1 | R1 | 4 | 12 | 1/1/2020 | null | Local |

- - measure can be anyone of the values (0,4,12)

[figure: R3[2000-null] · R1[2010-null] · R2[2000-null] · Input · 0 · 8 · 2 · 4 · 6 · 1 · 3 · 5 · 10 · 12]

![Figure 16 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-16-slide-21-route-and-events-from-lrs.svg)

### TC-U17 — Branched Input Route Has Different Concurrencies Over Time. The Target Dominant (case 6) <!-- src: S1 · slide 22 · case 6 -->

- **Case:** Branched input route has different concurrencies over time. The target dominant routes in opposite direction. Add the event to dominant route in each time slice and convert measures.

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2000 | null | Stop Sign |
| P2 | R3 | 2 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| P3 | R3 | 6 |  | 1/1/2000 | null | Stop Sign |
| L1 | R3 | 0 | 6 | 1/1/2000 | null | Interstate |
| L1 | R3 | 4 | 6 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2010 | null | Signal |
| P2 | R3 | 2 |  | 1/1/2010 | null | Signal |
| P3 | R3 | 6 |  | 1/1/2010 | null | Signal |
| L1 | R3 | 0 | 6 | 1/1/2010 | null | Local |
| L2 | R3 | 4 | 6 | 1/1/2010 | null | Local |

[figure: 2 · R3[2000-null] · R2[2000 -2020] · 0 · 100 · 6 · 10 · 4 · 20 · 14 · R1[2030-null] · 24 · 30 · 102 · 103 · Input]

![Figure 17 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-17-slide-22-route-and-events-from-lrs.svg)

### TC-U18 — Retire by EventID (case 6a) <!-- src: S2 · slide 23 · case 6a -->

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| P1 | R3 | 0 |  | 1/1/2010 | null | Signal |
| P2 | R3 | 2 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| P2 | R2 | 14 |  | 1/1/2010 | 1/1/2020 | Signal |
| P2 | R3 | 2 |  | 1/1/2020 | 1/1/2030 | Signal |
| P2 | R1 | 102 |  | 1/1/2030 | null | Signal |
| P3 | R3 | 6 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| P3* | R2 | 30 |  | 1/1/2010 | 1/1/2020 | Signal |
| P3 | R3 | 6 |  | 1/1/2020 | 1/1/2030 | Signal |
| P3 | R1 | 100 |  | 1/1/2030 | null | Signal |
| L1 | R3 | 0 | 6 | 1/1/2000 | 1/1/2010 | Interstate |
| L1 | R3 | 0 | 4 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R3 | 0 | 6 | 1/1/2020 | 1/1/2030 | Local |
| L1 | R3 | 0 | 1 | 1/1/2030 | null | Local |
| L1 | R3 | 2 | 4 | 1/1/2030 | null | Local |
| L1 | R2 | 10 | 14 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R1 | 100 | 103 | 1/1/2030 | null | Local |
| L2 | R1 | 4 | 6 | 1/1/2000 | 1/1/2010 | Interstate |
| L2 | R2 | 10 | 14 | 1/1/2010 | 1/1/2020 | Local |
| L2 | R3 | 4 | 6 | 1/1/2020 | 1/1/2030 | Local |
| L2 | R1 | 100 | 102 | 1/1/2030 | null | Local |

- - measure can be anyone of the values (10,30)

[figure: Result · 2 · R3[2000-null] · R2[2000 -2020] · 0 · 100 · 6 · 10 · 4 · 20 · 14 · R1[2030-null] · 24 · 30 · 102 · 103]

![Figure 18 — 6a. Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-18-slide-23-6a-retire-by-eventid.png)

![Figure 19 — 6a. Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-19-slide-23-6a-retire-by-eventid.svg)

### TC-U19 — Replace by EventID (case 6b) <!-- src: S2 · slide 24 · case 6b -->

- - measure can be anyone of the values (10,30)

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R3 | 0 |  | 1/1/2010 | null | Signal |
| P2 | R2 | 14 |  | 1/1/2010 | 1/1/2020 | Signal |
| P2 | R3 | 2 |  | 1/1/2020 | 1/1/2030 | Signal |
| P2 | R1 | 102 |  | 1/1/2030 | null | Signal |
| P3* | R2 | 30 |  | 1/1/2010 | 1/1/2020 | Signal |
| P3 | R3 | 6 |  | 1/1/2020 | 1/1/2030 | Signal |
| P3 | R1 | 100 |  | 1/1/2030 | null | Signal |
| L1 | R3 | 0 | 4 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R3 | 0 | 6 | 1/1/2020 | 1/1/2030 | Local |
| L1 | R3 | 0 | 1 | 1/1/2030 | null | Local |
| L1 | R3 | 2 | 4 | 1/1/2030 | null | Local |
| L1 | R2 | 10 | 14 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R1 | 100 | 103 | 1/1/2030 | null | Local |
| L2 | R2 | 10 | 14 | 1/1/2010 | 1/1/2020 | Local |
| L2 | R3 | 4 | 6 | 1/1/2020 | 1/1/2030 | Local |
| L2 | R1 | 100 | 102 | 1/1/2030 | null | Local |

[figure: Result · 2 · R3[2000-null] · R2[2000 -2020] · 0 · 100 · 6 · 10 · 4 · 20 · 14 · R1[2030-null] · 24 · 30 · 102 · 103]

![Figure 18 — 6a. Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-18-slide-23-6a-retire-by-eventid.png)

![Figure 20 — 6b. Replace by EventID](../media/3537-consider-route-dominance-in-append-events/fig-20-slide-24-6b-replace-by-eventid.svg)

### TC-U20 — Branched Input Route Has Different Concurrencies Over Time. The Target Dominant (case 6) <!-- src: S1 · slide 25 · case 6 -->

- **Case:** Branched input route has different concurrencies over time. The target dominant routes in opposite direction. Add the event to dominant route in each time slice and convert measures. – Retire Overlaps

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 6 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 6 | 1/1/2010 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | R3 | 0 | 6 | 1/1/2000 | 1/1/2010 | Interstate |
| L1 | R3 | 0 | 4 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R2 | 10 | 14 | 1/1/2010 | 1/1/2020 | Local |
| L1 | R3 | 0 | 6 | 1/1/2020 | 1/1/2030 | Local |
| L1 | R3 | 0 | 1 | 1/1/2030 | null | Local |
| L1 | R3 | 2 | 4 | 1/1/2030 | null | Local |
| L1 | R1 | 100 | 103 | 1/1/2030 | null | Local |

[figure: R3[2000-null] · R2[2000 -2020] · 0 · 2 · 100 · 6 · 10 · 4 · 20 · 14 · R1[2030-null] · 24 · 30 · 102 · 103 · Input · Result · L1[2020 -2030] & · L1[2010 -2020] · L1[2030 -null]]

![Figure 21 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-21-slide-25-route-and-events-from-lrs.svg)

### TC-U21 — Alpha Input Route Is the Subordinate Route Over the Only One Time Slice. Add (case 8a) <!-- src: S1 · slide 26 · case 8a -->

- **Case:** Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route. - Retire by EventID

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2000 | null | Stop Sign |
| L1 | R2 | 0 | 16 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 16 | 1/1/2010 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| P1 | R1 | 9 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 16 | 1/1/2000 | 1/1/2010 | Interstate |
| L1 | R2 | 0 | 2 | 1/1/2010 | null | Local |
| L1 | R2 | 14 | 16 | 1/1/2010 | null | Local |
| L1 | R1 | 3 | 15 | 1/1/2010 | null | Local |

[figure: 0 · 3 · 8 · R2 · R1 · 16 · 5 · 11 · 17 · 6 · 9 · 12 · 15 · 2 · 14 · Input · Result]

![Figure 22 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-22-slide-26-route-and-events-from-lrs.svg)

### TC-U22 — Alpha Input Route Is the Subordinate Route Over the Only One Time Slice. Add (case 8b) <!-- src: S1 · slide 27 · case 8b -->

- **Case:** Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route. - Replace by EventID

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2000 | null | Stop Sign |
| L1 | R2 | 0 | 16 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 16 | 1/1/2010 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R1 | 9 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 2 | 1/1/2010 | null | Local |
| L1 | R2 | 14 | 16 | 1/1/2010 | null | Local |
| L1 | R1 | 3 | 15 | 1/1/2010 | null | Local |

[figure: 0 · 3 · 8 · R2 · R1 · 16 · 5 · 11 · 17 · 6 · 9 · 12 · 15 · 2 · 14 · Input · Result]

![Figure 23 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-23-slide-27-route-and-events-from-lrs.svg)

### TC-U23 — Alpha Input Route Is the Subordinate Route Over the Only One Time Slice. Add (case 8c) <!-- src: S1 · slide 28 · case 8c -->

- **Case:** Alpha input route is the subordinate route over the only one time slice. Add the event on the dominant, 3D alpha route. – Retire Overlaps

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2000 | null | Stop Sign |
| L1 | R2 | 0 | 16 | 1/1/2000 | null | Interstate |

Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 16 | 1/1/2010 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | R2 | 8 |  | 1/1/2000 | null | Stop Sign |
| P1 | R1 | 9 |  | 1/1/2010 | null | Signal |
| L1 | R2 | 0 | 16 | 1/1/2000 | 1/1/2010 | Interstate |
| L1 | R2 | 2 | 14 | 1/1/2010 | null | Interstate |
| L1 | R2 | 0 | 2 | 1/1/2010 | null | Local |
| L1 | R2 | 14 | 16 | 1/1/2010 | null | Local |
| L1 | R1 | 3 | 15 | 1/1/2010 | null | Local |

[figure: 0 · 3 · 8 · R2 · R1 · 16 · 5 · 11 · 17 · 6 · 9 · 12 · 15 · 2 · 14 · Input · Result]

![Figure 24 — Route and events from LRS](../media/3537-consider-route-dominance-in-append-events/fig-24-slide-28-route-and-events-from-lrs.svg)

## Other content

### Slide 6 — 1a .: Simple input route has no concurrency. Add the event on this route. – Retire by EventID (Not required, verify <!-- slide 6 -->

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 4 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| Point1 | R1 | 1 |  | 1/1/2010 | 1/1/2020 | Signal |
| Point1 | R1 | 1 |  | 1/1/2020 | null | Signal |
| Point2 | R1 | 4 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 5 |  | 1/1/2020 | null | Signal |
| Line1 | R1 | 2 | 8 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

For the event point 1, the highlighted results both are correct. What ever is current Pro behavior follow that.

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |

[figure: Input · Result · R1 · 0 · 10 · 4 · 1 · 5]

![Figure 1 — 1a .: Simple input route has no concurrency. Add the event on this route. – Retire by EventID (Not required, verify](../media/3537-consider-route-dominance-in-append-events/fig-01-slide-06-1a-simple-input-route-has-no-concurrency.svg)

### Slide 9 — 2a .: Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Retire by <!-- slide 9 -->

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 4 |  | 1/1/2000 | null | Stop Sign |
| Line1 | R1 | 2 | 8 | 1/1/2000 | null | Interstate |

Route and events from LRS
Source event records to append

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |
| Point2 | R1 | 5 |  | 1/1/2020 | null | signal |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| Point1 | R1 | 1 |  | 1/1/2010 | 1/1/2020 | Signal |
| Point1 | R1 | 1 |  | 1/1/2020 | null | Signal |
| Point2 | R1 | 4 |  | 1/1/2000 | 1/1/2020 | Stop Sign |
| Point2 | R1 | 5 |  | 1/1/2020 | null | Signal |
| Line1 | R1 | 2 | 8 | 1/1/2000 | 1/1/2020 | Interstate |
| Line1 | R1 | 5 | 10 | 1/1/2020 | null | Local |

| EventID | RID | M | ToM | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| Point1 | R1 | 0 |  | 1/1/2000 | 1/1/2010 | Stop Sign |
| Point1 | R1 | 1 |  | 1/1/2010 | null | Signal |

For the event point 1, the highlighted results both are correct. What ever is current Pro behavior follow that.

[figure: Input · Result · R1 · 0 · 10 · 4 · 1 · 5 · R2]

![Figure 4 — 2a .: Simple input route is the dominant route over the only one time slice. Add the event on this route.. – Retire by](../media/3537-consider-route-dominance-in-append-events/fig-04-slide-09-2a-simple-input-route-is-the-dominant.svg)

### Slide 29 — For Spanning events only two methods Retire by EventID and Replace by Event ID is supported. <!-- slide 29 -->

![Figure 25 — For Spanning events only two methods Retire by EventID and Replace by Event ID is supported.](../media/3537-consider-route-dominance-in-append-events/fig-25-slide-29-for-spanning-events-only-two-methods.png)

### Slide 30 — Spanning Positive 1a : Simple input routes have no concurrency. Add the event on these routes. – Retire by EventID <!-- slide 30 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

[figure: Result · R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100]

![Figure 26 — Spanning Positive 1a : Simple input routes have no concurrency. Add the event on these routes. – Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-26-slide-30-spanning-positive-1a-simple-input-routes.svg)

### Slide 31 — Spanning Positive 1b : Simple input routes have no concurrency. Add the event on these routes. – Replace by EventID <!-- slide 31 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

[figure: R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100 · Result]

![Figure 27 — Spanning Positive 1b : Simple input routes have no concurrency. Add the event on these routes. – Replace by EventID](../media/3537-consider-route-dominance-in-append-events/fig-27-slide-31-spanning-positive-1b-simple-input-routes.svg)

### Slide 32 — Spanning Positive 2a : Simple input routes are the dominant route over the only one time slice. Add the event on these <!-- slide 32 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

[figure: Result · R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100 · A1 · 20 · 160 · A2 · L2 · 30 · A3 · 150]

![Figure 28 — Spanning Positive 2a : Simple input routes are the dominant route over the only one time slice. Add the event on these](../media/3537-consider-route-dominance-in-append-events/fig-28-slide-32-spanning-positive-2a-simple-input-routes.svg)

### Slide 33 — Spanning Positive 2b : Simple input routes are the dominant route over the only one time slice. Add the event on these <!-- slide 33 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

[figure: R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100 · Result · 20 · 160 · A2 · L2 · 30 · A3 · 150]

![Figure 29 — Spanning Positive 2b : Simple input routes are the dominant route over the only one time slice. Add the event on these](../media/3537-consider-route-dominance-in-append-events/fig-29-slide-33-spanning-positive-2b-simple-input-routes.svg)

### Slide 34 — Spanning Positive 3a : Simple input routes are the subordinate route over all time slices. Add the event on dominant <!-- slide 34 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE1 | R1 | 0 | R1 | 5 | 1/1/2010 | null | Class3 |
| LE1 | R3 | 105 | R3 | 110 | 1/1/2010 | null | Class3 |
| LE1 | B2 | 0 | B2 | 5 | 1/1/2010 | null | Class3 |
| LE1 | B3 | 10 | B3 | 20 | 1/1/2010 | null | Class3 |

[figure: Result · R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100 · A1 · 20 · 160 · A2 · L2 · 30 · A3 · 150 · B2 · L3 · B3 · 5]

![Figure 30 — Spanning Positive 3a : Simple input routes are the subordinate route over all time slices. Add the event on dominant](../media/3537-consider-route-dominance-in-append-events/fig-30-slide-34-spanning-positive-3a-simple-input-routes.svg)

### Slide 35 — Spanning Positive 3b : Simple input routes are the subordinate route over all time slices. Add the event on dominant <!-- slide 35 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R1 | 5 | 1/1/2010 | null | Class3 |
| LE1 | R3 | 105 | R3 | 110 | 1/1/2010 | null | Class3 |
| LE1 | B2 | 0 | B2 | 5 | 1/1/2010 | null | Class3 |
| LE1 | B3 | 10 | B3 | 20 | 1/1/2010 | null | Class3 |

[figure: Result · R1 · 0 · 110 · R2 · L1 · 10 · 50 · Input · R3 · 60 · 100 · A1 · 20 · 160 · A2 · L2 · 30 · A3 · 150 · B2 · L3 · B3 · 5]

![Figure 31 — Spanning Positive 3b : Simple input routes are the subordinate route over all time slices. Add the event on dominant](../media/3537-consider-route-dominance-in-append-events/fig-31-slide-35-spanning-positive-3b-simple-input-routes.svg)

### Slide 36 — Spanning Positive 4a : Simple input routes are the subordinate route over all time slices. Add the event on dominant <!-- slide 36 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE1 | R1 | 0 | R1 | 5 | 1/1/2010 | null | Class 3 |
| LE1 | A1 | 25 | A1 | 30 | 1/1/2010 | 1/1/2020 | Class3 |
| LE1 | A2 | 100 | A2 | 150 | 1/1/2010 | 1/1/2020 | Class3 |
| LE1 | A2 | 140 | A2 | 150 | 1/1/2020 | null | Class3 |
| LE1 | B2 | 0 | B2 | 5 | 1/1/2020 | null | Class 3 |
| LE1 | B3 | 10 | B3 | 20 | 1/1/2020 | null | Class 3 |

[figure: R1[2000 – null] · 0 · 110 · R2[2000 – null] · L1 · 10 · 50 · Input · 60 · 100 · A1[2010 – null] · 25 · A2[2010 – null] · L2 · 30 · 150 · 20 · B2[2020 – null] · L3 · 5 · R3[2000 – null] · B3[2020 – null] · Result]

![Figure 32 — Spanning Positive 4a : Simple input routes are the subordinate route over all time slices. Add the event on dominant](../media/3537-consider-route-dominance-in-append-events/fig-32-slide-36-spanning-positive-4a-simple-input-routes.svg)

### Slide 37 — Spanning Positive 4b : Simple input routes are the subordinate route over all time slices. Add the event on dominant <!-- slide 37 -->

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2000 | null | Class 2 |

Route and events from LRS
Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R3 | 110 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | R1 | 0 | R1 | 5 | 1/1/2010 | null | Class 3 |
| LE1 | A1 | 25 | A1 | 30 | 1/1/2010 | 1/1/2020 | Class3 |
| LE1 | A2 | 100 | A2 | 150 | 1/1/2010 | 1/1/2020 | Class3 |
| LE1 | A2 | 140 | A2 | 150 | 1/1/2020 | null | Class3 |
| LE1 | B2 | 0 | B2 | 5 | 1/1/2020 | null | Class 3 |
| LE1 | B3 | 10 | B3 | 20 | 1/1/2020 | null | Class 3 |

[figure: R1[2000 – null] · 0 · 110 · R2[2000 – null] · L1 · 10 · 50 · Input · 60 · 100 · A1[2010 – null] · 25 · A2[2010 – null] · L2 · 30 · 150 · 20 · B2[2020 – null] · L3 · 5 · R3[2000 – null] · B3[2020 – null] · Result]

![Figure 33 — Spanning Positive 4b : Simple input routes are the subordinate route over all time slices. Add the event on dominant](../media/3537-consider-route-dominance-in-append-events/fig-33-slide-37-spanning-positive-4b-simple-input-routes.svg)

### Slide 38 — Spanning Positive 5a : Lines have many routes, some in opposite direction.- – Retire by EventID <!-- slide 38 -->

Route and events from LRS

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L1R1 | 100 | L1R6 | 100 | 1/1/2000 | null | Class 2 |
| LE2 | L2R4 | 30 | L2R3 | 150 | 1/1/2000 | null | Class 2 |

Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L1R1 | 100 | L1R6 | 100 | 1/1/2010 | null | Class 3 |
| LE2 | L2R4 | 30 | L2R3 | 150 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L1R1 | 100 | L1R6 | 100 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE2 | L2R4 | 30 | L2R3 | 150 | 1/1/2000 | 1/1/2010 | Class 2 |
| LE1 | L3R1 | 100 | L3R1 | 160 | 1/1/2010 | null | Class 3 |
| LE1 | L3R2 | 100 | L3R2 | 150 | 1/1/2010 | null | Class 3 |
| LE1 | L3R3 | 0 | L3R3 | 50 | 1/1/2010 | null | Class 3 |
| LE1 | L3R4 | 0 | L3R4 | 60 | 1/1/2010 | null | Class 3 |
| LE2 | L3R1 | 100 | L3R1 | 160 | 1/1/2010 | null | Class 3 |
| LE2 | L3R2 | 125 | L3R2 | 150 | 1/1/2010 | null | Class 3 |

[figure: 38 · Input · R1 · 100 · L2 · 200 · 50 · L1 · 60 · L3 · 160 · 0 · 40 · 80 · 150 · 30 · R6 · R4 · R2 · R3 · R5 · 130 · Result]

![Figure 34 — Spanning Positive 5a : Lines have many routes, some in opposite direction.- – Retire by EventID](../media/3537-consider-route-dominance-in-append-events/fig-34-slide-38-spanning-positive-5a-lines-have-many.svg)

### Slide 39 — Spanning Positive 5b : Lines have many routes, some in opposite direction.- – Replace by EventID <!-- slide 39 -->

Route and events from LRS

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L1R1 | 100 | L1R6 | 100 | 1/1/2000 | null | Class 2 |
| LE2 | L2R4 | 30 | L2R3 | 150 | 1/1/2000 | null | Class 2 |

Source event records to append

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L1R1 | 100 | L1R6 | 100 | 1/1/2010 | null | Class 3 |
| LE2 | L2R4 | 30 | L2R3 | 150 | 1/1/2010 | null | Class 3 |

| EventID | From RID | From M | To RID | To M | FromDate | ToDate | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE1 | L3R1 | 100 | L3R1 | 160 | 1/1/2010 | null | Class 3 |
| LE1 | L3R2 | 100 | L3R2 | 150 | 1/1/2010 | null | Class 3 |
| LE1 | L3R3 | 0 | L3R3 | 50 | 1/1/2010 | null | Class 3 |
| LE1 | L3R4 | 0 | L3R4 | 60 | 1/1/2010 | null | Class 3 |
| LE2 | L3R1 | 100 | L3R1 | 160 | 1/1/2010 | null | Class 3 |
| LE2 | L3R2 | 125 | L3R2 | 150 | 1/1/2010 | null | Class 3 |

[figure: 39 · Input · R1 · 100 · L2 · 200 · 50 · L1 · 60 · L3 · 160 · 0 · 40 · 80 · 150 · 30 · R6 · R4 · R2 · R3 · R5 · 130 · Result]

![Figure 35 — Spanning Positive 5b : Lines have many routes, some in opposite direction.- – Replace by EventID](../media/3537-consider-route-dominance-in-append-events/fig-35-slide-39-spanning-positive-5b-lines-have-many.svg)
