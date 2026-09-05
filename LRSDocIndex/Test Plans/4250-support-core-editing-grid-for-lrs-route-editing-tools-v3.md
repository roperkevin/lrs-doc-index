# Support Core Editing Grid for LRS Route Editing Tools: Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 654 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#4250](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4250) |
| **Source** | [4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx>) · rev V3 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2022-07-20 18:18 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route editing · core editing grid · attribute rules · domains · subtypes · contingent values · realign routes · reassign routes · create routes |
| **Tools** | — |

## Summary

Test plan for core editing grid functionality in LRS route editing tools including Create, Realign, and Reassign Routes. Covers positive tests for attribute domains, subtypes, contingent values, and attribute rules on line, non-line, and PoM networks. Validates attribute value retention and error messaging across tools.

## Related documents

<!-- related:begin -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/4250-support-core-editing-grid-for-lrs-route-editing-tools-2022-07.md>) — shared issue ArcGISPro/ps-location-referencing#4250 · similar text 0.78 · 6 title words · 6 filename words · same kind/surface <!-- rel:655 s=1009.508 -->
- [Spike: Attribute Rules in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/attribute-rules-in-lrs.md>) — similar text 0.23 · same surface <!-- rel:814 s=2.974 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface <!-- rel:628 s=2.848 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools.md>) — similar text 0.16 · 3 title words · same surface <!-- rel:605 s=2.813 -->
- [Support Modifying and Deleting Lookup Table in an LRS Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-modifying-and-deleting-lookup-table-in-an-lrs.md>) — similar text 0.12 · 1 title word · 1 filename word · same surface <!-- rel:610 s=2.369 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Reassign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)

_No page matched:_ [adm](https://www.google.com/search?q=%22adm%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Create Routes with coded domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 1 -->

- **Group:** Create Routes

### TC-P02 — Create Routes with range domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 2 -->

- **Group:** Create Routes

### TC-P03 — Create Routes with subtype attribute values on line, non-line, and PoM networks. <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 3 -->

- **Group:** Create Routes

### TC-P04 — Create Routes with contingent attribute values on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 4 -->

- **Group:** Create Routes
- **Case:** Create Routes with contingent attribute values on line, non-line, and PoM networks.

### TC-P05 — Create Routes with calculation attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 5 -->

- **Group:** Create Routes
- **Case:** Create Routes with calculation attribute rules on line, non-line, and PoM networks.

### TC-P06 — Create Routes with constraint attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 6 -->

- **Group:** Create Routes
- **Case:** Create Routes with constraint attribute rules on line, non-line, and PoM networks.

### TC-P07 — Create Routes with validation attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Create Routes · 7 -->

- **Group:** Create Routes
- **Case:** Create Routes with validation attribute rules on line, non-line, and PoM networks.

### TC-P08 — Realign Routes with coded domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 1 -->

- **Group:** Realign Routes

### TC-P09 — Realign Routes with range domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 2 -->

- **Group:** Realign Routes

### TC-P10 — Realign Routes with subtype attribute values on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 3 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with subtype attribute values on line, non-line, and PoM networks.

### TC-P11 — Realign Routes with contingent attribute values on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 4 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with contingent attribute values on line, non-line, and PoM networks.

### TC-P12 — Realign Routes with calculation attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 5 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with calculation attribute rules on line, non-line, and PoM networks.

### TC-P13 — Realign Routes with constraint attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 6 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with constraint attribute rules on line, non-line, and PoM networks.

### TC-P14 — Realign Routes with validation attribute rules on line, non-line <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 7 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with validation attribute rules on line, non-line, and PoM networks.

### TC-P15 — Realign Routes with abandonment on a line network using subtypes, domains <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 8 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with abandonment on a line network using subtypes, domains, attribute rules, and contingent values.

### TC-P16 — Realign Routes with retirement on a line network using subtypes, domains <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 9 -->

- **Group:** Realign Routes
- **Case:** Realign Routes with retirement on a line network using subtypes, domains, attribute rules, and contingent values.

### TC-P17 — When changing panes within the tool, ensure that attribute values are not lost. (1) <!-- src: S4 · slide 1 · Positive Tests: Realign Routes · 10 -->

- **Group:** Realign Routes

### TC-P18 — Reassign Routes with coded domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 1 -->

- **Group:** Reassign Routes (Continued)

### TC-P19 — Reassign Routes with range domain values on line, non-line, and PoM networks. <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 2 -->

- **Group:** Reassign Routes (Continued)

### TC-P20 — Reassign Routes with subtype attribute values on line, non-line <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 3 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with subtype attribute values on line, non-line, and PoM networks.

### TC-P21 — Reassign Routes with contingent attribute values on line, non-line <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 4 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with contingent attribute values on line, non-line, and PoM networks.

### TC-P22 — Reassign Routes with calculation attribute rules on line, non-line <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 5 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with calculation attribute rules on line, non-line, and PoM networks.

### TC-P23 — Reassign Routes with constraint attribute rules on line, non-line <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 6 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with constraint attribute rules on line, non-line, and PoM networks.

### TC-P24 — Reassign Routes with validation attribute rules on line, non-line <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 7 -->

- **Group:** Reassign Routes (Continued)
- **Case:** Reassign Routes with validation attribute rules on line, non-line, and PoM networks.

### TC-P25 — When changing panes within the tool, ensure that attribute values are not lost. (2) <!-- src: S4 · slide 2 · Positive Tests: Reassign Routes (Continued) · 8 -->

- **Group:** Reassign Routes (Continued)

### TC-P26 — Ensure that subtype default values are honored on a network types. <!-- src: S4 · slide 2 · Positive Tests: All Tools · 1 -->

- **Group:** All Tools

### TC-P27 — When domains, subtypes, contingent values, and attribute rules are not followed <!-- src: S4 · slide 2 · Positive Tests: All Tools · 2 -->

- **Group:** All Tools
- **Case:** When domains, subtypes, contingent values, and attribute rules are not followed, the resulting error message must make sense.

### TC-P28 — Ensure field aliases are correctly shown for each field within the grid within <!-- src: S4 · slide 2 · Positive Tests: All Tools · 3 -->

- **Group:** All Tools
- **Case:** Ensure field aliases are correctly shown for each field within the grid within the route editing tool pane.

## Other content

### Slide 1 — Support Core Editing Grid for LRS Route Editing Tools: Test Plan <!-- slide 1 -->

**Notes**
- Test with Line, Non-Line, and PoM Networks.
- Test domains, subtypes, contingent values and attribute rules.
- Test on Create, Realign, and Reassign Route Editing Tools.
- For non-line networks with multifield route IDs, the core editing grid cannot be used because it will not work with the lookup tables and padding values.
