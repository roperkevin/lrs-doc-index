# Append Routes: Line Order Check Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 564 · Test Plan · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4975](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4975) |
| **Source** | [4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4975-AppendRoutesLineOrderCheck_TestPlan_V2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2023-05-22 22:17 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | append routes · line order · route · gapped routes · point on measure · test plan |
| **Tools** | — |

## Summary

Test plan for verifying the correct line order in appended routes including normal routes, gapped routes, and routes with routes inside others (PoM routes). It includes positive and negative test cases to ensure line order correctness and increments, tested in various environments and with different tools.

## Related documents

<!-- related:begin -->
- [Append Routes: Line Order Check User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4975-append-routes-line-order-check.md>) — shared issue ArcGISPro/ps-location-referencing#4975 · similar text 0.21 · 5 title words · 5 filename words · same surface <!-- rel:578 s=1006.257 -->
- [Append Routes: Allow Partial Loading Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6380-append-routes-allow-partial-loading.md>) — similar text 0.07 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:137 s=3.674 -->
- [Test Plan: Reverse Line Orders GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4983-reverse-line-orders-gp.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:547 s=3.465 -->
- [Consider Route Dominance in Append Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3537-consider-route-dominance-in-append-events.md>) — similar text 0.04 · 1 title word · 1 filename word · same kind/folder <!-- rel:278 s=2.691 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6209-generate-a-route-log-using-the-glrsdp-gp.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:260 s=2.659 -->
<!-- related:end -->

---

## Test Cases

### TC-P01 — Correct line order of 100, 200, 300, 400 on a normal line <!-- src: S4 · slide 1 · Positive Tests: Normal Routes · 1 -->

- **Group:** Normal Routes

### TC-P02 — Correct line order of 300, 400, 500, 600 on a normal line <!-- src: S4 · slide 1 · Positive Tests: Normal Routes · 2 -->

- **Group:** Normal Routes

### TC-P03 — Time sliced routes, first time slice is 100, 200, 300 <!-- src: S4 · slide 1 · Positive Tests: Normal Routes · 3 -->

- **Group:** Normal Routes
- **Case:** Time sliced routes, first time slice is 100, 200, 300, 400 and second time slice is 300, 400, 500, 600

### TC-P04 — Correct line order of 100, 200, 300 (1) <!-- src: S4 · slide 1 · Positive Tests: Gapped Routes · 1 -->

- **Group:** Gapped Routes
- **Case:** Correct line order of 100, 200, 300, 400 on a gapped line with a gap between the 300 and 400 routes

### TC-P05 — Correct line order of 300, 400, 500 (1) <!-- src: S4 · slide 1 · Positive Tests: Gapped Routes · 2 -->

- **Group:** Gapped Routes
- **Case:** Correct line order of 300, 400, 500, 600 on a gapped line with a gap between the 500 and 600 routes

### TC-P06 — Correct line order of 100, 200, 300 (2) <!-- src: S4 · slide 1 · Positive Tests: Gapped Routes · 3 -->

- **Group:** Gapped Routes
- **Case:** Correct line order of 100, 200, 300, 400 on gapped line with gaps in-between each route along the line.

### TC-P07 — Line order of 300, 100 <!-- src: S4 · slide 1 · Positive Tests: Gapped Routes · 4 -->

- **Group:** Gapped Routes
- **Case:** Line order of 300, 100, 200 on a gapped line with gaps between the 300 and 100 routes

### TC-P08 — Line order of 100, 300, 400 <!-- src: S4 · slide 1 · Positive Tests: Gapped Routes · 5 -->

- **Group:** Gapped Routes
- **Case:** Line order of 100, 300, 400, 200 on a gapped line with gaps in-between all routes

### TC-P09 — Correct line order of 100, 200, 300 (3) <!-- src: S4 · slide 1 · Positive Tests: PoM Routes · 1 -->

- **Group:** PoM Routes
- **Case:** Correct line order of 100, 200, 300, 400 on a normal line with route 200 inside of route 100

### TC-P10 — Correct line order of 300, 400, 500 (2) <!-- src: S4 · slide 1 · Positive Tests: PoM Routes · 2 -->

- **Group:** PoM Routes
- **Case:** Correct line order of 300, 400, 500, 600 on a normal line with route 400 inside of route 500

### TC-P11 — Correct line order of 100, 200, 300 (4) <!-- src: S4 · slide 1 · Positive Tests: PoM Routes · 3 -->

- **Group:** PoM Routes
- **Case:** Correct line order of 100, 200, 300, 400 on a gapped line with a gap between the 300 and 400 routes. Route 200 is inside of route 100

### TC-P12 — Correct line order of 300, 400, 500 (3) <!-- src: S4 · slide 1 · Positive Tests: PoM Routes · 4 -->

- **Group:** PoM Routes
- **Case:** Correct line order of 300, 400, 500, 600 on a gapped line with a gap between the 500 and 600 routes. Route 400 is inside of route 300.

### TC-N01 — Incorrect line order of 400, 200, 100 with a gap between routes 200 and 100 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 1 -->

- **Group:** Gapped Routes

### TC-N02 — Incorrect line order of 100, 200, 400 with a gap between routes 100 and 200 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 2 -->

- **Group:** Gapped Routes

### TC-N03 — Incorrect line order of 1, 2, 3 with a gap between routes 2 and 3 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 3 -->

- **Group:** Gapped Routes

### TC-N04 — Incorrect line order of 10, 20, 30 with a gap between routes 20 and 30 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 4 -->

- **Group:** Gapped Routes

### TC-N05 — Incorrect line order of 1000, 2000, 3000 with a gap between routes 1000 and 2000 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 5 -->

- **Group:** Gapped Routes

### TC-N06 — Incorrect line order of 100, 100, 100 with a gap between all routes <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 6 -->

- **Group:** Gapped Routes

### TC-N07 — Incorrect line order of 300, 100, 200 with a gap between routes 100 and 200 <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 7 -->

- **Group:** Gapped Routes

### TC-N08 — Incorrect line order of 1, 200, 300 with a gap between all routes <!-- src: S4 · slide 2 · Negative Tests: Gapped Routes · 8 -->

- **Group:** Gapped Routes

### TC-N09 — Incorrect line order of 100, 300, 200, 400 with route 200 inside route 300 <!-- src: S4 · slide 2 · Negative Tests: PoM Routes · 1 -->

- **Group:** PoM Routes

### TC-N10 — Incorrect line order of 400, 300, 200, 100 with route 300 inside route 200 <!-- src: S4 · slide 2 · Negative Tests: PoM Routes · 2 -->

- **Group:** PoM Routes

### TC-N11 — Incorrect line order of 300, 200, 100 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 1 -->

- **Group:** Normal Routes

### TC-N12 — Incorrect line order of 100, 200, 400 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 2 -->

- **Group:** Normal Routes

### TC-N13 — Incorrect line order of 1, 2, 3 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 3 -->

- **Group:** Normal Routes

### TC-N14 — Incorrect line order of 10, 20, 30 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 4 -->

- **Group:** Normal Routes

### TC-N15 — Incorrect line order of 1000, 2000, 3000 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 5 -->

- **Group:** Normal Routes

### TC-N16 — Incorrect line order of 100, 100, 100 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 6 -->

- **Group:** Normal Routes

### TC-N17 — Incorrect line order of 300, 100, 200 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 7 -->

- **Group:** Normal Routes

### TC-N18 — Incorrect line order of 1, 200, 300 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 8 -->

- **Group:** Normal Routes

### TC-N19 — Negative line order of -100, -200, -300 <!-- src: S4 · slide 2 · Negative Tests: Normal Routes · 9 -->

- **Group:** Normal Routes

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Append Routes: Line Order Check

**Notes**
- Test a few PoM Cases, focus mostly on APR data
- Test in FGDB, DC, and FS
- Ensure LineOrder is correct and a derived network can be generated
- Ensure that LineOrder numerical values are in increments of 100.
- Only test with Add Load Type
- Test a couple test cases in ModelBuilder and Python
