# Support Core Editing Grid for LRS Route Editing Tools: Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 655 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4250](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4250) |
| **Source** | [4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx>) |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2022-07-15 22:24 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route editing · attribute rules · domain values · line network · non line network · pom network · create routes · realign routes · reassign routes |
| **Tools** | — |

## Summary

Test plan covering positive test cases for creating, realigning, and reassigning routes with various attribute rules and domain values on line, non-line, and PoM networks. Includes tests for coded domain values, range domain values, subtypes, contingent attribute values, calculation attribute rules, constraint attribute rules, and validation attribute rules. Notes mention testing across different network types and editing tools.

## Related documents

<!-- related:begin -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4250-support-core-editing-grid-for-lrs-route-editing-tools-v3.md>) — shared issue ArcGISPro/ps-location-referencing#4250 · similar text 0.78 · 6 title words · 6 filename words · same kind/surface <!-- rel:654 s=1009.66 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.12 · 4 title words · 2 filename words · same kind/surface <!-- rel:483 s=4.634 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface <!-- rel:628 s=2.892 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools.md>) — similar text 0.14 · 3 title words · same surface <!-- rel:605 s=2.791 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.09 · 1 title word · same surface <!-- rel:826 s=2.167 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Reassign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)

_No page matched:_ [adm](https://www.google.com/search?q=%22adm%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Create Routes with coded domain values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 1 -->

- **Group:** Create Routes

### TC-P02 — Create Routes with range domain values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 2 -->

- **Group:** Create Routes

### TC-P03 — Create Routes with subtype attribute values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 3 -->

- **Group:** Create Routes

### TC-P04 — Create Routes with contingent attribute values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 4 -->

- **Group:** Create Routes

### TC-P05 — Create Routes with calculation attribute rules on a line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 5 -->

- **Group:** Create Routes

### TC-P06 — Create Routes with constraint attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 6 -->

- **Group:** Create Routes
- **Case:** Create Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P07 — Create Routes with validation attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 7 -->

- **Group:** Create Routes
- **Case:** Create Routes with validation attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P08 — Create Routes with coded domain values on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 8 -->

- **Group:** Create Routes

### TC-P09 — Create Routes with range domain values on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 9 -->

- **Group:** Create Routes

### TC-P10 — Create Routes with subtype attribute values on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 10 -->

- **Group:** Create Routes

### TC-P11 — Create Routes with contingent attribute values on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 11 -->

- **Group:** Create Routes

### TC-P12 — Create Routes with calculation attribute rules on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 12 -->

- **Group:** Create Routes

### TC-P13 — Create Routes with constraint attribute rules on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 13 -->

- **Group:** Create Routes
- **Case:** Create Routes with constraint attribute rules on a non-line network. (Crashes Pro, log bug!)

### TC-P14 — Create Routes with validation attribute rules on a non-line network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 14 -->

- **Group:** Create Routes
- **Case:** Create Routes with validation attribute rules on a non-line network. (Crashes Pro, log bug!)

### TC-P15 — Create Routes with coded domain values on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 15 -->

- **Group:** Create Routes

### TC-P16 — Create Routes with range domain values on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 16 -->

- **Group:** Create Routes

### TC-P17 — Create Routes with subtype attribute values on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 17 -->

- **Group:** Create Routes

### TC-P18 — Create Routes with contingent attribute values on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 18 -->

- **Group:** Create Routes

### TC-P19 — Create Routes with calculation attribute rules on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 19 -->

- **Group:** Create Routes

### TC-P20 — Create Routes with constraint attribute rules on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 20 -->

- **Group:** Create Routes

### TC-P21 — Create Routes with validation attribute rules on a PoM network. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 21 -->

- **Group:** Create Routes

### TC-P22 — Realign Routes with coded domain values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 1 -->

- **Group:** Realign Routes

### TC-P23 — Realign Routes with range domain values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 2 -->

- **Group:** Realign Routes

### TC-P24 — Realign Routes with subtype attribute values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 3 -->

- **Group:** Realign Routes

### TC-P25 — Realign Routes with contingent attribute values on a line network. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 4 -->

- **Group:** Realign Routes

### TC-P26 — Realign Routes with calculation attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 5 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with calculation attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P27 — Realign Routes with constraint attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 1 -->

- **Group:** Realign Routes (Continued)
- **Case:** Realign Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P28 — Realign Routes with validation attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 2 -->

- **Group:** Realign Routes (Continued)
- **Case:** Realign Routes with validation attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P29 — Realign Routes with abandonment on a line network using subtypes, domains <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 3 -->

- **Group:** Realign Routes (Continued)
- **Case:** Realign Routes with abandonment on a line network using subtypes, domains, attribute rules, and contingent values.

### TC-P30 — Realign Routes with retirement on a line network using subtypes, domains <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 4 -->

- **Group:** Realign Routes (Continued)
- **Case:** Realign Routes with retirement on a line network using subtypes, domains, attribute rules, and contingent values.

### TC-P31 — Realign Routes with coded domain values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 5 -->

- **Group:** Realign Routes (Continued)

### TC-P32 — Realign Routes with range domain values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 6 -->

- **Group:** Realign Routes (Continued)

### TC-P33 — Realign Routes with subtype attribute values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 7 -->

- **Group:** Realign Routes (Continued)

### TC-P34 — Realign Routes with contingent attribute values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 8 -->

- **Group:** Realign Routes (Continued)

### TC-P35 — Realign Routes with calculation attribute rules on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 9 -->

- **Group:** Realign Routes (Continued)

### TC-P36 — Realign Routes with constraint attribute rules on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 10 -->

- **Group:** Realign Routes (Continued)

### TC-P37 — Realign Routes with validation attribute rules on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 11 -->

- **Group:** Realign Routes (Continued)

### TC-P38 — Realign Routes with coded domain values on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 12 -->

- **Group:** Realign Routes (Continued)

### TC-P39 — Realign Routes with range domain values on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 13 -->

- **Group:** Realign Routes (Continued)

### TC-P40 — Realign Routes with subtype attribute values on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 14 -->

- **Group:** Realign Routes (Continued)

### TC-P41 — Realign Routes with contingent attribute values on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 15 -->

- **Group:** Realign Routes (Continued)

### TC-P42 — Realign Routes with calculation attribute rules on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 16 -->

- **Group:** Realign Routes (Continued)

### TC-P43 — Realign Routes with constraint attribute rules on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 17 -->

- **Group:** Realign Routes (Continued)

### TC-P44 — Realign Routes with validation attribute rules on a PoM network. <!-- src: S4 · slide 2 · Positive Tests: Realign Routes (Continued) · 18 -->

- **Group:** Realign Routes (Continued)

### TC-P45 — Reassign Routes with coded domain values on a line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 1 -->

- **Group:** Reassign Routes

### TC-P46 — Reassign Routes with range domain values on a line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 2 -->

- **Group:** Reassign Routes

### TC-P47 — Reassign Routes with subtype attribute values on a line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 3 -->

- **Group:** Reassign Routes

### TC-P48 — Reassign Routes with contingent attribute values on a line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 4 -->

- **Group:** Reassign Routes

### TC-P49 — Reassign Routes with calculation attribute rules on a line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 5 -->

- **Group:** Reassign Routes

### TC-P50 — Reassign Routes with constraint attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 6 -->

- **Group:** Reassign Routes
- **Case:** Reassign Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P51 — Reassign Routes with validation attribute rules on a line network. (Crashes Pro <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 7 -->

- **Group:** Reassign Routes
- **Case:** Reassign Routes with validation attribute rules on a line network. (Crashes Pro, log bug!)

### TC-P52 — Reassign Routes with coded domain values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 8 -->

- **Group:** Reassign Routes

### TC-P53 — Reassign Routes with range domain values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 9 -->

- **Group:** Reassign Routes

### TC-P54 — Reassign Routes with subtype attribute values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 10 -->

- **Group:** Reassign Routes

### TC-P55 — Reassign Routes with contingent attribute values on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 11 -->

- **Group:** Reassign Routes

### TC-P56 — Reassign Routes with calculation attribute rules on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 12 -->

- **Group:** Reassign Routes

### TC-P57 — Reassign Routes with constraint attribute rules on a non-line network. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes · 13 -->

- **Group:** Reassign Routes
- **Case:** Reassign Routes with constraint attribute rules on a non-line network. (Crashes Pro, log bug!)

### TC-P58 — Reassign Routes with validation attribute rules on a non-line network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 1 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with validation attribute rules on a non-line network. (Crashes Pro, log bug!)

### TC-P59 — Reassign Routes with coded domain values on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 2 -->

- **Group:** Reassign Routes (Continued)

### TC-P60 — Reassign Routes with range domain values on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 3 -->

- **Group:** Reassign Routes (Continued)

### TC-P61 — Reassign Routes with subtype attribute values on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 4 -->

- **Group:** Reassign Routes (Continued)

### TC-P62 — Reassign Routes with contingent attribute values on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 5 -->

- **Group:** Reassign Routes (Continued)

### TC-P63 — Reassign Routes with calculation attribute rules on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 6 -->

- **Group:** Reassign Routes (Continued)

### TC-P64 — Reassign Routes with constraint attribute rules on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 7 -->

- **Group:** Reassign Routes (Continued)

### TC-P65 — Reassign Routes with validation attribute rules on a PoM network. <!-- src: S4 · slide 3 · Positive Tests: Reassign Routes (Continued) · 8 -->

- **Group:** Reassign Routes (Continued)

## Other content

### Slide 1 — Support Core Editing Grid for LRS Route Editing Tools: Test Plan <!-- slide 1 -->

**Notes**
- Test with Line, Non-Line, and PoM Networks.
- Test domains, subtypes, contingent values and attribute rules.
- Test on Create, Realign, and Reassign Route Editing Tools.
