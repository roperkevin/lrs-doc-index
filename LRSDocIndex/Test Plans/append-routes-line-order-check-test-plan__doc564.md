# Append Routes: Line Order Check Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#4975](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4975) |
| **Source** | [4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx>) |
| **Edited** | 2023-05-22 22:17 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Append Routes: Line Order Check Test Plan"
source_file: "4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx"
doc_id: 564
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-05-22T22:17:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["append routes", "line order", "route", "gapped routes", "point on measure", "test plan"]
tools: []
products: ["Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#4975"]
related: [{"doc":578,"file":"append-routes-line-order-check-user-story__doc578.md","s":1006.257},{"doc":137,"file":"append-routes-allow-partial-loading-test-plan__doc137.md","s":3.674},{"doc":547,"file":"test-plan-reverse-line-orders-gp-tool__doc547.md","s":3.465},{"doc":278,"file":"consider-route-dominance-in-append-events-test-plan__doc278.md","s":2.691},{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":2.659}]
```
-->

## Summary

Test plan for verifying the correct line order in appended routes including normal routes, gapped routes, and routes with routes inside others (PoM routes). It includes positive and negative test cases to ensure line order correctness and increments, tested in various environments and with different tools.

## Related documents

<!-- related:begin -->
- [Append Routes: Line Order Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-line-order-check-user-story__doc578.md>) — shared issue ArcGISPro/ps-location-referencing#4975 · similar text 0.21 · 5 title words · 5 filename words · same surface <!-- rel:578 -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/append-routes-allow-partial-loading-test-plan__doc137.md>) — similar text 0.07 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:137 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-reverse-line-orders-gp-tool__doc547.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:547 -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/consider-route-dominance-in-append-events-test-plan__doc278.md>) — similar text 0.04 · 1 title word · 1 filename word · same kind/folder <!-- rel:278 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:260 -->
<!-- related:end -->

---

## Slide 1

Append Routes: Line Order Check

| Positive Tests: Normal Routes |
| --- |
| Correct line order of 100, 200, 300, 400 on a normal line Correct line order of 300, 400, 500, 600 on a normal line Time sliced routes, first time slice is 100, 200, 300, 400 and second time slice is 300, 400, 500, 600 |

| Notes |
| --- |
| Test a few PoM Cases, focus mostly on APR data Test in FGDB, DC, and FS Ensure LineOrder is correct and a derived network can be generated Ensure that LineOrder numerical values are in increments of 100. Only test with Add Load Type Test a couple test cases in ModelBuilder and Python |

Devtopia Issue

| Positive Tests: Gapped Routes |
| --- |
| Correct line order of 100, 200, 300, 400 on a gapped line with a gap between the 300 and 400 routes Correct line order of 300, 400, 500, 600 on a gapped line with a gap between the 500 and 600 routes Correct line order of 100, 200, 300, 400 on gapped line with gaps in-between each route along the line. Line order of 300, 100, 200 on a gapped line with gaps between the 300 and 100 routes Line order of 100, 300, 400, 200 on a gapped line with gaps in-between all routes |

| Positive Tests: PoM Routes |
| --- |
| Correct line order of 100, 200, 300, 400 on a normal line with route 200 inside of route 100 Correct line order of 300, 400, 500, 600 on a normal line with route 400 inside of route 500 Correct line order of 100, 200, 300, 400 on a gapped line with a gap between the 300 and 400 routes. Route 200 is inside of route 100 Correct line order of 300, 400, 500, 600 on a gapped line with a gap between the 500 and 600 routes. Route 400 is inside of route 300. |

## Slide 2

| Negative Tests: Gapped Routes |
| --- |
| Incorrect line order of 400, 200, 100 with a gap between routes 200 and 100 Incorrect line order of 100, 200, 400 with a gap between routes 100 and 200 Incorrect line order of 1, 2, 3 with a gap between routes 2 and 3 Incorrect line order of 10, 20, 30 with a gap between routes 20 and 30 Incorrect line order of 1000, 2000, 3000 with a gap between routes 1000 and 2000 Incorrect line order of 100, 100, 100 with a gap between all routes Incorrect line order of 300, 100, 200 with a gap between routes 100 and 200 Incorrect line order of 1, 200, 300 with a gap between all routes |

| Negative Tests: PoM Routes |
| --- |
| Incorrect line order of 100, 300, 200, 400 with route 200 inside route 300 Incorrect line order of 400, 300, 200, 100 with route 300 inside route 200 |

| Negative Tests: Normal Routes |
| --- |
| Incorrect line order of 300, 200, 100 Incorrect line order of 100, 200, 400 Incorrect line order of 1, 2, 3 Incorrect line order of 10, 20, 30 Incorrect line order of 1000, 2000, 3000 Incorrect line order of 100, 100, 100 Incorrect line order of 300, 100, 200 Incorrect line order of 1, 200, 300 Negative line order of -100, -200, -300 |
