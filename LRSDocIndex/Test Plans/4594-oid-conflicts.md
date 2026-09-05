# OID Conflicts Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 635 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [arcgispro/ps-location-referencing#4594](https://devtopia.esri.com/arcgispro/ps-location-referencing/issues/4594) |
| **Source** | [4594-OIDConflicts_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4594-OIDConflicts_TestPlan.pptx>) |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2022-09-12 19:12 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict detection · calibration point · centerline · event editing · route editing · reconcile · versioning |
| **Tools** | — |

## Summary

Test plan to ensure geodatabase level conflict detection functions correctly with LRS features by performing multiple edits on the same features in different versions and verifying conflict detection during reconcile and post operations. Covers negative test cases for calibration point, centerline, event, and route editing scenarios.

## Related documents

<!-- related:begin -->
- [64-bit OID Support for Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5013-64-bit-oid-support-for-route-editing-tools.md>) — similar text 0.12 · 1 title word · same kind/surface/folder <!-- rel:483 s=3.327 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.11 · same kind/surface <!-- rel:115 s=2.166 -->
- [Advanced Versioning Capabilities in LRS Configuration Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/26708-advanced-versioning-capabilities-in-lrs-configuration-widget.md>) — similar text 0.11 · same kind/folder <!-- rel:157 s=1.92 -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/3040-iteration-planning-and-issue-tracking-for-lr-3-8-12-2.md>) — similar text 0.08 · same surface <!-- rel:2 s=1.662 -->
- [64-bit OID in other LRS Pro tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-other-lrs-pro-tools.md>) — similar text 0.04 · 1 title word · same surface <!-- rel:501 s=1.569 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [calibration point editing](https://www.google.com/search?q=%22calibration%20point%20editing%22+site%3Adoc.esri.com) · [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-N01 — Split the same centerline by point multiple times in two separate child versions <!-- src: S4 · slide 1 · Negative Tests: Centerline Editing · 1 -->

- **Group:** Centerline Editing
- **Case:** Split the same centerline by point multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N02 — Split the same centerline by measure multiple times in two separate child <!-- src: S4 · slide 1 · Negative Tests: Centerline Editing · 2 -->

- **Group:** Centerline Editing
- **Case:** Split the same centerline by measure multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N03 — Split the same centerline into singlepart features in two separate child <!-- src: S4 · slide 1 · Negative Tests: Centerline Editing · 3 -->

- **Group:** Centerline Editing
- **Case:** Split the same centerline into singlepart features in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N04 — Split the same event multiple times in two separate child versions off default. <!-- src: S4 · slide 1 · Negative Tests: Event Editing · 1 -->

- **Group:** Event Editing
- **Case:** Split the same event multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N05 — Merge the same event multiple times in two separate child versions off default. <!-- src: S4 · slide 1 · Negative Tests: Event Editing · 2 -->

- **Group:** Event Editing
- **Case:** Merge the same event multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N06 — Realign the same route multiple times in two separate child versions off <!-- src: S4 · slide 2 · Negative Tests: Route Editing · 1 -->

- **Group:** Route Editing
- **Case:** Realign the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N07 — Extend the same route multiple times in two separate child versions off default. <!-- src: S4 · slide 2 · Negative Tests: Route Editing · 2 -->

- **Group:** Route Editing
- **Case:** Extend the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N08 — Retire the same route multiple times in two separate child versions off default. <!-- src: S4 · slide 2 · Negative Tests: Route Editing · 3 -->

- **Group:** Route Editing
- **Case:** Retire the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N09 — Reassign the same route multiple times in two separate child versions off <!-- src: S4 · slide 2 · Negative Tests: Route Editing · 4 -->

- **Group:** Route Editing
- **Case:** Reassign the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

### TC-N10 — Reverse the same route multiple times in two separate child versions off <!-- src: S4 · slide 2 · Negative Tests: Route Editing · 5 -->

- **Group:** Route Editing
- **Case:** Reverse the same route multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile.

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

OID Conflicts

**Notes**
- Want to ensure that GDB level conflict detection works properly with LRS features
- LRS conflict prevention will be turned off
- Test with all LRS editing tools (i.e. calibration point, centerline, event, and route editing)
- Main workflow of testing this will be editing the same feature multiple times in different versions using the same LRS tool, then attempting to reconcile and post to the default version

| Negative Tests: Calibration Point Editing |
| --- |
| Edit the same calibration point multiple times in two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts and prevent the reconcile. |

### Slide 2 <!-- slide 2 -->

| Negative Tests: Multiple Edit Operations |
| --- |
| Multiple edit operations performed on the same route/routes within two separate child versions off default. Attempt a reconcile, conflict detection will detect conflicts are prevent the reconcile. |
