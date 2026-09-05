# Add Point Event to Dominant Route in ArcGIS Pro – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 360 · Test Plan · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#3916](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3916) |
| **Source** | [AddPointDominantRt_testplan2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddPointDominantRt_testplan2.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Eric |
| **Edited** | 2024-06-20 21:51 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dominant route · point event · concurrency · route dominancy · temporal concurrency · spatial concurrency · conflict prevention |
| **Tools** | Add Point Event · Add Multiple Point Event |

## Summary

Test plan for enhancing the Add Point and Multiple Point Event tools in ArcGIS Pro to support adding events on the dominant route using concurrency logic. It includes verification of UI elements, concurrency pane behavior, conflict prevention, and testing across various route shapes and concurrency scenarios including spatial and temporal slices. Positive test cases cover multiple route types and concurrency conditions.

## Related documents

<!-- related:begin -->
- [Add Line Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-to-dominant-route-in-pro.md>) — similar text 0.28 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:358 s=7.252 -->
- [Add Point and non-Spanning Line Event to Dominant Route in Experience Builder – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24792-add-point-and-non-spanning-line-event-to-dominant-route.md>) — similar text 0.35 · 5 title words · 3 filename words · same kind/folder <!-- rel:169 s=6.894 -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3537-consider-route-dominance-in-append-events.md>) — similar text 0.24 · 1 title word · 2 filename words · same kind/folder <!-- rel:278 s=5.403 -->
- [Consider Route Dominance in Append Events (add method) – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/1488-consider-route-dominance-in-append-events-add-method.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:279 s=5.249 -->
- [Add Line Event to Dominant Route in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-to-dominant-route-in-pro.md>) — similar text 0.34 · 5 title words · 2 filename words · same surface <!-- rel:370 s=5.054 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Multiple Point Event](https://www.google.com/search?q=%22Add%20Multiple%20Point%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Add Point Event to Dominant Route in ArcGIS Pro – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3916

PE: Claire Wang
Dev: Eric

### Slide 2 <!-- slide 2 -->

These columns are removed so the other 2 columns should be wider to take up the space

![Figure 1 — 2](../media/3916-add-point-event-to-dominant-route-in-pro/fig-01-slide-02-2.png)

### Slide 3 <!-- slide 3 -->

Test

- Enhance Add Point and Multiple Point Event tools to be able to add events on dominant route
- Add a checkbox “Add event(s) to dominant route” Add Point Event(s) UI
  - Default is unchecked
  - When checked, use the concurrency logic (spatial and temporal) to identify the dominant route at the event location
    - If there is no concurrency, tool continues to the attribute pane
    - If there is concurrency, show the new pane
    - Perform any validations like we do today
- Test with RH (multifield RID), APRGCS, and a few cases in Address Data
- Test in FS
- Test normal and complex shapes
  - Test with self-intersections where multiple measures exist
- Test with spatial (routes fully/partially/not overlap) and temporal (time slices) concurrencies
  - Sanity test a few where there is no concurrency
  - Test scenarios where there are concurrencies across multiple time slices and the primary/dominant route changes over time
- Test conflict prevention
  - For Add Point, acquire the locks when next is clicked on this pane
  - For Add Multiple Points, continue to acquire on the attributes pane
- Test dark mode especially for the colors in the new pane

### Slide 4 — Test – Don’t allow override of event placement on dominant routes <!-- slide 4 -->

- By default, “Don’t allow override of event placement on dominant routes” box is unchecked
- If “Don’t allow override of event placement on dominant routes” is checked, and “Add event to dominant route” box is also checked, the concurrency pane does not show – we automatically add events on dominant route
- If “Don’t allow override of event placement on dominant routes” is checked but “Add event to dominant route” box is unchecked, do what it does today (add events onto selected route)
- If “Don’t allow override of event placement on dominant routes” is unchecked – do whatever “Add event to dominant route” box says (show concurrency pane when it’s checked; add events onto selected route when it’s unchecked)

![Figure 2 — Test – Don’t allow override of event placement on dominant routes](../media/3916-add-point-event-to-dominant-route-in-pro/fig-02-slide-04-test-dont-allow-override-of-event.png)

### Slide 5 — Grey as only 1 time slice exists <!-- slide 5 -->

New pane requires

- A paragraph about what this pane does shows up under tool title
- Then, a time dropdown for the temporal concurrencies
  - By default, show the earliest time slice
  - If there is only 1 temporal concurrency, disable (grey) the dropdown
  - If there is no concurrency in one of the time slices, we still show the time slice but only a non-editable black label for selected Route
- A Reset button to the right of time dropdown to reset the options in the drop downs to what was returned by the concurrency logic
- Under time dropdown, the route ID/Name label from the first pane
- A grid of spatial concurrencies
  - 2 columns: Measure and Route selection
  - Measure is the measure on the route in the first pane for the chosen time slice. It does not change.
  - Route selection has 2 elements: RouteID/Name and Measure
    - Show the RouteID/Name with a drop down. The default should be the dominant/primary route.
    - The primary/dominant route is in blue. The non primary/dominant route is in black.
    - The measure goes with the selected Route. It is always in black
- A label of unit of measure under the grid. This unit comes from the second pane.
- When the user clicks next, transition to the 4th pane with the attributes

| Measure | Selected Route |  |
| --- | --- | --- |
| 2 | RouteID | {Route1-… |
|  | Measure | 2 |

Grey as only 1 route exists

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {Route1-… |
|  | Measure | 4 |

Black as multiple routes exists
Black as multiple time slices exists

[figure: 1/1/2010 - null · RouteID : {Route1-… · 1/1/2000 - null]

![Figure 3 — Grey as only 1 time slice exists](../media/3916-add-point-event-to-dominant-route-in-pro/fig-03-slide-05-grey-as-only-1-time-slice-exists.svg)

### Slide 6 <!-- slide 6 -->

Verification

- Verify the checkbox is added to Add Point Events tool
- Verify the checkbox is unchecked by default
- Verify the existing functionalities do not change in the first, second, and the attribute pane
- Verify the tool does not show a concurrency pane when the checkbox is unchecked or no concurrency exists
- Verify the tool shows the new concurrency pane with all elements in page 3 when spatial and/or temporal concurrencies exist
- Verify the tool identifies the correct concurrent route
- Verify the tool shows the correct measure for the route from the first pane as well as the selected route in the grid
- Verify the Back/Next buttons do what they do today
  - If values have not changed in pane switching, keep values intact
  - If values have changed (e.g. a different route/measure selected in the second pane), change associated panes accordingly
- Verify events are added correctly at selected routes’ measures
- Verify tool looks fine in light and dark mode
- i18n and 508 testing
  - Verify the date functionality works as expected in Arabic

## Test Cases

### TC-P01 — Single point <!-- src: S4 · slide 7 · Positive cases · 1 -->

- Simple route in the second pane has no concurrency
- Simple route in the second pane is the dominant route over the only one time slice. Add the point event on this route
- Simple route in the second pane is the dominant route over the only one time slice. Add the point event on the subordinate route
- Simple route in the second pane is the subordinate route over the only one time slice. Add the point event on the dominant route
- Gapped route in the second pane is the dominant route over all time slices. Add the point event on this route
- Gapped route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice
- Looped in the second pane has its dominancy changed over different time slices. Add the point event to this route in each time slice
- Lollipop route in the second pane has its dominancy changed over different time slices. Add the point event to the subordinate route in each time slice
- Alpha route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice
- Branched route in the second pane is always the subordinate route over different time slices. Add the point event on a mix of dominant/subordinate route in different time slices
- 3D route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice

### TC-P02 — Multiple points <!-- src: S4 · slide 8 · Positive cases · 1 -->

- Simple route in the second pane has no concurrency
- Simple route in the second pane is the dominant route over the only one time slice. Add the point event on the subordinate route
- Simple route in the second pane is the subordinate route over the only one time slice. Add the point event on the dominant route
- Gapped route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice
- Looped in the second pane has its dominancy changed over different time slices. Add the point event to this route in each time slice
- Branched route in the second pane is always the subordinate route over different time slices. Add the point event on a mix of dominant/subordinate route in different time slices
- 3D route in the second pane has its dominancy changed over different time slices. Add the point event to the subordinate route in each time slice

## Other content

### Slide 7 — Positive cases <!-- slide 7 -->

MultiField:
1 2 3 5 7 9 10
SingleField:
1 2 4 6 8 11
Line:
1 2 4 6 11

### Slide 8 — Positive cases <!-- slide 8 -->

Any negative case?
MultiField:
1 2 4 5
SingleField:
1 3 6 7
Line:
1 3 4 7

### Slide 9 — Positive 1: Simple route in the second pane has no concurrency <!-- slide 9 -->

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {Route1-… |
|  | Measure | 4 |

Concurrency pane does not show. Event is added on Route1 (4)
Positive 2: Simple route in the second pane is the dominant route over the only one time slice. Add the point event on this route

Grey as only 1 time slice exists

[figure: {Route1- · 4 · 1/1/2000 - null · RouteID : {Route1-… · {Route2-]

![Figure 4 — Positive 1: Simple route in the second pane has no concurrency](../media/3916-add-point-event-to-dominant-route-in-pro/fig-04-slide-09-positive-1-simple-route-in-the-second.svg)

### Slide 10 <!-- slide 10 -->

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {Route2-… |
|  | Measure | 10 |

Positive 3: Simple route in the second pane is the dominant route over the only one time slice. Add the point event on the subordinate route

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {RA001-… |
|  | Measure | 10 |

Positive 4: Simple route in the second pane is the subordinate route over the only one time slice. Add the point event on the dominant route

Grey as only 1 time slice exists
Grey as only 1 time slice exists

[figure: {Route1- · 1/1/2000 - null · RouteID : {Route1-… · {Route2- · 10 · 4 · {RA001-]

![Figure 5 — 10](../media/3916-add-point-event-to-dominant-route-in-pro/fig-05-slide-10-10.svg)

### Slide 11 — 2010-null (recalibrated to 2-10) <!-- slide 11 -->

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route1-… |
|  | Measure | 8 |

Positive 5: Gapped route in the second pane is the dominant route over all time slices. Add the point event on this route

| Measure | Selected Route |  |
| --- | --- | --- |
| 10 | RouteID | {Route1-… |
|  | Measure | 10 |

[figure: {Route1- · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · {Route2- · 8 · 1/1/2010 - null · 2000-2010 (0-8) · 10]

![Figure 6 — 2010-null (recalibrated to 2-10)](../media/3916-add-point-event-to-dominant-route-in-pro/fig-06-slide-11-2010-null-recalibrated-to-2-10.svg)

### Slide 12 — 2010-2020 (recalibrated to 2-10) <!-- slide 12 -->

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route1-… |
|  | Measure | 8 |

Positive 6: Gapped route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 10 | RouteID | {RA000-… |
|  | Measure | 18 |

2020-null (recalibrated to 2-10)
2020-null (Reassign – form a new route ID 0-20)

| Measure | Selected Route |  |
| --- | --- | --- |
| 10 | RouteID | {Route1-… |
|  | Measure | 10 |

Grey as only 1 route exists

[figure: {Route1- · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · {RA001- · 8 · 1/1/2010 – 1/1/2020 · 2000-2010 (0-8) · 2010-2020 (0-20) · {Route2- · 10 · 18 · 1/1/2020 - null]

![Figure 7 — 2010-2020 (recalibrated to 2-10)](../media/3916-add-point-event-to-dominant-route-in-pro/fig-07-slide-12-2010-2020-recalibrated-to-2-10.svg)

### Slide 13 <!-- slide 13 -->

Positive 7: Looped in the second pane has its dominancy changed over different time slices. Add the point event to this route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

Verify the event only has 1 time slice, not 3

[figure: {Route1- · 2000-2010 · {Route2- · 2010-2020 · {RA000- · 2020-null · {Route2- has retired · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 – 1/1/2020 · 1/1/2020 - null · 0 · 0-8 · 5-20]

![Figure 8 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-08-slide-13-13.png)
![Figure 9 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-09-slide-13-13.png)

![Figure 10 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-10-slide-13-13.svg)

### Slide 14 <!-- slide 14 -->

Positive 8: Lollipop route in the second pane has its dominancy changed over different time slices. Add the point event to the subordinate route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route2-… |
|  | Measure | 6 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route2-… |
|  | Measure | 6 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route1-… |
|  | Measure | 8 |

[figure: {Route1- · 2000-2010 · {Route2- · 2010-2020 · {RA000- · 2020-null · {Route2- has retired · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 – 1/1/2020 · 1/1/2020 - null · 0-8 · 5-20 · 6 · 8 · 20 · 2-6]

![Figure 8 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-08-slide-13-13.png)
![Figure 9 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-09-slide-13-13.png)

![Figure 11 — 14](../media/3916-add-point-event-to-dominant-route-in-pro/fig-11-slide-14-14.svg)

### Slide 15 <!-- slide 15 -->

Positive 9: Alpha route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {RA000- |
|  | Measure | 13 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {Route1-… |
|  | Measure | 9 |

Reassign – form a new route

[figure: {Route1- · 2000-2010 · 2010-null · {RA001- · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 - null · 0-10 · 10-20 · 9 · 13 · {Route2-]

![Figure 9 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-09-slide-13-13.png)
![Figure 8 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-08-slide-13-13.png)
![Figure 12 — 15](../media/3916-add-point-event-to-dominant-route-in-pro/fig-12-slide-15-15.png)

![Figure 13 — 15](../media/3916-add-point-event-to-dominant-route-in-pro/fig-13-slide-15-15.svg)

### Slide 16 <!-- slide 16 -->

Positive 10: Branched route in the second pane is always the subordinate route over different time slices. Add the point event on a mix of dominant/subordinate route in different time slices

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {RB000- |
|  | Measure | 18 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {RA000- |
|  | Measure | 7 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {Route1-… |
|  | Measure | 9 |

[figure: {RB000- · {Route1- · 0-10 · 10-20 · 2000-2010 · 2010-2020 · {RA000- · 0-8 · 2020-null · 9 · 18 · 7 · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 – 1/1/2020 · 1/1/2020 - null]

![Figure 14 — 16](../media/3916-add-point-event-to-dominant-route-in-pro/fig-14-slide-16-16.svg)

### Slide 17 <!-- slide 17 -->

Positive 11: 3D route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 2 | RouteID | {RA000- |
|  | Measure | 12 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 2 | RouteID | {Route1-… |
|  | Measure | 2 |

[figure: {Route1- · 2000-2010 · {RA000- · 0-10 · 10-20 · 2010-null · 13-20 · Partially retired · 12 · 2 · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 - null]

![Figure 15 — 17](../media/3916-add-point-event-to-dominant-route-in-pro/fig-15-slide-17-17.svg)

### Slide 18 — Positive 12: Simple route in the second pane has no concurrency <!-- slide 18 -->

Concurrency pane does not show. Event is added on Route1 (4)
Positive 13: Simple route in the second pane is the dominant route over the only one time slice. Add the point events on the subordinate route

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {Route2-… |
|  | Measure | 10 |

Grey as only 1 time slice exists

[figure: {Route1- · 4 · 1/1/2000 - null · RouteID : {Route1-… · {Route2- · 10]

![Figure 16 — Positive 12: Simple route in the second pane has no concurrency](../media/3916-add-point-event-to-dominant-route-in-pro/fig-16-slide-18-positive-12-simple-route-in-the-second.svg)

### Slide 19 <!-- slide 19 -->

| Measure | Selected Route |  |
| --- | --- | --- |
| 4 | RouteID | {RA001-… |
|  | Measure | 10 |

Positive 14: Simple route in the second pane is the subordinate route over the only one time slice. Add the point events on the dominant route

Positive 15: Gapped route in the second pane has its dominancy changed over different time slices. Add the point event to the dominant route in each time slice
2020-null (extended to 0-10)
2020-null (Reassign – form a new route ID 0-20)

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route1-… |
|  | Measure | 8 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {RA000-… |
|  | Measure | 18 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 8 | RouteID | {Route1-… |
|  | Measure | 10 |

Grey as only 1 route exists
Grey as only 1 time slice exists

[figure: {Route1- · 1/1/2000 - null · RouteID : {Route1-… · {RA001- · 4 · 10 · 2000-2010 (0-8) · 2010-2010 · 2010-2020 (0-20) · {Route2- · 8 · 18 · 1/1/2000 – 1/1/2010 · 1/1/2010 – 1/1/2020 · 1/1/2020 - null]

![Figure 17 — 19](../media/3916-add-point-event-to-dominant-route-in-pro/fig-17-slide-19-19.svg)

### Slide 20 <!-- slide 20 -->

Positive 16: Looped in the second pane has its dominancy changed over different time slices. Add the point events to this route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 0 | RouteID | {Route1-… |
|  | Measure | 0 |

[figure: {Route1- · 2000-2010 · {Route2- · 2010-2020 · {RA000- · 2020-null · {Route2- has retired · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 – 1/1/2020 · 1/1/2020 - null · 5 · 0-8 · 5-20 · 0]

![Figure 8 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-08-slide-13-13.png)
![Figure 9 — 13](../media/3916-add-point-event-to-dominant-route-in-pro/fig-09-slide-13-13.png)

![Figure 18 — 20](../media/3916-add-point-event-to-dominant-route-in-pro/fig-18-slide-20-20.svg)

### Slide 21 <!-- slide 21 -->

Positive 16: Branched route in the second pane is always the subordinate route over different time slices. Add the point events on a mix of dominant/subordinate route in different time slices

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {RB000- |
|  | Measure | 18 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {RA000- |
|  | Measure | 1 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 9 | RouteID | {Route1-… |
|  | Measure | 9 |

[figure: {RB000- · {Route1- · 0-10 · 10-20 · 2000-2010 · 2010-2020 · {RA000- · 0-8 · 2020-null · 9 · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 – 1/1/2020 · 1/1/2020 - null · 18 · 1]

![Figure 19 — 21](../media/3916-add-point-event-to-dominant-route-in-pro/fig-19-slide-21-21.svg)

### Slide 22 <!-- slide 22 -->

Positive 17: 3D route in the second pane has its dominancy changed over different time slices. Add the point events to the subordinate route in each time slice

| Measure | Selected Route |  |
| --- | --- | --- |
| 2 | RouteID | {Route1-… |
|  | Measure | 2 |

| Measure | Selected Route |  |
| --- | --- | --- |
| 2 | RouteID | {Route1-… |
|  | Measure | 2 |

[figure: {Route1- · 2000-2010 · {RA000- · 0-10 · 10-20 · 2010-null · 13-20 · Partially retired · 1/1/2000 – 1/1/2010 · RouteID : {Route1-… · 1/1/2010 - null · 2]

![Figure 20 — 22](../media/3916-add-point-event-to-dominant-route-in-pro/fig-20-slide-22-22.svg)
