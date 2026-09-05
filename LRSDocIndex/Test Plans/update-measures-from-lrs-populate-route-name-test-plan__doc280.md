# Update Measures From LRS: Populate Route Name Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#3439](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3439) |
| **Source** | [3439-UpdateMeasureFromLRSPopulateRouteName_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/3439-UpdateMeasureFromLRSPopulateRouteName_TestPlanV1.pptx>) |
| **Edited** | 2024-11-20 23:19 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Measures From LRS: Populate Route Name Test Plan"
source_file: "3439-UpdateMeasureFromLRSPopulateRouteName_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/3439-UpdateMeasureFromLRSPopulateRouteName_TestPlanV1.pptx"
doc_id: 280
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2024-11-20T23:19:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route name", "measure update", "pipeline line", "un devices", "un junctions", "non lrs feature class", "geoprocessing", "test plan"]
tools: ["Update Measures From LRS"]
products: ["Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#3439"]
related: [{"doc":704,"file":"support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md","s":3.553},{"doc":277,"file":"update-measures-from-lrs-support-events-and-intersections__doc277.md","s":3.387},{"doc":230,"file":"update-measures-from-lrs-support-spanning-events-test-plan__doc230.md","s":3.327},{"doc":11,"file":"reassign-route-subsequent-pane-ai-assistant-test-plan__doc11.md","s":3.138},{"doc":513,"file":"export-network-reassign-transfer-test-plan-v1__doc513.md","s":2.182}]
```
-->

## Summary

Test plan for the Update Measures From LRS geoprocessing tool focusing on the optional Route Name parameter. Covers positive and negative test cases verifying route name population and measure updates across various input feature classes including PipelineLine, UN Devices, UN Junctions, and non-LRS line and point feature classes. Tests include execution in ArcGIS Pro GP, Model Builder, and Python environments with different geodatabase types.

## Related documents

<!-- related:begin -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md>) — similar text 0.08 · 3 title words · 2 filename words · same surface <!-- rel:704 -->
- [Update Measures From LRS: Support Events and Intersections](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/update-measures-from-lrs-support-events-and-intersections__doc277.md>) — similar text 0.05 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:277 -->
- [Update Measures From LRS: Support Spanning Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/update-measures-from-lrs-support-spanning-events-test-plan__doc230.md>) — similar text 0.03 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:230 -->
- [Reassign Route Subsequent Pane AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-route-subsequent-pane-ai-assistant-test-plan__doc11.md>) — similar text 0.04 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:11 -->
- [Export Network Reassign Transfer Test Plan V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/export-network-reassign-transfer-test-plan-v1__doc513.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:513 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Update Measures From LRS: Populate Route Name (when configured)

| Positive Tests: GP UI |
| --- |
| Input LRS Network does not have RouteName configured, Route Name parameter does not appear Input LRS Network has RouteName configured, Route Name parameter appears Route Name parameter is optional when it appears (should not have an asterisk) Fields in Route Name parameter list are the same length and type as the RouteName field in the input LRS Network Tabbing through tool parameters still works as expected |

| Notes |
| --- |
| Add optional parameter to Update Measures From LRS called “Route Name” Optional parameter will only appear for LRS Networks configured with Route Name When a valid field is populated into the parameter, the route name from the LRS Network will populate into every record in the Input Features where valid Test with both UN and non-UN data Test with both UN and non-UN feature classes as the input layer to be updated Test within Pro GP, Model Builder, and Python (inline and stand alone) Test in FGDB, EGDB DC, and FS |

Devtopia Issue

| Positive Tests |
| --- |
| Route Name is populated for PipelineLine input upon GP execution RouteName and measures are already populated for PipelineLine input, but overwritten when GP executes RouteName and measures already populated for multiple PipelineLines features that make up a route, but are overwritten when GP executes RouteName is populated for UN Devices input upon GP execution RouteName and Measure are already populated for UN Devices input, but overwritten when GP executes RouteName is populated for UN Junctions input upon GP execution RouteName and measure are already populated for UN Junctions input, but overwritten when GP executes RouteName is populated for non-LRS line feature class upon GP execution RouteName and measures are already populated for non-LRS line feature class, but overwritten when GP executes RouteName is populated for non-LRS point feature class upon GP execution RouteName and measure are already populated for non-LRS point feature class, but overwritten when GP executes RouteName and measures are already populated for non-LRS point feature class and a reassignment has split the route. RouteName and measure info is overwritten upon GP execution |

## Slide 2

| Negative Tests: Python |
| --- |
| LRS Network not configured with RouteName, Route Name parameter is populated LRS Network configured with RouteName, Route Name parameter is populated with an invalid field that is not the same length or type as the RouteName field in the input LRS Network |

## Case 1 <!-- slide 3 -->

### Route Name Is Populated for PipelineLine Input Upon GP

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 5: event E1 as 0–5 and 5–10.](../media/doc707_slide3_fig2.svg)

**Route Name is populated for PipelineLine input upon GP execution**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 10, before the split at measure 5.](../media/doc707_slide3_fig1.svg)

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001 | <Null> | 0 | 10 |

Before Update Measures From LRS:

| Line ID | Line Name | RouteID | Route Name | From Date | To Date |
| --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> |

After Update Measures From LRS (LRS Date input of 1/1/2005):

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001 | Route 001 | 0 | 10 |

| Line ID | Line Name | RouteID | Route Name | From Date | To Date |
| --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> |

## Case 2 <!-- slide 4 -->

### RouteName and Measures Are Already Populated for

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 5: event E1 as 0–5 and 5–10.](../media/doc707_slide4_fig2.svg)

**RouteName and measures are already populated for PipelineLine input, but overwritten when GP executes**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 10, before the split at measure 5.](../media/doc707_slide4_fig1.svg)

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001 | Route 001 | 0 | 10 |

Before Update Measures From LRS:

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

Line Network (RouteName and measures changed since last execution of Update Measures From LRS):
Pipeline Line (Update LRS was previously ran before the RouteName had changed):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001A | Route 001A | 5 | 15 |

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

## Case 3 <!-- slide 5 -->

### RouteName and Measures Already Populated for Multiple

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 1.3: event E1 as 0–1.3 and 1.3–2.5.](../media/doc707_slide5_fig2.svg)

**RouteName and measures already populated for multiple PipelineLine features that make up a route, but are overwritten when GP executes**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 2.5, before the split at measure 1.3.](../media/doc707_slide5_fig1.svg)

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001 | Route 001 | 0 | 2.5 |
| Distribution Pipe | Coated Steel | 001 | Route 001 | 2.5 | 7.5 |
| Distribution Pipe | Coated Steel | 001 | Route 001 | 7.5 | 10 |

Before Update Measures From LRS:

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

Line Network (RouteName and measures changed since last execution of Update Measures From LRS):
Pipeline Line (Update LRS was previously ran before the RouteName had changed):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Distribution Pipe | Coated Steel | 001A | Route 001A | 5 | 7.5 |
| Distribution Pipe | Coated Steel | 001A | Route 001A | 7.5 | 12.5 |
| Distribution Pipe | Coated Steel | 001A | Route 001A | 12.5 | 15 |

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

## Case 4 <!-- slide 6 -->

### RouteName Is Populated for UN Devices Input Upon GP

**RouteName is populated for UN Devices input upon GP execution**

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Controllable Valve | System | 001 | <Null> | 2.5 |
| Controllable Valve | System | 001 | <Null> | 7 |
| Controllable Valve | System | 001 | <Null> | 10 |

Before Update Measures From LRS:

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide6_fig1.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> | 0 | 10 |

After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Controllable Valve | System | 001 | Route 001 | 2.5 |
| Controllable Valve | System | 001 | Route 001 | 7 |
| Controllable Valve | System | 001 | Route 001 | 10 |

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide6_fig2.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> | 0 | 10 |

## Case 5 <!-- slide 7 -->

### RouteName and Measure Are Already Populated for UN Devices

**RouteName and Measure are already populated for UN Devices input, but overwritten when GP executes**

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Controllable Valve | System | 001 | Route 001 | 2.5 |
| Controllable Valve | System | 001 | Route 001 | 7 |
| Controllable Valve | System | 001 | Route 001 | 10 |

Before Update Measures From LRS:

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide7_fig1.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

Line Network (RouteName and measures changed since last execution of Update Measures From LRS):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Controllable Valve | System | 001A | Route 001A | 7.5 |
| Controllable Valve | System | 001A | Route 001A | 12 |
| Controllable Valve | System | 001A | Route 001A | 15 |

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide7_fig2.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

## Case 6 <!-- slide 8 -->

### RouteName Is Populated for UN Junctions Input Upon GP

**RouteName is populated for UN Junctions input upon GP execution**

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Elbow | Metal Elbow | 001 | <Null> | 5 |
| Elbow | Metal Elbow | 001 | <Null> | 7.5 |
| End Cap | Metal End Cap | 001 | <Null> | 10 |

Before Update Measures From LRS:

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide8_fig1.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> | 0 | 10 |

Line Network (RouteName changed since last execution of Update Measures From LRS):
After Update Measures From LRS (LRS Date input of 1/1/2010):

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide8_fig2.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> | 0 | 10 |

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Elbow | Metal Elbow | 001 | Route 001 | 5 |
| Elbow | Metal Elbow | 001 | Route 001 | 7 |
| End Cap | Metal End Cap | 001 | Route 001 | 10 |

## Case 7 <!-- slide 9 -->

### RouteName and Measure Are Already Populated for UN Junctions

**RouteName and measure are already populated for UN Junctions input, but overwritten when GP executes**

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Elbow | Metal Elbow | 001 | Route 001 | 5 |
| Elbow | Metal Elbow | 001 | Route 001 | 7.5 |
| End Cap | Metal End Cap | 001 | Route 001 | 10 |

Before Update Measures From LRS:

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide9_fig1.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

Line Network (RouteName and measures changed since last execution of Update Measures From LRS):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Elbow | Metal Elbow | 001A | Route 001A | 10 |
| Elbow | Metal Elbow | 001A | Route 001A | 12.5 |
| End Cap | Metal End Cap | 001A | Route 001A | 15 |

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide9_fig2.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | 1/1/2005 | 0 | 10 |
| 100A | Line 100A | 001A | Route 001A | 1/1/2005 | <Null> | 5 | 15 |

## Case 8 <!-- slide 10 -->

### RouteName Is Populated for Non-LRS Line Feature Class Upon

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 5: event E1 as 0–5 and 5–10.](../media/doc707_slide10_fig2.svg)

**RouteName is populated for non-LRS line feature class upon GP execution**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 10, before the split at measure 5.](../media/doc707_slide10_fig1.svg)

| Cable Type | Depth | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Fiber Optic | 8 ft | 005 | <Null> | 0 | 10 |

Before Update Measures From LRS:

| RouteID | Route Name | From Date | To Date |
| --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | <Null> |

After Update Measures From LRS (LRS Date input of 1/1/2005):

| Cable Type | Depth | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Fiber Optic | 8 ft | 005 | 5 th St. | 0 | 10 |

| RouteID | Route Name | From Date | To Date |
| --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | <Null> |

## Case 9 <!-- slide 11 -->

### RouteName and Measures Are Already Populated for Non-LRS

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 5: event E1 as 0–5 and 5–10.](../media/doc707_slide11_fig2.svg)

**RouteName and measures are already populated for non-LRS line feature class, but overwritten when GP executes**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 10, before the split at measure 5.](../media/doc707_slide11_fig1.svg)

| Cable Type | Depth | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Fiber Optic | 8 ft | 005 | 5 th St. | 0 | 10 |

Before Update Measures From LRS:

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 5 | 15 |

Non-LRS Layer (Fiber Cable):
After Update Measures From LRS (LRS Date input of 1/1/2005):

| Cable Type | Depth | RouteID | Route Name | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Fiber Optic | 8 ft | W05 | W. 5 th St. | 5 | 15 |

Non-LRS Layer (Fiber Cable):
W. 5th St.

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 5 | 15 |

## Case 10 <!-- slide 12 -->

### RouteName Is Populated for Non-LRS Point Feature Class Upon

**RouteName is populated for non-LRS point feature class upon GP execution**

| Material | Depth | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | 005 | <Null> | 2.5 |
| Brass | 4.5 ft | 005 | <Null> | 7 |
| Brass | 3.8 ft | 005 | <Null> | 10 |

Before Update Measures From LRS:
Non-LRS Layer (Water Shut-off):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Material | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | 005 | 5 th St. | 2.5 |
| Brass | 4.5 ft | 005 | 5 th St. | 7 |
| Brass | 3.8 ft | 005 | 5 th St. | 10 |

Non-LRS Layer (Water Shut-off):

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide12_fig2.svg)

| Line ID | Line Name | RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | Line 100 | 001 | Route 001 | 1/1/2000 | <Null> | 0 | 10 |

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide12_fig1.svg)

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | <Null> | 0 | 10 |

## Case 11 <!-- slide 13 -->

### RouteName and Measure Are Already Populated for Non-LRS

**RouteName and measure are already populated for non-LRS point feature class, but overwritten when GP executes**

| Material | Depth | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | 005 | 5 th St. | 2.5 |
| Brass | 4.5 ft | 005 | 5 th St. | 7 |
| Brass | 3.8 ft | 005 | 5 th St. | 10 |

Before Update Measures From LRS:

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide13_fig1.svg)

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 5 | 15 |

Non-LRS Layer (Water Shut-off):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | W05 | W. 5 th St. | 7.5 |
| Brass | 4.5 ft | W05 | W. 5 th St. | 12 |
| Brass | 3.8 ft | W05 | W. 5 th St. | 15 |

Non-LRS Layer (Water Shut-off):

W. 5th St.

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc707_slide13_fig2.svg)

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 5 | 15 |

## Slide 14

| Material | Depth | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | 005 | 5 th St. | 2.5 |
| Brass | 4.5 ft | 005 | 5 th St. | 7 |
| Brass | 3.8 ft | 005 | 5 th St. | 10 |

Before Update Measures From LRS and route reassignment:

![Diagram drawn from the slide's own shapes: 4 nodes (12.), 1 connector.](../media/doc707_slide14_fig1.svg)

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 0 | 5 |
| E05 | E 5 th . St. | 1/1/2005 | <Null> | 10 | 15 |

Non-LRS Layer (Water Shut-off):
After Update Measures From LRS (LRS Date input of 1/1/2010):

| Asset Group | Asset Type | RouteID | Route Name | Measure |
| --- | --- | --- | --- | --- |
| Brass | 4 ft | W05 | W. 5 th St. | 2.5 |
| Brass | 4.5 ft | E05 | E. 5 th St. | 12 |
| Brass | 3.8 ft | E05 | E. 5 th St. | 15 |

Non-LRS Layer (Water Shut-off):

W. 5th St.

E. 5th St.

![Diagram drawn from the slide's own shapes: 3 nodes, 2 connectors.](../media/doc707_slide14_fig2.svg)

| RouteID | Route Name | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| 005 | 5 th St. | 1/1/2000 | 1/1/2005 | 0 | 10 |
| W05 | W. 5 th St. | 1/1/2005 | <Null> | 0 | 5 |
| E05 | E 5 th . St. | 1/1/2005 | <Null> | 10 | 15 |
