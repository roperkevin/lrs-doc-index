# Flip Centerline Tool: In Memory Flip (UI) Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#5042](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5042) |
| **Source** | [5042-FlipCenterlineToolinMemoryFlipUI_TestPlan_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5042-FlipCenterlineToolinMemoryFlipUI_TestPlan_V3.pptx>) |
| **Edited** | 2023-04-17 16:10 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Flip Centerline Tool: In Memory Flip (UI) Test Plan"
source_file: "5042-FlipCenterlineToolinMemoryFlipUI_TestPlan_V3.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5042-FlipCenterlineToolinMemoryFlipUI_TestPlan_V3.pptx"
doc_id: 577
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V3"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-04-17T16:10:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "flip", "in memory flip", "route creation", "route extension", "route realignment", "non monotonic"]
tools: ["Create Route", "Extend Route", "Realign Route"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#5042"]
related: [{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":6.974},{"doc":602,"file":"flip-centerline-tool-in-memory-flip-user-story__doc602.md","s":6.83},{"doc":609,"file":"flip-centerline-tool-in-memory-flip-user-story__doc609.md","s":6.364},{"doc":18,"file":"extend-route-ai-assistant-test-plan__doc18.md","s":2.663},{"doc":483,"file":"64-bit-oid-support-for-route-editing-tools__doc483.md","s":2.632}]
```
-->

## Summary

Test plan for the Flip Centerline Tool focusing on in memory flipping of centerline geometry during route creation, extension, and realignment in continuous and engineering networks with Utility Network (UN). Covers positive and negative test cases including complex route scenarios, measure handling, and centerline order recalculation after flips.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.46 · 4 title words · 3 filename words · same surface <!-- rel:601 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/flip-centerline-tool-in-memory-flip-user-story__doc602.md>) — similar text 0.41 · 4 title words · 3 filename words · same surface <!-- rel:602 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc609.md>) — similar text 0.46 · 4 title words · 3 filename words · same surface <!-- rel:609 -->
- [Extend Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/extend-route-ai-assistant-test-plan__doc18.md>) — similar text 0.17 · same kind/surface/folder <!-- rel:18 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-support-for-route-editing-tools__doc483.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:483 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

## Slide 1

Flip Centerline Tool: In Memory Flip (UI)

| Notes |
| --- |
| Test with RH and APR data. Test more with APR in an APR-UN environment Test in FS, but do a couple tests in a DC environment Test in Create, Extend, and Realign Route tools Centerline geometry is only flipped in memory, permanent geometry of centerline will persist In memory flips should not create dirty area in UN and connectivity should maintain in UN Only test some of the complex route scenarios as per feedback from test plan review meeting |

Devtopia Issue

## Slide 2

| Positive Tests: Create Route (Continuous Network) |
| --- |
| 1 centerline selected, centerline flipped in memory, route created 2 centerlines selected, first centerline flipped in memory, route created 3 centerlines selected, middle centerline flipped in memory, route created 3 centerlines selected, first centerline flipped in memory, route created 3 centerlines selected, last centerline flipped in memory, route created 5 centerlines selected, centerlines 2 and 4 flipped in memory, route created |

| Positive Tests: Extend Route (Continuous Network) |
| --- |
| 1 centerline selected at end of existing route, flipped in memory, route extended 1 centerline selected at beginning of existing route, flipped in memory, route extended 2 centerlines selected at end of existing route, first centerline flipped in memory, route extended 2 centerlines selected at beginning of existing route, first centerline flipped in memory, route extended |

| Positive Tests: Create Route (Engineering Network + UN) |
| --- |
| 1 centerline selected with measures 0-10, centerline flipped in memory, route created with no dirty areas 2 centerlines selected with measures 0-10 and 10-20, second centerline flipped in memory, route created with no dirty areas 3 centerlines selected with measures 0-10, 10-20, and 20-30, middle centerline flipped in memory, route created with no dirty areas 3 centerlines selected with measures 0-10, 10-20, and 20-30, first centerline flipped in memory, route created with no dirty areas 3 centerlines selected with measures 0-10, 10-20, and 20-30, last centerline flipped in memory, route created with no dirty areas |

| Positive Tests: Extend Route (Engineering Network+ UN) |
| --- |
| 1 centerline selected at end of existing route, flipped in memory, route extended with no dirty areas 1 centerline selected at beginning of existing route, flipped in memory, route extended with no dirty areas 2 centerlines selected at end of existing route, first centerline flipped in memory, route extended with no dirty areas 2 centerlines selected at beginning of existing route, first centerline flipped in memory, route extended with no dirty areas 1 centerline selected at the end of the next route on the line, flipped in memory, route extended with no dirty areas 1 centerline selected at the beginning of the previous route on the line, flipped in memory, route extended with no dirty areas 1 centerline selected at the end of the next reverse stationed route on the line, flipped in memory, route extended with no dirty areas |

## Slide 3

| Positive Tests: Realign Route (Continuous Network) |
| --- |
| 1 centerline selected, realign middle of a normal route with an in memory flip, route realigned 2 centerlines selected, realign middle of a normal route, first centerline flipped in memory, route realigned 1 centerline selected, realign middle of a loop route with an in memory flip, route realigned 1 centerline selected, realign middle of a lollipop route with an in memory flip, route realigned 1 centerline selected, realign middle of a gapped route with an in memory flip, route realigned 1 centerline selected, realign middle of an infinity route with an in memory flip, route realigned 1 center line selected, realign middle of a branch route with an in memory flip, route realigned |

| Positive Tests: Realign Route (Engineering Network + UN) |
| --- |
| 1 centerline selected, realign middle of a normal route with an in memory flip, route realigned with no dirty areas 2 centerlines selected, realign middle of a normal route, first centerline flipped in memory, route realigned with no dirty areas 1 centerline selected, realign middle of a loop route with an in memory flip, route realigned with no dirty areas 1 centerline selected, realign middle of a lollipop route with an in memory flip, route realigned with no dirty areas 1 centerline selected, realign middle of a gapped route with an in memory flip, route realigned with no dirty areas 1 centerline selected, realign middle of an infinity route with an in memory flip, route realigned with no dirty areas 1 center line selected, realign middle of a branch route with an in memory flip, route realigned with no dirty areas 1 centerline selected, realign middle of a series of reverse stationed routes with an in memory flip, route realigned with no dirty areas 1 centerline used to create a route with an in memory flip. Another centerline used to realign the route without an in memory flip, abandoned route will have correct measures. |

| Positive Tests: Centerline Reorder After Flip |
| --- |
| 3 centerlines selected, all centerlines flipped in memory. Centerline order recalculated after in memory flip Multiple centerlines selected, realign multiple routes along a route with an in memory flip, route realigned with no dirty areas Multiple centerlines selected, one flipped in memory. Centerline order recalculated after in memory flip |

| Positive Tests: UN Measures not populated, measures will populate event with a flip |
| --- |
| 1 centerline selected without measures populated, in memory centerline flip, route created successfully with no dirty areas 1 centerline selected without measures populated, in memory centerline flip, route extended successfully with no dirty areas 1 centerline selected without measures populated, in memory centerline flip, route realigned successfully with no dirty areas |

## Slide 4

| Positive Tests: PoM Case |
| --- |
| 1 . 1 centerline selected at the end of the next route on the line, flipped in memory, PoM route extended |

## Slide 5

| Negative Tests: Create Route Error |
| --- |
| 3 centerlines selected, first centerline is in same direction of calibration as other centerlines in selection. Result is non-monotonic Attempt route creation with LRS measures opposite UN measures |

| Negative Tests: Extend Route Error |
| --- |
| 1 Centerline selected at the end of a route, centerline is flipped to be against the direction of calibration of the route. Result is non-monotonic 1 centerline selected at the beginning of a route, centerline is flipped to be against the direction of calibration of the route. Result is non-monotonic. |

| Negative Tests: Realign Route Error |
| --- |
| 1 Centerline selected with each endpoint being in the middle of a route, centerline is flipped to be against the direction of calibration of the route. Result is non-monotonic Multiple centerlines selected, flipped to be against direction of calibration of routes along a line. Result is non-monotonic. |

## Slide 6

![Measured route diagram drawn from the slide's own shapes, measures 1 to 3.](../media/doc365_slide6.svg)

In Memory Flipped Centerline:

## Slide 7

1. 1 centerline selected, centerline flipped in memory, route created
2. 2 centerlines selected, first centerline flipped in memory, route created

[figure: Input: · Output: · 0 · 10 · R1 · 1 · 2]

## Slide 8

4. 3 centerlines selected, first centerline flipped in memory, route created

3. 3 centerlines selected, middle centerline flipped in memory, route created (Prompt will appear around digitization direction, user must click yes)

[figure: Input: · Output: · 0 · R1 · 10 · 1 · 1–3 · 2 · 3]

## Slide 9

5. 3 centerlines selected, last centerline flipped in memory, route created
(Prompt appears about digitization direction)

6. 5 centerlines selected, centerlines 2 and 4 flipped in memory, route created

[figure: 9 · Input: · Output: · 0 · R1 · 10 · 3 · 1 · 2 · 3–5]

## Case 2 <!-- slide 10 -->

### 2 Centerlines Selected with Measures 0-10 and 10-20

- 1 centerline selected with measures 0-10, centerline flipped in memory, route created with no dirty areas
**2 centerlines selected with measures 0-10 and 10-20, second centerline flipped in memory, route created with no dirty areas**

[figure: 0 · 10 · Input: · Output: · L1 R1 · 20 · 1 · 2]

## Slide 11

3. 3 centerlines selected with measures 0-10, 10-20, and 20-30, middle centerline flipped in memory, route created with no dirty areas

4. 3 centerlines selected with measures 0-10, 10-20, and 20-30, first centerline flipped in memory, route created with no dirty areas

[figure: 11 · 0 · Input: · Output: · L1 R1 · 30 · 10 · 20 · 1 · 1–3 · 2 · 3]

## Case 5 <!-- slide 12 -->

### 3 Centerlines Selected with Measures 0-10, 10-20, and 20-30

**3 centerlines selected with measures 0-10, 10-20, and 20-30, last centerline flipped in memory, route created with no dirty areas**

[figure: 0 · Input: · Output: · L1 R1 · 30 · 20 · 1–3 · 10]

## Slide 13

1. 1 centerline selected at end of existing route, flipped in memory, route extended
2. 1 centerline selected at beginning of existing route, flipped in memory, route extended

[figure: Input: · Output: · 0 · 20 · R1 · 1]

## Slide 14

3. 2 centerlines selected at end of existing route, first centerline flipped in memory, route extended

4. 2 centerlines selected at beginning of existing route, first centerline flipped in memory, route extended

[figure: Input: · Output: · 0 · 20 · R1 · 10 · 2 · 1]

## Slide 15

1. 1 centerline selected at end of existing route, flipped in memory, route extended with no dirty areas
2. 1 centerline selected at beginning of existing route, flipped in memory, route extended with no dirty areas

[figure: 0 · 10 · Input: · Output: · 20 · L1 R1 · -10 · 1]

## Slide 16

3. 2 centerlines selected at end of existing route, first centerline flipped in memory, route extended with no dirty areas
4. 2 centerlines selected at beginning of existing route, first centerline flipped in memory, route extended with no dirty areas

[figure: 10 · Input: · Output: · 0 · 20 · L1 R1 · -20 · 2 · 1 · 15 · -10]

## Slide 17

![Measured route diagram drawn from the slide's own shapes, measures 0 to 20.](../media/doc365_slide17_fig1.svg)
![Measured route diagram drawn from the slide's own shapes, measures 30 to 15.](../media/doc365_slide17_fig2.svg)

5. 1 centerline selected at the end of the next route on the line, flipped in memory, route extended with no dirty areas
6. 1 centerline selected at the beginning of the previous route on the line, flipped in memory, route extended with no dirty areas

## Case 7 <!-- slide 18 -->

### 1 Centerline Selected at the End of the Next Reverse

![Measured route diagram drawn from the slide's own shapes, measures 0 to 20.](../media/doc365_slide18_fig1.svg)
![Measured route diagram drawn from the slide's own shapes, measures 20 to 10.](../media/doc365_slide18_fig2.svg)

**1 centerline selected at the end of the next reverse stationed route on the line, flipped in memory, route extended with no dirty areas**

## Slide 19

1. 1 centerline selected, centerline flipped in memory, route created
2. 2 centerlines selected, realign middle of a normal route, in memory flip first centerline, route realigned

[figure: 0 · 10 · Input: · Output: · 15 · R1 · 20 · 1 · 2]

## Slide 20

3. 1 centerline selected, realign middle of a loop route with an in memory flip, route realigned

4. 1 centerline selected, realign middle of a lollipop route with an in memory flip, route realigned

[figure: Input: · Output: · 0 · 10 · 15 · R1 · 1]

## Slide 21

5. 1 centerline selected, realign middle of a gapped route with an in memory flip, route realigned

6. 1 centerline selected, realign middle of an infinity route with an in memory flip, route realigned

[figure: 0 · 10 · Input: · Output: · R1 · 3 · 6 · 15 · 2 · 5 · 4 · 7 · 9 · 1]

## Case 7 <!-- slide 22 -->

### 1 Center Line Selected

**1 center line selected, realign middle of a branch route with an in memory flip, route realigned**

[figure: Input: · Output: · R1 · 0 · 6 · 10 · 1]

## Case 2 <!-- slide 23 -->

### 2 Centerlines Selected, Realign Middle of a Normal Route

![Measured route diagram drawn from the slide's own shapes, measures 0 to 3.](../media/doc365_slide23.svg)

- 1 centerline selected, realign middle of a normal route with an in memory flip, route realigned with no dirty areas
**2 centerlines selected, realign middle of a normal route, first centerline flipped in memory, route realigned with no dirty areas**

## Slide 24

![Measured route diagram drawn from the slide's own shapes, measures 0 to 10.](../media/doc365_slide24.svg)

3. 1 centerline selected, realign middle of a lollipop route with an in memory flip, route realigned with no dirty areas

4. 1 centerline selected, realign middle of a gapped route with an in memory flip, route realigned with no dirty areas

## Slide 25

![Measured route diagram drawn from the slide's own shapes, measures 0 to 3.](../media/doc365_slide25.svg)

5. 1 centerline selected, realign middle of a gapped route with an in memory flip, route realigned with no dirty areas

6. 1 centerline selected, realign middle of an infinity route with an in memory flip, route realigned with no dirty areas

## Case 7 <!-- slide 26 -->

### 1 Center Line Selected

![Measured route diagram drawn from the slide's own shapes, measures 0 to 1.](../media/doc365_slide26.svg)

**1 center line selected, realign middle of a branch route with an in memory flip, route realigned with no dirty areas**

## Case 8 <!-- slide 27 -->

### 1 Centerline Selected

![Measured route diagram drawn from the slide's own shapes, measures 0 to 6.](../media/doc365_slide27.svg)

**1 centerline selected, realign middle of a series of reverse stationed routes with an in memory flip, route realigned with no dirty areas**

## Case 9 <!-- slide 28 -->

### 1 Centerline Used To Create a Route with an in Memory Flip.

![Measured route diagram drawn from the slide's own shapes, measures 10 to 3.](../media/doc365_slide28.svg)

**1 centerline used to create a route with an in memory flip. 3 centerlines used to realign the route without an in memory flip, abandoned route will have correct measures.**
Route Realigned with assignment to abandoned routes:

## Case 1 <!-- slide 29 -->

### 3 Centerlines Selected

**3 centerlines selected, all centerlines flipped in memory. Centerline order recalculated after flip**

Centerline Order Recalculation After Flip:

[figure: Input: · 3 · 1–3 · 1 · 2]

## Case 2 <!-- slide 30 -->

### Multiple Centerlines Selected

![Measured route diagram drawn from the slide's own shapes, measures 0 to 1.](../media/doc365_slide30.svg)

**Multiple centerlines selected, realign multiple routes along a route with an in memory flip, centerline order recalculated after flip**
Centerline Order Recalculation After Flip:

## Case 3 <!-- slide 31 -->

### Multiple Centerlines Selected with a User-chosen Order

**Multiple centerlines selected with a user-chosen order, one flipped in memory. Centerline order recalculated after in memory flip**

Centerline Order Recalculation After Flip:

[figure: 0 · Input: · 3 · 1 · 2 · 0–3]

## Case 1 <!-- slide 32 -->

### 1 Centerline Selected at the End of the Next Route on the

![Measured route diagram drawn from the slide's own shapes, measures 15 to 1.](../media/doc365_slide32.svg)

**1 centerline selected at the end of the next route on the line, flipped in memory, PoM route extended**

## Slide 33

1. 1 centerline selected without measures populated, in memory centerline flip, route created successfully with no dirty areas

2. 1 centerline selected without measures populated, in memory centerline flip, route created successfully with no dirty areas

[figure: Input: · 1 · Output: · L1 R1 · 0 · 10 · 5]

## Case 3 <!-- slide 34 -->

### 1 Centerline Selected Without Measures Populated

![Measured route diagram drawn from the slide's own shapes, measures 0 to 1.](../media/doc365_slide34.svg)

**1 centerline selected without measures populated, in memory centerline flip, route realigned successfully with no dirty areas**

## Slide 35

1. 3 centerlines selected, first centerline is in same direction of calibration as other centerlines in selection.  Result is non-monotonic

2. Attempt route creation with LRS measures opposite UN measures (enhancement)

[figure: Input: · 1–3 · 0 · 10 · 1]

## Slide 36

1. 1 Centerline selected at the end of a route, centerline is flipped to be against the direction of calibration of the route.  Result is non-monotonic
2. 1 centerline selected at the beginning of a route, centerline is flipped to be against the direction of calibration of the route.  Result is non-monotonic.

[figure: 0 · 10 · Input: · L1 R1 · 1 · 20 · -10]

## Slide 37

![Measured route diagram drawn from the slide's own shapes, measures 0 to 1.](../media/doc365_slide37.svg)

2. Multiple centerlines selected, realign multiple routes along a route with  centerlines in opposite direction, result is non monotonic
1. 1 Centerline selected with each endpoint being in the middle of a route, centerline is flipped to be against the direction of calibration of the route.  Result is non-monotonic
