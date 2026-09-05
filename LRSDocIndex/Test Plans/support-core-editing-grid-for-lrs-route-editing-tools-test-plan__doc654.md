# Support Core Editing Grid for LRS Route Editing Tools: Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4250](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4250) |
| **Source** | [4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx>) |
| **Edited** | 2022-07-20 18:18 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Core Editing Grid for LRS Route Editing Tools: Test Plan"
source_file: "4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4250-SupportCoreEditingGridforLRSRouteEditingTools_V3.pptx"
doc_id: 654
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V3"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-07-20T18:18:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route editing", "core editing grid", "attribute rules", "domains", "subtypes", "contingent values", "realign routes", "reassign routes", "create routes"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#4250"]
related: [{"doc":655,"file":"support-core-editing-grid-for-lrs-route-editing-tools-test-plan__doc655.md","s":1009.508},{"doc":814,"file":"spike-attribute-rules-in-lrs__doc814.md","s":2.974},{"doc":628,"file":"investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md","s":2.848},{"doc":605,"file":"eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md","s":2.813},{"doc":610,"file":"support-modifying-and-deleting-lookup-table-in-an-lrs-network__doc610.md","s":2.369}]
```
-->

## Summary

Test plan for core editing grid functionality in LRS route editing tools including Create, Realign, and Reassign Routes. Covers positive tests for attribute domains, subtypes, contingent values, and attribute rules on line, non-line, and PoM networks. Validates attribute value retention and error messaging across tools.

## Related documents

<!-- related:begin -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/support-core-editing-grid-for-lrs-route-editing-tools-test-plan__doc655.md>) — shared issue ArcGISPro/ps-location-referencing#4250 · similar text 0.78 · 6 title words · 6 filename words · same kind/surface <!-- rel:655 -->
- [Spike: Attribute Rules in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-attribute-rules-in-lrs__doc814.md>) — similar text 0.23 · same surface <!-- rel:814 -->
- [Investigate Negative Measures for LR Tools in Pro/REST/EE](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/investigate-negative-measures-for-lr-tools-in-pro-rest-ee__doc628.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface <!-- rel:628 -->
- [Eyedropper Tool for Attribute Copying in Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/eyedropper-tool-for-attribute-copying-in-route-editing-tools__doc605.md>) — similar text 0.16 · 3 title words · same surface <!-- rel:605 -->
- [Support Modifying and Deleting Lookup Table in an LRS Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-modifying-and-deleting-lookup-table-in-an-lrs-network__doc610.md>) — similar text 0.12 · 1 title word · 1 filename word · same surface <!-- rel:610 -->
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
| Create Routes with coded domain values on line, non-line, and PoM networks. Create Routes with range domain values on line, non-line, and PoM networks. Create Routes with subtype attribute values on line, non-line, and PoM networks. Create Routes with contingent attribute values on line, non-line, and PoM networks. Create Routes with calculation attribute rules on line, non-line, and PoM networks. Create Routes with constraint attribute rules on line, non-line, and PoM networks. Create Routes with validation attribute rules on line, non-line, and PoM networks. |

| Notes |
| --- |
| Test with Line, Non-Line, and PoM Networks. Test domains, subtypes, contingent values and attribute rules. Test on Create, Realign, and Reassign Route Editing Tools. For non-line networks with multifield route IDs, the core editing grid cannot be used because it will not work with the lookup tables and padding values. |

| Positive Tests: Realign Routes |
| --- |
| Realign Routes with coded domain values on line, non-line, and PoM networks. Realign Routes with range domain values on line, non-line, and PoM networks. Realign Routes with subtype attribute values on line, non-line, and PoM networks. Realign Routes with contingent attribute values on line, non-line, and PoM networks. Realign Routes with calculation attribute rules on line, non-line, and PoM networks. Realign Routes with constraint attribute rules on line, non-line, and PoM networks. Realign Routes with validation attribute rules on line, non-line, and PoM networks. Realign Routes with abandonment on a line network using subtypes, domains, attribute rules, and contingent values. Realign Routes with retirement on a line network using subtypes, domains, attribute rules, and contingent values. When changing panes within the tool, ensure that attribute values are not lost. |

## Slide 2

| Positive Tests: Reassign Routes (Continued) |
| --- |
| Reassign Routes with coded domain values on line, non-line, and PoM networks. Reassign Routes with range domain values on line, non-line, and PoM networks. Reassign Routes with subtype attribute values on line, non-line, and PoM networks. Reassign Routes with contingent attribute values on line, non-line, and PoM networks. Reassign Routes with calculation attribute rules on line, non-line, and PoM networks. Reassign Routes with constraint attribute rules on line, non-line, and PoM networks. Reassign Routes with validation attribute rules on line, non-line, and PoM networks. When changing panes within the tool, ensure that attribute values are not lost. |

| Positive Tests: All Tools |
| --- |
| Ensure that subtype default values are honored on a network types. When domains, subtypes, contingent values, and attribute rules are not followed, the resulting error message must make sense. Ensure field aliases are correctly shown for each field within the grid within the route editing tool pane. |
