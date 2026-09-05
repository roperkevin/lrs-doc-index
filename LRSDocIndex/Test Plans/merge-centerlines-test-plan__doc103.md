# Merge Centerlines Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#363](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/363) |
| **Source** | [363-MergeCenterlines_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/363-MergeCenterlines_TestPlanV1.pptx>) |
| **Edited** | 2025-11-26 22:11 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Merge Centerlines Test Plan"
source_file: "363-MergeCenterlines_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/363-MergeCenterlines_TestPlanV1.pptx"
doc_id: 103
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2025-11-26T22:11:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerlines", "merge", "routes", "attribute exact", "conflict prevention", "singlepart", "complex shape", "time slices", "lock", "xy tolerance", "admrh", "unapr"]
tools: ["Merge Centerlines"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#363"]
related: [{"doc":59,"file":"iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md","s":1001.079},{"doc":97,"file":"merge-centerlines__doc97.md","s":4.224},{"doc":87,"file":"merge-centerlines__doc87.md","s":4.19},{"doc":38,"file":"sld-support-for-centerline-in-un-and-adm-lrs-datasets-test-plan__doc38.md","s":3.359},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.302}]
```
-->

## Summary

Test plan for the new centerline merge operation within the Linear Referencing System (LRS) applyEdits and the Location Referencing ribbon tool. It covers positive and negative test cases for merging centerlines under various conditions including attribute matching, route association, direction, time slices, conflict prevention, and dataset types such as ADMRH and UNAPR. The plan includes tests for singlepart and complex shapes, lock acquisition, tolerance thresholds, and REST and Pro UI interactions.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Esri LRS Development](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/iteration-planning-and-issue-tracking-for-esri-lrs-development__doc59.md>) — shared issue ArcGISPro/ps-location-referencing#363 · similar text 0.03 · same surface <!-- rel:59 -->
- [Merge Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/merge-centerlines__doc97.md>) — similar text 0.20 · 2 title words · 2 filename words · same surface <!-- rel:97 -->
- [Merge Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/merge-centerlines__doc87.md>) — similar text 0.15 · 2 title words · 2 filename words · same surface <!-- rel:87 -->
- [SLD Support for Centerline in UN and ADM LRS Datasets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/sld-support-for-centerline-in-un-and-adm-lrs-datasets-test-plan__doc38.md>) — similar text 0.14 · same kind/folder <!-- rel:38 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.14 · same kind/surface <!-- rel:115 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-multipart-centerlines-into-singlepart-features.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/release-locks.html) · [Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.html)
<!-- docs:end -->

---

## Slide 1

Merge Centerlines

| Notes |
| --- |
| Add new centerline merge operation within LRS applyEdits Add new tool on LR ribbon for merging centerlines All Centerline feature attributes (excluding CenterlineID) must match to merge. ADMRH is also an exception for addressing fields and we will preserve the From Address of the “upstream” centerline and the To Address of the most “downstream” centerline Only allow centerline merge if resultant merged centerline is singlepart and not a complex shape If conflict prevention is enabled, then lock underlying route(s) associated with centerlines being merged CenterlineSequenceTable will update to reflect merged centerlines Continue to fail when merging centerlines through core Merge tool Test with FS only Test with undo/redo Pro tool icon will be disabled in FGDB/EGDB LRS datasets Test with RH, APR, APR GCS, PoM, and ADMRH data. UNAPR data will be sanity tested to ensure merge is not possible Test directly with REST and in Pro UI (more on the Pro UI) |

Devtopia Issue

![image1.png](../media/doc916_image1.png)

## Slide 2

| Positive Tests |
| --- |
| Test below test cases with nonline and line networks (unless otherwise noted) Merge centerlines with no populated attributes, including CenterlineID Merge centerlines with no populated attributes, excluding CenterlineID Merge centerlines with populated attributes that are attribute-exact Merge centerlines with inputs in different directions Merge centerlines, route has time slices but centerlines can still be merged Merge centerlines with inputs associated with multiple routes, but centerlines can still be merged Merge dozens of centerlines with no populated attributes, including CenterlineID Merge dozens of centerlines with no populated attributes, excluding CenterlineID Merge centerlines with inputs that make up a complex route shape Merge centerlines in an ADMRH dataset, address range will update in resultant merged event Merge centerlines, conflict prevention is enabled and route lock is acquired for associated route (Pro UI) 11A. Merge centerlines, conflict prevention is enabled and route lock must be acquired prior to merge (REST) Merge centerlines in GCS dataset, input 1000 centerlines with z values and length exceeds 15 miles Merge centerlines that are slightly longer than the XY Tolerance 13A. Merge centerlines with a gap that is within the XY Tolerance Merge vertical centerlines that share X,Y coordinates but have different Z coordinates Merge overlapping centerlines not associated with routes |

## Slide 3

| Negative Tests |
| --- |
| Test below test cases with nonline and line networks (unless otherwise noted) Attempt to merge centerlines with populated attributes that are not attribute-exact Attempt to merge centerlines that are not part of the same route 2A. Attempt to merge centerlines that are not part of the same route but belong to the same line 2B. Attempt to merge centerlines that are not part of the same route and do not belong to the same line Attempt to merge centerlines, one centerline has Null CenterlineID Attempt to merge centerlines in a UNAPR dataset Attempt to merge centerlines using the core Merge tool Attempt to merge centerlines, route has time slices that prevent centerlines from being merged Attempt to merge centerlines, route associated with input centerlines is locked by user in another version Attempt to merge centerlines, resultant merged centerline is not singlepart Attempt to merge centerlines, input centerlines are associated with other LRS Network route feature and are not able to merge Attempt to merge centerlines that do not have exact attributes in an ADMRH dataset Merge centerlines with inputs that make up a complex route shape, resultant merged centerline is a complex shape Attempt to merge overlapping centerlines associated with routes Attempt to merge centerlines that are smaller than the XY Tolerance Attempt to merge centerlines with only one centerline selected Attempt to merge centerlines with no centerlines selected Attempt to merge centerlines in an ADMRH dataset with centerlines that are not all in the same direction Attempt to merge centerlines that do not share z values at intersection points Attempt to merge centerlines, one Centerline has manually populated CenterlineID Attempt to merge overlapping 2D centerlines not associated with routes that do not overlap in 3D space |

## Case 1 <!-- slide 4 -->

### Merge Centerlines with No Populated Attributes

**Merge centerlines with no populated attributes, including CenterlineID**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |

[figure: Input: · Output: · 1–4]

## Case 2 <!-- slide 5 -->

### Merge Centerlines with No Populated Attributes

**Merge centerlines with no populated attributes, excluding CenterlineID**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |
| 2 | Null | Null |
| 3 | Null | Null |
| 4 | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |

[figure: Input: · Output: · 1–4 · 1 · 001 · 10 mi · 0 mi]

## Case 3 <!-- slide 6 -->

### Merge Centerlines with Populated Attributes That Are

**Merge centerlines with populated attributes that are attribute-exact**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 1]

## Case 4 <!-- slide 7 -->

### Merge Centerlines with Inputs in Different Directions

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 1]

## Case 5 <!-- slide 8 -->

### Merge Centerlines

**Merge centerlines, route has time slices but centerlines can still be merged**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Inactive |
| 2 | State | Active |
| 3 | State | Active |
| 4 | Null | Inactive |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | Network1 | 001 | 1/1/2005 | Null |
| 3 | Network1 | 001 | 1/1/2005 | Null |
| 4 | Network1 | 001 | 1/1/2010 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2005 | 1/1/2010 |
| 001 | 1/1/2010 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Inactive |
| 2 | State | Active |
| 4 | Null | Inactive |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | Network1 | 001 | 1/1/2005 | Null |
| 4 | Network1 | 001 | 1/1/2010 | Null |

[figure: 001, 1/1/2005-1/1/2010 · 001, 1/1/2010-Null · Input: · Output: · 1–4 · 10 mi · 0 mi · 15 mi · 1 · 2 · 4]

## Case 6 <!-- slide 9 -->

### Merge Centerlines with Inputs Associated with Multiple

**Merge centerlines with inputs associated with multiple routes, but centerlines can still be merged**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Inactive |
| 2 | Shared | Active |
| 3 | Shared | Active |
| 4 | County | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network2 | 45A | 1/1/2000 | Null |
| 3 | Network2 | 45A | 1/1/2000 | Null |
| 4 | Network2 | 45A | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |  |
| --- | --- | --- | --- |
| LRS Network | Route ID | From Date | To Date |
| Network1 | 001 | 1/1/2000 | Null |
| Network2 | 45A | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Inactive |
| 2 | State | Active |
| 4 | Null | Inactive |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network2 | 45A | 1/1/2000 | Null |
| 4 | Network2 | 45A | 1/1/2000 | Null |

[figure: 001 · 45A · Input: · Output: · 1–4 · 1 · 2 · 4 · 10 mi · 0 mi · 15 mi]

## Case 8 <!-- slide 10 -->

### Merge Dozens of Centerlines with No Populated Attributes

**Merge dozens of centerlines with no populated attributes, excluding CenterlineID**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| … | … | … |
| 38 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| … | … | … | … | … |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

[figure: Input: · Output: · 10 mi · 0 mi · 1 · 38]

## Case 9 <!-- slide 11 -->

### Merge Centerlines with Inputs That Make Up a Complex Route

**Merge centerlines with inputs that make up a complex route shape**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |
| 5 | State | Active |
| 6 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |
| 5 | Network1 | 001 | 1/1/2000 | Null |
| 6 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 6 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 6 | Network1 | 001 | 1/1/2000 | Null |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 5 · 6 · 1]

## Case 10 <!-- slide 12 -->

### Merge Centerlines in an ADMRH Dataset

**Merge centerlines in an ADMRH dataset, address range will update in resultant merged centerline**

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Centerline ID | County on Left | County on Right | From Left | To Left | From Right | To Right |
| 1 | Adams | Jackson | 2 | 24 | 1 | 25 |
| 2 | Adams | Jackson | 26 | 50 | 27 | 49 |
| 3 | Adams | Jackson | 52 | 74 | 51 | 75 |
| 4 | Adams | Jackson | 76 | 100 | 77 | 99 |

| Centerline Attribute Table |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Centerline ID | County on Left | County on Right | From Left | To Left | From Right | To Right |
| 1 | Adams | Jackson | 2 | 100 | 1 | 99 |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 1]

## Case 11 <!-- slide 13 -->

### Merge Centerlines

**Merge centerlines, conflict prevention is enabled and lock is acquired for associated route (Pro UI)**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |
| 2 | Null | Null |
| 3 | Null | Null |
| 4 | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |

| Locks Table |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| RouteID | Event | User | Date | Version | Releasable |
| No records |  |  |  |  |  |

| Locks Table |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| RouteID | Event | User | Date | Version | Releasable |
| 001 |  | Editor1 | XX/XX/XXXX | Editor.Version1 | No |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 1]

## Slide 14

11A. Merge centerlines, conflict prevention is enabled and route lock must be acquired prior to merge (REST)

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |
| 2 | Null | Null |
| 3 | Null | Null |
| 4 | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null |

| Locks Table (Lock acquired prior to merge) |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| RouteID | Event | User | Date | Version | Releasable |
| 001 |  | Editor1 | XX/XX/XXXX | Editor.Version1 | No |

| Locks Table |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| RouteID | Event | User | Date | Version | Releasable |
| 001 |  | Editor1 | XX/XX/XXXX | Editor.Version1 | No |

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 1]

## Case 12 <!-- slide 15 -->

### Merge Centerlines in GCS Dataset

**Merge centerlines in GCS dataset, input 1000 centerlines with populated non-zero z values and total length that exceeds 15 miles**

| Centerline Attribute Table |  |  |  |
| --- | --- | --- | --- |
| ObjectID | CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Null | Null |
| 2 | Null | Null | Null |
| … | … | … | … |
| 1000 | Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |

[figure: Input: · Output: · 1 · 1000 · 25 mi · 0 mi]

## Case 13 <!-- slide 16 -->

### Merge Centerlines That Are Slightly Longer Than the XY

**Merge centerlines that are slightly longer than the XY Tolerance**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |

XY Tolerance is 0.001 meters

[figure: Input: · Output: · 1–4 · 0.002 m · 0 m · 0.004 m]

## Slide 17

13A. Merge centerlines with a gap that is within the XY Tolerance

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |

XY Tolerance is 0.001 meters

[figure: Input: · Output: · 1–4 · 0 mi · 0 m · 10 mi · 0.0009 m gap]

## Case 14 <!-- slide 18 -->

### Merge Vertical Centerlines That Share X,Y Coordinates but

**Merge vertical centerlines that share X,Y coordinates but have different Z coordinates**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |

[figure: Input: · Output: · 1–4 · 1]

## Case 15 <!-- slide 19 -->

### Merge Overlapping Centerlines Not Associated with Routes

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

[figure: Input: · Output: · 1–4 · 10 mi · 0 mi · 2 · 4]

## Case 1 <!-- slide 20 -->

### Attempt To Merge Centerlines with Populated Attributes That

**Attempt to merge centerlines with populated attributes that are not attribute-exact**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Proposed |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, centerlines are not attribute exact

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 2 <!-- slide 21 -->

### Attempt To Merge Centerlines That Are Not Part of the Same

**Attempt to merge centerlines that are not part of the same route**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Transmission | Active |
| 2 | Transmission | Active |
| 3 | Transmission | Active |
| 4 | Transmission | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 002 | 1/1/2000 | Null |
| 4 | Network1 | 002 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |
| 002 | 1/1/2000 | Null |

ERROR, centerlines belong to more than one route and cannot be merged

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 002]

## Slide 22

2A. Attempt to merge centerlines that are not part of the same route but belong to the same line

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Transmission | Active |
| 2 | Transmission | Active |
| 3 | Transmission | Active |
| 4 | Transmission | Active |

| LRS Network Attribute Table |  |  |  |
| --- | --- | --- | --- |
| Line Name | Route Name | From Date | To Date |
| Line1 | L1_R1 | 1/1/2000 | Null |
| Line1 | L1_R1 | 1/1/2000 | Null |

ERROR, centerlines belong to more than one route and cannot be merged

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 002 | 1/1/2000 | Null |
| 4 | Network1 | 002 | 1/1/2000 | Null |

[figure: Input: · Output: · 1–4 · L1_R1 · L1_R2 · 10 mi · 0 mi]

## Slide 23

2B. Attempt to merge centerlines that are not part of the same route and do not belong to the same line

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Transmission | Active |
| 2 | Transmission | Active |
| 3 | Transmission | Active |
| 4 | Transmission | Active |

| LRS Network Attribute Table |  |  |  |
| --- | --- | --- | --- |
| Line Name | Route Name | From Date | To Date |
| Line1 | L1_R1 | 1/1/2000 | Null |
| Line2 | L2_R1 | 1/1/2000 | Null |

ERROR, centerlines belong to more than one route and cannot be merged

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 002 | 1/1/2000 | Null |
| 4 | Network1 | 002 | 1/1/2000 | Null |

[figure: Input: · Output: · 1–4 · L1_R1 · L2_R1 · 10 mi · 0 mi]

## Case 3 <!-- slide 24 -->

### Attempt To Merge Centerlines

**Attempt to merge centerlines, one centerline has Null CenterlineID**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| Null | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, one centerline has a Null CenterlineID

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 4 <!-- slide 25 -->

### Attempt To Merge Centerlines in a UNAPR Dataset

| Pipeline Line Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Distribution Pipe | Coated |
| 2 | Distribution Pipe | Coated |
| 3 | Distribution Pipe | Coated |
| 4 | Distribution Pipe | Coated |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| Route Name | From Date | To Date |
| Route 001 | 1/1/2000 | Null |

ERROR, centerlines cannot be merged in UNAPR dataset

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 5 <!-- slide 26 -->

### Attempt To Merge Centerlines Using the Core Merge Tool

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

ERROR, centerlines cannot be merged using the core Merge tool

[figure: Input: · Output: · 1–4]

## Case 6 <!-- slide 27 -->

### Merge Centerlines

**Merge centerlines, route has time slices that prevent centerline from being merged**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Inactive |
| 2 | State | Active |
| 3 | State | Active |
| 4 | Null | Inactive |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | 1 | 001 | 1/1/2000 | Null |
| 3 | 1 | 001 | 1/1/2005 | Null |
| 4 | 1 | 001 | 1/1/2010 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | 1/1/2005 |
| 001 | 1/1/2005 | 1/1/2010 |
| 001 | 1/1/2010 | Null |

ERROR, associated routes have time slices that prevent the centerlines from being merged

[figure: 001, 1/1/2000-1/1/2005 · 001, 1/1/2005-1/1/2010 · 001, 1/1/2010-Null · Input: · Output: · 1–4 · 10 mi · 0 mi · 5 mi · 15 mi]

## Case 7 <!-- slide 28 -->

### Attempt To Merge Centerlines

**Attempt to merge centerlines, route associated with input centerlines is locked by user in another version**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, associated route is locked by user in another version

| Locks Table |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| RouteID | Event | User | Date | Version | Releasable |
| 001 |  | Editor1 | XX/XX/XXXX | Editor.Version1 | No |

[figure: Input: · Output: · 1–4 · 10 mi · 0 mi]

## Case 8 <!-- slide 29 -->

### Attempt To Merge Centerlines

**Attempt to merge centerlines, resultant merged centerline is not singlepart (also test with Null CenterlineID centerlines)**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, merged centerline must be a singlepart feature

[figure: Input: · Output: · 1–4 · 10 mi · 0 mi]

## Case 9 <!-- slide 30 -->

### Attempt To Merge Centerlines

**Attempt to merge centerlines, input centerlines are associated with other LRS Network route feature and cannot merge**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | Null | Inactive |
| 2 | Shared | Active |
| 3 | Shared | Active |
| 4 | County | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network2 | 45A | 1/1/2000 | Null |
| 3 | Network2 | 45A | 1/1/2000 | Null |
| 4 | Network2 | 45A | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |  |
| --- | --- | --- | --- |
| LRS Network | Route ID | From Date | To Date |
| Network1 | 001 | 1/1/2000 | Null |
| Network2 | 45A | 1/1/2000 | Null |

ERROR, input centerlines are not shared with associated routes that belong to different LRS Networks

[figure: 001 · 45A · Input: · Output: · 1–4 · 10 mi · 0 mi · 15 mi]

## Case 10 <!-- slide 31 -->

### Attempt To Merge Centerlines That Do Not Have Exact

**Attempt to merge centerlines that do not have exact attributes in an ADMRH dataset**

| Centerline Attribute Table |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Centerline ID | County on Left | County on Right | From Left | To Left | From Right | To Right |
| 1 | Adams | Jackson | 2 | 24 | 1 | 25 |
| 2 | Adams | Jackson | 26 | 50 | 27 | 49 |
| 3 | Adams | Jackson | 52 | 74 | 51 | 75 |
| 4 | Shasta | Jackson | 76 | 100 | 77 | 99 |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, input centerlines are not attribute-exact

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 11 <!-- slide 32 -->

### Merge Centerlines with Inputs That Make Up a Complex Route

**Merge centerlines with inputs that make up a complex route shape, resultant merged centerline is a complex shape**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |
| 5 | State | Active |
| 6 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |
| 5 | Network1 | 001 | 1/1/2000 | Null |
| 6 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, input centerlines will result in a complex shape

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi · 5 · 6]

## Case 12 <!-- slide 33 -->

### Attempt To Merge Overlapping Centerlines Associated with

**Attempt to merge overlapping centerlines associated with routes**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 002 | 1/1/2000 | Null |
| 4 | Network1 | 002 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |
| 002 | 1/1/2000 | Null |

ERROR, input centerlines do not share routes

[figure: Input: · Output: · 1–4 · 10 mi · 0 mi · 001]

## Case 13 <!-- slide 34 -->

### Attempt To Merge Centerlines That Are Smaller Than the XY

**Attempt to merge centerlines that are smaller than the XY Tolerance**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

XY Tolerance is 0.001 meters
ERROR, input centerlines are smaller than the XY Tolerance

[figure: Input: · Output: · 1–4 · 0.0004 m · 0 m]

## Case 14 <!-- slide 35 -->

### Attempt To Merge Centerlines with Only One Centerline

**Attempt to merge centerlines with only one centerline selected**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

ERROR, only one centerline is selected

[figure: Input: · Output: · 1–4]

## Case 15 <!-- slide 36 -->

### Attempt To Merge Centerlines with No Centerlines Selected

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| No records |  |  |  |  |

ERROR, no centerlines are selected

[figure: Input: · Output: · 1–4]

## Case 16 <!-- slide 37 -->

### Attempt To Merge Centerlines in an ADMRH Dataset with

**Attempt to merge centerlines in an ADMRH dataset with centerlines that are not all in the same direction**

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

| Centerline Attribute Table |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Centerline ID | County on Left | County on Right | From Left | To Left | From Right | To Right |
| 1 | Adams | Jackson | 2 | 24 | 1 | 25 |
| 2 | Adams | Jackson | 27 | 49 | 26 | 50 |
| 3 | Adams | Jackson | 52 | 74 | 51 | 75 |
| 4 | Adams | Jackson | 76 | 100 | 77 | 99 |

ERROR, centerlines in an ADMRH dataset must all be in the same direction

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 17 <!-- slide 38 -->

### Attempt To Merge Centerlines That Do Not Share Z Values at

**Attempt to merge centerlines that do not share z values at intersection points**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 4 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |
| 4 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, merged centerlines cannot be multipart

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 18 <!-- slide 39 -->

### Attempt To Merge Centerlines

**Attempt to merge centerlines, one Centerline has manually populated CenterlineID**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| 1 | State | Active |
| 2 | State | Active |
| 3 | State | Active |
| 99 | State | Active |

| CenterlineSequenceTable |  |  |  |  |
| --- | --- | --- | --- | --- |
| Centerline ID | Network ID | Route ID | From Date | To Date |
| 1 | Network1 | 001 | 1/1/2000 | Null |
| 2 | Network1 | 001 | 1/1/2000 | Null |
| 3 | Network1 | 001 | 1/1/2000 | Null |

| LRS Network Attribute Table |  |  |
| --- | --- | --- |
| RouteID | From Date | To Date |
| 001 | 1/1/2000 | Null |

ERROR, centerlines do not share routes

[figure: Input: · Output: · 1–4 · 001 · 10 mi · 0 mi]

## Case 19 <!-- slide 40 -->

### Attempt To Merge Overlapping 2D Centerlines Not Associated

**Attempt to merge overlapping 2D centerlines not associated with routes that do not overlap in 3D space**

| Centerline Attribute Table |  |  |
| --- | --- | --- |
| CenterlineID | Attribute1 | Attribute2 |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |
| Null | Null | Null |

ERROR, merged centerline will not be a singlepart feature

[figure: Input: · Output: · 1–4 · 10 mi · 0 mi]
