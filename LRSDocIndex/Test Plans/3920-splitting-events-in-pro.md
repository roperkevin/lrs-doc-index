# Splitting Events in ArcGIS Pro - Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 491 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#3920](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3920) |
| **Source** | [SplittingEventsinPro_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/SplittingEventsinPro_Testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2023-09-26 21:42 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event splitting · spanning event · non spanning event · route picker · measure picker · attribute validation · conflict prevention · error handling |
| **Tools** | Core Split · Divide · Clip |

## Summary

Test plan for splitting events in ArcGIS Pro covering feature service testing on line and non-line networks with projected and unprojected data. Includes verification of UI elements such as event layer dropdown, route selector, measure picker, and validation of attributes and date fields. Contains positive and negative test cases for spanning and non-spanning events, conflict prevention, and error handling.

## Related documents

<!-- related:begin -->
- [Split Event Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16461-split-event-widget.md>) — similar text 0.71 · same kind/folder <!-- rel:459 s=4.06 -->
- [Add Multiple Point Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/add-multiple-point-events-2022-04.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:672 s=3.99 -->
- [Merge Events Pro Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3921-merge-events-pro.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:647 s=3.881 -->
- [Create multiple line events: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-multiple-line-events.md>) — similar text 0.22 · 1 title word · same kind/surface/folder <!-- rel:669 s=3.539 -->
- [Point Events Dynamic Segmentation Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/point-events-dynseg.md>) — similar text 0.26 · 1 title word · same kind/surface/folder <!-- rel:365 s=3.438 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Core Split](https://www.google.com/search?q=%22Core%20Split%22+site%3Adoc.esri.com) · [Divide](https://www.google.com/search?q=%22Divide%22+site%3Adoc.esri.com) · [Clip](https://www.google.com/search?q=%22Clip%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Splitting Events in Pro – Test Plan <!-- slide 1 -->

- https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3920

### Slide 2 <!-- slide 2 -->

- Test in Feature Service only
- Test in Line and Non-line Network
- Test in projected and unprojected data
- Test with spanning and non-spanning events
- Verify that the default for ‘Event Layer’ is the first line event layer in the map. The dropdown should include all the line events from the LRS enabled service in the map
- Verify once clicked on an event layer in a location, the routeID/route name, the measure, and the OID of the event are populated
- RouteID and Measure should be empty until the user types or select using the picker tools
- Verify the ‘Route Name” is displayed instead of route id for the events configured with route name including in the event attributes displayed in the bottom of the pane.
- Verify that the route selector UI is shown when the user clicks a location with the route picker that has more than one route at that location
- Verify that the route selector UI is shown when the user types in a RouteId/Name which has more than one timeslices
- Verify that the measure picker is shown when the user picks a location where we have multiple measures
- Verify the route  flashes 3 times, Once it is chosen on the map using the route picker
- Verify the marker is shown at the split location
- Verify that measure can be typed in
- Provide a measure with 20 decimal places where only 7 decimal places are allowed and verify that the measure is truncated properly

![Figure 1 — Test in Feature Service only](../media/3920-splitting-events-in-pro/fig-01-slide-02-test-in-feature-service-only.png)

### Slide 3 <!-- slide 3 -->

17. Verify that the Effective Date text box is populated with the current date
18. Verify that Route/Measure information is shown  as the user moves the cursor along the route in the map
19. By default, End Date should be empty
20.For spanning events , check box for Route From date and Route To Date should not be displayed
21. 508 / i18n testing
22. Make sure coded value domains, range domains, subtypes, required fields, contingent values and default values for any fields where applicable are honored
23. Add 15 additional attributes  and ensure  scroll bar shows up
24. When an event is split, both the events after split will be highlighted in different colors.
25. Verify that the attributes of the events after split are editable.
26 Verify the RouteID/name or measure in the  event attributes table in the bottom of the pane  is read only.  Currently we are going to hide the LRS attribute fields
27. Hovering in the pane should show the information related to the fields.
28. The events after split will be shown in tables one below another with accordion

![Figure 2 — Verify that the Effective Date text box is populated with the current date](../media/3920-splitting-events-in-pro/fig-02-slide-03-verify-that-the-effective-date-text-box.png)

## Test Cases

### TC-P01 — Normal route - Split measure: 16 <!-- src: S4 · slide 4 · Positive -Nonline network – Non spanning line event · 1 -->

- **Group:** Nonline Network – Non Spanning Line Event

### TC-P02 — Loop <!-- src: S1 · slide 5 · case 2 -->

- **Group:** Nonline Network – Non Spanning Line Event
- **Case:** Loop – Split measure: 20

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 40 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 20 |
| To Measure | 40 | 20 | 40 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1 · Output]

![Figure 4 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-04-slide-05-positive-nonline-network-non-spanning.png)
![Figure 5 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-05-slide-05-positive-nonline-network-non-spanning.png)

### TC-P03 — Lollipop <!-- src: S1 · slide 6 · case 3 -->

- **Case:** Lollipop – Split measure: 30

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 20 |
| To Measure | 70 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 20 | 20 | 30 |
| To Measure | 70 | 30 | 70 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

[figure: E1 · R1 · Output]

![Figure 6 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-06-slide-06-positive-nonline-network-non-spanning.png)
![Figure 7 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-07-slide-06-positive-nonline-network-non-spanning.png)

### TC-P04 — Branch (case 4) <!-- src: S1 · slide 7 · case 4 -->

- **Case:** Branch – Split measure: 28

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 48 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 28 |
| To Measure | 48 | 28 | 48 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

[figure: E1 · R1 · Output]

![Figure 8 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-08-slide-07-positive-nonline-network-non-spanning.png)
![Figure 9 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-09-slide-07-positive-nonline-network-non-spanning.png)

### TC-P05 — Branch (case 5) <!-- src: S1 · slide 8 · case 5 -->

- **Case:** Branch – Split measure: 25

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 40 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 25 |
| To Measure | 40 | 25 | 40 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

Modify this test case to have the event is from measure 5 to measure 35.

[figure: E1 · R1 · Output]

![Figure 10 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-10-slide-08-positive-nonline-network-non-spanning.png)
![Figure 11 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-11-slide-08-positive-nonline-network-non-spanning.png)

### TC-P06 — Alpha <!-- src: S1 · slide 9 · case 6 -->

- **Case:** Alpha– Split measure: 40

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 15 |
| To Measure | 70 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 15 | 15 | 40 |
| To Measure | 70 | 40 | 70 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

[figure: E1 · R1 · Output]

![Figure 12 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-12-slide-09-positive-nonline-network-non-spanning.png)
![Figure 13 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-13-slide-09-positive-nonline-network-non-spanning.png)

### TC-P07 — Gap <!-- src: S1 · slide 10 · case 8 -->

- **Case:** Gap– Split measure: 10
Current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 50 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 20 |
| To Measure | 50 | 10 | 50 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

Modify this test case to have the event only in one part of the gapped event and split that event

[figure: R1 · E1 · Output]

### TC-P08 — Infinity <!-- src: S1 · slide 11 · case 7 -->

- **Case:** Infinity– Split measure: 40
Current date: 3/29/2022

current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 112 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 40 |
| To Measure | 112 | 40 | 112 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | Split | Split1 | Split |
| Attribute2 | Event | Event1 | Event |

[figure: E1 · E1_2 · R1 · Output]

### TC-P09 — Changing the From and To Date <!-- src: S1 · slide 12 · case 9 -->

Split measure: 25
From date: 1/1/2010
To date: 1/1/2020

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 40 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 25 |
| To Measure | 40 | 25 | 40 |
| From Date | 1/1/2000 | 1/1/2010 | 1/1/2010 |
| To Date | 1/1/2010 | 1/1/2020 | 1/1/2020 |
| Attribute 1 | Split | Split1 | Split2 |
| Attribute2 | Event | Event1 | Event2 |

Modify this test case to have the event is from measure 5 to measure 35.

[figure: R1 · E1 · Output]

### TC-P10 — Vertical Route (case 10) <!-- src: S1 · slide 13 · case 10 -->

- **Group:** Nonline Network – Non Spanning Line Event

Split measure: 4.5
Current date : 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 0 |
| To Measure | 5 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | Split |
| Attribute2 | Event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 0 | 0 | 4.5 |
| To Measure | 5 | 4.5 | 5 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | null | null |
| Attribute 1 | Split | Split1 | Split2 |
| Attribute2 | Event | Event1 | Event2 |

[figure: R1 · E1 · 0–5 · Output]

### TC-P11 — Normal Route <!-- src: S1 · slide 14 · case 11 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Normal route - Split measure: 52.5
Current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L3 | 1/1/2000 | Null |
| R2L3 | 1/1/2000 | Null |
| R3L3 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L3 |
| From Measure | 10 |
| To RouteID | R3L3 |
| To Measure | 25 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L3 | R1L3 | R2L3 |
| From Measure | 10 | 10 | 52.5 |
| To RouteID | R3L3 | R2L3 | R3L3 |
| To Measure | 25 | 52.5 | 25 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

Test case for UI automation

[figure: E1 · 10–15 · 50–55 · 20–25 · Output]

![Figure 14 — Positive -line network – Spanning line event](../media/3920-splitting-events-in-pro/fig-14-slide-14-positive-line-network-spanning-line.svg)

### TC-P12 — Routes in Loop <!-- src: S1 · slide 15 · case 12 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Routes in loop - Split measure: 20/50
Current date: 3/29/2022

Route Picker should show up.

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R2L1 |
| To Measure | 70 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 50 |
| To RouteID | R2L1 | R1L1 | R2L1 |
| To Measure | 70 | 20 | 70 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1L1 · R2L1 · Output]

### TC-P13 — Routes in Lollipop <!-- src: S1 · slide 16 · case 13 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Routes in lollipop - Split measure: 10
Current date: 3/29/2022

Measure picker should show up.

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |
| R3L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R3L1 |
| To Measure | 35 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R1L1 |
| From Measure | 0 | 0 | 10 |
| To RouteID | R3L1 | R1L1 | R3L1 |
| To Measure | 35 | 10 | 35 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1L1 · R2L1 · R3L1 · Output]

### TC-P14 — Routes in Infinity <!-- src: S1 · slide 17 · case 14 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Routes in infinity - Split measure: 10 (R2L1)
Current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |
| R3L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R4L1 |
| To Measure | 15 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 10 |
| To RouteID | R4L1 | R2L1 | R4L1 |
| To Measure | 15 | 10 | 15 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1L1 · R2L1 · R3L1 · R4L1 · Output]

### TC-P15 — Reverse Routes <!-- src: S1 · slide 18 · case 15 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Reverse routes - Split measure: 10 (R1L1)
Current date: 3/29/2022

Route picker will show up ?
output event after split will follow the route direction.

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R2L1 |
| To Measure | 50 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 50 |
| To RouteID | R2L1 | R1L1 | R2L1 |
| To Measure | 50 | 10 | 60 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1L1 · R2L1 · Output]

### TC-P16 — Gapped Routes <!-- src: S1 · slide 19 · case 16 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Gapped routes - Split measure: 120 (R2L1)
Current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R2L1 |
| To Measure | 200 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 120 |
| To RouteID | R2L1 | R2L1 | R2L1 |
| To Measure | 200 | 120 | 200 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R1L1 · R2L1 · Output]

### TC-P17 — Reverse Route <!-- src: S1 · slide 20 · case 17 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Reverse Route- Splitting measure 0(R3L1) or 100 (R4L1)

Current date: 3/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |
| R3L1 | 1/1/2000 | Null |
| R4L1 | 1/1/2000 | Null |
| R5L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R5L1 |
| To Measure | 10 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R3L1 |
| From Measure | 0 | 0 | 0 |
| To RouteID | R5L1 | R3L1 | R5L1 |
| To Measure | 10 | 0 | 10 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R5L1 · R2L1 · R3L1 · R4L1 · R1L1 · Output]

### TC-P18 — Branch Route <!-- src: S1 · slide 21 · case 18 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Branch Route – split measure 20 of R1L1
Current date : 03/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R2L1 |
| To Measure | 20 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R1L1 |
| From Measure | 0 | 0 | 20 |
| To RouteID | R2L1 | R1L1 | R2L1 |
| To Measure | 20 | 20 | 20 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

Modify this test case to have the event is from measure 5 of R1L1 to measure 10 of R2L1.

[figure: E1 · R2L1 · R1L1 · Output]

### TC-P19 — Vertical Route (case 19) <!-- src: S1 · slide 22 · case 19 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Vertical route – splitting measure 11.5 (R2L1)

 Current date : 03/29/2022

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |
| R3L1 | 1/1/2000 | Null |
| R4L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R4L1 |
| To Measure | 53 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 11.5 |
| To RouteID | R4L1 | R2L1 | R4L1 |
| To Measure | 53 | 11.5 | 53 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

[figure: E1 · R2L1 · R3L1 · R4L1 · R1L1 · 0–2 · 10–13 · 50–53 · 0 · 1 · 2 · Output]

### TC-P20 — Changing From / To Date <!-- src: S1 · slide 23 · case 20 -->

- **Group:** Line Network – Spanning Line Event
- **Case:** Route – Changing from/ To date Split measure: 105(R2L1)

From date: 1/1/2010
To date: 1/1/2020

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1L1 | 1/1/2000 | Null |
| R2L1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| From RID | R1L1 |
| From Measure | 0 |
| To RouteID | R2L1 |
| To Measure | 110 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| From RID | R1L1 | R1L1 | R2L1 |
| From Measure | 0 | 0 | 105 |
| To RouteID | R2L1 | R2L1 | R2L1 |
| To Measure | 110 | 105 | 110 |
| From Date | 1/1/2000 | 1/1/2010 | 1/1/2010 |
| To Date | 1/1/2010 | 1/1/2020 | 1/1/2020 |
| Attribute 1 | split | split1 | Split2 |
| Attribute2 | event | event1 | event2 |

Modify this test case to have the event is from measure 5  in R1L1 to measure  108. Of R2L1

[figure: E1 · R2L1 · R1L1 · 10 · Output]

## Other content

### Slide 4 <!-- slide 4 -->

| Route<br>ID | From<br>Date | To<br>Date |
| --- | --- | --- |
| R1 | 1/1/2000 | Null |

| Event ID | E1 |
| --- | --- |
| Route ID | R1 |
| Measure | 10 |
| To Measure | 22 |
| From Date | 1/1/2000 |
| To Date | Null |
| Attribute 1 | split |
| Attribute2 | event |

| Event ID | E1 | E1 | E1 |
| --- | --- | --- | --- |
| Route ID | R1 | R1 | R1 |
| Measure | 10 | 10 | 16 |
| To Measure | 22 | 16 | 22 |
| From Date | 1/1/2000 | 3/29/2022 | 3/29/2022 |
| To Date | 3/29/2022 | Null | Null |
| Attribute 1 | split | split1 | split |
| Attribute2 | event | event1 | event |

Test case for UI automation

[figure: 10–22 · R1 · E1 · Output]

![Figure 3 — Positive -Nonline network – Non spanning line event](../media/3920-splitting-events-in-pro/fig-03-slide-04-positive-nonline-network-non-spanning.svg)

### Slide 24 <!-- slide 24 -->

| User1 is in Version1 and splitting events in Event1 layer |  |  |  |  |
| --- | --- | --- | --- | --- |
|  | User 1 Version1 | User1 Version2 | User2<br>VersionA | Result |
| Event1 |  |  |  | Lock acquired and split events |
| Route/Line lock |  |  |  | Lock acquired and split events |
| Event1 |  | Locked |  | Lock cannot be acquired |
| Route/Line lock |  |  | Locked and version in use | Lock cannot be acquired |
| Event1 |  |  | Locked and version not in use | Transfer lock and split events |
| Event1 |  | Locked event2 |  | Lock for event1 acquired and split events |
| Event1 |  | Locked event1 and version not in use |  | Transfer lock and split events |

Conflict Prevention test cases
User1 is editing event in Version1

Check with one or two cases with Reconcile required options. If reconcile is required then message should be displayed and should not allow the user to acquire lock without reconciling displaying error message.

Other test cases

- Editing attributes
- Range domain values, coded domain values and subtypes, contingent values and attribute rules should be honoured.

### Slide 25 <!-- slide 25 -->

Negative test cases will be tested for both spanning and non-spanning events.

| Test Case | Expected Result | Error message |
| --- | --- | --- |
| Split at a location where more than one line event exist – Test case for UI automation | Show error message |  |
| Selected measure is the endpoint/beginning point of an event |  |  |
| Split using core split, divide, clip tools |  | Can be edited only using LR tools |
| Route ID does not exist |  | Route ID cannot be validated |
| Changing From Date/ To date out of the route range |  |  |
| RouteID is null |  |  |
| Measure is null |  |  |
| Measure is out of range of route |  |  |
| From Date is null |  | Please enter a valid From date |
| In the attributes, enter a value not in range /coded domain |  |  |
| In the attributes make null for a non- nullable field |  |  |
| In the attributes, enter a value overruling attribute rule |  |  |
| In the attributes with contigent values enter a value which does not fall under the restricted value |  |  |
