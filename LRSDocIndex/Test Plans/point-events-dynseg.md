# Point Events Dynamic Segmentation Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 365 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [PointEvents_Dynseg_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/PointEvents_Dynseg_TestPlan1.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2024-05-22 18:01 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | point event · dynamic segmentation · attribute editing · conflict prevention · event editing · time sliced events · spanning events |
| **Tools** | Save Edits |

## Summary

Test plan for verifying the dynamic segmentation functionality for point events in ArcGIS Pro. Covers attribute editing, domain validation, conflict prevention with locks, event editing scenarios including spanning and time-sliced events, and behavior of editable fields in dynamic segmentation feature classes. Includes examples of normal, complex, gapped, and spanning routes with associated event tables and schematics.

## Related documents

<!-- related:begin -->
- [Overlay Events and queryAttributeSet Point Event Support Test Cases](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5301-overlay-events-and-queryattributeset-point-event-support.md>) — similar text 0.12 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:364 s=4.004 -->
- [Add Point Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3916-add-point-event-to-dominant-route-in-pro.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:360 s=3.685 -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3537-consider-route-dominance-in-append-events.md>) — similar text 0.27 · 1 title word · 1 filename word · same kind/folder <!-- rel:278 s=3.496 -->
- [Splitting Events in ArcGIS Pro - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3920-splitting-events-in-pro.md>) — similar text 0.26 · 1 title word · same kind/surface/folder <!-- rel:491 s=3.438 -->
- [Dynamic Segmentation Table Experience Builder Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/dynseg-table-exb-2024-07.md>) — similar text 0.21 · 2 title words · same kind/folder <!-- rel:351 s=3.199 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Save Edits](https://www.google.com/search?q=%22Save%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 <!-- slide 1 -->

![Figure 1 — 1](../media/point-events-dynseg/fig-01-slide-01-1.png)

### Slide 2 <!-- slide 2 -->

Verification

- Request time out is 10 mins
- Only the point attribute sets that are present in the Attribute Sets location folder are listed
- Point Event’s attribute fields that hold characteristic values are editable
- The Point Event’s fields are named as <EventName.FieldName>
- The following fields are editable (provided they are the characteristic fields)
  - Coded value domains
  - Range Domains
  - Contingent Values
  - Fields with attribute rules
  - Fields with subtypes
  - Default value set
  - Null not allowed
Verify that non-allowed values are not transferred from the Dynseg table to the event tables. E.g. A value of out range for a field where range domain is set.

- Domains are copied over from the underlying point event tables so that user has them available when editing the data in the dynamic segmentation FC.
- The DynamicSegmentation attribute table can be exported to a new table
- Selecting a row in the table highlights the feature on the map
- The following fields types are supported (provided they are the characteristic fields)
  - Text
  - Numeric
  - Date
  - Guid
- Once a field is edited, the edits can be saved using the ‘Save Edits’ tool in the Pro ribbon.
- Once you make an edit and save, then verify that the individual event’s attribute table is updated, and shape is generated.
- Centerline layer is not allowed as a Dynseg layer for this tool
- A dynseg table is still generated if there exists only point events but no line events for the selected route.
- The type field is non editable

## Test Cases

### TC-U01 — Route locked by another user in same version <!-- src: S3 · slide 3 · table · row 1 -->

- **Expected Result:** Unable to edit

### TC-U02 — Route locked by another user in another version <!-- src: S3 · slide 3 · table · row 2 -->

- **Expected Result:** Unable to edit

### TC-U03 — Route locked by same user in another version <!-- src: S3 · slide 3 · table · row 3 -->

- **Expected Result:** Unable to edit

### TC-U04 — Route locked by same user in same version <!-- src: S3 · slide 3 · table · row 4 -->

- **Expected Result:** Editing allowed

### TC-U05 — No locks present for the route or for the events on the route <!-- src: S3 · slide 3 · table · row 5 -->

- **Expected Result:** Editing allowed

### TC-U06 — Multiple cells are edited using calculate fields <!-- src: S3 · slide 3 · table · row 6 -->

- **Case:** Multiple cells are edited using calculate fields, some of the route locks are not available
- **Expected Result:** Unable to edit

### TC-U07 — Route locked by another user in same version, but no edits have taken place <!-- src: S3 · slide 3 · table · row 7 -->

- **Expected Result:** Editing allowed provided that the lock is transferred

### TC-U08 — Event locked by same user in another version <!-- src: S3 · slide 3 · table · row 8 -->

- **Expected Result:** Unable to edit

### TC-U09 — Line locked by another user in same version <!-- src: S3 · slide 3 · table · row 9 -->

- **Expected Result:** Unable to edit

### TC-U10 — Line locked by another user in another version <!-- src: S3 · slide 3 · table · row 10 -->

- **Expected Result:** Unable to edit

### TC-U11 — Line locked by same user in another version <!-- src: S3 · slide 3 · table · row 11 -->

- **Expected Result:** Unable to edit

### TC-U12 — Event locked by another user in another version <!-- src: S3 · slide 3 · table · row 12 -->

- **Expected Result:** Unable to edit

### TC-U13 — Event locked by another user in same version <!-- src: S3 · slide 3 · table · row 13 -->

- **Expected Result:** Unable to edit

## Other content

### Slide 3 — Conflict Prevention <!-- slide 3 -->

• Check for locks only when a field is edited. Acquire event locks.
• Release the lock upon a successful run when using the Default version

### Slide 4 <!-- slide 4 -->

### Slide 5 — Normal Route <!-- slide 5 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | Null | 20 | 70 | A |
| R1 | 2 |  |  | 70 | 110 | B |
| Line Event2 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 10 | 50 | Y |
| R1 | 2 | 1/1/2000 | Null | 50 | 100 | X |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 18 |  | 1 |
| R1 | 2 | 1/1/2000 | Null | 30 |  | 2 |
| R1 | 3 | 1/1/2000 | Null | 50 |  | 3 |
| R1 | 4 | 1/1/2000 | Null | 100 |  | 1 |
| Point Event2 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 20 |  | XX |
| R1 | 2 | 1/1/2000 | Null | 70 |  | YY |
| R1 | 3 | 1/1/2000 | Null | 110 |  | XX |

![Figure 2 — Normal Route](../media/point-events-dynseg/fig-02-slide-05-normal-route.png)

### Slide 6 <!-- slide 6 -->

| Type | From<br>Measure | To<br>Measure | Line1 | Line2 | Point1 | Point2 |
| --- | --- | --- | --- | --- | --- | --- |
| Line | 10 | 18 |  | Y |  |  |
| Point | 18 | 18 |  | Y | 1 |  |
| Line | 18 | 20 |  | Y |  |  |
| Point | 20 | 20 | A | Y |  | XX |
| Line | 20 | 30 | A | Y |  |  |
| Point | 30 | 30 | A | Y | 2 |  |
| Line | 30 | 50 | A | Y |  |  |
| Point | 50 | 50 | A | X | 3 |  |
| Line | 50 | 70 | A | X |  |  |
| Point | 70 | 70 | B | X |  | YY |
| Line | 70 | 100 | B | X |  |  |
| Point | 100 | 100 | B | X | 1 |  |
| Line | 100 | 110 | B |  |  |  |
| Point | 110 | 110 | B |  |  | XX |

Only white cells are editable

![Figure 2 — Normal Route](../media/point-events-dynseg/fig-02-slide-05-normal-route.png)

![Figure 3 — 6](../media/point-events-dynseg/fig-03-slide-06-6.svg)

### Slide 7 — Complex Route <!-- slide 7 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | Null | 30 | 180 | A |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 10 |  | 11 |
| R1 | 2 | 1/1/2000 | Null | 30 |  | 33 |
| R1 | 3 | 1/1/2000 | Null | 180 |  | 22 |
| Point Event2 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 200 |  | AA |
| R1 | 2 | 1/1/2000 | Null | 100 |  | BB |

![Figure 4 — Complex Route](../media/point-events-dynseg/fig-04-slide-07-complex-route.png)

### Slide 8 <!-- slide 8 -->

| Type | From<br>Measure | To<br>Measure | Line1 | Point1 | Point2 |
| --- | --- | --- | --- | --- | --- |
| Line | 10 | 30 |  |  |  |
| Point | 10 | 10 |  |  | 11 |
| Point | 30 | 30 | A |  | 33 |
| Line | 30 | 100 | A |  |  |
| Point | 100 | 100 | A | BB |  |
| Line | 100 | 180 | A |  |  |
| Point | 180 | 180 | A |  | 22 |
| Line | 180 | 200 |  |  |  |
| Point | 200 | 200 |  | AA |  |

Only white cells are editable

![Figure 4 — Complex Route](../media/point-events-dynseg/fig-04-slide-07-complex-route.png)

### Slide 9 — Gapped Route <!-- slide 9 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | Null | 12 | 14 | A |
| R1 | 2 | 1/1/2000 | Null | 16 | 21 | A |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 14 |  | 22 |
| R1 | 2 | 1/1/2000 | Null | 15 |  | 33 |
| R1 | 3 | 1/1/2000 | Null | 16 |  | 33 |
| Point Event2 |  |  |  |  |  |  |
| R1 | 2 | 1/1/2000 | Null | 14 |  | BB |

![Figure 5 — Gapped Route](../media/point-events-dynseg/fig-05-slide-09-gapped-route.png)

### Slide 10 <!-- slide 10 -->

| Type | From<br>Measure | To<br>Measure | Line1 | Point1 | Point2 |
| --- | --- | --- | --- | --- | --- |
| Line | 12 | 14 | A |  |  |
| Point | 14 | 14 | A | 22 | BB |
| Line | 14 | 15 |  |  |  |
| Point | 15 | 15 | A | 33 |  |
| Point | 16 | 16 | A | 33 |  |
| Line | 16 | 21 | A |  |  |
| Line | 21 | 22 |  |  |  |

Only white cells are editable

![Figure 5 — Gapped Route](../media/point-events-dynseg/fig-05-slide-09-gapped-route.png)

### Slide 11 <!-- slide 11 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 | 23 | A |
| R1 | 2 | 1/1/2000 | 12/31/2020 | 23 | 30 | B |
| R1 | 1 | 12/31/2020 | Null | 16 | 30 | A |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 |  | BB |
| R1 | 2 | 1/1/2000 | 12/31/2020 | 23 |  | BB |
| R1 | 3 | 12/31/2020 | Null | 26.1 |  | BB |
| R1 | 4 | 12/31/2020 | Null | 16 |  | BB |

[figure: Time Sliced Events · 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · A · B]

![Figure 6 — 11](../media/point-events-dynseg/fig-06-slide-11-11.png)

### Slide 12 <!-- slide 12 -->

| Type | From<br>Measure | To<br>Measure | From<br>Date | To<br>Date | Line1 | Point1 |
| --- | --- | --- | --- | --- | --- | --- |
| Point | 16 | 16 | 1/1/2000 | 12/31/2020 | A | BB |
| Line | 16 | 23 | 1/1/2000 | 12/31/2020 | A |  |
| Line | 23 | 30 | 1/1/2000 | 12/31/2020 | B |  |
| Point | 23 | 23 | 1/1/2000 | 12/31/2020 | B | BB |
| Line | 16 | 26.1 | 12/31/2020 | Null | A |  |
| Point | 16 | 16 | 12/31/2020 | Null | A | BB |
| Point | 26.1 | 26.1 | 12/31/2020 | Null | A | BB |
| Line | 26.1 | 30 | 12/31/2020 | Null | A |  |

Only white cells are editable

[figure: 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · A · B]

![Figure 6 — 11](../media/point-events-dynseg/fig-06-slide-11-11.png)

### Slide 13 — Line Network – Spanning Events <!-- slide 13 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| Line ID | L1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| From<br>RouteID | From<br>Measure | To<br>Route ID | To<br>Measure | Event<br>ID | From<br>Date | To<br>Date | Code |
| R1 | 10 | R1 | 90 | 1 | 1/1/2000 | Null | A |
| R1 | 90 | R2 | 130 | 2 | 1/1/2000 | Null | B |
| Point Event1 |  |  |  |  |  |  |  |
| R1 | 10 |  |  | 1 | 1/1/2000 | Null | 33 |
| R1 | 90 |  |  | 2 | 1/1/2000 | Null | 22 |
| Point Event2 |  |  |  |  |  |  |  |
| R1 | 90 |  |  | 1 | 1/1/2000 | Null | AA |
| R2 | 50 |  |  | 2 | 1/1/2000 | Null | BB |

| Network |  |
| --- | --- |
| RouteID | R2 |
| Line ID | L1 |
| From Date | 1/1/2000 |
| To Date | Null |

[figure: Route · Line Event1 · Point Event1 · Point Event2]

![Figure 7 — Line Network – Spanning Events](../media/point-events-dynseg/fig-07-slide-13-line-network-spanning-events.png)

### Slide 14 <!-- slide 14 -->

| Type | Route ID | From<br>Measure | To<br>Measure | Line1 | Point1 | Point2 |
| --- | --- | --- | --- | --- | --- | --- |
| Point | R1 | 10 | 10 | A | 33 |  |
| Line | R1 | 10 | 90 | A |  |  |
| Line | R1 | 90 | 110 | B |  |  |
| Point | R1 | 90 | 90 | B | 22 | AA |
| Line | R2 | 50 | 130 | B |  |  |
| Point | R2 | 50 | 50 | B |  | BB |

Only white cells are editable

[figure: Route · Line Event1 · Point Event1 · Point Event2]

![Figure 7 — Line Network – Spanning Events](../media/point-events-dynseg/fig-07-slide-13-line-network-spanning-events.png)

### Slide 15 — Editing Scenarios <!-- slide 15 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | Null | 20 | 70 | A |
| R1 | 2 |  |  | 70 | 110 | B |
| Line Event2 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 10 | 50 | Y |
| R1 | 2 | 1/1/2000 | Null | 50 | 100 | X |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 18 |  | 1 |
| R1 | 2 | 1/1/2000 | Null | 30 |  | 2 |
| R1 | 3 | 1/1/2000 | Null | 50 |  | 3 |
| R1 | 4 | 1/1/2000 | Null | 100 |  | 1 |
| Point Event2 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | Null | 20 |  | XX |
| R1 | 2 | 1/1/2000 | Null | 70 |  | YY |
| R1 | 3 | 1/1/2000 | Null | 110 |  | XX |

![Figure 2 — Normal Route](../media/point-events-dynseg/fig-02-slide-05-normal-route.png)

### Slide 16 <!-- slide 16 -->

| Type | From<br>Measure | To<br>Measure | Line1 | Line2 | Point1 | Point2 |
| --- | --- | --- | --- | --- | --- | --- |
| Line | 10 | 18 |  | Y |  |  |
| Point | 18 | 18 |  | Y | 1 |  |
| Line | 18 | 20 |  | Y |  |  |
| Point | 20 | 20 | A | Y |  | XX |
| Line | 20 | 30 | A | Y |  |  |
| Point | 30 | 30 | A | Y | 2 |  |
| Line | 30 | 50 | A | Y |  |  |
| Point | 50 | 50 | A | Y | 3 |  |
| Line | 50 | 70 | A | X |  |  |
| Point | 70 | 70 | B | X |  | YY |
| Line | 70 | 100 | B | X |  |  |
| Point | 100 | 100 | B | X | 1 |  |
| Line | 100 | 110 | A |  |  |  |
| Point | 110 | 110 | B |  |  | XX |

Only white cells are editable
Change to PP
Add YY

![Figure 2 — Normal Route](../media/point-events-dynseg/fig-02-slide-05-normal-route.png)

![Figure 8 — 16](../media/point-events-dynseg/fig-08-slide-16-16.svg)

### Slide 17 <!-- slide 17 -->

| Point Event2 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | Null | 20 |  | XX |
| R1 | 2 | 1/1/2000 | Null | 70 |  | YY |
| R1 | 3 | 1/1/2000 | Null | 110 |  | PP |
| R1 | 4 | 1/1/2000 | Null | 30 |  | YY |

Event is added to the existing time-slice

[figure: Changed to PP · Added YY · Same Event ID · New Event ID]

![Figure 2 — Normal Route](../media/point-events-dynseg/fig-02-slide-05-normal-route.png)
![Figure 9 — 17](../media/point-events-dynseg/fig-09-slide-17-17.png)

![Figure 10 — 17](../media/point-events-dynseg/fig-10-slide-17-17.svg)

### Slide 18 <!-- slide 18 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 | 23 | A |
| R1 | 2 | 1/1/2000 | 12/31/2020 | 23 | 30 | B |
| R1 | 1 | 12/31/2020 | Null | 16 | 30 | A |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 |  | BB |
| R1 | 2 | 1/1/2000 | 12/31/2020 | 23 |  | BB |
| R1 | 3 | 12/31/2020 | Null | 26.1 |  | BB |
| R1 | 4 | 12/31/2020 | Null | 16 |  | BB |

[figure: Time Sliced Events · 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · A · B]

![Figure 6 — 11](../media/point-events-dynseg/fig-06-slide-11-11.png)

### Slide 19 <!-- slide 19 -->

| Type | From<br>Measure | To<br>Measure | From<br>Date | To<br>Date | Line1 | Point1 |
| --- | --- | --- | --- | --- | --- | --- |
| Point | 16 | 16 | 1/1/2000 | 12/31/2020 | A | BB |
| Line | 16 | 23 | 1/1/2000 | 12/31/2020 | A |  |
| Line | 23 | 30 | 1/1/2000 | 12/31/2020 | B |  |
| Point | 23 | 23 | 1/1/2000 | 12/31/2020 | B | BB |
| Line | 16 | 26.1 | 12/31/2020 | Null | A |  |
| Point | 16 | 16 | 12/31/2020 | Null | A | BB |
| Point | 26.1 | 26.1 | 12/31/2020 | Null | A | BB |
| Line | 26.1 | 30 | 12/31/2020 | Null | A |  |

Only white cells are editable

[figure: 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · A · B · Change to AA]

![Figure 6 — 11](../media/point-events-dynseg/fig-06-slide-11-11.png)

### Slide 20 <!-- slide 20 -->

| Point Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 |  | BB |
| R1 | 2 | 1/1/2000 | 12/31/2020 | 23 |  | AA |
| R1 | 3 | 12/31/2020 | Null | 26.1 |  | BB |
| R1 | 4 | 12/31/2020 | Null | 16 |  | BB |

Only this time-slice is used

[figure: 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · A · B · AA · Same Event ID]

![Figure 6 — 11](../media/point-events-dynseg/fig-06-slide-11-11.png)

![Figure 11 — 20](../media/point-events-dynseg/fig-11-slide-20-20.svg)

### Slide 21 — Time Sliced Events -2 <!-- slide 21 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 16 | 30 | B |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | 12/31/2020 | 17 |  | 1 |
| R1 | 2 | 12/31/2020 | Null | 17 |  | 2 |

[figure: 1/1/2000 - Null · 1/1/2000 – 12/31/2020 · 12/31/2020 - Null · Route · Point Event1 · B · Line Event1]

![Figure 12 — Time Sliced Events -2](../media/point-events-dynseg/fig-12-slide-21-time-sliced-events-2.png)

### Slide 22 <!-- slide 22 -->

| Type | From<br>Measure | To<br>Measure | From<br>Date | To<br>Date | Line1 | Point1 |
| --- | --- | --- | --- | --- | --- | --- |
| Line | 16 | 17 | 1/1/2000 | 1/1/2010 |  |  |
| Point | 17 | 17 | 1/1/2000 | 1/1/2010 |  | 1 |
| Line | 17 | 30 | 1/1/2000 | 1/1/2010 |  |  |
| Line | 16 | 17 | 1/1/2010 | 12/31/2020 | B |  |
| Point | 17 | 17 | 1/1/2010 | 12/31/2020 | B | 1 |
| Line | 17 | 30 | 1/1/2010 | 12/31/2020 | B |  |
| Line | 16 | 17 | 12/31/2020 | 12/31/2030 |  |  |
| Point | 17 | 17 | 12/31/2020 | 12/31/2030 |  | 1 |
| Line | 17 | 30 | 12/31/2020 | 12/31/2030 |  |  |
| Line | 16 | 17 | 12/31/2030 | Null |  |  |
| Point | 17 | 17 | 12/31/2030 | Null |  | 2 |
| Line | 17 | 30 | 12/31/2030 | Null |  |  |

[figure: 1/1/2000 - Null · 1/1/2010 – 12/31/2020 · 12/31/2030 - Null · Route · Point Event1 · B · 1/1/2000 – 12/31/2030 · Line Event1]

![Figure 12 — Time Sliced Events -2](../media/point-events-dynseg/fig-12-slide-21-time-sliced-events-2.png)

### Slide 23 — Time Sliced Events -3 <!-- slide 23 -->

| Network |  |
| --- | --- |
| RouteID | R1 |
| From Date | 1/1/2000 |
| To Date | Null |

| Line Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| RouteID | EventID | From Date | To Date | From M | To M | Code |
| R1 | 1 | 1/1/2000 | 12/31/2010 | 16 | 30 | A |
| R1 | 1 | 12/31/2010 | 12/31/2020 | 16 | 30 | B |
| R1 | 1 | 12/31/2020 | Null | 16 | 30 | C |
| Point Event1 |  |  |  |  |  |  |
| R1 | 1 | 1/1/2000 | 12/31/2010 | 20 |  | 3 |

[figure: 1/1/2000 - Null · 12/31/2010 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · Point Event1 · C · 1/1/2000 – 12/31/2010 · B · A]

![Figure 13 — Time Sliced Events -3](../media/point-events-dynseg/fig-13-slide-23-time-sliced-events-3.png)

### Slide 24 <!-- slide 24 -->

| Type | From<br>Measure | To<br>Measure | From<br>Date | To<br>Date | Line1 | Point1 |
| --- | --- | --- | --- | --- | --- | --- |
| Line | 16 | 20 | 1/1/2000 | 12/31/2010 | A |  |
| Point | 20 | 20 | 1/1/2000 | 12/31/2010 | A | 3 |
| Line | 20 | 30 | 1/1/2000 | 12/31/2010 | A |  |
| Line | 16 | 30 | 12/31/2010 | 12/31/2020 | A |  |
| Line | 16 | 30 | 12/31/2020 | Null | A |  |

[figure: 1/1/2000 - Null · 1/1/2010 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · Point Event1 · C · 1/1/2000 – 12/31/2010 · B · A · Change to 2]

![Figure 13 — Time Sliced Events -3](../media/point-events-dynseg/fig-13-slide-23-time-sliced-events-3.png)

### Slide 25 <!-- slide 25 -->

| Point Event1 |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 1 | 1/1/2000 | 12/31/2010 | 20 |  | 2 |

[figure: 1/1/2000 - Null · 1/1/2010 – 12/31/2020 · 12/31/2020 - Null · Route · Line Event1 · Point Event1 · C · 1/1/2000 – 12/31/2010 · B · A · 2]

![Figure 13 — Time Sliced Events -3](../media/point-events-dynseg/fig-13-slide-23-time-sliced-events-3.png)

![Figure 14 — 25](../media/point-events-dynseg/fig-14-slide-25-25.svg)
