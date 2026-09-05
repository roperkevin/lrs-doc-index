# 64-bit OID Support for Route Editing Tools

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#5013](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5013) |
| **Source** | [5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx>) |
| **Edited** | 2023-10-20 21:06 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "64-bit OID Support for Route Editing Tools"
source_file: "5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5013-64BitOIDforRouteEditingTools_TestPlan_V1.pptx"
doc_id: 483
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-10-20T21:06:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route editing", "64 bit oid", "centerlines", "calibration points", "cartographic realignment", "retire route", "realign route", "reassign route", "reverse route"]
tools: ["Create Route", "Extend Route", "Retire Route", "Realign Route", "Reassign Route", "Reverse Route", "Calibration Editing", "Cartographic Realignment"]
products: ["Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#5013"]
related: [{"doc":502,"file":"64-bit-oid-in-lrs-route-editing-tools__doc502.md","s":7.349},{"doc":515,"file":"spike-64-bit-oid-in-lrs-editing-tools__doc515.md","s":6.314},{"doc":481,"file":"64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md","s":5.812},{"doc":482,"file":"64-bit-oid-other-pro-lr-tools-test-plan__doc482.md","s":5.371},{"doc":504,"file":"64-bit-oid-in-lrs-event-editing-tools__doc504.md","s":5.285}]
```
-->

## Summary

Test plan for supporting 64-bit OID values in LRS OID fields for route editing tools. Covers positive test cases for creating, extending, realigning, reassigning, reversing, calibrating, cartographic realignment, and retiring routes with OID values greater than 2.1 billion. Tests include various network types and datasets.

## Related documents

<!-- related:begin -->
- [64-bit OID in LRS Route Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-route-editing-tools__doc502.md>) — similar text 0.46 · 5 title words · 3 filename words · same surface <!-- rel:502 -->
- [Spike: 64-bit OID in LRS Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-editing-tools__doc515.md>) — similar text 0.40 · 4 title words · 2 filename words · same surface <!-- rel:515 -->
- [64 bit OID LRS Event Editing Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-lrs-event-editing-tools-test-plan__doc481.md>) — similar text 0.31 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:481 -->
- [64 bit OID Other Pro LR Tools – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/64-bit-oid-other-pro-lr-tools-test-plan__doc482.md>) — similar text 0.31 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:482 -->
- [64-bit OID in LRS Event Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/64-bit-oid-in-lrs-event-editing-tools__doc504.md>) — similar text 0.35 · 4 title words · 3 filename words · same surface <!-- rel:504 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Calibration Editing](https://www.google.com/search?q=%22Calibration%20Editing%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

64-bit OID Support for Route Editing Tools

| Notes |
| --- |
| Need to support actual 64-bit values in LRS OID fields for users who have more than 2.1 billion records in their LRS networks. For testing, this includes anything related to route editing, such as the LRS network, centerlines, CPs, Centerline Sequence Table, etc. Test on mix of line and nonline networks, including postmile. Do a few tests with UNAPR dataset Test with FGDB, DC , and FS For testing, we will have OIDs greater than 2.1 billion. The creation of 2.1 billion records is not necessary as we can edit the geodatabase properties to force values above 2.1 billion. Ensure all schema elements impacted by each route edit have 64-bit OID value and can handle this value Test each tool 2-3 times, test breadth not depth. Tools to test: Create Route Extend Route Retire Route Realign Route Reassign Route Reverse Route Calibration editing Cartographic Realignment Test 64-bit OID values can be in any related schema element: Centerline Sequence Table Centerlines Calibration Points Network Feature Classes Edit Log Locks Table Conflict Prevention |

Devtopia Issue

| Positive Tests: Create Route |
| --- |
| Create a route using multiple centerlines Create a complex route Create a route at the start/end of an existing line |

| Positive Tests: Extend Route |
| --- |
| Extend a route at the beginning Extend a route at the end Extend a route, turning it into a complex route |

## Slide 2

| Positive Tests: Realign Route |
| --- |
| Realign a route Realign multiple routes on a line Realign a route, assigning the abandoned portion to a new route |

| Positive Tests: Reassign Route |
| --- |
| Reassign a route(s) to a new route Reassign a route(s) to an adjacent route on an adjacent/same line Reassign a route(s) to an existing/new line |

| Positive Tests: Reverse Route |
| --- |
| Reverse a route Reverse a route in the middle of a line Reverse multiple routes on a line |

| Positive Tests: Calibration Editing |
| --- |
| Edit the calibration of a route at the beginning of a route Edit the calibration of a route at the middle of a route Edit the calibration of a route at the end of a route |

| Positive Tests: Cartographic Realignment |
| --- |
| Perform Cartographic Realignment on a simple route Perform Cartographic Realignment on a complex route |

| Positive Tests: Retire Route |
| --- |
| Retire a whole route Retire multiple routes on a line Retire a complex route turning it into a simple route |
