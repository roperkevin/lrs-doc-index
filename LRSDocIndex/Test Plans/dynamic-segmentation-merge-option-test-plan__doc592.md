# Dynamic Segmentation Merge Option Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#4902](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4902) |
| **Source** | [4902-DynamicSegmentationMergeOption_TestPlan_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4902-DynamicSegmentationMergeOption_TestPlan_V2.pptx>) |
| **Edited** | 2023-03-16 21:54 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Dynamic Segmentation Merge Option Test Plan"
source_file: "4902-DynamicSegmentationMergeOption_TestPlan_V2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4902-DynamicSegmentationMergeOption_TestPlan_V2.pptx"
doc_id: 592
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: "V2"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-03-16T21:54:29Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "merge", "coincident events", "attribute set", "event layers", "time slices", "route", "measures", "experience builder"]
tools: ["Dynamic Segmentation"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#4902"]
related: [{"doc":351,"file":"dynamic-segmentation-table-experience-builder-test-plan__doc351.md","s":3.635},{"doc":604,"file":"merge-coincident-option-in-dynseg-tool-in-pro__doc604.md","s":3.549},{"doc":437,"file":"merge-events-widget-test-plan__doc437.md","s":3.509},{"doc":663,"file":"merge-coincident-option-in-add-events-tools-in-pro__doc663.md","s":3.443},{"doc":647,"file":"merge-events-pro-test-plan__doc647.md","s":3.307}]
```
-->

## Summary

Test plan for the Dynamic Segmentation Merge Option feature in the Location Referencing system. It covers positive and negative test cases for merging coincident events with exact attributes across different routes, time slices, and event layers, including scenarios with spanning and non-spanning events. The document includes detailed test cases with route and event attribute tables illustrating expected merge behaviors and exceptions.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation Table Experience Builder Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/dynamic-segmentation-table-experience-builder-test-plan__doc351.md>) — similar text 0.11 · 2 title words · same kind/surface/folder <!-- rel:351 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro__doc604.md>) — similar text 0.17 · 2 title words · 2 filename words <!-- rel:604 -->
- [Merge Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/merge-events-widget-test-plan__doc437.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:437 -->
- [Merge Coincident Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-add-events-tools-in-pro__doc663.md>) — similar text 0.15 · 2 title words · 2 filename words <!-- rel:663 -->
- [Merge Events Pro Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/merge-events-pro-test-plan__doc647.md>) — similar text 0.15 · 1 title word · 1 filename word · same kind/folder <!-- rel:647 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## Slide 1

Dynamic Segmentation Merge Option

| Positive Tests: UI |
| --- |
| Ensure Merge Option checkbox in Advanced LRS Options default state is unchecked Ensure checkbox works both in light and dark themes |

| Notes: |
| --- |
| Test with mix of APR and RH data Test with and without spanning line events Test with all field types in multiple events in an Attribute Set Test a case or two in REST Confirm Conflict Prevention still works as intended Test in light and dark themes Common workflow will be merging coincident measured events with the exact same attributes Events with different derived event measures should not merge as they are not attribute exact |

Devtopia Issue

| Positive Tests: Merge Nonline Network |
| --- |
| 2 coincident events with exact attributes from measures 0-4 and 4-8 3 coincident events with exact attributes from measures 0-2, 2-6, and 6-8 2 coincident events with a third event not coincident from measures 0-4, 4-6, and 6.5-8. Coincident events will merge Multiple event layers in attribute set with numerous coincident exact attribute events |

| Positive Tests: No Merge |
| --- |
| 2 coincident events with exact attributes from measures 0-4 and 4.1-8. Events should not merge Merge Option disabled, coincident events that do not have exact attributes from measures 1-2 and 2-3. Events should not merge Gapped route, 2 coincident events that are updated to have the same exact attributes, but a gap exists between them. They should not merge Route with events in different time slices. Events are updated to same attributes but will not merge |

| Positive Tests: Merge Line Network |
| --- |
| 2 coincident events with exact attributes from measures 0-4 and 4-8 3 coincident events with exact attributes from measures 0-2, 2-6, and 6-8 3 events on 3 different routes. R1 and R3 have the same event info, R2 event is updated to be the same. Events should merge across the routes |

| Positive Tests: Other |
| --- |
| 2 coincident events in overlapping time slices from measures 0-4 and 4-8. Event 1 time slice of 1/1/2005-1/1/2010 and Event 2 time slice of 1/1/2009-Null. Events will merge and create new event records for the time slices |

## Case 1 <!-- slide 2 -->

### 2 Coincident Events with Exact Attributes From Measures 0-4

**2 coincident events with exact attributes from measures 0-4 and 4-8**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide2.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |

Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 8 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 45 | MPH | Active | Highway | Active |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | 001 | 1/1/2000 | Null | 0 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 2 <!-- slide 3 -->

### 3 Coincident Events with Exact Attributes From Measures 0-2

**3 coincident events with exact attributes from measures 0-2, 2-4, and 6-8**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide3.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 55 | MPH | Active | Interstate | Proposed |
| R1 | 1/1/2000 | Null | 6 | 8 | 65 | MPH | Active | Highway | Active |

Existing (DynSeg Table):
Edit (DynSeg Table):

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 8 | 45 | MPH | Active | Highway | Active |

Post-Edit (Event Attribute Table):

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 8 | 45 | MPH | Active |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | 001 | 1/1/2000 | Null | 0 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 3 <!-- slide 4 -->

### 2 Coincident Events with a Third Event Not Coincident From

**2 coincident events with a third event not coincident from measures 0-4, 4-6, and 6.5-8. Coincident events will merge**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide4.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 55 | MPH | Active | Interstate | Proposed |
| R1 | 1/1/2000 | Null | 6.5 | 8 | 65 | MPH | Active | Interstate | Retired |

Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active |
| Speed | R1 | 003 | 1/1/2000 | Null | 6.5 | 8 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6.5 | 8 | 45 | MPH | Active | Highway | Active |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | 001 | 1/1/2000 | Null | 0 | 6 | Highway | Active |
| FuncClass | R1 | 003 | 1/1/2000 | Null | 6.5 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 4 <!-- slide 5 -->

### Multiple Event Layers in Attribute Set with Numerous

**Multiple event layers in attribute set with numerous coincident exact attribute events**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide5.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 55 | MPH | Active | Interstate | Active |
| R1 | 1/1/2000 | Null | 6 | 8 | 65 | MPH | Active | Major | Active |

Existing (DynSeg Table):
Edit (DynSeg Table):

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 8 | 45 | MPH | Active | Highway | Active |

Post-Edit (Event Attribute Table):

| Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 001 | 1/1/2000 | Null | 0 | 8 | 45 | MPH | Active |

| Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 100 | 1/1/2000 | Null | 0 | 8 | Highway | MPH |

![image1.png](../media/doc343_image1.png)

## Case 5 <!-- slide 6 -->

### 2 Coincident Non-spanning Events with Exact Attributes From

**2 coincident non-spanning events with exact attributes from measures 0-4 and 4-8**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide6.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |

Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 8 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 45 | MPH | Active | Highway | Active |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | 001 | 1/1/2000 | Null | 0 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 6 <!-- slide 7 -->

### 3 Coincident Non-spanning Events with Exact Attributes From

**3 coincident non-spanning events with exact attributes from measures 0-2, 2-4, and 6-8**

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide7.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 55 | MPH | Active | Interstate | Proposed |
| R1 | 1/1/2000 | Null | 6 | 8 | 65 | MPH | Active | Highway | Active |

Existing (DynSeg Table):
Edit (DynSeg Table):

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 2 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 2 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 8 | 45 | MPH | Active | Highway | Active |

Post-Edit (Event Attribute Table):

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 8 | 45 | MPH | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 7 <!-- slide 8 -->

### 3 Spanning Events on 3 Different Routes. Events Merge Across

**3 spanning events on 3 different routes. Events merge across the routes**

![Measured route diagram drawn from the slide's own shapes, measures 0 to 15.](../media/doc343_slide8.svg)

| From Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 3 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 3 | 5 | 55 | MPH | Active | Interstate | Proposed |
| R2 | 1/1/2000 | Null | 5 | 10 | 55 | MPH | Active | Interstate | Proposed |
| R3 | 1/1/2000 | Null | 10 | 12 | 55 | MPH | Active | Interstate | Proposed |
| R3 | 1/1/2000 | Null | 12 | 15 | 45 | MPH | Active | Highway | Active |

Post-Edit (Event Attribute Table):

| Event Layer | From Route Name | To Route Name | Event ID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | R3 | 001 | 1/1/2000 | Null | 0 | 15 | 45 | MPH | Active |

| From Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 3 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 3 | 5 | 45 | MPH | Active | Highway | Active |
| R2 | 1/1/2000 | Null | 5 | 10 | 45 | MPH | Active | Highway | Active |
| R3 | 1/1/2000 | Null | 10 | 12 | 45 | MPH | Active | Highway | Active |
| R3 | 1/1/2000 | Null | 12 | 15 | 45 | MPH | Active | Highway | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 8 | Highway | Active |

## Slide 9

- 2 noncoincident events with exact attributes from measures 0-4 and 4.1-8, events should not merge

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide9_fig1.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4.1 | 8 | 55 | MPH | Active | Interstate | Proposed |

Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide9_fig2.svg)

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active |
| Speed | R1 | 002 | 1/1/2000 | Null | 4.1 | 8 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4.1 | 8 | 45 | MPH | Active | Highway | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 4 | Highway | Active |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 4.1 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 9 <!-- slide 10 -->

### Merge Option Disabled

**Merge Option disabled, coincident events that have exact attributes from measures 0-4 and 4-8. Events should not merge**
Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide10_fig1.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide10_fig2.svg)

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active |
| Speed | R1 | 002 | 1/1/2000 | Null | 4 | 8 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 4 | 8 | 45 | MPH | Active | Highway | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 4 | Highway | Active |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 4 | 8 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Case 10 <!-- slide 11 -->

### Gapped Route, 2 Coincident Events That Are Updated To Have

**Gapped route, 2 coincident events that are updated to have the same exact attributes, but a gap exists between them. They should not merge**
Post-Edit (Event Attribute Table):

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide11.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 10 | 55 | MPH | Active | Interstate | Proposed |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active |
| Speed | R1 | 002 | 1/1/2000 | Null | 6 | 10 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 10 | 45 | MPH | Active | Highway | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 6 | Highway | Active |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 6 | 10 | Highway | Active |

![image2.png](../media/doc343_image2.png)

## Case 11 <!-- slide 12 -->

### Route with Events in Different Time Slices. Events Are

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 3: event E1 as 0–3 and 3–6.](../media/doc343_slide12_fig2.svg)

**Route with events in different time slices. Events are updated to same attributes but will not merge**
Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 6, before the split at measure 3.](../media/doc343_slide12_fig1.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | 1/1/2005 | 0 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2006 | Null | 6 | 10 | 55 | MPH | Active | Interstate | Proposed |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active |
| Speed | R1 | 002 | 1/1/2000 | Null | 6 | 10 | 45 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2000 | Null | 0 | 6 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2000 | Null | 6 | 10 | 45 | MPH | Active | Highway | Active |

| Event Layer | From Route Name | To Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 0 | 6 | Highway | Active |
| FuncClass | R1 | R1 | 001 | 1/1/2000 | Null | 6 | 10 | Highway | Active |

![image1.png](../media/doc343_image1.png)

## Slide 13

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide13_fig2.svg)

- 2 coincident events in overlapping time slices from measures 0-4 and 4-8. Event 1 time slice of 1/1/2005-1/1/2010 and Event 2 time slice of 1/1/2009-Null.  Events will merge and create new event records for the time slices

![Measured route diagram drawn from the slide's own shapes.](../media/doc343_slide13_fig1.svg)

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2005 | 1/1/2009 | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2009 | 1/1/2010 | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2010 | Null | 0 | 4 | Null | Null | Null | Null | Null |
| R1 | 1/1/2005 | 1/1/2009 | 4 | 8 | Null | Null | Null | Null | Null |
| R1 | 1/1/2009 | 1/1/2010 | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |
| R1 | 1/1/2010 | Null | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |

Existing (DynSeg Table):
Edit (DynSeg Table):
Post-Edit (Event Attribute Table):

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Speed Limit | Units | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed | R1 | 001 | 1/1/2005 | 1/1/2009 | 0 | 4 | 45 | MPH | Active |
| Speed | R1 | 001 | 1/1/2009 | 1/1/2010 | 0 | 8 | 45 | MPH | Active |
| Speed | R1 | 001 | 1/1/2010 | Null | 4 | 8 | 55 | MPH | Active |

| Route Name | From Date | To Date | From Measure | To Measure | Speed. SpeedLimit | Speed. Units | Speed. Status | FuncClass . Type | FuncClass . Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 1/1/2005 | 1/1/2009 | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2009 | 1/1/2010 | 0 | 4 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2010 | Null | 0 | 4 | Null | Null | Null | Null | Null |
| R1 | 1/1/2005 | 1/1/2009 | 4 | 8 | Null | Null | Null | Null | Null |
| R1 | 1/1/2009 | 1/1/2010 | 4 | 8 | 45 | MPH | Active | Highway | Active |
| R1 | 1/1/2010 | Null | 4 | 8 | 55 | MPH | Active | Interstate | Proposed |

| Event Layer | Route Name | EventID | From Date | To Date | From Measure | To Measure | Type | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass | R1 | 001 | 1/1/2005 | 1/1/2009 | 0 | 4 | 45 | Active |
| FuncClass | R1 | 001 | 1/1/2009 | 1/1/2010 | 0 | 8 | 45 | Active |
| FuncClass | R1 | 001 | 1/1/2010 | Null | 4 | 8 | 55 | MPH |

![image1.png](../media/doc343_image1.png)
