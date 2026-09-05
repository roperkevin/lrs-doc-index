# All LRS Widgets: Create a Single Route Picker

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24843](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24843) |
| **Source** | [24843-SingleRoutePicker_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/24843-SingleRoutePicker_TestPlanV1.pptx>) |
| **Edited** | 2025-05-07 14:33 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "All LRS Widgets: Create a Single Route Picker"
source_file: "24843-SingleRoutePicker_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/24843-SingleRoutePicker_TestPlanV1.pptx"
doc_id: 180
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: "V1"
target_release: ""
pe: ""
dev: "Devtopia Issue"
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2025-05-07T14:33:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route picker", "experience builder widget", "route selection", "measure selection", "self intersecting location", "route id", "route name"]
tools: ["Add Point Event", "Add Line Event", "Split Event", "LRS Identify"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24843"]
related: [{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":1000.558},{"doc":193,"file":"create-single-lrs-picker-for-experience-builder-widgets__doc193.md","s":4.427},{"doc":174,"file":"experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md","s":3.423},{"doc":48,"file":"location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md","s":2.723},{"doc":415,"file":"test-plan-conflict-prevention-for-lrs-widgets__doc415.md","s":2.384}]
```
-->

## Summary

Test plan for creating a single route picker to be used across all LRS widgets in Experience Builder. Covers positive tests for route picker behavior including icon consistency, route selection pop-ups, and measure selection pop-ups across multiple widgets and data configurations. Ensures consistency, edit sanity, and compliance with internationalization and accessibility standards.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24843 · similar text 0.05 <!-- rel:2 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-experience-builder-widgets__doc193.md>) — similar text 0.30 · 4 title words · 2 filename words · same surface <!-- rel:193 -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:174 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md>) — similar text 0.11 · 1 title word · same kind/surface <!-- rel:48 -->
- [Test Plan: Conflict Prevention for LRS Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-conflict-prevention-for-lrs-widgets__doc415.md>) — similar text 0.05 · 1 title word · same kind/surface <!-- rel:415 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

All LRS Widgets: Create a single route picker

| Positive Tests: All Widgets |
| --- |
| Picker button icon is visually same across all widgets (except for LRS Identify) Picker button icon updates appropriately with all out-of-the-box themes When active vs. non-active, the picker button icon will visually reflect the state Clicking a location with no routes will not populate any RouteID/RouteName or measure Picker behavior is consistent between widgets |

| Notes |
| --- |
| Need to create a single route picker for all widgets in ExB to maintain consistency between widgets Test with all widgets that include a route picker. Widgets to test: Add Point Event Add Line Event LRS Identify Split Event Test with mix of APR, UNAPR, RH, ADMRH and PoM data Test with data in PCS vs. GCS Test with LRS networks configured with RouteID vs. RouteName Ensure consistency between the picker in each widget Sanity test edits can still be performed I18n and 508 compliance |

Devtopia Issue

| Positive Tests: Add Point/Add Line/Split Event Widgets |
| --- |
| When clicking on a location with one route, the RouteID/RouteName populates When clicking on a location with more than one route, a route selection pop-up appears When clicking on a self-intersecting location, a measure selection pop-up appears (except for Split Event, only routes can be picked |

| Positive Tests: LRS Identify Widget |
| --- |
| When clicking on a location with one route, the pop-up appears with the route info When clicking on a location with one route, the pop-up appears with the route info and event info, when configured When clicking a location with more than one route, all routes appear in the pop-up When clicking a self-intersecting location, both measures are displayed in the pop-up |
