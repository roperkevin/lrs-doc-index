# OID Conflicts Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [arcgispro/ps-location-referencing#4594](https://devtopia.esri.com/arcgispro/ps-location-referencing/issues/4594) |
| **Source** | [4594-OIDConflicts_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4594-OIDConflicts_TestPlan.pptx>) |
| **Edited** | 2022-09-12 19:12 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "OID Conflicts Test Plan"
source_file: "4594-OIDConflicts_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4594-OIDConflicts_TestPlan.pptx"
doc_id: 635
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-09-12T19:12:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["conflict detection", "calibration point", "centerline", "event editing", "route editing", "reconcile", "versioning"]
tools: []
products: []
issues: ["arcgispro/ps-location-referencing#4594"]
related: [{"doc":483,"file":"64-bit-oid-support-for-route-editing-tools__doc483.md","s":3.327},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":2.166},{"doc":157,"file":"advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md","s":1.92},{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":1.662},{"doc":501,"file":"64-bit-oid-in-other-lrs-pro-tools__doc501.md","s":1.569}]
```
-->

## Summary

Test plan to ensure geodatabase level conflict detection functions correctly with LRS features by performing multiple edits on the same features in different versions and verifying conflict detection during reconcile and post operations. Covers negative test cases for calibration point, centerline, event, and route editing scenarios.

## Related documents

<!-- related:begin -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-support-for-route-editing-tools__doc483.md>) — similar text 0.12 · 1 title word · same kind/surface/folder <!-- rel:483 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.11 · same kind/surface <!-- rel:115 -->
- [Advanced Versioning Capabilities in LRS Configuration Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md>) — similar text 0.11 · same kind/folder <!-- rel:157 -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — similar text 0.08 · same surface <!-- rel:2 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools__doc501.md>) — similar text 0.04 · 1 title word · same surface <!-- rel:501 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [calibration point editing](https://www.google.com/search?q=%22calibration%20point%20editing%22+site%3Adoc.esri.com) · [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

OID Conflicts

| Notes |
| --- |
| Want to ensure that GDB level conflict detection works properly with LRS features LRS conflict prevention will be turned off Test with all LRS editing tools (i.e. calibration point, centerline, event, and route editing) Main workflow of testing this will be editing the same feature multiple times in different versions using the same LRS tool, then attempting to reconcile and post to the default version |

| Negative Tests: Calibration Point Editing |
| --- |
| Edit the same calibration point multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. |

| Negative Tests: Centerline Editing |
| --- |
| Split the same centerline by point multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Split the same centerline by measure multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Split the same centerline into singlepart features in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. |

| Negative Tests: Event Editing |
| --- |
| Split the same event multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Merge the same event multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. |

Devtopia Issue

## Slide 2

| Negative Tests: Route Editing |
| --- |
| Realign the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Extend the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Retire the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Reassign the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. Reverse the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. |

| Negative Tests: Multiple Edit Operations |
| --- |
| Multiple edit operations performed on the same route/routes within two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts are prevent the reconcile. |
