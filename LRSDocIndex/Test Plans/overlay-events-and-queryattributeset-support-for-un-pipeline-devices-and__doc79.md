# Overlay Events and queryAttributeSet Support for UN Pipeline Devices and Junctions

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [OverlayEventsqueryAttributeSet_UNdevice_junctions.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/OverlayEventsqueryAttributeSet_UNdevice_junctions.pptx>) |
| **Edited** | 2026-01-22 22:20 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Events and queryAttributeSet Support for UN Pipeline Devices and Junctions"
source_file: "OverlayEventsqueryAttributeSet_UNdevice_junctions.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/OverlayEventsqueryAttributeSet_UNdevice_junctions.pptx"
doc_id: 79
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Praveen Kumar"
last_edited: "2026-01-22T22:20:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["pipeline device", "pipeline junction", "overlay events", "query attribute set", "line event", "point event", "route", "attribute propagation"]
tools: ["Overlay Events", "queryAttributeSet"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":364,"file":"overlay-events-and-queryattributeset-point-event-support-test-cases__doc364.md","s":7.479},{"doc":461,"file":"support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md","s":6.044},{"doc":257,"file":"overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md","s":4.139},{"doc":320,"file":"update-address-range-information-as-part-of-segmentation-in-overlay-events__doc320.md","s":3.829},{"doc":131,"file":"overlay-events-location-referencing__doc131.md","s":2.874}]
```
-->

## Summary

This document presents test cases for the Overlay Events and queryAttributeSet functionalities with UN Pipeline Devices and Junctions as inputs. It covers positive and negative tests on various route configurations including simple, overlapping, vertical, gapped, and multi-time slice routes, validating event layering and attribute propagation.

## Related documents

<!-- related:begin -->
- [Overlay Events and queryAttributeSet Point Event Support Test Cases](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-events-and-queryattributeset-point-event-support-test-cases__doc364.md>) — similar text 0.56 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:364 -->
- [Support Centerline as Input in queryAttributeSet and Overlay Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md>) — similar text 0.52 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:461 -->
- [Overlay Events/queryAttributeSet: Update Address Range info via Address Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md>) — similar text 0.06 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:257 -->
- [Update Address Range Information as Part of Segmentation in Overlay Events & Query Attribute Sets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/update-address-range-information-as-part-of-segmentation-in-overlay-events__doc320.md>) — similar text 0.09 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:320 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc131.md>) — similar text 0.05 · 2 title words · 1 filename word · same surface <!-- rel:131 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [queryAttributeSet](https://www.google.com/search?q=%22queryAttributeSet%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Overlay Events/queryAttributeSet UN Devices and Junctions Support

| Notes |
| --- |
| Allow UN Pipeline Devices and Junctions as input in Overlay Events and queryAttributeSet Where a Pipeline Devices and Junctions exists, a new record will be created with the same From/To Measure and From/To RouteID. Test with UN APR data For Overlay Events, test in EGDB, and FS For queryAttributeSet, test in FS only Test Overlay Events in ModelBuilder and Python with Pipeline Devices and Junctions input |

| Positive Tests: Overlay Events UI |
| --- |
| UN Pipeline Devices and Junctions can be input in Event Layers parameter |

| Negative Tests: Overlay Events |
| --- |
| Only UN Pipeline Devices and Junctions into the Event Layers, with no input line event layers |

| Negative Tests: queryAttributeSet |
| --- |
| Only UN Pipeline Devices and Junctions is input into the attributeSet, with no input line event layers |

## Case 1 <!-- slide 2 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

Route1
Route2

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions and line events, including the PipelineLine layer (UNAPR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 5 nodes, 5 connectors.](../media/doc949_slide2.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pipeline Line | N/A | N/A | N/A | 0 | 5 | N/A | N/A | Steel | Active |
| Pipeline Line | N/A | N/A | N/A | 10 | 12.5 | N/A | N/A | Plastic | Active |
| Pipeline Line | N/A | N/A | N/A | 12.5 | 15 | N/A | N/A | Steel | Active |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 0 | N/A | Route1 | N/A | Tank | Active |
| Junction | Tee1 | N/A | N/A | 5 | N/A | Route1 | N/A | Tee | Active |
| Junction | Elbow1 | N/A | N/A | 15 | N/A | Route2 | N/A | Elbow | Active |
| Device | Valve1 | N/A | N/A | 12.5 | N/A | Route2 | N/A | Control Valve | Active |
| Device | Valve2 | N/A | N/A | 14 | N/A | Route2 | N/A | Flow Valve | Active |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | PipelineLine. Attribute1 | PipelineLine. Attribute2 | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | Steel | Active | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Upstream | Steel | Active | 450psi | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Upstream | Steel | Active | 500 psi | Proposed | Tee | Active | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | Plastic | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 12.5 | 12.5 | Midstream | Plastic | Active | 500 psi | Proposed | <Null> | <Null> | Control Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 14 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | Flow Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 15 | 15 | Midstream | Steel | Active | 500 psi | Proposed | Elbow | Active | <Null> | <Null> |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 2 <!-- slide 3 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

Route1
Route2

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions that overlap and line events, including the PipelineLine layer (UNAPR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 4 nodes, 5 connectors.](../media/doc949_slide3.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pipeline Line | N/A | N/A | N/A | 0 | 5 | N/A | N/A | Steel | Active |
| Pipeline Line | N/A | N/A | N/A | 10 | 12.5 | N/A | N/A | Plastic | Active |
| Pipeline Line | N/A | N/A | N/A | 12.5 | 15 | N/A | N/A | Steel | Active |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 0 | N/A | Route1 | N/A | Tank | Active |
| Junction | Tee1 | N/A | N/A | 5 | N/A | Route1 | N/A | Tee | Active |
| Junction | Elbow1 | N/A | N/A | 15 | N/A | Route2 | N/A | Elbow | Active |
| Device | Valve1 | N/A | N/A | 5 | N/A | Route1 | N/A | Control Valve | Active |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | PipelineLine. Attribute1 | PipelineLine. Attribute2 | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | Steel | Active | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Upstream | Steel | Active | 450psi | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Upstream | Steel | Active | 500 psi | Proposed | Tee | Active | Control Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | Plastic | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 15 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 15 | 15 | Midstream | Steel | Active | 500 psi | Proposed | Elbow | Active | <Null> | <Null> |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 3 <!-- slide 4 -->

### Overlay Events / QueryAttributeSet on Vertical Routes with UN

**Overlay Events/queryAttributeSet on vertical routes with UN Pipeline Devices and Junctions , spanning and non-spanning input events on vertical route**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 3 nodes, 8 connectors.](../media/doc949_slide4.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 2 | N/A | Route1 | N/A | Tank | Active |
| Junction | Elbow1 | N/A | N/A | 17.5 | N/A | Route2 | N/A | Elbow | Active |
| Device | Valve1 | N/A | N/A | 17.5 | N/A | Route2 | N/A | Control Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 15 | 17.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 17.5 | 17.5 | Midstream | 500 psi | Proposed | Elbow | Active | Control Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 17.5 | 20 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

## Case 4 <!-- slide 5 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 7.5: event Red2 as 2.5–7.5 and 7.5–12.5.](../media/doc949_slide5_fig2.svg)

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions and input partial line events**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Schematic redrawn from the slide's data: straight route R1, event Red2 from measure 2.5 to 12.5, before the split at measure 7.5.](../media/doc949_slide5_fig1.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 12.5 | Route1 | Route2 | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 2 | N/A | Route1 | N/A | Tank | Active |
| Junction | Elbow1 | N/A | N/A | 15 | N/A | Route2 | N/A | Elbow | Active |
| Device | Valve1 | N/A | N/A | 15 | N/A | Route2 | N/A | Control Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | <Null> | <Null> | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 15 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 15 | 15 | Midstream | 500 psi | Proposed | Elbow | Active | Control Valve | Active |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 5 <!-- slide 6 -->

### Overlay Events / QueryAttributeSet on Gapped Routes with

**Overlay Events/queryAttributeSet on gapped routes with multiple input line events , UN Pipeline Devices and Junctions**

![Measured route diagram drawn from the slide's own shapes.](../media/doc949_slide6.svg)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 1 | 15 | Route1 | Route2 | 450 psi | Active |
| Blue Event | Blue1 | 1/1/2000 | <Null> | 0 | 1 | Route1 | Route1 | Low | Active |
| Green Event | Green1 | 1/1/2000 | <Null> | 0 | 1 | Route1 | Route1 | Complete | Active |
| Green Event | Green2 | 1/1/2000 | <Null> | 1 | 12.5 | Route1 | Route2 | Incomplete | Active |
| Junction | Elbow1 | N/A | N/A | 0.5 | N/A | Route1 | N/A | Tank | Active |
| Device | Valve1 | N/A | N/A | 14 | N/A | Route2 | N/A | Control Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Attribute1 | RedEvent . Attribute2 | BlueEvent . Attribute1 | BlueEvent . Attribute2 | GreenEvent . Attribute1 | GreenEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 0.5 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 0.5 | 0.5 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 0.5 | 1 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 1 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | Incomplete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | Incomplete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 14 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | Control Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image3.png](../media/doc949_image3.png)

## Case 6 <!-- slide 7 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions and input line and point events, with input network as a different LRS Network**

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc949_slide7.svg)

| Network Name | RouteID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |
| Network2 | RouteX | 1/1/2000 | <Null> | Public |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 mi | 10 mi | Route1 | Route1 | 450 psi | Active |
| Junction | Tank1 | N/A | N/A | 0.5 | N/A | Route1 | N/A | Tank | Active |
| Device | Valve1 | N/A | N/A | 14 | N/A | Route2 | N/A | Control Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network2. Access | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteX | 1/1/2000 | <Null> | 0 ft | 10560 ft | Public | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteX | 1/1/2000 | <Null> | 10560 ft | 10560 ft | Public | 450 psi | Active | Tank | Active | <Null> | <Null> |
| Line | RouteX | 1/1/2000 | <Null> | 10560 ft | 42240 ft | Public | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteX | 1/1/2000 | <Null> | 42240 ft | 42240 ft | Public | 450 psi | Active | <Null> | <Null> | Control Valve | Active |
| Line | RouteX | 1/1/2000 | <Null> | 42240 ft | 52800 ft | Public | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png) ![image4.png](../media/doc949_image4.png)

## Case 7 <!-- slide 8 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple time slices of input line and point events along with UN Pipeline Devices and Junctions**

| Network Name | Route ID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Type | Route ID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Attribute1 | RedEvent. Attribute2 | BlueEvent . Attribute1 | BlueEvent . Attribute2 | PurpleEvent . Attribute1 | PurpleEvent . Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Route1 | 1/1/2000 | 1/1/2005 | 0 | 0 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> | Control Valve | Active |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 0 | 2.5 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | 1/1/2005 | 2.5 | 2.5 | Upstream | 450 psi | Retired | Low | Retired | Dent | Retired | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 2.5 | 5 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | 1/1/2005 | 10 | 13 | Midstream | 450 psi | Retired | Low | Retired | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | 1/1/2005 | 13 | 15 | Midstream | 450 psi | Retired | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | 1/1/2005 | 15 | 15 | Midstream | 450 psi | Retired | <Null> | <Null> | <Null> | <Null> | Flow Valve | Active |
| Point | Route1 | 1/1/2005 | 1/1/2010 | 0 | 0 | Upstream | 450 psi | Retired | Medium | Active | <Null> | <Null> | Control Valve | Active |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 0 | 2.5 | Upstream | 450 psi | Retired | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2005 | 1/1/2010 | 2.5 | 2.5 | Upstream | 450 psi | Retired | Medium | Active | Corrosion | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 2.5 | 5 | Upstream | 450 psi | Retired | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2005 | 1/1/2010 | 10 | 15 | Midstream | 500 psi | Retired | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2005 | 1/1/2010 | 15 | 15 | Midstream | 500 psi | Retired | Medium | Active | <Null> | <Null> | Flow Valve | Active |
| Line | Route1 | 1/1/2010 | <Null> | 0 | 2.5 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2010 | <Null> | 0 | 0 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> | Control Valve | Active |
| Point | Route1 | 1/1/2010 | <Null> | 2.5 | 2.5 | Upstream | 450 psi | Active | Medium | Active | Corrosion | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2010 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2010 | <Null> | 10 | 15 | Midstream | 450 psi | Active | Medium | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2010 | <Null> | 15 | 15 | Midstream | 450 psi | Active | Medium | Active | <Null> | <Null> | Flow Valve | Active |

![Diagram drawn from the slide's own shapes: 4 nodes, 6 connectors.](../media/doc949_slide8.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | 1/1/2005 | 0 | 15 | Route1 | Route2 | 450 psi | Retired |
| Red Event | Red1 | 1/1/2005 | 1/1/2010 | 0 | 5 | Route1 | Route1 | 450 psi | Retired |
| Red Event | Red2 | 1/1/2005 | 1/1/2010 | 10 | 15 | Route2 | Route2 | 500 psi | Retired |
| Red Event | Red1 | 1/1/2010 | <Null> | 0 | 15 | Route1 | Route2 | 450 psi | Active |
| Blue Event | Blue1 | 1/1/2000 | 1/1/2005 | 0 | 13 | Route1 | Route2 | Low | Retired |
| Blue Event | Blue2 | 1/1/2005 | <Null> | 0 | 15 | Route1 | Route2 | Medium | Active |
| Purple Event | Purple1 | 1/1/2000 | 1/1/2005 | 2.5 | N/A | Route1 | N/A | Dent | Retired |
| Purple Event | Purple1 | 1/1/2005 | <Null> | 2.5 | N/A | Route1 | N/A | Corrosion | Active |
| Device | Valve1 | N/A | N/A | 0 | N/A | Route1 | N/A | Control Valve | Active |
| Device | Valve2 | N/A | N/A | 15 | N/A | Route2 | N/A | Flow Valve | Active |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 8 <!-- slide 9 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 1.3: event Red1 as 0–1.3 and 1.3–2.5.](../media/doc949_slide9_fig2.svg)

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions and multiple input line and point events, with the line events found on a different route**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Schematic redrawn from the slide's data: straight route R1, event Red1 from measure 0 to 2.5, before the split at measure 1.3.](../media/doc949_slide9_fig1.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | RouteX | RouteX | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | RouteX | RouteY | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 0.5 | N/A | Route1 | N/A | Tank | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 13 | N/A | Route2 | N/A | 1500 | Active |
| Device | Valve2 | N/A | N/A | 15 | N/A | Route2 | N/A | Flow Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | YellowEvent . Attribute1 | YellowEvent . Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | <Null> | <Null> | Tank | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 13 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 13 | 13 | Midstream | <Null> | <Null> | <Null> | <Null> | 1500 | Active | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 13 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 15 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | Flow Valve | Active |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 9 <!-- slide 10 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions on cusp of line events**

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc949_slide10.svg)

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 2.5 | 12.5 | Route1 | Route2 | 450 psi | Active |
| Junction | Tank1 | N/A | N/A | 0.5 | N/A | Route1 | N/A | Tank | Active |
| Device | Valve2 | N/A | N/A | 15 | N/A | Route2 | N/A | Flow Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2.5 | 2.5 | Upstream | 450 psi | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 12.5 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | Flow Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)

## Case 10 <!-- slide 11 -->

### Overlay Events / QueryAttributeSet on Simple Routes with UN

**Overlay Events/queryAttributeSet on simple routes with UN Pipeline Devices and Junctions and multiple input line and point events, with a selection set on Devices and Junctions**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 5 nodes, 2 connectors.](../media/doc949_slide11.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute1 | Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Junction | Tank1 | N/A | N/A | 0 | N/A | Route1 | N/A | Tank | Active |
| Junction | Tee1 | N/A | N/A | 2 | N/A | Route1 | N/A | Tee | Active |
| Junction | Elbow1 | N/A | N/A | 15 | N/A | Route2 | N/A | Elbow | Active |
| Device | Valve1 | N/A | N/A | 0 | N/A | Route1 | N/A | Control Valve | Active |
| Device | Valve2 | N/A | N/A | 14 | N/A | Route2 | N/A | Flow Valve | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Attribute1 | RedEvent . Attribute2 | Junction. Attribute1 | Junction. Attribute2 | Device. Attribute1 | Device. Attribute2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Upstream | 450psi | Active | Tank | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Tee | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 450psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | Control Valve | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 500 psi | Proposed | Elbow | Active | <Null> | <Null> |

![image1.png](../media/doc949_image1.png) ![image2.png](../media/doc949_image2.png)
