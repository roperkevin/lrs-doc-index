# Support Core Editing Grid for LRS Route Editing Tools: Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4250](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4250) |
| **Source** | [4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx>) |
| **Edited** | 2022-07-15 22:24 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Core Editing Grid for LRS Route Editing Tools: Test Plan"
source_file: "4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/4250-SupportCoreEditingGridforLRSRouteEditingTools-Copy.pptx"
doc_id: 655
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-07-15T22:24:15Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route editing", "attribute rules", "domain values", "line network", "non line network", "pom network", "create routes", "realign routes", "reassign routes"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#4250"]
related: [{"doc":654,"file":"support-core-editing-grid-for-lrs-route-editing-tools-test-plan__doc654.md","s":1009.66},{"doc":483,"file":"64-bit-oid-support-for-route-editing-tools__doc483.md","s":4.634},{"doc":628,"file":"investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md","s":2.892},{"doc":605,"file":"eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md","s":2.791},{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":2.167}]
```
-->

## Summary

Test plan covering positive test cases for creating, realigning, and reassigning routes with various attribute rules and domain values on line, non-line, and PoM networks. Includes tests for coded domain values, range domain values, subtypes, contingent attribute values, calculation attribute rules, constraint attribute rules, and validation attribute rules. Notes mention testing across different network types and editing tools.

## Related documents

<!-- related:begin -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-core-editing-grid-for-lrs-route-editing-tools-test-plan__doc654.md>) — shared issue ArcGISPro/ps-location-referencing#4250 · similar text 0.78 · 6 title words · 6 filename words · same kind/surface <!-- rel:654 -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-support-for-route-editing-tools__doc483.md>) — similar text 0.12 · 4 title words · 2 filename words · same kind/surface <!-- rel:483 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface <!-- rel:628 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md>) — similar text 0.14 · 3 title words · same surface <!-- rel:605 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.09 · 1 title word · same surface <!-- rel:826 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Reassign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html)

_No page matched:_ [adm](https://www.google.com/search?q=%22adm%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Support Core Editing Grid for LRS Route Editing Tools: Test Plan

| Positive Tests: Create Routes |
| --- |
| Create Routes with coded domain values on a line network. Create Routes with range domain values on a line network. Create Routes with subtype attribute values on a line network. Create Routes with contingent attribute values on a line network. Create Routes with calculation attribute rules on a line network. Create Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!) Create Routes with validation attribute rules on a line network. (Crashes Pro, log bug!) Create Routes with coded domain values on a non-line network. Create Routes with range domain values on a non-line network. Create Routes with subtype attribute values on a non-line network. Create Routes with contingent attribute values on a non-line network. Create Routes with calculation attribute rules on a non-line network. Create Routes with constraint attribute rules on a non-line network. (Crashes Pro, log bug!) Create Routes with validation attribute rules on a non-line network. (Crashes Pro, log bug!) Create Routes with coded domain values on a PoM network. Create Routes with range domain values on a PoM network. Create Routes with subtype attribute values on a PoM network. Create Routes with contingent attribute values on a PoM network. Create Routes with calculation attribute rules on a PoM network. Create Routes with constraint attribute rules on a PoM network. Create Routes with validation attribute rules on a PoM network. |

| Notes |
| --- |
| Test with Line, Non-Line, and PoM Networks. Test domains, subtypes, contingent values and attribute rules. Test on Create, Realign, and Reassign Route Editing Tools. |

| Positive Tests: Realign Routes |
| --- |
| Realign Routes with coded domain values on a line network. Realign Routes with range domain values on a line network. Realign Routes with subtype attribute values on a line network. Realign Routes with contingent attribute values on a line network. Realign Routes with calculation attribute rules on a line network. (Crashes Pro, log bug!) |

## Slide 2

| Positive Tests: Realign Routes (Continued) |
| --- |
| Realign Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!) Realign Routes with validation attribute rules on a line network. (Crashes Pro, log bug!) Realign Routes with abandonment on a line network using subtypes, domains, attribute rules, and contingent values. Realign Routes with retirement on a line network using subtypes, domains, attribute rules, and contingent values. Realign Routes with coded domain values on a non-line network. Realign Routes with range domain values on a non-line network. Realign Routes with subtype attribute values on a non-line network. Realign Routes with contingent attribute values on a non-line network. Realign Routes with calculation attribute rules on a non-line network. Realign Routes with constraint attribute rules on a non-line network. Realign Routes with validation attribute rules on a non-line network. Realign Routes with coded domain values on a PoM network. Realign Routes with range domain values on a PoM network. Realign Routes with subtype attribute values on a PoM network. Realign Routes with contingent attribute values on a PoM network. Realign Routes with calculation attribute rules on a PoM network. Realign Routes with constraint attribute rules on a PoM network. Realign Routes with validation attribute rules on a PoM network. |

| Positive Tests: Reassign Routes |
| --- |
| Reassign Routes with coded domain values on a line network. Reassign Routes with range domain values on a line network. Reassign Routes with subtype attribute values on a line network. Reassign Routes with contingent attribute values on a line network. Reassign Routes with calculation attribute rules on a line network. Reassign Routes with constraint attribute rules on a line network. (Crashes Pro, log bug!) Reassign Routes with validation attribute rules on a line network. (Crashes Pro, log bug!) Reassign Routes with coded domain values on a non-line network. Reassign Routes with range domain values on a non-line network. Reassign Routes with subtype attribute values on a non-line network. Reassign Routes with contingent attribute values on a non-line network. Reassign Routes with calculation attribute rules on a non-line network. Reassign Routes with constraint attribute rules on a non-line network. (Crashes Pro, log bug!) |

## Slide 3

| Positive Tests: Reassign Routes (Continued) |
| --- |
| Reassign Routes with validation attribute rules on a non-line network. (Crashes Pro, log bug!) Reassign Routes with coded domain values on a PoM network. Reassign Routes with range domain values on a PoM network. Reassign Routes with subtype attribute values on a PoM network. Reassign Routes with contingent attribute values on a PoM network. Reassign Routes with calculation attribute rules on a PoM network. Reassign Routes with constraint attribute rules on a PoM network. Reassign Routes with validation attribute rules on a PoM network. |
