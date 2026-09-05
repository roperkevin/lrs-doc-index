# Relocate Events Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 521 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [RelocateEvents_ReassignEB_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/RelocateEvents_ReassignEB_V1.pptx>) · rev V1 |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev — |
| **Edited** | 2023-08-15 15:20 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | relocate events · event transfer · route transfer · calibration point · measure change · recalibrate downstream · simple routes · concurrent routes · partial routes · test case |
| **Tools** | ReassignSnapEB_toNewLine · ReassignSnapEB_toExistingLine · ReassignStayput_RetireEB_Testplan · 5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6 |

## Summary

This document contains detailed test plans for relocating events within an Esri Linear Referencing System. It includes multiple test cases for transferring routes and events to existing or new lines, with variations on transferring calibration points, changing measures, and recalibrating downstream routes. The test cases provide route and event data tables, expected results, and diagrams illustrating the scenarios.

## Related documents

<!-- related:begin -->
- [Transfer to Another Line – Support Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/transfer-to-another-line-support-snap-eb-rh-apr-2023-08-2.md>) — similar text 0.39 · 1 filename word · same kind/surface/folder <!-- rel:527 s=4.182 -->
- [Transfer to Another Line – Support Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/transfer-to-another-line-support-snap-eb-rh-apr-2023-08.md>) — similar text 0.35 · 1 filename word · same kind/surface/folder <!-- rel:526 s=4.08 -->
- [Reassign - Transfer to Another Line with StayPut and Retire Event Behavior - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/5140-reassign-transfer-to-another-line-with-stayput-and-retire-eb.md>) — similar text 0.16 · 1 filename word · same kind/folder <!-- rel:528 s=3.669 -->
- [Reassign Routes to Another Line with Original Route ID/Name Maintenance - REST Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-routes-to-another-line-with-original-route-id-name.md>) — similar text 0.08 · 1 filename word · same kind/folder <!-- rel:542 s=3.517 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5141-reassign-route-transfer-to-another-line-method-support-move.md>) — similar text 0.18 · 1 filename word · same kind/folder <!-- rel:533 s=3.166 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [ReassignSnapEB_toNewLine](https://www.google.com/search?q=%22ReassignSnapEB_toNewLine%22+site%3Adoc.esri.com) · [ReassignSnapEB_toExistingLine](https://www.google.com/search?q=%22ReassignSnapEB_toExistingLine%22+site%3Adoc.esri.com) · [ReassignStayput_RetireEB_Testplan](https://www.google.com/search?q=%22ReassignStayput_RetireEB_Testplan%22+site%3Adoc.esri.com) · [5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6](https://www.google.com/search?q=%225141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Relocate Events Test Plan <!-- slide 1 -->

Test cases are from below test plans

- ReassignSnapEB_toNewLine
- ReassignSnapEB_toExistingLine
- ReassignStayput_RetireEB_Testplan
- 5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6

### Slide 2 <!-- slide 2 -->

  - Existing Data
  - Existing Test cases
  - Export the existing event layers
  - Register as external events
  - Perform Route Edits
  - Run AEB
  - Compare internal and external events

[figure: Data · External events · Route edits · Run Relocate Events · Relocate Events · Compare Events · Plan]

![Figure 1 — 2](../media/relocate-events/fig-01-slide-02-2.svg)

### Slide 3 — Snap EB- reassign to existing line <!-- slide 3 -->

## Test Cases

### TC-U01 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 1) <!-- src: S2 · slide 4 · case 1 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing this event for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58exs_1A]

![Figure 2 — Test case 1: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-02-slide-04-test-case-1-transfer-to-existing-line.svg)

### TC-U02 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 1) <!-- src: S2 · slide 5 · case 1 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Blue | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Blue | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S1 | 1/1/2020 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2020 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2020 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2020 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2020 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 3A | 2 | 4 | No Error |

[figure: After · 2A, 200 · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 3 — Test case 1: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-03-slide-05-test-case-1-transfer-to-existing-line.svg)

### TC-U03 — Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP (case 2) <!-- src: S2 · slide 6 · case 2 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP; change measures; change 1

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW52exs_1A]

![Figure 4 — Test case 2: Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP; change measures; change 1](../media/relocate-events/fig-04-slide-06-test-case-2-transfer-to-existing-line.svg)

### TC-U04 — Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP (case 2) <!-- src: S2 · slide 7 · case 2 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP; change measures; change 1

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S1 | 1/1/2020 | <Null> | 1A | 1A | 2 | 3 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 2A | 1.5 | 2.5 | No Error |
| S3 | 1/1/2020 | <Null> | 1A | 1A | 4 | 6 | No Error |
| S4 | 1/1/2020 | <Null> | 3A_new | 3A_new | 0 | 8 | No Error |
| S5 | 1/1/2020 | <Null> | 2A | 3A_new | 2.5 | 8 | No Error |
| S6 | 1/1/2020 | <Null> | 1A | 2A | 2 | 2 | No Error |
| S7 | 1/1/2020 | <Null> | 1A | 3A_new | 4 | 4 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 3A_new | 2 | 8 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Blue | 100 | 1/1/2020 | null | 2 | 6 |
| 2A | Blue | 200 | 1/1/2020 | null | 1 | 3 |
| 3A_new | Blue | 300 | 1/1/2020 | null | 0 | 8 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 2A, 200 · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A_new, 300]

![Figure 5 — Test case 2: Transfer to Existing Line – transfer 3 entire simple routes; not transfer CP; change measures; change 1](../media/relocate-events/fig-05-slide-07-test-case-2-transfer-to-existing-line.svg)

### TC-U05 — Transfer to Existing Line – transfer 1 entire simple route; transfer CP (case 3) <!-- src: S2 · slide 8 · case 3 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 3A | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 3A | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | <Null> | 3A | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW49exs_1A]

![Figure 6 — Test case 3: Transfer to Existing Line – transfer 1 entire simple route; transfer CP; keep original measures; keep](../media/relocate-events/fig-06-slide-08-test-case-3-transfer-to-existing-line.svg)

### TC-U06 — Transfer to Existing Line – transfer 1 entire simple route; transfer CP (case 3) <!-- src: S2 · slide 9 · case 3 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; transfer CP; keep original measures; keep

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 3A | 3A | 3 | 4 | No Error |
| S1 | 1/1/2020 | null | 3A | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 3A | 3A | 1 | 3 | No Error |
| S2 | 1/1/2020 | null | 3A | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 2 | No Error |
| S3 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Blue | 100 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 200 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 300 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 400 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1B, 200 · 2B, 300 · 3B, 400 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 100]

![Figure 7 — Test case 3: Transfer to Existing Line – transfer 1 entire simple route; transfer CP; keep original measures; keep](../media/relocate-events/fig-07-slide-09-test-case-3-transfer-to-existing-line.svg)

### TC-U07 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 5) <!-- src: S2 · slide 10 · case 5 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
This case has 2 variations. Recal downstream unchecked in result1, and checked in result 2

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 1A, 100 · 2A, 200 · 3A, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · CW40exs_1A]

![Figure 8 — Test case 5: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-08-slide-10-test-case-5-transfer-to-existing-line.svg)

### TC-U08 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 5) <!-- src: S2 · slide 11 · case 5 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | null | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | null | 1A_reassign | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A_reassign | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 2 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 3A_reassign | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 2 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | null | 1A | 1A | 2 | 3 | No Error |
| S6 | 1/1/2020 | null | 1A_reassign | 2A | 3 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Red | 200 | 1/1/2020 | null | 2 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A_reassign | Blue | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Blue | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1C, 100 · 2C, 200 · 4 · 5 · 2 · 3 · 8 · 3C, 300 · 1B, 400 · 2B, 500 · 3B, 600 · 0 · 1 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Split into 2]

![Figure 9 — Test case 5: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-09-slide-11-test-case-5-transfer-to-existing-line.svg)

### TC-U09 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 5) <!-- src: S2 · slide 12 · case 5 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | null | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | null | 1A_reassign | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A_reassign | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 3A_reassign | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | null | 1A | 1A | 2 | 3 | No Error |
| S6 | 1/1/2020 | null | 1A_reassign | 2A | 3 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 3A | 2 | 2 | No Error |
| S8 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Red | 200 | 1/1/2020 | null | 2 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A_reassign | Blue | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Blue | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1C, 100 · 2C, 200 · 4 · 5 · 2 · 3 · 8 · 3C, 300 · 1B, 400 · 2B, 500 · 3B, 600 · 0 · 1 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · CW37exs_1A · Split into 2]

![Figure 10 — Test case 5: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-10-slide-12-test-case-5-transfer-to-existing-line.svg)

### TC-U10 — Transfer to Existing Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 13 · case 8 -->

- **Case:** Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2020 | 0 | 4 |
| 2A | Red | 100 | 1/1/2020 | null | 0 | 2 |
| 3A | Red | 200 | 1/1/2020 | null | 0 | 4 |
| Conc1 | Orange | 100 | 1/1/2000 | null | 10 | 15 |
| Conc2 | Orange | 200 | 1/1/2015 | null | 15 | 20 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2015 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2010 | 1/1/2015 | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2015 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S6 | 1/1/2010 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2010 | 1A | 1A | 3 | 4 | No Error |
| S7 | 1/1/2010 | 1/1/2015 | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2015 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S8 | 1/1/2010 | 1/1/2015 | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2015 | <Null> | 1A | 3A | 2 | 4 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sconc1 | 1/1/2000 | 1/1/2015 | Conc1 | Conc1 | 10 | 15 | No Error |
| Sconc1 | 1/1/2015 | <Null> | Conc1 | Conc2 | 10 | 16 | No Error |
| Sconc2 | 1/1/2015 | <Null> | Conc2 | Conc2 | 17.5 | 20 | No Error |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

[figure: Before · 1A, 100 2000-2020 · 2A, 200 2010-null · 3A, 300 2015-null · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · CW25exs_1A]

![Figure 11 — Test case 8: Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes](../media/relocate-events/fig-11-slide-13-test-case-8-transfer-to-existing-line.svg)

### TC-U11 — Transfer to Existing Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 14 · case 8 -->

- **Case:** Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes

2A_reassign, 100
2025-null

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2015 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2020 | 0 | 4 |
| 2A | Red | 100 | 1/1/2020 | 1/1/2025 | 0 | 2 |
| 3A | Red | 200 | 1/1/2020 | 1/1/2025 | 0 | 4 |
| 2A | Red | 100 | 1/1/2025 | null | 0 | 1.25 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2025 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2025 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2025 | 0 | 4 |
| Conc1 | Orange | 100 | 1/1/2000 | null | 10 | 15 |
| Conc2 | Orange | 200 | 1/1/2015 | null | 15 | 20 |
| 2A_reassign | Blue | 100 | 1/1/2025 | null | 2 | 3 |
| 3A | Blue | 200 | 1/1/2025 | null | 0 | 4 |
| 1B | Blue | 300 | 1/1/2025 | null | 3 | 5 |
| 2B | Blue | 400 | 1/1/2025 | null | 4 | 8 |
| 3B | Blue | 500 | 1/1/2025 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

[figure: After - routes · 1A, 100 2000-2020 · 2A, 100 2025-null · 3A, 200 2025-null · 1B, 300 · 2B, 400 · 3B, 500 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · 1.25]

![Figure 12 — Test case 8: Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes](../media/relocate-events/fig-12-slide-14-test-case-8-transfer-to-existing-line.svg)

### TC-U12 — Transfer to Existing Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 15 · case 8 -->

- **Case:** Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes

2A_reassign, 100
2025-null

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | 1/1/2025 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2025 | <Null> | 2A | 2A | 1 | 1.25 | No Error |
| S2 | 1/1/2025 | <Null> | 2A_reassign | 2A_reassign | 2 | 2.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2015 | 1/1/2025 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2025 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2010 | 1/1/2015 | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2015 | 1/1/2025 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2.5 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S6 | 1/1/2010 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2010 | 1A | 1A | 3 | 4 | No Error |
| S7 | 1/1/2010 | 1/1/2015 | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2015 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | 1/1/2025 | 2A | 3A | 0 | 2 | No Error |
| S7 | 1/1/2025 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S7 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S8 | 1/1/2010 | 1/1/2015 | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2015 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | 1/1/2025 | 2A | 3A | 0 | 4 | No Error |
| S8 | 1/1/2025 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S8 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2 | 4 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sconc1 | 1/1/2000 | 1/1/2015 | Conc1 | Conc1 | 10 | 15 | No Error |
| Sconc1 | 1/1/2015 | <Null> | Conc1 | Conc2 | 10 | 16 | No Error |
| Sconc2 | 1/1/2015 | <Null> | Conc2 | Conc2 | 17.5 | 20 | No Error |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

[figure: After - Events · 1A, 100 2000-2020 · 2A, 100 2025-null · 3A, 200 2025-null · 1B, 300 · 2B, 400 · 3B, 500 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · 1.25]

![Figure 13 — Test case 8: Transfer to Existing Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes](../media/relocate-events/fig-13-slide-15-test-case-8-transfer-to-existing-line.svg)

### TC-U13 — b: Transfer to Existing Line – transfer 3 simple routes (case 8) <!-- src: S2 · slide 16 · case 8 -->

- **Case:** b: Transfer to Existing Line – transfer 3 simple routes; routes on source line have multiple time slices

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2020 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2010 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2020 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2030
Recal downstream unchecked

[figure: Before · 1A, 100 2000-null · 2A, 200 2010-null · 3A, 300 2020-null · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · CW22exs_1A]

![Figure 14 — Test case 8-b: Transfer to Existing Line – transfer 3 simple routes; routes on source line have multiple time slices;](../media/relocate-events/fig-14-slide-16-test-case-8-b-transfer-to-existing-line.svg)

### TC-U14 — b: Transfer to Existing Line – transfer 3 simple routes (case 8) <!-- src: S2 · slide 17 · case 8 -->

- **Case:** b: Transfer to Existing Line – transfer 3 simple routes; routes on source line have multiple time slices

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2030 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2030 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2030 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2030 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2030 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2030 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2030 | null | 2 | 4 |
| 2B | Blue | 200 | 1/1/2030 | null | 0 | 2 |
| 3B | Blue | 300 | 1/1/2030 | null | 0 | 4 |
| 1B | Blue | 400 | 1/1/2030 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2030 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2030 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2030 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | 1/1/2030 | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2030 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | 1/1/2030 | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2020 | 1/1/2030 | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2010 | 1/1/2030 | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2020 | 1/1/2030 | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2020 | 1/1/2030 | 1A | 3A | 2 | 4 | No Error |

| S1 | 1/1/2030 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S2 | 1/1/2030 | <Null> | 2A | 2A | 0.5 | 1.25 | No Error |
| S3 | 1/1/2030 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2030 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2030 | <Null> | 2A | 3A | 1.5 | 4 | No Error |
| S6 | 1/1/2030 | <Null> | 1A | 2A | 2 | 1 | No Error |
| S7 | 1/1/2030 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2030 | <Null> | 1A | 3A | 2 | 4 | No Error |

[figure: After · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 2030-null · 2A, 200 2030-null · 3A, 300 2030-null]

![Figure 15 — Test case 8-b: Transfer to Existing Line – transfer 3 simple routes; routes on source line have multiple time slices;](../media/relocate-events/fig-15-slide-17-test-case-8-b-transfer-to-existing-line.svg)

### TC-U15 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 9) <!-- src: S2 · slide 18 · case 9 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing this event for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58exs_1A]

![Figure 16 — Test case 9: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-16-slide-18-test-case-9-transfer-to-existing-line.svg)

### TC-U16 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 9) <!-- src: S2 · slide 19 · case 9 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |

| S1 | 1/1/2020 | <Null> | 1A | 2 | 2.5 | No Error |
| --- | --- | --- | --- | --- | --- | --- |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2020 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2020 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Blue | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Blue | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 2A, 200 · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 17 — Test case 9: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-17-slide-19-test-case-9-transfer-to-existing-line.svg)

### TC-U17 — Transfer to Existing Line – transfer 1 entire simple route; not transfer CP (case 10) <!-- src: S2 · slide 20 · case 10 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW19exs_1A]

![Figure 18 — Test case 10: Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep](../media/relocate-events/fig-18-slide-20-test-case-10-transfer-to-existing-line.svg)

### TC-U18 — Transfer to Existing Line – transfer 1 entire simple route; not transfer CP (case 10) <!-- src: S2 · slide 21 · case 10 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 3A | 3 | 4 | No Error |
| S1 | 1/1/2020 | <Null> | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 3A | 1 | 3 | No Error |
| S2 | 1/1/2020 | <Null> | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S3 | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Blue | 100 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 200 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 300 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 400 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1B, 200 · 2B, 300 · 3B, 400 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 100]

![Figure 19 — Test case 10: Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep](../media/relocate-events/fig-19-slide-21-test-case-10-transfer-to-existing-line.svg)

### TC-U19 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 11) <!-- src: S2 · slide 22 · case 11 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2020
This case has 2 variations. Recal downstream unchecked in result1, and checked in result 2

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 1A, 100 · 2A, 200 · 3A, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · CW40exs_1A]

![Figure 20 — Test case 11: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures;](../media/relocate-events/fig-20-slide-22-test-case-11-transfer-to-existing-line.svg)

### TC-U20 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 11) <!-- src: S2 · slide 23 · case 11 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5b | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S6a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S8a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S8c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Red | 200 | 1/1/2020 | null | 2 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A_reassign | Blue | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Blue | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1B, 400 · 2B, 500 · 3B, 600 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Gray line hidden]

![Figure 21 — Test case 11: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures;](../media/relocate-events/fig-21-slide-23-test-case-11-transfer-to-existing-line.svg)

### TC-U21 — Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 11) <!-- src: S2 · slide 24 · case 11 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Red | 200 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A_reassign | Blue | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Blue | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5b | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S6a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S8a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S8c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |

[figure: After · 1B, 400 · 2B, 500 · 3B, 600 · 4 · 2 · 0 · 1 · 3 · 5 · 8 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Gray line hidden · CW37exs_1A]

![Figure 22 — Test case 11: Transfer to Existing Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures;](../media/relocate-events/fig-22-slide-24-test-case-11-transfer-to-existing-line.svg)

### TC-U22 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 15) <!-- src: S2 · slide 25 · case 15 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing these events for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2000 | <Null> | 1A | 2.5 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 | No Error |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star_blue | 1/1/2000 | <Null> | 2B | 6.5 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58exs_1A]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 24 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-24-slide-25-test-case-15-transfer-to-existing-line.svg)

### TC-U23 — Transfer to Existing Line – transfer 3 entire simple routes; transfer CP (case 15) <!-- src: S2 · slide 26 · case 15 -->

- **Case:** Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing these events for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | 1/1/2020 | 3A | 2 | No Error |
| Star2 | 1/1/2000 | 1/1/2020 | 1A | 2 | No Error |
| Star3 | 1/1/2000 | 1/1/2020 | 1A | 2.5 | No Error |
| Star4 | 1/1/2000 | 1/1/2020 | 2A | 0 | No Error |
| Star5 | 1/1/2000 | 1/1/2020 | 2A | 2 | No Error |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star_blue | 1/1/2000 | <Null> | 2B | 6.5 | No Error |

| Star1 | 1/1/2020 | <Null> | 3A | 2 | No Error |
| --- | --- | --- | --- | --- | --- |
| Star2 | 1/1/2020 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2020 | <Null> | 1A | 2.5 | No Error |
| Star4 | 1/1/2020 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2020 | <Null> | 2A | 2 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Blue | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Blue | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Blue | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 400 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 500 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 600 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 2A, 200 · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 25 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-25-slide-26-test-case-15-transfer-to-existing-line.svg)

### TC-U24 — Transfer to Existing Line – transfer 1 entire simple route; not transfer CP (case 16) <!-- src: S2 · slide 27 · case 16 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2000 | <Null> | 3A | 1 | No Error |
| Star4 | 1/1/2000 | <Null> | 3A | 4 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW19exs_1A]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 26 — Test case 16: Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep](../media/relocate-events/fig-26-slide-27-test-case-16-transfer-to-existing-line.svg)

### TC-U25 — Transfer to Existing Line – transfer 1 entire simple route; not transfer CP (case 16) <!-- src: S2 · slide 28 · case 16 -->

- **Case:** Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | 1/1/2020 | 3A | 2 | No Error |
| Star1 | 1/1/2020 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2000 | 1/1/2020 | 3A | 1 | No Error |
| Star3 | 1/1/2020 | <Null> | 3A | 1 | No Error |
| Star4 | 1/1/2000 | 1/1/2020 | 3A | 4 | No Error |
| Star4 | 1/1/2020 | <Null> | 3A | 4 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 ?? | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | 1/1/2020 | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Blue | 100 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 200 | 1/1/2020 | null | 3 | 5 |
| 2B | Blue | 300 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 400 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1B, 200 · 2B, 300 · 3B, 400 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 100]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 27 — Test case 16: Transfer to Existing Line – transfer 1 entire simple route; not transfer CP; keep original measures; keep](../media/relocate-events/fig-27-slide-28-test-case-16-transfer-to-existing-line.svg)

### TC-U26 — Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP (case 17) <!-- src: S2 · slide 29 · case 17 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial route

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 2A | 1.25 | No Error |
| Star3 | 1/1/2000 | <Null> | 2A | 1.4375 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6 · CW16exs_1A · 1.25]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 28 — Test case 17: Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial route](../media/relocate-events/fig-28-slide-29-test-case-17-transfer-to-existing-line.svg)

### TC-U27 — Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP (case 17) <!-- src: S2 · slide 30 · case 17 -->

- **Case:** Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial route

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | 1/1/2020 | 3A | 2 | No Error |
| Star1 | 1/1/2020 | <Null> | 3A | 4 | No Error |
| Star2 | 1/1/2000 | 1/1/2020 | 2A | 1.25 | No Error |
| Star2 | 1/1/2020 | <Null> | 2A_reassign | 2 | No Error |
| Star3 | 1/1/2000 | 1/1/2020 | 2A | 1.4375 | No Error |
| Star3 | 1/1/2020 | <Null> | 2A_reassign | 2.25 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | 1/1/2020 | 2A | 2 | No Error |
| Star5 | 1/1/2020 | <Null> | 2A_reassign | 3 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 2A | Red | 200 | 1/1/2020 | null | 0 | 1.25 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | 1/1/2020 | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 2A_reassign | Blue | 200 | 1/1/2020 | null | 2 | 3 |
| 3A | Blue | 300 | 1/1/2020 | null | 0 | 8 |
| 2B | Blue | 400 | 1/1/2020 | null | 4 | 8 |
| 3B | Blue | 500 | 1/1/2020 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 400 · 3B, 500 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6 · 2A_reassign, 200 · 1.25]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 29 — Test case 17: Transfer to Existing Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial route](../media/relocate-events/fig-29-slide-30-test-case-17-transfer-to-existing-line.svg)

### TC-U28 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 1) <!-- src: S2 · slide 32 · case 1 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing this event for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58_1A]

![Figure 30 — Test case 1: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original](../media/relocate-events/fig-30-slide-32-test-case-1-transfer-to-new-line.svg)

### TC-U29 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 1) <!-- src: S2 · slide 33 · case 1 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Teal | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Teal | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S1 | 1/1/2020 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2020 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2020 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2020 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2020 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 3A | 2 | 4 | No Error |

[figure: After · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 31 — Test case 1: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original](../media/relocate-events/fig-31-slide-33-test-case-1-transfer-to-new-line.svg)

### TC-U30 — b: Transfer to New Line – 2 separate transfers; transfer CP (case 1) <!-- src: S2 · slide 34 · case 1 -->

- **Case:** b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 1A | 5 | 5.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 1A | 6 | 8 | No Error |
| S5 | 1/1/2000 | <Null> | 1A | 1A | 5.75 | 8 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 1A | 2 | 5.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 1A | 3 | 6.5 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 1A | 2 | 8 | No Error |

First transfer is 1/1/2020
Second transfer is 1/1/2030
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 7 · 1 &2 · CW55_1A]

![Figure 32 — Test case 1- b : Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes](../media/relocate-events/fig-32-slide-34-test-case-1-b-transfer-to-new-line-2.svg)

### TC-U31 — Transfer to New Line – transfer 1 entire simple route; transfer CP (case 3) <!-- src: S2 · slide 36 · case 3 -->

- **Case:** Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 3A | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 3A | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | <Null> | 3A | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW49_1A]

![Figure 34 — Test case 3: Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original](../media/relocate-events/fig-34-slide-36-test-case-3-transfer-to-new-line.svg)

### TC-U32 — Transfer to New Line – transfer 1 entire simple route; transfer CP (case 3) <!-- src: S2 · slide 37 · case 3 -->

- **Case:** Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Teal | 100 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 3A | 3A | 3 | 4 | No Error |
| S1 | 1/1/2020 | null | 3A | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 3A | 3A | 1 | 3 | No Error |
| S2 | 1/1/2020 | null | 3A | 3A | 1 | 3 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 2 | No Error |
| S3 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2020 | null | 3A | 3A | 0 | 4 | No Error |

[figure: After · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 100]

![Figure 35 — Test case 3: Transfer to New Line – transfer 1 entire simple route; transfer CP; keep original measures; keep original](../media/relocate-events/fig-35-slide-37-test-case-3-transfer-to-new-line.svg)

### TC-U33 — Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 5) <!-- src: S2 · slide 38 · case 5 -->

- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
This case has 2 variations. Recal downstream unchecked in result1, and checked in result 2

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 1A, 100 · 2A, 200 · 3A, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · CW40_1A]

![Figure 36 — Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-36-slide-38-test-case-5-transfer-to-new-line.svg)

### TC-U34 — Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 5) <!-- src: S2 · slide 39 · case 5 -->

- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Red | 200 | 1/1/2020 | null | 2 | 4 |
| 1A_reassign | Teal | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Teal | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | null | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | null | 1A_reassign | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A_reassign | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 2 | 4 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 3A_reassign | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 2 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | null | 1A | 1A | 2 | 3 | No Error |
| S6 | 1/1/2020 | null | 1A_reassign | 2A | 3 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |

[figure: After · 1C, 100 · 2C, 200 · 4 · 5 · 2 · 3 · 8 · 3C, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 0 · 1 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Split into 2]

![Figure 37 — Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-37-slide-39-test-case-5-transfer-to-new-line.svg)

### TC-U35 — Transfer to New Line – transfer 0.5+1 simple routes; transfer CP (case 6) <!-- src: S2 · slide 41 · case 6 -->

- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 3A | 3A | 3 | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 3A | 3A | 0 | 2 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2000 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 3A | 2 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6 · CW31_1A]

![Figure 39 — Test case 6: Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to](../media/relocate-events/fig-39-slide-41-test-case-6-transfer-to-new-line.svg)

### TC-U36 — Transfer to New Line – transfer 0.5+1 simple routes; transfer CP (case 6) <!-- src: S2 · slide 42 · case 6 -->

- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 2A | Red | 200 | 1/1/2020 | null | 0 | 1.25 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 2A_reassign | Teal | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Teal | 200 | 1/1/2020 | null | 0 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 3A | 3A | 3 | 4 | No Error |
| S1 | 1/1/2020 | null | 3A | 3A | 6 | 8 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | null | 2A | 2A | 1 | 1.25 | No Error |
| S2 | 1/1/2020 | null | 2A_reassign | 2A_reassign | 2 | 2.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 2 | No Error |
| S3 | 1/1/2020 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 3A | 0 | 8 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | <Null> | 2A_reassign | 3A | 2.75 | 8 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | <Null> | 1A | 2A | 3 | 1.25 | No Error |
| S7 | 1/1/2020 | <Null> | 2A_reassign | 3A | 2 | 4 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S8 | 1/1/2020 | <Null> | 2A_reassign | 3A | 2 | 8 | No Error |

[figure: After · 1A, 100 · 2A, 200 · 3A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 1 · 3 · 5 · 8 · 6 · 2A_reassign, 100 · 1.25]

![Figure 40 — Test case 6: Transfer to New Line – transfer 0.5+1 simple routes; transfer CP; change measures; partial routes have to](../media/relocate-events/fig-40-slide-42-test-case-6-transfer-to-new-line.svg)

### TC-U37 — Transfer to New Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 43 · case 8 -->

- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2020 | 0 | 4 |
| 2A | Red | 100 | 1/1/2020 | null | 0 | 2 |
| 3A | Red | 200 | 1/1/2020 | null | 0 | 4 |
| Conc1 | Orange | 100 | 1/1/2000 | null | 10 | 15 |
| Conc2 | Orange | 200 | 1/1/2015 | null | 15 | 20 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | <Null> | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2015 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2010 | 1/1/2015 | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2015 | <Null> | 2A | 3A | 1.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S6 | 1/1/2010 | <Null> | 1A | 2A | 2 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2010 | 1A | 1A | 3 | 4 | No Error |
| S7 | 1/1/2010 | 1/1/2015 | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2015 | <Null> | 1A | 3A | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S8 | 1/1/2010 | 1/1/2015 | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2015 | <Null> | 1A | 3A | 2 | 4 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sconc1 | 1/1/2000 | 1/1/2015 | Conc1 | Conc1 | 10 | 15 | No Error |
| Sconc1 | 1/1/2015 | <Null> | Conc1 | Conc2 | 10 | 16 | No Error |
| Sconc2 | 1/1/2015 | <Null> | Conc2 | Conc2 | 17.5 | 20 | No Error |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

| [{"id":19,"retireRoute":{"retireDate":,"routeId":"CW44_2C","toRouteId":"CW44_2C","fromMeasure":0,"toMeasure":2,"recalibrateRouteDownstream":true}}] |
| --- |

[figure: Before · 1A, 100 2000-2020 · 2A, 200 2010-null · 3A, 300 2015-null · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · CW25_1A]

![Figure 41 — Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that](../media/relocate-events/fig-41-slide-43-test-case-8-transfer-to-new-line.svg)

### TC-U38 — Transfer to New Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 44 · case 8 -->

- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that

2A_reassign, 100
2025-null

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2015 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2020 | 0 | 4 |
| 2A | Red | 100 | 1/1/2020 | 1/1/2025 | 0 | 2 |
| 3A | Red | 200 | 1/1/2020 | 1/1/2025 | 0 | 4 |
| 2A | Red | 100 | 1/1/2025 | null | 0 | 1.25 |
| 2A_reassign | Teal | 100 | 1/1/2025 | null | 2 | 3 |
| 3A | Teal | 200 | 1/1/2025 | null | 0 | 4 |
| Conc1 | Orange | 100 | 1/1/2000 | null | 10 | 15 |
| Conc2 | Orange | 200 | 1/1/2015 | null | 15 | 20 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

[figure: After - routes · 1A, 100 2000-2020 · 2A, 100 2025-null · 3A, 200 2025-null · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · 1.25]

![Figure 42 — Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that](../media/relocate-events/fig-42-slide-44-test-case-8-transfer-to-new-line.svg)

### TC-U39 — Transfer to New Line – transfer 1+0.5 simple routes (case 8) <!-- src: S2 · slide 45 · case 8 -->

- **Case:** Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that

2A_reassign, 100
2025-null

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2010 | 1/1/2025 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2025 | <Null> | 2A | 2A | 1 | 1.25 | No Error |
| S2 | 1/1/2025 | <Null> | 2A_reassign | 2A_reassign | 2 | 2.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2015 | 1/1/2025 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2025 | <Null> | 3A | 3A | 0 | 4 | No Error |
| S5 | 1/1/2010 | 1/1/2015 | 2A | 2A | 1.75 | 2 | No Error |
| S5 | 1/1/2015 | 1/1/2025 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2.75 | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S6 | 1/1/2010 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2010 | 1A | 1A | 3 | 4 | No Error |
| S7 | 1/1/2010 | 1/1/2015 | 1A | 2A | 3 | 2 | No Error |
| S7 | 1/1/2015 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | 1/1/2025 | 2A | 3A | 0 | 2 | No Error |
| S7 | 1/1/2025 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S7 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2010 | 1A | 1A | 2 | 4 | No Error |
| S8 | 1/1/2010 | 1/1/2015 | 1A | 2A | 2 | 2 | No Error |
| S8 | 1/1/2015 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | 1/1/2025 | 2A | 3A | 0 | 4 | No Error |
| S8 | 1/1/2025 | <Null> | 2A | 2A | 0 | 1.25 | No Error |
| S8 | 1/1/2025 | <Null> | 2A_reassign | 3A | 2 | 4 | No Error |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sconc1 | 1/1/2000 | 1/1/2015 | Conc1 | Conc1 | 10 | 15 | No Error |
| Sconc1 | 1/1/2015 | <Null> | Conc1 | Conc2 | 10 | 16 | No Error |
| Sconc2 | 1/1/2015 | <Null> | Conc2 | Conc2 | 17.5 | 20 | No Error |

In 2000, create 1A
In 2010, create 2A
In 2015, create 3A and conc1
In 2020, retire1A
In 2025, transfer part 2A & 3A, recal downstream unchecked

[figure: After - Events · 1A, 100 2000-2020 · 2A, 100 2025-null · 3A, 200 2025-null · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · 15 · 20 · Conc2, 200 2015-null · 10 · Conc1, 100 2000-null · 1.25]

![Figure 43 — Test case 8: Transfer to New Line – transfer 1+0.5 simple routes; routes on source line have concurrent routes that](../media/relocate-events/fig-43-slide-45-test-case-8-transfer-to-new-line.svg)

### TC-U40 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 9) <!-- src: S2 · slide 46 · case 9 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing this event for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58_1A]

![Figure 44 — Test case 9: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original](../media/relocate-events/fig-44-slide-46-test-case-9-transfer-to-new-line.svg)

### TC-U41 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 9) <!-- src: S2 · slide 47 · case 9 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Teal | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Teal | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2020 | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |

| S1 | 1/1/2020 | <Null> | 1A | 2 | 2.5 | No Error |
| --- | --- | --- | --- | --- | --- | --- |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2020 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2020 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |

[figure: After · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 45 — Test case 9: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep original](../media/relocate-events/fig-45-slide-47-test-case-9-transfer-to-new-line.svg)

### TC-U42 — b: Transfer to New Line – 2 separate transfers; transfer CP (case 9) <!-- src: S2 · slide 48 · case 9 -->

- **Case:** b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes change

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 5 | 5.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 6 | 8 | No Error |
| S5 | 1/1/2000 | <Null> | 1A | 5.75 | 8 | No Error |
| S6 | 1/1/2000 | <Null> | 1A | 2 | 5.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3 | 6.5 | No Error |
| S8 | 1/1/2000 | <Null> | 1A | 2 | 8 | No Error |

First transfer is 1/1/2020
Second transfer is 1/1/2030
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 7 · 1 &2 · CW55_1A]

![Figure 46 — Test case 9-b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes change](../media/relocate-events/fig-46-slide-48-test-case-9-b-transfer-to-new-line-2.svg)

### TC-U43 — b: Transfer to New Line – 2 separate transfers; transfer CP (case 9) <!-- src: S2 · slide 49 · case 9 -->

- **Case:** b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes change

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 8 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 4 |
| 1A_reassign | Teal | 100 | 1/1/2020 | 1/1/2030 | 4 | 8 |
| 1A_reassign | Teal | 100 | 1/1/2030 | null | 4 | 6 |
| 1A_reassign_reassign | Yellow | 100 | 1/1/2030 | null | 6 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

1A_reassign_reassign, 100

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 1A | 5 | 5.5 | No Error |
| S2 | 1/1/2020 | <Null> | 1A_reassign | 5 | 5.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 1A | 6 | 8 | No Error |
| S4 | 1/1/2020 | 1/1/2030 | 1A_reassign | 6 | 8 | No Error |
| S4 | 1/1/2030 | null | 1A_reassign_reassign | 6 | 8 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 1A | 5.75 | 8 | No Error |
| S5 | 1/1/2020 | 1/1/2030 | 1A_reassign | 5.75 | 8 | No Error |
| S5 | 1/1/2030 | null | 1A_reassign | 5.75 | 6 | No Error |
| S5 | 1/1/2030 | null | 1A_reassign_reassign | 6 | 8 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2 | 5.25 | No Error |
| S6 | 1/1/2020 | null | 1A | 2 | 4 | No Error |
| S6 | 1/1/2020 | <Null> | 1A_reassign | 4 | 5.25 | No Error |
| S7 | 1/1/2000 | <Null> | 1A | 3 | 6.5 | No Error |
| S7 | 1/1/2020 | null | 1A | 3 | 4 | No Error |
| S7 | 1/1/2020 | 1/1/2030 | 1A_reassign | 4 | 6.5 | No Error |
| S7 | 1/1/2030 | null | 1A_reassign | 4 | 6 | No Error |
| S7 | 1/1/2030 | null | 1A_reassign_reassign | 6 | 6.5 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 2 | 8 | No Error |
| S8 | 1/1/2020 | <Null> | 1A | 2 | 4 | No Error |
| S8 | 1/1/2020 | 1/1/2030 | 1A_reassign | 4 | 8 | No Error |
| S8 | 1/1/2030 | null | 1A_reassign | 4 | 6 | No Error |
| S8 | 1/1/2030 | null | 1A_reassign_reassign | 6 | 8 | No Error |

[figure: After · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A_reassign, 100 · 1A, 100 · 7]

![Figure 47 — Test case 9-b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes change](../media/relocate-events/fig-47-slide-49-test-case-9-b-transfer-to-new-line-2.svg)

### TC-U44 — Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 11) <!-- src: S2 · slide 50 · case 11 -->

- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S5a | 1/1/2000 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |
| S6a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S6b | 1/1/2000 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S7b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | <Null> | 3A | 0 | 2 | No Error |
| S8a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S8b | 1/1/2000 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2020
This case has 2 variations for recal downstream option.

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 1C, 100 · 2C, 200 · 1A, 100 · 2A, 200 · 3A, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 7 · 3C, 300 · CW40_1A]

![Figure 48 — Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-48-slide-50-test-case-11-transfer-to-new-line.svg)

### TC-U45 — Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP (case 11) <!-- src: S2 · slide 51 · case 11 -->

- **Case:** Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Red | 200 | 1/1/2020 | null | 2 | 4 |
| 1A_reassign | Teal | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Teal | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5b | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S6a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S8a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S8c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |

[figure: After · 1B, 100 · 2B, 200 · 3B, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Gray line hidden]

![Figure 49 — Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial](../media/relocate-events/fig-49-slide-51-test-case-11-transfer-to-new-line.svg)

### TC-U46 — b: Transfer to New Line – transfer 3 simple routes (case 14) <!-- src: S2 · slide 53 · case 14 -->

- **Case:** b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1a | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S1b | 1/1/2020 | <Null> | 3A | 2 | 4 | No Error |
| S2a | 1/1/2000 | <Null> | 1A | 2.5 | 3.5 | No Error |
| S2b | 1/1/2020 | <Null> | 3A | 1 | 3 | No Error |
| S3a | 1/1/2000 | <Null> | 1A | 3 | 4 | No Error |
| S3b | 1/1/2020 | <Null> | 3A | 0 | 1.2 | No Error |
| S4a | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| S4b | 1/1/2020 | <Null> | 3A | 0 | 4 | No Error |

Effective date is 1/1/2030
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 2000-null · 2A, 200 2010-null · 3A, 300 2020-null · CW22_1A]

![Figure 51 — Test case 14-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not](../media/relocate-events/fig-51-slide-53-test-case-14-b-transfer-to-new-line.svg)

### TC-U47 — b: Transfer to New Line – transfer 3 simple routes (case 14) <!-- src: S2 · slide 54 · case 14 -->

- **Case:** b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2030 | 2 | 4 |
| 2A | Red | 200 | 1/1/2010 | 1/1/2030 | 0 | 2 |
| 3A | Red | 300 | 1/1/2015 | 1/1/2030 | 0 | 4 |
| 1A | Teal | 100 | 1/1/2030 | null | 2 | 4 |
| 2A | Teal | 200 | 1/1/2030 | null | 0 | 2 |
| 3A | Teal | 300 | 1/1/2030 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1a | 1/1/2000 | 1/1/2030 | 1A | 2 | 2.5 | No Error |
| S1b | 1/1/2020 | 1/1/2030 | 3A | 2 | 4 | No Error |
| S2a | 1/1/2000 | 1/1/2030 | 1A | 2.5 | 3.5 | No Error |
| S2b | 1/1/2020 | 1/1/2030 | 3A | 1 | 3 | No Error |
| S3a | 1/1/2000 | 1/1/2030 | 1A | 3 | 4 | No Error |
| S3b | 1/1/2020 | 1/1/2030 | 3A | 0 | 1.2 | No Error |
| S4a | 1/1/2000 | 1/1/2030 | 1A | 2 | 4 | No Error |
| S4b | 1/1/2020 | 1/1/2030 | 3A | 0 | 4 | No Error |

| S1a | 1/1/2030 | <Null> | 1A | 2 | 2.5 | No Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1b | 1/1/2030 | <Null> | 3A | 3 | 4 | No Error |
| S2a | 1/1/2030 | <Null> | 1A | 2.5 | 3.5 | No Error |
| S2b | 1/1/2030 | <Null> | 3A | 1.5 | 3.5 | No Error |
| S3a | 1/1/2030 | <Null> | 1A | 3 | 4 | No Error |
| S3b | 1/1/2030 | <Null> | 3A | 0 | 2 | No Error |
| S4a | 1/1/2030 | <Null> | 1A | 2 | 4 | No Error |
| S4b | 1/1/2030 | <Null> | 3A | 0 | 4 | No Error |

[figure: After · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 2030-null · 2A, 200 2030-null · 3A, 300 2030-null]

![Figure 52 — Test case 14-b: Transfer to New Line – transfer 3 simple routes; routes on source line have multiple time slices; not](../media/relocate-events/fig-52-slide-54-test-case-14-b-transfer-to-new-line.svg)

### TC-U48 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 15) <!-- src: S2 · slide 55 · case 15 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing these events for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2000 | <Null> | 1A | 2.5 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 | No Error |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star_blue | 1/1/2000 | <Null> | 2B | 6.5 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 2A, 200 · 3A, 300 · CW58_1A]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 53 — Test case 15: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-53-slide-55-test-case-15-transfer-to-new-line.svg)

### TC-U49 — Transfer to New Line – transfer 3 entire simple routes; transfer CP (case 15) <!-- src: S2 · slide 56 · case 15 -->

- **Case:** Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 1A | Teal | 100 | 1/1/2020 | null | 2 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A | Teal | 300 | 1/1/2020 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S_blue | 1/1/2000 | <Null> | 1B | 2B | 4 | 5 | No Error |

Showing these events for once to indicate events on other lines will not be affected

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | 1/1/2020 | 3A | 2 | No Error |
| Star2 | 1/1/2000 | 1/1/2020 | 1A | 2 | No Error |
| Star3 | 1/1/2000 | 1/1/2020 | 1A | 2.5 | No Error |
| Star4 | 1/1/2000 | 1/1/2020 | 2A | 0 | No Error |
| Star5 | 1/1/2000 | 1/1/2020 | 2A | 2 | No Error |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star_blue | 1/1/2000 | <Null> | 2B | 6.5 | No Error |

| Star1 | 1/1/2020 | <Null> | 3A | 2 | No Error |
| --- | --- | --- | --- | --- | --- |
| Star2 | 1/1/2020 | <Null> | 1A | 2 | No Error |
| Star3 | 1/1/2020 | <Null> | 1A | 2.5 | No Error |
| Star4 | 1/1/2020 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2020 | <Null> | 2A | 2 | No Error |

[figure: After · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 3A, 300]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 54 — Test case 15: Transfer to New Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-54-slide-56-test-case-15-transfer-to-new-line.svg)

### TC-U50 — Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP (case 17) <!-- src: S2 · slide 57 · case 17 -->

- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial routes

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | null | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | null | 0 | 4 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | <Null> | 3A | 2 | No Error |
| Star2 | 1/1/2000 | <Null> | 2A | 1.25 | No Error |
| Star3 | 1/1/2000 | <Null> | 2A | 1.4375 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | <Null> | 2A | 2 | No Error |

Effective date is 1/1/2020
Recal downstream unchecked

[figure: Before · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6 · CW16_1A · 1.25]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 55 — Test case 17: Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial routes](../media/relocate-events/fig-55-slide-57-test-case-17-transfer-to-new-line.svg)

### TC-U51 — Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP (case 17) <!-- src: S2 · slide 58 · case 17 -->

- **Case:** Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial routes

| Event ID | From Date | To Date | Route ID | Measure | Location Error |
| --- | --- | --- | --- | --- | --- |
| Star1 | 1/1/2000 | 1/1/2020 | 3A | 2 | No Error |
| Star1 | 1/1/2020 | <Null> | 3A | 4 | No Error |
| Star2 | 1/1/2000 | 1/1/2020 | 2A | 1.25 | No Error |
| Star2 | 1/1/2020 | <Null> | 2A_reassign | 2 | No Error |
| Star3 | 1/1/2000 | 1/1/2020 | 2A | 1.4375 | No Error |
| Star3 | 1/1/2020 | <Null> | 2A_reassign | 2.25 | No Error |
| Star4 | 1/1/2000 | <Null> | 2A | 0 | No Error |
| Star5 | 1/1/2000 | 1/1/2020 | 2A | 2 | No Error |
| Star5 | 1/1/2020 | <Null> | 2A_reassign | 3 | No Error |

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | null | 2 | 4 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 2A | Red | 200 | 1/1/2020 | null | 0 | 1.25 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 2A_reassign | Teal | 100 | 1/1/2020 | null | 2 | 3 |
| 3A | Teal | 200 | 1/1/2020 | null | 0 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

[figure: After · 1A, 100 · 2A, 200 · 3A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6 · 2A_reassign, 100 · 1.25]

![Figure 23 — Test case 15: Transfer to Existing Line – transfer 3 entire simple routes; transfer CP; keep original measures; keep](../media/relocate-events/fig-23-slide-25-test-case-15-transfer-to-existing-line.png)

![Figure 56 — Test case 17: Transfer to New Line – transfer 0.5+1 simple routes; not transfer CP; change measures; partial routes](../media/relocate-events/fig-56-slide-58-test-case-17-transfer-to-new-line.svg)

### TC-U52 — Transfer To an Existing Line – Spanning Events – Stayput and Retire Behavior. (case 1) <!-- src: S1 · slide 60 · case 1 -->

Reassign all the routes in a line to another line transferring routes and measures. ; keep original measures; keep original route name.

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1.5 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 1 | No Error |
| S5 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A | L2 | 100 | 1/1/2023 | <Null> | 2 | 4 |
| 1B | L2 | 200 | 1/1/2023 | <Null> | 0 | 2 |
| 1C | L2 | 300 | 1/1/2023 | <Null> | 0 | 4 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1.5 | 1C | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 1 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 2A; 400 · 2B; 500 · 2C; 600]

![Figure 57 — 60](../media/relocate-events/fig-57-slide-60-60.svg)

### TC-U53 — Transfer To an Existing Line – Spanning Events – Stayput and Retire Behavior. (case 2) <!-- src: S1 · slide 61 · case 2 -->

Reassign all the routes in a line to another line on right, transferring routes. Measures changed. Route Name changed.

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1.5 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 1 | No Error |
| S5 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1.5 | 1C | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 1 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A_New | L2 | 100 | 1/1/2023 | <Null> | 5 | 8 |
| 1B_New | L2 | 200 | 1/1/2023 | <Null> | 2 | 4 |
| 1C_New | L2 | 300 | 1/1/2023 | <Null> | 5 | 9 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1A_New; 100 · 1B_New 200 · 1C_New; 300 · 2A; 400 · 2B; 500 · 2C; 600 · 9]

![Figure 58 — 61](../media/relocate-events/fig-58-slide-61-61.svg)

### TC-U54 — Transfer To an Existing Line – Spanning Events – Stayput Behavior (case 5-1) <!-- src: S1 · slide 62 · case 5-1 -->

Reassign 1 entire route  and a partial route  in a line to another line transferring routes and measures. ; Keep the same name for the
entire route and partial route (name of a retired route from the line to which route is reassigned), Change measures

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1B | L1 | 200 | 1/1/2023 | <Null> | 0 | 1 |
| 1R1 | L2 | 100 | 1/1/2023 | <Null> | 0 | 1 |
| 1C | L2 | 200 | 1/1/2023 | <Null> | 4 | 6 |
| 2A | L2 | 300 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 400 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 500 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S1 | 1/1/2023 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 2 | No Error |
| S4 | 1/1/2023 | <Null> | 1A | 3 | 1B | 1 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 4 · 0 · 1 · 6 · 3 · 5 · 8 · 2 · 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output · 1C; 200 · 2A; 300 · 2B; 400 · 2C; 500 · 1R1; 100]

![Figure 59 — 62](../media/relocate-events/fig-59-slide-62-62.svg)

### TC-U55 — Transfer To an Existing Line – Spanning Events – Retire Behavior (case 5-2) <!-- src: S1 · slide 63 · case 5-2 -->

Reassign 1 entire route  and a partial route  in a line to another line transferring routes and measures. ; Keep the same name for the
Entire route and partial route (name of a retired route from the line to which route is reassigned). Change measures

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1B | L1 | 200 | 1/1/2023 | <Null> | 0 | 1 |
| 1R1 | L2 | 100 | 1/1/2023 | <Null> | 0 | 1 |
| 1C | L2 | 200 | 1/1/2023 | <Null> | 4 | 6 |
| 2A | L2 | 300 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 400 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 500 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 4 · 0 · 1 · 6 · 3 · 5 · 8 · 2 · 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output · 1C; 200 · 2A; 300 · 2B; 400 · 2C; 500 · 1R1; 100]

![Figure 60 — 63](../media/relocate-events/fig-60-slide-63-63.svg)

### TC-U56 — Transfer To an Existing Line (case 8) <!-- src: S1 · slide 64 · case 8 -->

- **Case:** Transfer to an existing line – spanning Events only Routes and Route Table shown here - StayPut

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route name and measure maintained. Rest all name and measure are changed. Recalibrate source downstream. Calibrate set to Stayput

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 4 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 5 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 1 |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A | L1 | 100 | 1/1/2023 | <Null> | 2 | 3 |
| 1C | L1 | 200 | 1/1/2023 | <Null> | 0 | 2 |
| 1A_New | L2 | 100 | 1/1/2023 | <Null> | 1 | 2 |
| 1B | L2 | 200 | 1/1/2023 | <Null> | 0 | 2 |
| 1C_New | L2 | 300 | 1/1/2023 | <Null> | 5 | 6 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 4 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 5 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 1 |

| Effective Date | 1/1/2023 |
| --- | --- |
| Source RD | Yes |

[figure: 1A; 100 · 1B; 200 · 1C; 200 · 2A; 400 · 2B; 500 · 2C; 600 · 1A_New; 100 · 1C_New; 300 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output]

![Figure 61 — 64](../media/relocate-events/fig-61-slide-64-64.svg)

### TC-U57 — Transfer To an Existing Line – Spanning Events – Stayput Behavior (case 8-1) <!-- src: S1 · slide 65 · case 8-1 -->

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route names and measures maintained. Rest all name and measure are changed. Recalibrate source downstream. Calibrate set to stayput

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1C | 3 | 1C | 4 | No Error |
| S7 | 1/1/2000 | <Null> | 1C | 1 | 1C | 3 | No Error |
| S8 | 1/1/2000 | <Null> | 1C | 0 | 1C | 1 | No Error |
| S9 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |
| S10 | 1/1/2000 | <Null> | 1A | 2 | 1A | 2.5 | No Error |
| S11 | 1/1/2000 | <Null> | 1A | 2.5 | 1A | 3.5 | No Error |
| S12 | 1/1/2000 | <Null> | 1A | 3.5 | 1A | 4 | No Error |
|  |  |  |  |  |  |  |  |
| E1 | 1/1/2000 | <Null> | 2A | 4 | 2C | 1 | No Error |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S1 | 1/1/2023 | <Null> | 1A | 2 | 1A | 3 | No Error |
| S1 | 1/1/2023 | <Null> | 1C | 0 | 1C | 2 | No Error |
| S2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1B | 1 | No Error |
| S2 | 1/1/2023 | <Null> | 1A | 2 | 1A | 3 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1 | 1C | 4 | No Error |
| S3 | 1/1/2023 | <Null> | 1C | 0 | 1C | 2 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 4 | No Error |
| S5 | 1/1/2023 | <Null> | 1C | 0 | 1C | 2 | No Error |
| S6 | 1/1/2000 | 1/1/2023 | 1C | 3 | 1C | 4 | No Error |
| S6 | 1/1/2023 | <Null> | 1C | 1 | 1C | 2 | No Error |
| S7 | 1/1/2000 | 1/1/2023 | 1C | 1 | 1C | 3 | No Error |
| S7 | 1/1/2023 | <Null> | 1C | 0 | 1C | 1 | No Error |
| S8 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 1 | No Error |
| S9 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |
| S10 | 1/1/2000 | <Null> | 1A | 2 | 1A | 2.5 | No Error |
| S11 | 1/1/2000 | 1/1/2023 | 1A | 2.5 | 1A | 3.5 | No Error |
| S11 | 1/1/2023 | <Null> | 1A | 2.5 | 1A | 3 | No Error |
| S12 | 1/1/2000 | 1/1/2023 | 1A | 3.5 | 1A | 4 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |
| Source RD | Yes |

[figure: 1A; 100 · 1B; 200 · 1C; 200 · 2A; 400 · 2B; 500 · 2C; 600 · 1A_New; 100 · 1C_New; 300 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output · Not affected]

![Figure 62 — 65](../media/relocate-events/fig-62-slide-65-65.svg)

### TC-U58 — Transfer To an Existing Line – Spanning Events – Retire Behavior (case 8-2) <!-- src: S1 · slide 66 · case 8-2 -->

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route names and measures maintained. Rest all name and measure are changed. Recalibrate source downstream. Calibrate set to retire

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |
| S6 | 1/1/2000 | <Null> | 1C | 3 | 1C | 4 | No Error |
| S7 | 1/1/2000 | <Null> | 1C | 1 | 1C | 3 | No Error |
| S8 | 1/1/2000 | <Null> | 1C | 0 | 1C | 1 | No Error |
| S9 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |
| S10 | 1/1/2000 | <Null> | 1A | 2 | 1A | 2.5 | No Error |
| S11 | 1/1/2000 | <Null> | 1A | 2.5 | 1A | 3.5 | No Error |
| S12 | 1/1/2000 | <Null> | 1A | 3.5 | 1A | 4 | No Error |
|  |  |  |  |  |  |  |  |
| E1 | 1/1/2000 | <Null> | 2A | 4 | 2C | 1 | No Error |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | 1/1/2023 | 1B | 1 | 1C | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2023 | 1A | 3 | 1C | 2 | No Error |
| S5 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 4 | No Error |
| S6 | 1/1/2000 | 1/1/2023 | 1C | 3 | 1C | 4 | No Error |
| S7 | 1/1/2000 | 1/1/2023 | 1C | 1 | 1C | 3 | No Error |
| S8 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 1 | No Error |
| S9 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |
| S10 | 1/1/2000 | <Null> | 1A | 2 | 1C | 2.5 | No Error |
| S11 | 1/1/2000 | 1/1/2023 | 1A | 2.5 | 1C | 3.5 | No Error |
| S12 | 1/1/2000 | 1/1/2023 | 1A | 3.5 | 1C | 4 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |
| Source RD | Yes |

[figure: 1A_New; 100 · 1B; 200 · 1C_New; 300 · 2A; 400 · 2B;500 · 2C; 600 · 2 · 1A; 100 · 1C; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output · Not affected]

![Figure 63 — 66](../media/relocate-events/fig-63-slide-66-66.svg)

### TC-U59 — Transfer To an Existing Line – Non-Spanning Events – Stayput and Retire Behavior <!-- src: S1 · slide 67 · case 14 -->

Reassign all the routes in a line to another line transferring routes and measures. ; keep original measures; keep original route name

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 1A | 4 | No Error |
| N2 | 1/1/2000 | <Null> | 1A | 2 | 1A | 3 | No Error |
| N3 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |
| N4 | 1/1/2000 | <Null> | 1B | 0.5 | 1B | 1.5 | No Error |
| N5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |
| N6 | 1/1/2000 | <Null> | 1C | 0 | 1C | 2 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A | L2 | 100 | 1/1/2023 | <Null> | 2 | 4 |
| 1B | L2 | 200 | 1/1/2023 | <Null> | 0 | 2 |
| 1C | L2 | 300 | 1/1/2023 | <Null> | 0 | 4 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1A | 4 | No Error |
| N2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1A | 3 | No Error |
| N3 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |
| N4 | 1/1/2000 | 1/1/2023 | 1B | 0.5 | 1B | 1.5 | No Error |
| N5 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 4 | No Error |
| N6 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 2 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 2A; 400 · 2B; 500 · 2C; 600]

![Figure 64 — 67](../media/relocate-events/fig-64-slide-67-67.svg)

### TC-U60 — Transfer To an Existing Line – NonSpanning Events – Stayput and Retire Behavior <!-- src: S1 · slide 68 · case 15 -->

Reassign all the routes in a line to another line on right, transferring routes. Measures changed. Route Name changed.

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 1A | 4 | No Error |
| N2 | 1/1/2000 | <Null> | 1A | 2 | 1A | 3 | No Error |
| N3 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |
| N4 | 1/1/2000 | <Null> | 1B | 0.5 | 1B | 1.5 | No Error |
| N5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |
| N6 | 1/1/2000 | <Null> | 1C | 0 | 1C | 2 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A_New | L2 | 100 | 1/1/2023 | <Null> | 5 | 8 |
| 1B_New | L2 | 200 | 1/1/2023 | <Null> | 2 | 4 |
| 1C_New | L2 | 300 | 1/1/2023 | <Null> | 4 | 9 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1A | 4 | No Error |
| N2 | 1/1/2000 | 1/1/2023 | 1A | 2 | 1A | 3 | No Error |
| N3 | 1/1/2000 | 1/1/2023 | 1B | 0 | 1B | 2 | No Error |
| N4 | 1/1/2000 | 1/1/2023 | 1B | 0.5 | 1B | 1.5 | No Error |
| N5 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 4 | No Error |
| N6 | 1/1/2000 | 1/1/2023 | 1C | 0 | 1C | 2 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1A_new; 100 · 1B_New 200 · 1C_New; 300 · 2A; 400 · 2B; 500 · 2C; 600 · 9]

![Figure 65 — 68](../media/relocate-events/fig-65-slide-68-68.svg)

### TC-U61 — Transfer To an Existing Line – Non-spanning Events – Stayput Behavior <!-- src: S1 · slide 69 · case 18-1 -->

Reassign 1 entire route  and a partial route  in a line to another line transferring routes and measures. ; Keep the same name for the
entire route and partial route (name of a retired route from the line to which route is reassigned), Change measures

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1B | L1 | 200 | 1/1/2023 | <Null> | 0 | 1 |
| 1R1 | L2 | 100 | 1/1/2023 | <Null> | 0 | 1 |
| 1C | L2 | 200 | 1/1/2023 | <Null> | 4 | 6 |
| 2A | L2 | 300 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 400 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 500 | 1/1/2023 | <Null> | 0 | 2 |

| Effective Date | 1/1/2023 |
| --- | --- |

| Event ID | From Date | To Date | From Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| N2 | 1/1/2000 | <Null> | 1B | 0 | 2 | No Error |
| N3 | 1/1/2000 | <Null>. | 1C | 2 | 4 | No Error |
| N4 | 1/1/2000 | <Null> | 1B | 0.5 | 1.5 | No Error |
| N5 | 1/1/2000 | <Null> | 1B | 1.5 | 2 | No Error |
| N6 | 1/1/2000 | <Null> | 1B | 0 | 0.5 | No Error |
| N7 | 1/1/2000 | <Null> | 1C | 2 | 4 | No Error |
| N8 | 1/1/2000 | <Null> | 1C | 0 | 4 | No Error |
| N9 | 1/1/2000 | <Null> | 1C | 0 | 2 | No Error |

| Event ID | From Date | To Date | From Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| N2 | 1/1/2000 | 1/1/2023 | 1B | 0 | 2 | No Error |
| N2 | 1/1/2023 | <Null> | 1B | 0 |  | No Error |
| N3 | 1/1/2000 | 1/1/2023 | 1C | 2 | 4 | No Error |
| N4 | 1/1/2000 | 1/1/2023 | 1B | 0.5 | 1.5 | No Error |
| N4 | 1/1/2023 | <Null> | 1B | 0.5 | 1 | NO Error |
| N5 | 1/1/2000 | 1/1/2023 | 1B | 1.5 | 2 | No Error |
| N6 | 1/1/2000 | <Null> | 1B | 0 | 0.5 | No Error |
| N7 | 1/1/2000 | 1/1/2023 | 1C | 2 | 4 | No Error |
| N8 | 1/1/2000 | 1/1/2023 | 1C | 0 | 4 | No Error |
| N9 | 1/1/2000 | 1/1/2023 | 1C | 0 | 2 | No Error |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1C; 200 · 2A; 300 · 2B; 400 · 2C; 500 · 1R1; 100]

![Figure 66 — 69](../media/relocate-events/fig-66-slide-69-69.png)

![Figure 67 — 69](../media/relocate-events/fig-67-slide-69-69.svg)

### TC-U62 — Transfer To an Existing Line – Non-spanning Events – Retire Behavior <!-- src: S1 · slide 70 · case 18-2 -->

Reassign 1 entire route  and a partial route  in a line to another line transferring routes and measures. ; Keep the same name for the
entire route and partial route (name of a retired route from the line to which route is reassigned), Change measures

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1B | L1 | 200 | 1/1/2023 | <Null> | 0 | 1 |
| 1R1 | L2 | 100 | 1/1/2023 | <Null> | 0 | 1 |
| 1C | L2 | 200 | 1/1/2023 | <Null> | 4 | 6 |
| 2A | L2 | 300 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 400 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 500 | 1/1/2023 | <Null> | 0 | 2 |

| Effective Date | 1/1/2023 |
| --- | --- |

| Event ID | From Date | To Date | From Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| N2 | 1/1/2000 | <Null> | 1B | 0 | 2 | No Error |
| N3 | 1/1/2000 | <Null>. | 1C | 2 | 4 | No Error |
| N4 | 1/1/2000 | <Null> | 1B | 0.5 | 1.5 | No Error |
| N5 | 1/1/2000 | <Null> | 1B | 1.5 | 2 | No Error |
| N6 | 1/1/2000 | <Null> | 1B | 0 | 0.5 | No Error |
| N7 | 1/1/2000 | <Null> | 1C | 2 | 4 | No Error |
| N8 | 1/1/2000 | <Null> | 1C | 0 | 4 | No Error |
| N9 | 1/1/2000 | <Null> | 1C | 0 | 2 | No Error |

| Event ID | From Date | To Date | From Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 4 | No Error |
| N2 | 1/1/2000 | 1/1/2023 | 1B | 0 | 2 | No Error |
| N3 | 1/1/2000 | 1/1/2023 | 1C | 2 | 4 | No Error |
| N4 | 1/1/2000 | 1/1/2023 | 1B | 0.5 | 1.5 | No Error |
| N5 | 1/1/2000 | 1/1/2023 | 1B | 1.5 | 2 | No Error |
| N6 | 1/1/2000 | <Null> | 1B | 0 | 0.5 | No Error |
| N7 | 1/1/2000 | 1/1/2023 | 1C | 2 | 4 | No Error |
| N8 | 1/1/2000 | 1/1/2023 | 1C | 0 | 4 | No Error |
| N9 | 1/1/2000 | 1/1/2023 | 1C | 0 | 2 | No Error |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1C; 200 · 2A; 300 · 2B; 400 · 2C; 500 · 1R1; 100]

![Figure 68 — 70](../media/relocate-events/fig-68-slide-70-70.png)

![Figure 69 — 70](../media/relocate-events/fig-69-slide-70-70.svg)

### TC-U63 — Transfer To an Existing Line – Spanning Events – Stayput & Retire <!-- src: S1 · slide 71 · case 3-2 -->

- **Case:** Transfer to an existing line – spanning Events – Stayput & Retire – irrespective of behavior

Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as source route’s From Date. Change Measures; keep original route name

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 1C | 4 | No Error |
| S2 | 1/1/2000 | <Null> | 1A | 2 | 1B | 1 | No Error |
| S3 | 1/1/2000 | <Null> | 1B | 1.5 | 1C | 4 | No Error |
| S4 | 1/1/2000 | <Null> | 1A | 3 | 1C | 1 | No Error |
| S5 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |

| Effective Date | 1/1/2000 |
| --- | --- |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L2 | 100 | 1/1/2000 | <Null> | 5 | 8 |
| 1B | L2 | 200 | 1/1/2000 | <Null> | 2 | 4 |
| 1C | L2 | 300 | 1/1/2000 | <Null> | 5 | 9 |
| 2A | L2 | 400 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Events get deleted as the from date and to date are same. An enhancement is logged to add a log file to the Apply event behaviors tool to output the list of the events deleted |  |  |  |  |  |  |
| S2 |  |  |  |  |  |  |  |
| S3 |  |  |  |  |  |  |  |
| S4 |  |  |  |  |  |  |  |
| S5 |  |  |  |  |  |  |  |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 2A; 400 · 2B; 500 · 2C; 600]

![Figure 70 — 71](../media/relocate-events/fig-70-slide-71-71.png)

![Figure 71 — 71](../media/relocate-events/fig-71-slide-71-71.svg)

### TC-U64 — Transfer To an Existing Line – Non Spanning Events <!-- src: S1 · slide 72 · case 16-4 -->

- **Case:** Transfer to an existing line – Non spanning Events – StayPut and Retire Behavior.

Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as source route’s From Date. Keep original route name , changing only the from measure on the first route , only the To Measure of the last route

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Effective Date | 1/1/2000 |
| --- | --- |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L2 | 100 | 1/1/2000 | <Null> | 1 | 4 |
| 1B | L2 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L2 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 400 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | To Route ID | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | 1/1/2000 | <Null> | 1A | 2 | 1A | 4 | No Error |
| N3 | 1/1/2000 | <Null> | 1B | 0 | 1B | 2 | No Error |
| N5 | 1/1/2000 | <Null> | 1C | 0 | 1C | 4 | No Error |

Completed. Events are deleted

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · Input · Output]

![Figure 72 — 72](../media/relocate-events/fig-72-slide-72-72.png)

![Figure 73 — 72](../media/relocate-events/fig-73-slide-72-72.svg)

### TC-U65 — Transfer To an Existing Line – Point Events – Stayput and Retire Behavior (case 27) <!-- src: S1 · slide 73 · case 27 -->

Reassign all the routes in a line to another line transferring routes and measures ; keep original measures; keep original route name

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | Location Error |
| --- | --- | --- | --- | --- | --- |
| 1 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| 2 | 1/1/2000 | <Null> | 1B | 1 | No Error |
| 3 | 1/1/2000 | <Null> | 1C | 1 | No Error |
| 4 | 1/1/2000 | <Null> | 1C | 4 | No Error |
| 5 | 1/1/2000 | <Null> | 1A | 4 | No Error |
| 6 | 1/1/2000 | <Null> | 1B | 0 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A | L2 | 100 | 1/1/2023 | <Null> | 2 | 4 |
| 1B | L2 | 200 | 1/1/2023 | <Null> | 0 | 2 |
| 1C | L2 | 300 | 1/1/2023 | <Null> | 0 | 4 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | Location Error |
| --- | --- | --- | --- | --- | --- |
| 1 | 1/1/2000 | 1/1/2023 | 1A | 2 | No Error |
| 2 | 1/1/2000 | 1/1/2023 | 1B | 1 | No Error |
| 3 | 1/1/2000 | 1/1/2023 | 1C | 1 | No Error |
| 4 | 1/1/2000 | 1/1/2023 | 1C | 4 | No Error |
| 4 | 1/1/2000 | 1/1/2023 | 1A | 4 | No Error |
| 5 | 1/1/2000 | 1/1/2023 | 1B | 0 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1 · 2A; 400 · 2B; 500 · 2C; 600]

![Figure 74 — 73](../media/relocate-events/fig-74-slide-73-73.png)

![Figure 75 — 73](../media/relocate-events/fig-75-slide-73-73.svg)

### TC-U66 — Transfer To an Existing Line – Point Events – Stayput and Retire Behavior (case 28) <!-- src: S1 · slide 74 · case 28 -->

Reassign all the routes in a line to another line on right, transferring routes. Measures changed. Route Name changed.

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | <Null> | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | <Null> | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | <Null> | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | <Null> | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | <Null> | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | Location Error |
| --- | --- | --- | --- | --- | --- |
| 1 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| 2 | 1/1/2000 | <Null> | 1B | 1 | No Error |
| 3 | 1/1/2000 | <Null> | 1C | 1 | No Error |
| 4 | 1/1/2000 | <Null> | 1C | 4 | No Error |

| Route Name | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 100 | 1/1/2000 | 1/1/2023 | 2 | 4 |
| 1B | L1 | 200 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1C | L1 | 300 | 1/1/2000 | 1/1/2023 | 0 | 4 |
| 2A | L2 | 100 | 1/1/2000 | 1/1/2023 | 3 | 5 |
| 2B | L2 | 200 | 1/1/2000 | 1/1/2023 | 4 | 8 |
| 2C | L2 | 300 | 1/1/2000 | 1/1/2023 | 0 | 2 |
| 1A_New | L2 | 100 | 1/1/2023 | <Null> | 5 | 8 |
| 1B_New | L2 | 200 | 1/1/2023 | <Null> | 2 | 4 |
| 1C_New | L2 | 300 | 1/1/2023 | <Null> | 4 | 9 |
| 2A | L2 | 400 | 1/1/2023 | <Null> | 3 | 5 |
| 2B | L2 | 500 | 1/1/2023 | <Null> | 4 | 8 |
| 2C | L2 | 600 | 1/1/2023 | <Null> | 0 | 2 |

| Event ID | From Date | To Date | From Route ID | From M | Location Error |
| --- | --- | --- | --- | --- | --- |
| 1 | 1/1/2000 | 1/1/2023 | 1A | 2 | No Error |
| 2 | 1/1/2000 | 1/1/2023 | 1B | 1 | No Error |
| 3 | 1/1/2000 | 1/1/2023 | 1C | 1 | No Error |
| 4 | 1/1/2000 | 1/1/2023 | 1C | 4 | No Error |

| Effective Date | 1/1/2023 |
| --- | --- |

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 2A, 100 · 2B, 200 · 2C, 300 · 4 · 3 · 5 · 8 · 0 · 2 · Input · Output · 1 · 1A_new; 100 · 1B_New 200 · 1C_New; 300 · 2A; 400 · 2B; 500 · 2C; 600 · 9]

![Figure 74 — 73](../media/relocate-events/fig-74-slide-73-73.png)

![Figure 76 — 74](../media/relocate-events/fig-76-slide-74-74.svg)

### TC-U67 — Transfer To an Existing Line – Point Events – Stayput Behavior <!-- src: S1 · slide 75 · case 35-1 -->

Transfer partial route (1/2 of a route) in a line to adjacent upstream existing line , recalibrate source route downstream ,calibrate set to stayput, route name changed , no measure change for the reassigned route portion

| Event ID | From Date | To Date | From Route ID | From M | Location Error |
| --- | --- | --- | --- | --- | --- |
| 1 | 1/1/2000 | <Null> | 1A | 2 | No Error |
| 2 | 1/1/2000 | <Null> | 1A | 2.5 | No Error |
| 3 | 1/1/2000 | <Null> | 1A | 3 | No Error |
| 4 | 1/1/2000 | <Null> | 1A | 3.5 | No Error |
| 5 | 1/1/2000 | <Null> | 1B | 1 | No Error |
| 6 | 1/1/2000 | <Null> | 1C | 2 | No Error |

{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
0A
L0
100
1/1/2000
<Null>
3
5
1A
L1
100
1/1/2000
<Null>
2
4
1B
L1
200
1/1/2000
<Null>
0
2
1C
L1
300
1/1/2000
<Null>
0
4
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
0A
L0
100
1/1/2000
<Null>
3
5
1A_New
L0
200
1/1/2023
<Null>
2
3
1A
L1
100
1/1/2023
<Null>
0
1
1A
L1
100
1/1/2000
1/1/2023
2
4
1B
L1
200
1/1/2000
1/1/2023
0
2
1C
L1
300
1/1/2000
1/1/2023
0
4
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
1/1/2023
1A
2
No Error
2
1/1/2000
1/1/2023
1A
2.5
No Error
3
1/1/2000
1/1/2023
1A
3
No Error
4
1/1/2000
1/1/2023
1A
3.5
No Error
4
1/1/2023
<Null>
1A
1.5
No Error
5
1/1/2000
<Null>
1B
1
No Error
6
1/1/2000
<Null>
1C
2
No Error
{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}Effective Date
1/1/2023
Source RD
Yes

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 0A, 100 · 4 · 0 · 2 · 0–2 · 3 · 5 · 6 · Input · Output · 1 · 1A_New; 200]

![Figure 77 — 75](../media/relocate-events/fig-77-slide-75-75.png)
![Figure 78 — 75](../media/relocate-events/fig-78-slide-75-75.png)

![Figure 79 — 75](../media/relocate-events/fig-79-slide-75-75.svg)

### TC-U68 — Transfer To an Existing Line – Point Events – Retire Behavior <!-- src: S1 · slide 76 · case 35-2 -->

Transfer partial route (1/2 of a route) in a line to adjacent upstream existing line , recalibrate source route downstream, calibrate set to retire, route name changed , no measure change for the reassigned route portion
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
<Null>
1A
2
No Error
2
1/1/2000
<Null>
1A
2.5
No Error
3
1/1/2000
<Null>
1A
3
No Error
4
1/1/2000
<Null>
1A
3.5
No Error
5
1/1/2000
<Null>
1B
1
No Error
6
1/1/2000
<Null>
1C
2
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
0A
L0
100
1/1/2000
<Null>
3
5
1A
L1
100
1/1/2000
<Null>
2
4
1B
L1
200
1/1/2000
<Null>
0
2
1C
L1
300
1/1/2000
<Null>
0
4
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
0A
L0
100
1/1/2000
<Null>
3
5
1A_New
L0
200
1/1/2023
<Null>
2
3
1A
L1
100
1/1/2023
<Null>
0
1
1A
L1
100
1/1/2000
1/1/2023
2
4
1B
L1
200
1/1/2000
1/1/2023
0
2
1C
L1
300
1/1/2000
1/1/2023
0
4
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
1/1/2023
1A
2
No Error
2
1/1/2000
1/1/2023
1A
2.5
No Error
3
1/1/2000
1/1/2023
1A
3
No Error
4
1/1/2000
1/1/2023
1A
3.5
No Error
4
1/1/2023
<Null>
1A
2.5
No Error
5
1/1/2000
<Null>
1B
1
No Error
6
1/1/2000
<Null>
1C
2
No Error
{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}Effective Date
1/1/2023
Source RD
Yes

[figure: 1A; 100 · 1B; 200 · 1C; 300 · 0A, 100 · 4 · 0 · 2 · 0–2 · 3 · 5 · 6 · Input · Output · 1]

![Figure 77 — 75](../media/relocate-events/fig-77-slide-75-75.png)
![Figure 78 — 75](../media/relocate-events/fig-78-slide-75-75.png)

![Figure 80 — 76](../media/relocate-events/fig-80-slide-76-76.svg)

### TC-U69 — Transfer To an Existing Line (case 38) <!-- src: S1 · slide 77 · case 38 -->

- **Case:** Transfer to an existing line – Point Events only Routes and Route Table shown -Stayput

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route name and measure maintained. Rest all name and measure are changed. Do not Recalibrate source downstream.
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
1A
L1
100
1/1/2000
<Null>
2
4
1B
L1
200
1/1/2000
<Null>
0
2
1C
L1
300
1/1/2000
<Null>
0
4
2A
L2
100
1/1/2000
<Null>
4
5
2B
L2
200
1/1/2000
<Null>
5
8
2C
L2
300
1/1/2000
<Null>
0
1
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
1A
L1
100
1/1/2000
1/1/2023
2
4
1B
L1
200
1/1/2000
1/1/2023
0
2
1C
L1
300
1/1/2000
1/1/2023
0
4
2A
L2
100
1/1/2000
1/1/2023
3
5
2B
L2
200
1/1/2000
1/1/2023
4
8
2C
L2
300
1/1/2000
1/1/2023
0
2
1A
L1
100
1/1/2023
<Null>
2
3
1C
L1
200
1/1/2023
<Null>
2
4
1A_New
L2
100
1/1/2023
<Null>
1
2
1B
L2
200
1/1/2023
<Null>
0
2
1C_New
L2
300
1/1/2023
<Null>
5
6
2A
L2
400
1/1/2023
<Null>
4
5
2B
L2
500
1/1/2023
<Null>
5
8
2C
L2
600
1/1/2023
<Null>
0
1
{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}Effective Date
1/1/2023
Source RD
No

[figure: Output · 1B; 200 · 2 · 3 · 7 · 5 · 8 · 9 · 2A, 100 · 1A; 100 · 1C; 300 · 2B, 200 · 2C, 300 · 4 · 6 · 10 · 1 · Input · 2A; 400 · 2B; 500 · 2C; 600 · 1A_New; 100 · 1C_New; 300 · 1C; 200]

![Figure 81 — 77](../media/relocate-events/fig-81-slide-77-77.png)
![Figure 82 — 77](../media/relocate-events/fig-82-slide-77-77.png)

![Figure 83 — 77](../media/relocate-events/fig-83-slide-77-77.svg)

### TC-U70 — Transfer To an Existing Line – Point Events - Stayput <!-- src: S1 · slide 78 · case 38-1 -->

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route name and measure maintained. Rest all name and measure are changed. Do not Recalibrate source downstream.
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
<Null>
1A
2
No Error
2
1/1/2000
<Null>
1A
2.5
No Error
3
1/1/2000
<Null>
1A
3
No Error
4
1/1/2000
<Null>
1A
4
No Error
5
1/1/2000
<Null>
1B
1
No Error
6
1/1/2000
<Null>
1B
2
No Error
7
1/1/2000
<Null>
1C
1
No Error
8
1/1/2000
<Null>
1C
2
No Error
9
1/1/2000
<Null>
1C
3
No Error
10
1/1/2000
<Null>
1C
4
No Error

1
1/1/2000
<Null>
2A
4.5
No Error
2
1/1/2000
<Null>
2A
5
No Error
{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}Effective Date
1/1/2023
Source RD
No
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
<Null>
1A
2
No Error
2
1/1/2000
<Null>
1A
2.5
No Error
3
1/1/2000
1/1/2023
1A
3
No Error
4
1/1/2000
1/1/2023
1A
4
No Error
5
1/1/2000
1/1/2023
1B
1
No Error
6
1/1/2000
1/1/2023
1B
2
No Error
7
1/1/2000
1/1/2023
1C
1
No Error
9
1/1/2023
<Null>
1C
1
No Error
10
1/1/2000
<Null>
1C
2
No Error

1
1/1/2000
<Null>
2A
4.5
No Error
2
1/1/2000
<Null>
2A
5
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
1A
L1
100
1/1/2000
<Null>
2
4
1B
L1
200
1/1/2000
<Null>
0
2
1C
L1
300
1/1/2000
<Null>
0
4
2A
L2
100
1/1/2000
<Null>
4
5
2B
L2
200
1/1/2000
<Null>
5
8
2C
L2
300
1/1/2000
<Null>
0
1

[figure: Output · 1B; 200 · 2 · 3 · 7 · 5 · 8 · 9 · 2A, 100 · 1A; 100 · 1C; 300 · 2B, 200 · 2C, 300 · 4 · 6 · 10 · 1 · Input · 2A; 400 · 2B; 500 · 2C; 600 · 1A_New; 100 · 1C_New; 300 · 1C; 200]

![Figure 81 — 77](../media/relocate-events/fig-81-slide-77-77.png)
![Figure 82 — 77](../media/relocate-events/fig-82-slide-77-77.png)

![Figure 84 — 78](../media/relocate-events/fig-84-slide-78-78.svg)

### TC-U71 — Transfer To an Existing Line – Point Events - Retire <!-- src: S1 · slide 79 · case 38-2 -->

Reassign 0.5+1+0.5 routes in a line to new line ,1/3 route name and measure maintained. Rest all name and measure are changed. Do not Recalibrate source downstream.
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
<Null>
1A
2
No Error
2
1/1/2000
<Null>
1A
2.5
No Error
3
1/1/2000
<Null>
1A
3
No Error
4
1/1/2000
<Null>
1A
4
No Error
5
1/1/2000
<Null>
1B
1
No Error
6
1/1/2000
<Null>
1B
2
No Error
7
1/1/2000
<Null>
1C
1
No Error
8
1/1/2000
<Null>
1C
2
No Error
9
1/1/2000
<Null>
1C
3
No Error
10
1/1/2000
<Null>
1C
4
No Error

1
1/1/2000
<Null>
2A
4.5
No Error
2
1/1/2000
<Null>
2A
5
No Error
{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}Effective Date
1/1/2023
Source RD
No
{912C8C85-51F0-491E-9774-3900AFEF0FD7}Event ID
From Date
To Date
From Route ID
From M
Location Error
1
1/1/2000
<Null>
1A
2
No Error
2
1/1/2000
<Null>
1A
2.5
No Error
3
1/1/2000
1/1/2023
1A
3
No Error
4
1/1/2000
1/1/2023
1A
4
No Error
5
1/1/2000
1/1/2023
1B
1
No Error
6
1/1/2000
1/1/2023
1B
2
No Error
7
1/1/2000
1/1/2023
1C
1
No Error
8
1/1/2000
1/1/2023
1C
0
No Error
9
1/1/2000
<Null>
1C
1
No Error
10
1/1/2000
<Null>
1C
2
No Error

1
1/1/2000
<Null>
2A
4.5
No Error
2
1/1/2000
<Null>
2A
5
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Route Name
Line Name
Line Order
From Date
To Date
From M
To M
1A
L1
100
1/1/2000
<Null>
2
4
1B
L1
200
1/1/2000
<Null>
0
2
1C
L1
300
1/1/2000
<Null>
0
4
2A
L2
100
1/1/2000
<Null>
4
5
2B
L2
200
1/1/2000
<Null>
5
8
2C
L2
300
1/1/2000
<Null>
0
1

[figure: Output · 1B; 200 · 2 · 3 · 7 · 5 · 8 · 9 · 2A, 100 · 1A; 100 · 1C; 300 · 2B, 200 · 2C, 300 · 4 · 6 · 10 · 1 · Input · 2A; 400 · 2B; 500 · 2C; 600 · 1A_New; 100 · 1C_New; 300 · 1C; 200]

![Figure 81 — 77](../media/relocate-events/fig-81-slide-77-77.png)
![Figure 82 — 77](../media/relocate-events/fig-82-slide-77-77.png)

![Figure 85 — 79](../media/relocate-events/fig-85-slide-79-79.svg)

## Other content

### Slide 31 — Snap EB- reassign to new line <!-- slide 31 -->

### Slide 35 <!-- slide 35 -->

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 8 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 4 |
| 1A_reassign | Teal | 100 | 1/1/2020 | 1/1/2030 | 4 | 8 |
| 1A_reassign | Teal | 100 | 1/1/2030 | null | 4 | 6 |
| 1A_reassign_reassign | Yellow | 100 | 1/1/2030 | null | 6 | 8 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

1A_reassign_reassign, 100

Test case 1-b: Transfer to New Line – 2 separate transfers; transfer CP; keep original measures; partial routes change route name/id

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 1A | 1A | 5 | 5.5 | No Error |
| S2 | 1/1/2020 | <Null> | 1A_reassign | 1A_reassign | 5 | 5.5 | No Error |
| S3 | 1/1/2000 | <Null> | 1A | 1A | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 1A | 1A | 6 | 8 | No Error |
| S4 | 1/1/2020 | 1/1/2030 | 1A_reassign | 1A_reassign | 6 | 8 | No Error |
| S4 | 1/1/2030 | null | 1A_reassign_reassign | 1A_reassign_reassign | 6 | 8 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 1A | 1A | 5.75 | 8 | No Error |
| S5 | 1/1/2020 | 1/1/2030 | 1A_reassign | 1A_reassign | 5.75 | 8 | No Error |
| S5 | 1/1/2030 | null | 1A_reassign | 1A_reassign | 5.75 | 6 | No Error |
| S5 | 1/1/2030 | null | 1A_reassign_reassign | 1A_reassign_reassign | 6 | 8 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 5.25 | No Error |
| S6 | 1/1/2020 | <Null> | 1A | 1A | 2 | 4 | No Error |
| S6 | 1/1/2020 | <Null> | 1A_reassign | 1A_reassign | 4 | 5.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 6.5 | No Error |
| S7 | 1/1/2020 | null | 1A | 1A | 3 | 4 | No Error |
| S7 | 1/1/2020 | 1/1/2030 | 1A_reassign | 1A_reassign | 4 | 6.5 | No Error |
| S7 | 1/1/2030 | null | 1A_reassign | 1A_reassign | 4 | 6 | No Error |
| S7 | 1/1/2030 | null | 1A_reassign_reassign | 1A_reassign_reassign | 6 | 6.5 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 1A | 2 | 8 | No Error |
| S8 | 1/1/2020 | null | 1A | 1A | 2 | 4 | No Error |
| S8 | 1/1/2020 | 1/1/2030 | 1A_reassign | 1A_reassign | 4 | 8 | No Error |
| S8 | 1/1/2030 | null | 1A_reassign | 1A_reassign | 4 | 6 | No Error |
| S8 | 1/1/2030 | null | 1A_reassign_reassign | 1A_reassign_reassign | 6 | 8 | No Error |

[figure: After · 1A_reassign, 100 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 4 · 8 · 0 · 1 · 2 · 6 · 3 · 1A, 100 · 7]

![Figure 33 — 35](../media/relocate-events/fig-33-slide-35-35.svg)

### Slide 40 <!-- slide 40 -->

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Red | 200 | 1/1/2020 | null | 0 | 2 |
| 1A_reassign | Teal | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Teal | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | From Route ID | To Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | null | 2A | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | null | 1A_reassign | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | null | 3A_reassign | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S5 | 1/1/2000 | 1/1/2020 | 2A | 3A | 1.75 | 4 | No Error |
| S5 | 1/1/2020 | null | 2A | 3A_reassign | 1.75 | 2 | No Error |
| S5 | 1/1/2020 | null | 3A | 3A | 0 | 2 | No Error |
| S6 | 1/1/2000 | 1/1/2020 | 1A | 2A | 2 | 1.25 | No Error |
| S6 | 1/1/2020 | null | 1A | 1A | 2 | 3 | No Error |
| S6 | 1/1/2020 | null | 1A_reassign | 2A | 3 | 1.25 | No Error |
| S7 | 1/1/2000 | 1/1/2020 | 1A | 3A | 3 | 2 | No Error |
| S7 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |
| S8 | 1/1/2000 | 1/1/2020 | 1A | 3A | 2 | 4 | No Error |
| S8 | 1/1/2020 | null | 1A | 3A | 2 | 2 | No Error |
| S8 | 1/1/2020 | null | 1A_reassign | 3A_reassign | 3 | 2 | No Error |

Test case 5: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name/id –  recalibrate source downstream

[figure: After · 1C, 100 · 2C, 200 · 4 · 5 · 2 · 3 · 8 · 3C, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 0 · 1 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · CW37_1A · Split into 2]

![Figure 38 — 40](../media/relocate-events/fig-38-slide-40-40.svg)

### Slide 52 <!-- slide 52 -->

| Rname | Line Name | Line Order | From Date | To Date | From M | To M |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | Red | 100 | 1/1/2000 | 1/1/2020 | 2 | 4 |
| 1A | Red | 100 | 1/1/2020 | null | 2 | 3 |
| 2A | Red | 200 | 1/1/2000 | 1/1/2020 | 0 | 2 |
| 3A | Red | 300 | 1/1/2000 | 1/1/2020 | 0 | 4 |
| 3A | Red | 200 | 1/1/2020 | null | 0 | 2 |
| 1A_reassign | Teal | 100 | 1/1/2020 | null | 3 | 4 |
| 2A | Teal | 200 | 1/1/2020 | null | 0 | 2 |
| 3A_reassign | Teal | 300 | 1/1/2020 | null | 0 | 2 |
| 1B | Blue | 100 | 1/1/2000 | null | 3 | 5 |
| 2B | Blue | 200 | 1/1/2000 | null | 4 | 8 |
| 3B | Blue | 300 | 1/1/2000 | null | 0 | 4 |
| 1C | Gray | 100 | 1/1/2000 | null | 2 | 6 |
| 2C | Gray | 200 | 1/1/2000 | null | 2 | 4 |
| 3C | Gray | 300 | 1/1/2000 | null | 6 | 8 |

| Event ID | From Date | To Date | Route ID | From M | To M | Location Error |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | 1/1/2000 | <Null> | 1A | 2 | 2.5 | No Error |
| S2 | 1/1/2000 | 1/1/2020 | 2A | 1 | 1.5 | No Error |
| S2 | 1/1/2020 | <Null> | 2A | 1 | 1.5 | No Error |
| S3 | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S3 | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S4 | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S4 | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S4 | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S5a | 1/1/2000 | 1/1/2020 | 2A | 1.75 | 2 | No Error |
| S5a | 1/1/2020 | <Null> | 2A | 1.75 | 2 | No Error |
| S5b | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S5b | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S5b | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |
| S6a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S6a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S6a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S6b | 1/1/2000 | 1/1/2020 | 2A | 0 | 1.25 | No Error |
| S6b | 1/1/2020 | <Null> | 2A | 0 | 1.25 | No Error |
| S7a | 1/1/2000 | 1/1/2020 | 1A | 3 | 4 | No Error |
| S7a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S7b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S7b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S7c | 1/1/2000 | 1/1/2020 | 3A | 0 | 2 | No Error |
| S7c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8a | 1/1/2000 | 1/1/2020 | 1A | 2 | 4 | No Error |
| S8a | 1/1/2020 | <Null> | 1A | 2 | 3 | No Error |
| S8a | 1/1/2020 | <Null> | 1A_reassign | 3 | 4 | No Error |
| S8b | 1/1/2000 | 1/1/2020 | 2A | 0 | 2 | No Error |
| S8b | 1/1/2020 | <Null> | 2A | 0 | 2 | No Error |
| S8c | 1/1/2000 | 1/1/2020 | 3A | 0 | 4 | No Error |
| S8c | 1/1/2020 | <Null> | 3A_reassign | 0 | 2 | No Error |
| S8c | 1/1/2020 | <Null> | 3A | 0 | 2 | No Error |

Test case 11: Transfer to New Line – transfer 0.5+1+0.5 simple routes; transfer CP; keep original measures; partial routes have to change route name –  recalibrate source downstream

[figure: After · 1B, 100 · 2B, 200 · 3B, 300 · 4 · 2 · 0 · 1 · 3 · 5 · 8 · 0–2 · 7 · 1A, 100 · 3A, 200 · 2A, 200 · 1A_reassign, 100 · 3A_reassign, 300 · Gray line hidden · CW37_1A]

![Figure 50 — 52](../media/relocate-events/fig-50-slide-52-52.svg)

### Slide 59 — Stayput and Retire EB- reassign <!-- slide 59 -->

### Slide 80 — Move EB- reassign to new line <!-- slide 80 -->

### Slide 81 <!-- slide 81 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Spanning Line Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2A
2
1
No Error
002
1/1/2000
Null
1A
3A
2
4
No Error
003
1/1/2000
Null
1A
2A
3
1
No Error
004
1/1/2000
Null
2A
3A
1
2
No Error
005
1/1/2000
Null
1A
3A
3
2
No Error
006
1/1/2000
Null
2A
3A
1
4
No Error
007
1/1/2000
Null
1A
2A
2
2
No Error
008
1/1/2000
Null
2A
3A
0
4
No Error
009
1/1/2000
Null
2A
3A
0
2
No Error
010
1/1/2000
Null
1A
2A
3
2
No Error
011
1/1/2000
Null
3A
3A
0
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2020

![Figure 86 — 81](../media/relocate-events/fig-86-slide-81-81.png)

![Figure 87 — 81](../media/relocate-events/fig-87-slide-81-81.svg)

### Slide 82 <!-- slide 82 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
1A
L1
12/31/2010
Null
100
2
4
2A
L1
12/31/2010
Null
200
0
2
3A
L1
12/31/2010
Null
300
0
4
1B
L1
12/31/2010
Null
400
3
5
2B
L1
12/31/2010
Null
500
4
8
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Spanning Line Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2A
2
1
No Error
002
1/1/2000
12/31/2010
1A
3A
2
4
No Error
003
1/1/2000
12/31/2010
1A
2A
3
1
No Error
004
1/1/2000
12/31/2010
2A
3A
1
2
No Error
005
1/1/2000
12/31/2010
1A
3A
3
2
No Error
006
1/1/2000
12/31/2010
2A
3A
1
4
No Error
007
1/1/2000
12/31/2010
1A
2A
2
2
No Error
008
1/1/2000
12/31/2010
2A
3A
0
4
No Error
009
1/1/2000
12/31/2010
2A
3A
0
2
No Error
010
1/1/2000
12/31/2010
1A
2A
3
2
No Error
011
1/1/2000
12/31/2010
3A
3A
0
4
No Error
001
12/31/2010
Null
1A
2A
2
1
No Error
002
12/31/2010
Null
1A
3A
2
4
No Error
003
12/31/2010
Null
1A
2A
3
1
No Error
004
12/31/2010
Null
2A
3A
1
2
No Error
005
12/31/2010
Null
1A
3A
3
2
No Error
006
12/31/2010
Null
2A
3A
1
4
No Error
007
12/31/2010
Null
1A
2A
2
2
No Error
008
12/31/2010
Null
2A
3A
0
4
No Error
009
12/31/2010
Null
2A
3A
0
2
No Error
010
12/31/2010
Null
1A
2A
3
2
No Error
011
12/31/2010
Null
3A
3A
0
4
No Error

![Figure 88 — 82](../media/relocate-events/fig-88-slide-82-82.png)

![Figure 89 — 82](../media/relocate-events/fig-89-slide-82-82.svg)

### Slide 83 <!-- slide 83 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Spanning Line Events)
Test
Reassign in the middle spanning routes to the line on the right.  Rename one route

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2A
2
1
No Error
002
1/1/2000
Null
1A
3A
2
4
No Error
003
1/1/2000
Null
1A
2A
3
1
No Error
004
1/1/2000
Null
2A
3A
1
2
No Error
005
1/1/2000
Null
1A
3A
3
2
No Error
006
1/1/2000
Null
2A
3A
1
4
No Error
007
1/1/2000
Null
1A
2A
2
2
No Error
008
1/1/2000
Null
2A
3A
0
4
No Error
009
1/1/2000
Null
2A
3A
0
2
No Error
010
1/1/2000
Null
1A
2A
3
2
No Error
011
1/1/2000
Null
3A
3A
0
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

![Figure 90 — {5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source](../media/relocate-events/fig-90-slide-83-5940675a-b579-460e-94d1-54222c63f5da.svg)

### Slide 84 <!-- slide 84 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line
Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
2A
L0
12/31/2010
Null
200
0
1
2A Line1
L1
12/31/2010
Null
100
1
2
3A
L1
12/31/2010
Null
200
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
1B
L1
12/31/2010
Null
300
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
400
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
500
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2A
2
1
No Error
002
1/1/2000
12/31/2010
1A
3A
2
4
No Error
003
1/1/2000
12/31/2010
1A
2A
3
1
No Error
004
1/1/2000
12/31/2010
2A
3A
1
2
No Error
005
1/1/2000
12/31/2010
1A
3A
3
2
No Error
006
1/1/2000
12/31/2010
2A
3A
1
4
No Error
007
1/1/2000
12/31/2010
1A
2A
2
2
No Error
008
1/1/2000
12/31/2010
2A
3A
0
4
No Error
009
1/1/2000
12/31/2010
2A
3A
0
2
No Error
010
1/1/2000
12/31/2010
1A
2A
3
2
No Error
011
1/1/2000
12/31/2010
3A
3A
0
4
No Error
001
12/31/2010
Null
1A
2A
2
1
No Error
002
12/31/2010
Null
1A
3A
2
4
Different From Route And To Route Line IDs
003
12/31/2010
Null
1A
2A
3
1
No Error
004
12/31/2010
Null
2A
3A
1
2
Different From Route And To Route Line IDs
005
12/31/2010
Null
1A
3A
3
2
Different From Route And To Route Line IDs
006
12/31/2010
Null
2A
3A
1
4
Different From Route And To Route Line IDs
007
12/31/2010
Null
1A
2A
2
2
Partial Match for the To Measure
008
12/31/2010
Null
2A
3A
0
4
Different From Route And To Route Line IDs
009
12/31/2010
Null
2A
3A
0
2
Different From Route And To Route Line IDs
010
12/31/2010
Null
1A
2A
3
2
Partial Match for the To Measure
011
12/31/2010
Null
3A
3A
0
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Spanning Line Events)
Test
Reassign in the middle spanning routes to the line on the right.  Rename one route

[figure: 1A, 100 · 2A, 200 · 3A, 200 · 1B, 300 · 2B, 400 · 3B, 500 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6 · 2A Line1, 100]

![Figure 91 — 84](../media/relocate-events/fig-91-slide-84-84.svg)

### Slide 85 <!-- slide 85 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2020

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
4
Network Type
Engineering (Spanning Line Events)
Test
Reassign to a new line. No Change.

New Line

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2A
2
1
No Error
002
1/1/2000
Null
1A
3A
2
4
No Error
003
1/1/2000
Null
1A
2A
3
1
No Error
004
1/1/2000
Null
2A
3A
1
2
No Error
005
1/1/2000
Null
1A
3A
3
2
No Error
006
1/1/2000
Null
2A
3A
1
4
No Error
007
1/1/2000
Null
1A
2A
2
2
No Error
008
1/1/2000
Null
2A
3A
0
4
No Error
009
1/1/2000
Null
2A
3A
0
2
No Error
010
1/1/2000
Null
1A
2A
3
2
No Error
011
1/1/2000
Null
3A
3A
0
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![Figure 86 — 81](../media/relocate-events/fig-86-slide-81-81.png)

![Figure 92 — 85](../media/relocate-events/fig-92-slide-85-85.svg)

### Slide 86 <!-- slide 86 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2020
100
2
4
2A
L0
1/1/2010
12/31/2020
200
0
2
3A
L0
1/1/2020
12/31/2020
300
0
4
1A
LX
12/31/2020
Null
100
2
4
2A
LX
12/31/2020
Null
200
0
2
3A
LX
12/31/2020
Null
300
0
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
Null
100
4
6
2C
L2
1/1/2020
Null
200
2
6
3C
L2
1/1/2020
Null
300
4
8

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2A
2
1
No Error
002
1/1/2000
12/31/2010
1A
3A
2
4
No Error
003
1/1/2000
12/31/2010
1A
2A
3
1
No Error
004
1/1/2000
12/31/2010
2A
3A
1
2
No Error
005
1/1/2000
12/31/2010
1A
3A
3
2
No Error
006
1/1/2000
12/31/2010
2A
3A
1
4
No Error
007
1/1/2000
12/31/2010
1A
2A
2
2
No Error
008
1/1/2000
12/31/2010
2A
3A
0
4
No Error
009
1/1/2000
12/31/2010
2A
3A
0
2
No Error
010
1/1/2000
12/31/2010
1A
2A
3
2
No Error
011
1/1/2000
12/31/2010
3A
3A
0
4
No Error
001
12/31/2010
Null
1A
2A
2
1
No Error
002
12/31/2010
Null
1A
3A
2
4
No Error
003
12/31/2010
Null
1A
2A
3
1
No Error
004
12/31/2010
Null
2A
3A
1
2
No Error
005
12/31/2010
Null
1A
3A
3
2
No Error
006
12/31/2010
Null
2A
3A
1
4
No Error
007
12/31/2010
Null
1A
2A
2
2
No Error
008
12/31/2010
Null
2A
3A
0
4
No Error
009
12/31/2010
Null
2A
3A
0
2
No Error
010
12/31/2010
Null
1A
2A
3
2
No Error
011
12/31/2010
Null
3A
3A
0
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
4
Network Type
Engineering (Spanning Line Events)
Test
Reassign to a new line. No Change.

![Figure 93 — 86](../media/relocate-events/fig-93-slide-86-86.svg)

### Slide 87 <!-- slide 87 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2030

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
6
Network Type
Engineering (Spanning Line Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2A
2
1
No Error
002
1/1/2000
Null
1A
3A
2
4
No Error
003
1/1/2000
Null
1A
2A
3
1
No Error
004
1/1/2000
Null
2A
3A
1
2
No Error
005
1/1/2000
Null
1A
3A
3
2
No Error
006
1/1/2000
Null
2A
3A
1
4
No Error
007
1/1/2000
Null
1A
2A
2
2
No Error
008
1/1/2000
Null
2A
3A
0
4
No Error
009
1/1/2000
Null
2A
3A
0
2
No Error
010
1/1/2000
Null
1A
2A
3
2
No Error
011
1/1/2000
Null
3A
3A
0
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: New Line · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

![Figure 94 — 87](../media/relocate-events/fig-94-slide-87-87.svg)

### Slide 88 <!-- slide 88 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
6
Network Type
Engineering (Spanning Line Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2010
12/31/2030
200
0
2
3A
L0
1/1/2020
12/31/2030
300
0
4
1A
LX
12/31/2030
Null
100
2
4
2A
LX
12/31/2030
Null
200
0
2
3A LineX
LX
12/31/2030
Null
300
0
2
3A
L0
12/31/2030
Null
100
2
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
12/31/2030
100
4
6
2C
L2
1/1/2020
12/31/2030
200
2
6
3C
L2
1/1/2020
12/31/2030
300
4
8

3A LineX, 300

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2A
2
1
No Error
002
1/1/2000
12/31/2010
1A
3A
2
4
No Error
003
1/1/2000
12/31/2010
1A
2A
3
1
No Error
004
1/1/2000
12/31/2010
2A
3A
1
2
No Error
005
1/1/2000
12/31/2010
1A
3A
3
2
No Error
006
1/1/2000
12/31/2010
2A
3A
1
4
No Error
007
1/1/2000
12/31/2010
1A
2A
2
2
No Error
008
1/1/2000
12/31/2010
2A
3A
0
4
No Error
009
1/1/2000
12/31/2010
2A
3A
0
2
No Error
010
1/1/2000
12/31/2010
1A
2A
3
2
No Error
011
1/1/2000
12/31/2010
3A
3A
0
4
No Error
001
12/31/2030
Null
1A
2A
2
1
No Error
002
12/31/2030
Null
1A
3A
2
4
Different From Route And To Route Line IDs
003
12/31/2030
Null
1A
2A
3
1
No Error
004
12/31/2030
Null
2A
3A
1
2
Different From Route And To Route Line IDs
005
12/31/2030
Null
1A
3A
3
2
Different From Route And To Route Line IDs
006
12/31/2030
Null
2A
3A
1
4
Different From Route And To Route Line IDs
007
12/31/2030
Null
1A
2A
2
2
No Error
008
12/31/2030
Null
2A
3A
0
4
Different From Route And To Route Line IDs
009
12/31/2030
Null
2A
3A
0
2
Different From Route And To Route Line IDs
010
12/31/2030
Null
1A
2A
3
2
No Error
011
12/31/2030
Null
3A
3A
0
4
Partial Match for the From Measure

[figure: 1A, 100 · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6 · 3A, 100]

![Figure 95 — 88](../media/relocate-events/fig-95-slide-88-88.svg)

### Slide 89 <!-- slide 89 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
8
Network Type
Engineering (Spanning Line Events)
Test
Reassign to fill the gap in a line by transferring route.

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2023
{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
X1
X2
2
28
No Error
002
1/1/2000
Null
X1
X2
2
26
No Error
003
1/1/2000
Null
X1
X2
4
26
No Error
004
1/1/2000
Null
X1
X2
4
28
No Error
005
1/1/2000
Null
1B
3B
3
2
No Error
006
1/1/2000
Null
1B
3B
4
2
No Error
007
1/1/2000
Null
1B
3B
4
1
No Error

[figure: 100 · 200 · X1 · X2]

![Figure 96 — 89](../media/relocate-events/fig-96-slide-89-89.svg)

### Slide 90 <!-- slide 90 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
100
24
28
1B
L1
1/1/2000
12/31/2023
100
3
5
2B
L1
1/1/2000
12/31/2023
200
4
8
3B
L1
1/1/2000
12/31/2023
300
0
2
X2
L3
12/31/2023
Null
300
24
28
1B
L3
12/31/2023
Null
200
4
5
3B
L1
12/31/2023
Null
200
0
2
2B
L1
12/31/2023
Null
100
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
8
Network Type
Engineering (Spanning Line Events)
Test
Reassign to fill the gap in a line by transferring route.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2023
X1
X2
2
28
No Error
002
1/1/2000
12/31/2023
X1
X2
2
26
No Error
003
1/1/2000
12/31/2023
X1
X2
4
26
No Error
004
1/1/2000
12/31/2023
X1
X2
4
28
No Error
005
1/1/2000
12/31/2023
1B
3B
3
2
No Error
006
1/1/2000
12/31/2023
1B
3B
4
2
No Error
007
1/1/2000
12/31/2023
1B
3B
4
1
No Error
001
12/31/2023
Null
X1
X2
2
28
No Error
002
12/31/2023
Null
X1
X2
2
26
No Error
003
12/31/2023
Null
X1
X2
4
26
No Error
004
12/31/2023
Null
X1
X2
4
28
No Error
005
12/31/2023
Null
1B
3B
3
2
Different From Route and To Route LineIDs
006
12/31/2023
Null
1B
3B
4
2
Different From Route and To Route LineIDs
007
12/31/2023
Null
1B
3B
4
1
Different From Route and To Route LineIDs

[figure: 100 · 300 · X1 · X2]

![Figure 97 — 90](../media/relocate-events/fig-97-slide-90-90.svg)

### Slide 91 <!-- slide 91 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Spanning Line Events)
Test
Reassign last route to adjacent line. Change measures

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2A
2
1
No Error
002
1/1/2000
Null
1A
3A
2
4
No Error
003
1/1/2000
Null
1A
2A
3
1
No Error
004
1/1/2000
Null
2A
3A
1
2
No Error
005
1/1/2000
Null
1A
3A
3
2
No Error
006
1/1/2000
Null
2A
3A
1
4
No Error
007
1/1/2000
Null
1A
2A
2
2
No Error
008
1/1/2000
Null
2A
3A
0
4
No Error
009
1/1/2000
Null
2A
3A
0
2
No Error
010
1/1/2000
Null
1A
2A
3
2
No Error
011
1/1/2000
Null
3A
3A
0
4
No Error
012
1/1/2000
Null
3A
3A
0
2
No Error
013
1/1/2000
Null
3A
3A
2
4
No Error
014
1/1/2000
Null
3A
3A
1
3
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

![Figure 98 — {5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source](../media/relocate-events/fig-98-slide-91-5940675a-b579-460e-94d1-54222c63f5da.svg)

### Slide 92 <!-- slide 92 -->

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
1A
L0
12/31/2010
Null
100
2
3
2A
L0
12/31/2010
Null
200
10
20
3A
L0
1/1/2000
12/31/2010
300
0
4
3A
L1
12/31/2010
Null
100
1
4
1B
L1
1/1/2000
12/31/2010
100
3
5
1B
L1
12/31/2010
Null
200
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
300
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
400
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
From
RouteID
To
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2A
2
1
No Error
002
1/1/2000
12/31/2010
1A
3A
2
4
No Error
003
1/1/2000
12/31/2010
1A
2A
3
1
No Error
004
1/1/2000
12/31/2010
2A
3A
1
2
No Error
005
1/1/2000
12/31/2010
1A
3A
3
2
No Error
006
1/1/2000
12/31/2010
2A
3A
1
4
No Error
007
1/1/2000
12/31/2010
1A
2A
2
2
No Error
008
1/1/2000
12/31/2010
2A
3A
0
4
No Error
009
1/1/2000
12/31/2010
2A
3A
0
2
No Error
010
1/1/2000
12/31/2010
1A
2A
3
2
No Error
011
1/1/2000
12/31/2010
3A
3A
0
4
No Error
012
1/1/2000
12/31/2010
3A
3A
0
2
No Error
013
1/1/2000
12/31/2010
3A
3A
2
4
No Error
014
1/1/2000
12/31/2010
3A
3A
1
3
No Error
001
12/31/2010
Null
1A
2A
2
1
Partial Match for the To Measure
002
12/31/2010
Null
1A
3A
2
4
Different From and To Route Line IDs
003
12/31/2010
Null
1A
2A
3
1
Partial Match for the To Measure
004
12/31/2010
Null
2A
3A
1
2
Different From and To Route Line IDs
005
12/31/2010
Null
1A
3A
3
2
Different From and To Route Line IDs
006
12/31/2010
Null
2A
3A
1
4
Different From and To Route Line IDs
007
12/31/2010
Null
1A
2A
2
2
Partial Match for the To Measure
008
12/31/2010
Null
2A
3A
0
4
Different From and To Route Line IDs
009
12/31/2010
Null
2A
3A
0
2
Different From and To Route Line IDs
010
12/31/2010
Null
1A
2A
3
2
Partial Match for the To Measure
011
12/31/2010
Null
3A
3A
0
4
Partial Match for the From Measure
012
12/31/2010
Null
3A
3A
0
2
Partial Match for the From Measure
013
12/31/2010
Null
3A
3A
2
4
No Error
014
12/31/2010
Null
3A
3A
1
3
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Spanning Line Events)
Test
Reassign last route to adjacent line. Change measures

[figure: 1A, 100 · 2A, 200 · 3A, 100 · 1B, 200 · 2B, 300 · 3B, 400 · 2C, 200 · 1C, 100 · 3C, 300 · 3 · 2 · 20 · 10 · 1 · 4 · 5 · 8 · 0 · 6]

![Figure 99 — 92](../media/relocate-events/fig-99-slide-92-92.svg)

### Slide 93 <!-- slide 93 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign in the middle spanning routes to the line on the right.  Rename one route

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
Null
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
Null
2A
1
2
No Error
007
1/1/2000
Null
3A
0
4
No Error
008
1/1/2000
Null
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

![Figure 100 — {5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source](../media/relocate-events/fig-100-slide-93-5940675a-b579-460e-94d1-54222c63f5da.svg)

### Slide 94 <!-- slide 94 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign in the middle spanning routes to the line on the right

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
12/31/2010
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
12/31/2010
2A
1
2
No Error
007
1/1/2000
12/31/2010
3A
0
4
No Error
008
1/1/2000
12/31/2010
3A
0
2
No Error
009
1/1/2000
12/31/2010
3A
2
4
No Error
004
12/31/2010
Null
2A
0
2
Partial Match for the To Measure
006
12/31/2010
Null
2A
1
2
Partial Match for the To Measure
007
12/31/2010
Null
3A
0
4
No Error
008
12/31/2010
Null
3A
0
2
No Error
009
12/31/2010
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line
Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
2A
L0
12/31/2010
Null
200
0
1
2A Line1
L1
12/31/2010
Null
100
1
2
3A
L1
12/31/2010
Null
200
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
1B
L1
12/31/2010
Null
300
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
400
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
500
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 200 · 1B, 300 · 2B, 400 · 3B, 500 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6 · 2A Line1, 100]

![Figure 101 — 94](../media/relocate-events/fig-101-slide-94-94.svg)

### Slide 95 <!-- slide 95 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
6
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

3A LineX, 300

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
4
No Error
002
1/1/2000
12/31/2010
1A
2
3
No Error
003
1/1/2000
12/31/2010
1A
3
4
No Error
004
1/1/2000
12/31/2010
2A
0
2
No Error
005
1/1/2000
12/31/2010
2A
0
1
No Error
006
1/1/2000
12/31/2010
2A
1
2
No Error
007
1/1/2000
12/31/2010
3A
0
4
No Error
008
1/1/2000
12/31/2010
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
001
12/31/2030
Null
1A
2
4
No Error
002
12/31/2030
Null
1A
2
3
No Error
003
12/31/2030
Null
1A
3
4
No Error
004
12/31/2030
Null
2A
0
2
No Error
005
12/31/2030
Null
2A
0
1
No Error
006
12/31/2030
Null
2A
1
2
No Error
007
12/31/2030
Null
3A
0
4
Partial Match for the From Measure
008
12/31/2030
Null
3A
0
2
Partial Match for the From Measure
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2010
12/31/2030
200
0
2
3A
L0
1/1/2020
12/31/2030
300
0
4
1A
LX
12/31/2030
Null
100
2
4
2A
LX
12/31/2030
Null
200
0
2
3A LineX
LX
12/31/2030
Null
300
0
2
3A
L0
12/31/2030
Null
100
2
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
12/31/2030
100
4
6
2C
L2
1/1/2020
12/31/2030
200
2
6
3C
L2
1/1/2020
12/31/2030
300
4
8

[figure: 1A, 100 · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6 · 3A, 100]

![Figure 102 — 95](../media/relocate-events/fig-102-slide-95-95.svg)

### Slide 96 <!-- slide 96 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
7
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
1/1/2000

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
Null
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
Null
2A
1
2
No Error
007
1/1/2000
Null
3A
0
4
No Error
008
1/1/2000
Null
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![Figure 86 — 81](../media/relocate-events/fig-86-slide-81-81.png)

![Figure 103 — 96](../media/relocate-events/fig-103-slide-96-96.svg)

### Slide 97 <!-- slide 97 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

![Figure 86 — 81](../media/relocate-events/fig-86-slide-81-81.png)

![Figure 104 — 97](../media/relocate-events/fig-104-slide-97-97.svg)

### Slide 98 <!-- slide 98 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2010
Null
1A
2
No Error
002
12/31/2010
Null
1A
3
No Error
003
12/31/2010
Null
1A
4
No Error
004
12/31/2010
Null
2A
0
No Error
005
12/31/2010
Null
2A
1
No Error
006
12/31/2010
Null
2A
2
No Error
007
12/31/2010
Null
3A
0
No Error
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
1A
L1
12/31/2010
Null
100
2
4
2A
L1
12/31/2010
Null
200
0
2
3A
L1
12/31/2010
Null
300
0
4
1B
L1
12/31/2010
Null
400
3
5
2B
L1
12/31/2010
Null
500
4
8
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![Figure 88 — 82](../media/relocate-events/fig-88-slide-82-82.png)

![Figure 105 — 98](../media/relocate-events/fig-105-slide-98-98.svg)

### Slide 99 <!-- slide 99 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Point Events)
Test
Reassign in the middle spanning routes to the line on the right.  Rename one route

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

![Figure 106 — {5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source](../media/relocate-events/fig-106-slide-99-5940675a-b579-460e-94d1-54222c63f5da.svg)

### Slide 100 <!-- slide 100 -->

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Point Events)
Test
Reassign in the middle spanning routes to the line on the right

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
006
12/31/2010
Null
2A
2
Route Location not Found
007
12/31/2010
Null
3A
0
No Error
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line
Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
2A
L0
12/31/2010
Null
200
0
1
2A Line1
L1
12/31/2010
Null
1
2
3A
L1
12/31/2010
Null
200
0
4
1B
L1
1/1/2000
12/31/2010
3
5
1B
L1
12/31/2010
Null
300
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
400
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
500
0
2
1C
L2
1/1/2000
Null
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 200 · 1B, 300 · 2B, 400 · 3B, 500 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6 · 2A Line1, 100]

*(tables truncated at 200 — remaining tables render as plain text)*

![Figure 107 — 100](../media/relocate-events/fig-107-slide-100-100.svg)
