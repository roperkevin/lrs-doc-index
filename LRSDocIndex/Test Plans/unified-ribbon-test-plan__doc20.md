# Unified Ribbon Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [Unified_Ribbon_TestPlan1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Unified_Ribbon_TestPlan1.pptx>) |
| **Edited** | 2026-06-22 15:13 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Unified Ribbon Test Plan"
source_file: "Unified_Ribbon_TestPlan1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Unified_Ribbon_TestPlan1.pptx"
doc_id: 20
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2026-06-22T15:13:27Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["ribbon", "route editing", "tooltips", "keyboard navigation", "dark mode", "feature class", "linear referencing extension", "location referencing"]
tools: ["Make Route", "Define Line Portion", "Calibrate Route", "Route Identifier tools", "Event Editing Group tools", "Centerline Editing Group tools", "Conflict Prevention Group tools"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":360,"file":"add-point-event-to-dominant-route-in-arcgis-pro-test-plan__doc360.md","s":2.982},{"doc":340,"file":"reorganize-location-referencing-pro-options-test-plan__doc340.md","s":2.613},{"doc":656,"file":"set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md","s":2.565},{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":2.529},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":2.323}]
```
-->

## Summary

Test plan for verifying the behavior and functionality of the unified ribbon in ArcGIS Pro when working with feature classes containing measures. Includes tests for tool availability, licensing messages, ribbon customization, dark mode, tooltips, keyboard navigation, screen reader support, and context-based tool visibility across various resolutions and scales.

## Related documents

<!-- related:begin -->
- [Add Point Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-event-to-dominant-route-in-arcgis-pro-test-plan__doc360.md>) — similar text 0.04 · same kind/surface/folder <!-- rel:360 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc340.md>) — similar text 0.07 · same kind/surface/folder <!-- rel:340 -->
- [Set Time Filter Button LR Pro Ribbon: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md>) — similar text 0.10 · 1 title word · same kind/surface/folder <!-- rel:656 -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — similar text 0.03 · same surface <!-- rel:2 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.07 · same kind/surface <!-- rel:115 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [Make Route](https://www.google.com/search?q=%22Make%20Route%22+site%3Adoc.esri.com) · [Define Line Portion](https://www.google.com/search?q=%22Define%20Line%20Portion%22+site%3Adoc.esri.com) · [Calibrate Route](https://www.google.com/search?q=%22Calibrate%20Route%22+site%3Adoc.esri.com) · [Route Identifier tools](https://www.google.com/search?q=%22Route%20Identifier%20tools%22+site%3Adoc.esri.com) · [Event Editing Group tools](https://www.google.com/search?q=%22Event%20Editing%20Group%20tools%22+site%3Adoc.esri.com) · [Centerline Editing Group tools](https://www.google.com/search?q=%22Centerline%20Editing%20Group%20tools%22+site%3Adoc.esri.com) · [Conflict Prevention Group tools](https://www.google.com/search?q=%22Conflict%20Prevention%20Group%20tools%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![image1.png](../media/doc1013_image1.png)

## Slide 2

Verify that

- The ribbon shows up ONLY when a feature class containing measures is present in the TOC
- All the tools in the Route Identifier group are available when a feature class containing measures is present in the TOC
- The Make Route, Define Line Portion, and Calibrate Route tools in the Route Editing group display the message “Only Linear Referencing Extension tools can be used to edit this layer” whenever a feature class with the Linear Referencing data model, and the Linear Referencing extension license is supplied as the tool input.
- The tools in the Route Editing group—except the Make Route, Define Line Portion, and Calibrate Route tools—along with the Event Editing Group, Centerline Editing Group, Data Products, Settings Group, Tools Group, and Conflict Prevention Group, display the message “Only Map Linear Referencing tools can be used to edit this layer” whenever a feature class (with the Linear Referencing data model, and the Linear Referencing extension license) is supplied as the tool input.
- Verify that all the tools show up in the  ‘commands’ list when customizing the ribbon
- Test dark mode
- Verify tooltips on all the tools
- Test with FGDB, DC and FS along with RH, APR, APR-UN, Addressing, Caltrans and FGDB m enabled feature classes with non LR data type

![image2.png](../media/doc1013_image2.png)

## Slide 3

Verify that

- Test with following resolutions and scale:
- Test with minimized tool icons
- Open project with existing LR layers → Ribbon loads automatically
- Open project with existing m enabled layers → Ribbon loads automatically
- Remove all m enabled layers from the TOC → Ribbon goes away
- Disabled tools show appropriate tooltips with the reason
- Test Keyboard navigation across ribbon
- Test keyboard shortcuts provided in Pro
- Test custom keyboard shortcuts
- Test id the Tab order is correct
- Test Screen reader announcements
- The context based behavior of present Location Referencing tools remain the same. E.g., The Conflict Prevention section only shows up when it’s enabled.

| Resolution | Scale |
| --- | --- |
| 720 | 100, 125, 150, 175, 200 |
| 1080 | 100, 125, 150, 175, 200 |
| 1440 | 100, 125, 150, 175, 200 |
| 2160 | 100, 125, 150, 175, 200 |
