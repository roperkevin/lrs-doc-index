# Support Search Tolerance Parameter in Update Measures from LRS Tool – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 229 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4100](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4100) |
| **Source** | [UpdateMeasuresfromLRS_SearchToleranceTestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/UpdateMeasuresfromLRS_SearchToleranceTestPlan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Lakshmi · dev Eric |
| **Edited** | 2025-02-19 19:43 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | search tolerance · update measures · route · measure · point event · line event · calibration · network · rest |
| **Tools** | Update Measures from LRS |

## Summary

Test plan for the Update Measures from LRS tool focusing on the support and verification of the search tolerance parameter. Includes testing across various networks, feature types, and environments such as ArcGIS Pro, Python, Model Builder, and REST. Covers positive, negative, and edge cases to ensure correct behavior of the search tolerance parameter in measure updates.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.25 · 6 title words · 2 filename words · same surface <!-- rel:273 s=5.516 -->
- [Update Measures From LRS: Support Events and Intersections](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3882-update-measures-from-lrs-support-events-and-intersections.md>) — similar text 0.10 · 2 title words · same kind/surface/folder <!-- rel:277 s=3.833 -->
- [Generate LR Data Product: Support summary and length fields from the template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5769-generate-lr-data-product-support-summary-and-length-fields.md>) — similar text 0.09 · 1 title word · same kind/surface/pe/folder <!-- rel:339 s=3.801 -->
- [Update Measures From LRS: Support Spanning Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/3881-update-measures-from-lrs-support-spanning-events.md>) — similar text 0.09 · 2 title words · same kind/surface/folder <!-- rel:230 s=3.527 -->
- [Overlay Events and queryAttributeSet Point Event Support Test Cases](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5301-overlay-events-and-queryattributeset-point-event-support.md>) — similar text 0.10 · 1 title word · same kind/surface/folder <!-- rel:364 s=3.042 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Support search tolerance parameter in Update Measures from LRS tool – Test Plan <!-- slide 1 -->

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4100

PE: Lakshmi
Dev: Eric

### Slide 2 <!-- slide 2 -->

 Test Data

- Test with RH and APR(GCS) , APRUNdata.
- Test in Pro, Python inline, Python Standalone and Model builder
- Test in REST ( one case for sanity)
- Test for all networks (line, nonline and postmile)
- Test for point and line features. Test with point events , Line events , intersection points ,Centerline , nonLRS point features, nonLRS line features
- Add test cases which are close to tolerance, exactly on tolerance and slightly outside the tolerance value.

Verification

- Verify an optional parameter Search Tolerance is added to the tool
- Verify this parameter is available on the REST version of the tool
- Verify this parameter is available for all the networks
- Verify the unit of tolerance is same as the  xy units of the network
- Verify if more than one route/measure location falls within the search radius populate with the closest value. If two measure location/route are at equidistant choose anyone.
- Verify for the line features both from and to measure are populated from the same route and they should be within the search radius of the same route

Automation
	Update the existing python automation for the new parameter. Fix if any test cases break and add new test cases.
 Documentation
	Update the documentation for the gp tool for the new parameter.( update that feature can be within search tolerance , not necessarily exactly coincident on route)
	Update the REST topic
Negative Test case
	Test a case with uncalibrated route , negative value as a search tolerance and non numeric  value as a search tolerance.

## Test Cases

### TC-U01 — Nearest one route and one measure – Normal Route <!-- src: S2 · slide 3 · case 1 -->

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0 |
| P2 | R1 | 5 |
| P3 | Null | Null |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | Null | Null | Null |
| L2 | R1 | 6 | 8 |
| L3 | Null | Null | Null |
| L4 | Null | Null | Null |
| L5 | Null | Null | Null |
| L6 | Null | Null | Null |
| L7 | R1 | 1 | 7 |

[figure: 1 · 2 · R1 · 0 · 10 · L1 · L2 · L3 · L4 · L5 · 3 · L6 · L7]

![Figure 1 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-01-slide-03-1-nearest-one-route-and-one-measure.png)
![Figure 2 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-02-slide-03-1-nearest-one-route-and-one-measure.png)

![Figure 3 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-03-slide-03-1-nearest-one-route-and-one-measure.svg)

### TC-U02 — Nearest one route and one measure – Gapped route <!-- src: S2 · slide 5 · case 4 -->

5. Nearest one route and more than one  measure – Gapped route – Equidistant from more than one measure

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | R1 | 0 | 10 |
| L2 | Null | Null | Null |
| L3 | Null | Null | Null |
| L4 | R1 | 10 | 5 |

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0.5 |
| P2 | Null | Null |
| P3 | R1 | 8 |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | R1 | 0 | 10 |
| L2 | R1 | 1 | 6 |
| L3 | R1 | 2 | 9 |
| L4 | R1 | 10 | 5 |

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0.5 |
| P2 | R1 | 2 |
| P3 | R1 | 6 |

[figure: R1 · 1–3 · L1 · L2 · L3 · L4 · 0 · 10 · 2 · 4 · 6 · 8]

![Figure 7 — 4. Nearest one route and one measure – Gapped route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-07-slide-05-4-nearest-one-route-and-one-measure.png)
![Figure 8 — 4. Nearest one route and one measure – Gapped route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-08-slide-05-4-nearest-one-route-and-one-measure.png)

![Figure 9 — 4. Nearest one route and one measure – Gapped route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-09-slide-05-4-nearest-one-route-and-one-measure.svg)

### TC-U03 — Nearest one route and one measure (case 6) <!-- src: S2 · slide 6 · case 6 -->

- **Case:** Nearest one route and one measure – Concurrent Routes updated from any one of the routes

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0 |
| P2 | R1 | 4 |
| P3(right on tolerance) | R1 | 10 |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | Null | Null | Null |
| L2 | R1 | 6 | 8 |
| L3 | Null | Null | Null |
| L4 | Null | Null | Null |
| L5 | Null | Null | Null |
| L6 | Null | Null | Null |
| L7 | R1 | 1 | 7 |

[figure: 1 · 2 · R1 · 0 · 10 · L1 · L2 · L3 · L4 · L5 · 3 · L6 · L7 · R2 · 5 · 15]

![Figure 1 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-01-slide-03-1-nearest-one-route-and-one-measure.png)
![Figure 2 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-02-slide-03-1-nearest-one-route-and-one-measure.png)

![Figure 10 — 6. Nearest one route and one measure – Concurrent Routes updated from any one of the routes](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-10-slide-06-6-nearest-one-route-and-one-measure.svg)

### TC-U04 — Nearest one route and one measure (case 7) <!-- src: S2 · slide 7 · case 7 -->

- **Case:** Nearest one route and one measure – Same route with different time slices and updated measures. TVD: 1/1/2021 R1

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 10 |
| P2 | R1 | 6 |
| P3 | Null | Null |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | Null | Null | Null |
| L2 | R1 | 4 | 2 |
| L3 | Null | Null | Null |
| L4 | Null | Null | Null |
| L5 | Null | Null | Null |
| L6 | Null | Null | Null |
| L7 | R1 | 9 | 7 |

[figure: 1 · 2 · R1 · 0 · 10 · L1 · L2 · L3 · L4 · L5 · 3 · L6 · L7]

![Figure 1 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-01-slide-03-1-nearest-one-route-and-one-measure.png)
![Figure 2 — 1. Nearest one route and one measure – Normal Route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-02-slide-03-1-nearest-one-route-and-one-measure.png)

![Figure 11 — 7. Nearest one route and one measure – Same route with different time slices and updated measures. TVD : 1/1/2021 R1 -](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-11-slide-07-7-nearest-one-route-and-one-measure-same.svg)

### TC-U05 — Measures of more than one route within the search tolerance <!-- src: S2 · slide 8 · case 8 -->

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0 |
| P2 | R1 | 5 |
| P3 | R2 | 10 |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | R2 | 9 | 15 |
| L2 | R1 | 5 | 10 |
| L3 | R1 | 0 | 10 |
| L4 | R1 | 0 | 5 |
| L5 | R3 | 19 | 20 |

[figure: 1 · 1–3 · R1 · R2 · R3 · 0 · 10 · 5 · 15 · 25 · L1 · L2 · L3 · L5 · L4 · 8]

![Figure 12 — 8. Measures of more than one route within the search tolerance](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-12-slide-08-8-measures-of-more-than-one-route-within.png)

![Figure 13 — 8. Measures of more than one route within the search tolerance](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-13-slide-08-8-measures-of-more-than-one-route-within.svg)

### TC-U06 — Nearest two or more routes – one of the route is complex route <!-- src: S2 · slide 9 · case 9 -->

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 or R2 | 2 or 4 or 14 |
| P2 | R1 or R2 | 6 or 30 |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | Null | Null | Null |
| L2 | Null | Null | Null |
| L3 | R2 | 14 | 24 |
| L4 | R2 | 30 | 24 |
| L5 | R1 | 4 | 6 |

[figure: 1 · 2 · R1 · R2 · 0 · 4 · 6 · 14 · 20 · 24 · 30 · L1 · L2 · L3 · L4 · L5]

![Figure 14 — 9. Nearest two or more routes – one of the route is complex route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-14-slide-09-9-nearest-two-or-more-routes-one.png)

![Figure 15 — 9. Nearest two or more routes – one of the route is complex route](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-15-slide-09-9-nearest-two-or-more-routes-one.svg)

## Other content

### Slide 4 <!-- slide 4 -->

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 0 |
| P5 | Null | Null |

2. Nearest one route and more than one measure on the same route/same location – Complex route

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | R1 | 3 | 4 |
| L2 | R1 | 4 | 3 |
| L3 | Null | Null | Null |
| L4 | R1 | 0 | 2 |

3. Nearest one route and more than one measure on the same route – event is at equidistant from multiple measures

| Feature | RID | M |
| --- | --- | --- |
| P1 | R1 | 1.5 |

| Feature | RID | M | ToM |
| --- | --- | --- | --- |
| L1 | Null | Null | Null |
| L2 | R1 | 1.5 | 1.5 |

[figure: 1 · 0–4 · R1 · L1 · L2 · L3 · L4 · 0–5]

![Figure 4 — 4](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-04-slide-04-4.png)
![Figure 5 — 4](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-05-slide-04-4.png)

![Figure 6 — 4](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-06-slide-04-4.svg)

### Slide 10 <!-- slide 10 -->

![Figure 16 — 10](../media/4100-support-search-tolerance-parameter-in-update-measures/fig-16-slide-10-10.png)
