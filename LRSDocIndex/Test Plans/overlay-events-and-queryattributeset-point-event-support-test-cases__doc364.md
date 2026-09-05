# Overlay Events and queryAttributeSet Point Event Support Test Cases

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#5301](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5301) |
| **Source** | [5301-OverlayEventsqueryAttributeSetPointSupport_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5301-OverlayEventsqueryAttributeSetPointSupport_V3.pptx>) |
| **Edited** | 2024-05-23 21:33 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Events and queryAttributeSet Point Event Support Test Cases"
source_file: "5301-OverlayEventsqueryAttributeSetPointSupport_V3.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5301-OverlayEventsqueryAttributeSetPointSupport_V3.pptx"
doc_id: 364
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V3"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2024-05-23T21:33:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "overlay events", "query attribute set", "route", "line event", "measure translation", "gapped route", "time slices", "event overlap"]
tools: ["Overlay Events", "queryAttributeSet"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#5301"]
related: [{"doc":79,"file":"overlay-events-and-queryattributeset-support-for-un-pipeline-devices-and__doc79.md","s":7.479},{"doc":461,"file":"support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md","s":6.931},{"doc":257,"file":"overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md","s":4.303},{"doc":365,"file":"point-events-dynamic-segmentation-test-plan__doc365.md","s":4.004},{"doc":231,"file":"add-line-events-by-offsetting-from-other-points-test-plan__doc231.md","s":3.379}]
```
-->

## Summary

This document provides detailed test cases for the Overlay Events and queryAttributeSet functionality supporting point events as input. It covers various scenarios including simple, complex, vertical, gapped routes, multiple time slices, overlapping events, and events across different LRS networks with measure translation. The tests validate correct output generation for line and point events in different datasets and network configurations.

## Related documents

<!-- related:begin -->
- [Overlay Events and queryAttributeSet Support for UN Pipeline Devices and Junctions](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-events-and-queryattributeset-support-for-un-pipeline-devices-and__doc79.md>) — similar text 0.56 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:79 -->
- [Support Centerline as Input in queryAttributeSet and Overlay Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-centerline-as-input-in-queryattributeset-and-overlay-events-test-plan__doc461.md>) — similar text 0.65 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:461 -->
- [Overlay Events/queryAttributeSet: Update Address Range info via Address Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md>) — similar text 0.08 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:257 -->
- [Point Events Dynamic Segmentation Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/point-events-dynamic-segmentation-test-plan__doc365.md>) — similar text 0.12 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:365 -->
- [Add Line Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-by-offsetting-from-other-points-test-plan__doc231.md>) — similar text 0.10 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:231 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [queryAttributeSet](https://www.google.com/search?q=%22queryAttributeSet%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 24 buttons, 7 row separators, 11 icons, 34 text rows. 34 of 34 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc603_slide1.svg)

Overlay Events/queryAttributeSet Point Event Support

| Notes |
| --- |
| Allow point events as input in Overlay Events and queryAttributeSet Where a point event exists, a new record will be created with the same From/To Measure and From/To RouteID. Test with Non-line and Line networks, including one test on an Addressing dataset (with addressing info on the LRS Centerline layer) Test at least one case where events are associated with a different LRS Network and translation occurs Test with normal, complex, vertical, and gapped routes For Overlay Events, test in FGDB, EGDB, and FS For queryAttributeSet, test in FS only Sanity test existing functionality by running without point event input Test Overlay Events in ModelBuilder and Python with point input A line event layer input is required for point event layer input |

Devtopia Issue

| Positive Tests: Overlay Events UI |
| --- |
| Point events can be input in Event Layers parameter |

| Negative Tests: Overlay Events |
| --- |
| Only one point event is input into the Event Layers, with no input line event layers |

| Negative Tests: queryAttributeSet |
| --- |
| Only one point event is input into the attributeSet, with no input line event layers |

![image1.png](../media/doc603_image1.png)

## Case 1 <!-- slide 2 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

Route1
Route2

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input point and line events, including the PipelineLine layer (UNAPR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc603_slide2.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pipeline Line | N/A | N/A | N/A | 0 | 5 | N/A | N/A | Steel | Active |
| Pipeline Line | N/A | N/A | N/A | 10 | 12.5 | N/A | N/A | Plastic | Active |
| Pipeline Line | N/A | N/A | N/A | 12.5 | 15 | N/A | N/A | Steel | Active |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | PipelineLine. Attribute1 | PipelineLine. Attribute2 | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | Steel | Active | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | Steel | Active | 450psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | Steel | Active | 450psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | Plastic | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 14 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | Steel | Active | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 2 <!-- slide 3 -->

### Overlay Events / QueryAttributeSet on Complex Routes with No

**Overlay Events/queryAttributeSet on complex routes with no input tVD and multiple input line and point events (UNAPR Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 4 nodes, 2 freeform paths.](../media/doc603_slide3.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 20 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 6 | N/A | Route1 | N/A | Dent | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 1.5 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 10 | N/A | Route1 | N/A | 1400 | Active |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 17.5 | N/A | Route2 | N/A | 1500 | Active |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 1.5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 1.5 | 1.5 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 1.5 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 6 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 6 | 6 | Upstream | 500 psi | Proposed | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 6 | 10 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 10 | 10 | Upstream | 500 psi | Proposed | <Null> | <Null> | 1400 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 15 | 17.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 17.5 | 17.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 17.5 | 20 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1
Route2

![image4.png](../media/doc603_image4.png)

## Case 3 <!-- slide 4 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, including point events that overlap (UNAPR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide4.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Dent | Active | 1500 | Active |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 15 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 1 <!-- slide 5 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple line and point input events, including the Road Centerline layer (ADM-RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc603_slide5.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Centerline | N/A | N/A | N/A | N/A | N/A | 100 | 120 |
| Centerline | N/A | N/A | N/A | N/A | N/A | 122 | 140 |
| Centerline | N/A | N/A | N/A | N/A | N/A | 142 | 160 |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |

Output (Centerline measures are found in-memory):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | Centerline. Attribute1 | Centerline. Attribute2 | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | 100 | 120 | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | 100 | 120 | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | 100 | 120 | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Interstate | 100 | 120 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 7.5 | Interstate | 122 | 140 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 7.5 | 9 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 2 <!-- slide 6 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple line and point input events, including a flipped Road Centerline layer (ADM-RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 3 nodes, 5 connectors.](../media/doc603_slide6.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Centerline | N/A | N/A | N/A | N/A | N/A | 100 | 120 |
| Centerline | N/A | N/A | N/A | N/A | N/A | 122 | 140 |
| Centerline | N/A | N/A | N/A | N/A | N/A | 142 | 160 |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 6 | N/A | Stop | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |

Output (Centerline measures are found in-memory):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | Centerline. Attribute1 | Centerline. Attribute2 | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | 100 | 120 | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | 100 | 120 | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | 100 | 120 | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Interstate | 100 | 120 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 7.5 | 6 | Interstate | 122 | 140 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 6 | 6 | Interstate | 122 | 140 | Laporte | Proposed | Stop | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 6 | 5 | Interstate | 122 | 140 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 7.5 | 9 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | 142 | 160 | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 1 <!-- slide 7 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide7.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 2 <!-- slide 8 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 2 nodes, 2 freeform paths.](../media/doc603_slide8.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 8 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Output:

Route1

![image6.png](../media/doc603_image6.png)

## Case 3 <!-- slide 9 -->

### Overlay Events / QueryAttributeSet on Vertical Routes with No

**Overlay Events/queryAttributeSet on vertical routes with no input tVD and multiple input events**
(RH Dataset)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 7 connectors.](../media/doc603_slide9.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 8 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

## Case 4 <!-- slide 10 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events, with line attribution remaining the same along the route (RH Dataset)**
Input:

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide10.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Green Event | Green1 | 1/1/2000 | <Null> | 0 | 10 | 45 MPH | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | GreenEvent . Green1 | GreenEvent . Green2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | 45 MPH | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | 45 MPH | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 8 | Interstate | 45 MPH | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | 45 MPH | Active | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | 45 MPH | Active | <Null> | <Null> | <Null> | <Null> |

Output:

![image5.png](../media/doc603_image5.png)

## Case 5 <!-- slide 11 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events, with line events that don’t fully cover a route (RH Dataset)**
Input:
Route1

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 3 nodes, 2 connectors.](../media/doc603_slide11.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 2.5 | 5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 7.5 | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 1 | N/A | Yield | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 5 | N/A | Stop | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 1 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 1 | 1 | Interstate | <Null> | <Null> | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 1 | 2.5 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Interstate | Laporte | Active | Stop | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 7.5 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 7.5 | 9 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | <Null> | <Null> | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

Output:

![image5.png](../media/doc603_image5.png)

## Case 6 <!-- slide 12 -->

### Overlay Events / QueryAttributeSet on Gapped Routes with Input

**Overlay Events/queryAttributeSet on gapped routes with input line and point events (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide12.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 4 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 6 | 10 | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 4 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 6 | 8 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | Laporte | Active | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |

![image7.png](../media/doc603_image7.png)

## Slide 13

6A. Overlay Events/queryAttributeSet on route with multiple gaps and with input line and point events\
(RH Dataset)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 8 nodes, 4 connectors.](../media/doc603_slide13.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 3 | 4 | Laporte | Active |
| Red Event | Red3 | 1/1/2000 | <Null> | 5 | 7 | Adams | Active |
| Red Event | Red4 | 1/1/2000 | <Null> | 8 | 10 | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 0 | N/A | Yield | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Purple Event | Purple3 | 1/1/2000 | <Null> | 3 | N/A | Yield | Active |
| Purple Event | Purple4 | 1/1/2000 | <Null> | 4 | N/A | Yield | Active |
| Purple Event | Purple5 | 1/1/2000 | <Null> | 5 | N/A | Yield | Active |
| Purple Event | Purple6 | 1/1/2000 | <Null> | 7 | N/A | Yield | Active |
| Purple Event | Purple7 | 1/1/2000 | <Null> | 8 | N/A | Yield | Active |
| Purple Event | Purple8 | 1/1/2000 | <Null> | 10 | N/A | Yield | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Interstate | Adams | Active | Yield | Active |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active |
| Point | Route1 | 1/1/2000 | <Null> | 3 | 3 | Interstate | Adams | Active | Yield | Active |
| Line | Route1 | 1/1/2000 | <Null> | 3 | 4 | Interstate | Adams | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 4 | 4 | Interstate | Adams | Active | Yield | Active |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Interstate | Adams | Active | Yield | Active |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 7 | Interstate | Adams | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 7 | 7 | Interstate | Adams | Active | Yield | Active |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | Adams | Active | Yield | Active |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | Adams | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 10 | 10 | Interstate | Adams | Active | Yield | Active |

![image8.png](../media/doc603_image8.png)

## Case 7 <!-- slide 14 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events that belong to a different LRS Network, with measure translation occurring between the networks (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network2 | RouteA | 1/1/2000 | <Null> | County |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide14.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 0 mi | 10 mi | Adams | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 mi | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 mi | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent. Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteA | 1/1/2000 | <Null> | 0 ft | 10560 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 10560 ft | 10560 ft | County | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | RouteA | 1/1/2000 | <Null> | 10560 ft | 42240 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 42240 ft | 42240 ft | County | Adams | Active | <Null> | <Null> | Private | Proposed |
| Line | RouteA | 1/1/2000 | <Null> | 42240 ft | 52800 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |

![image9.png](../media/doc603_image9.png) ![image5.png](../media/doc603_image5.png)

## Slide 15

7A. Overlay Events/queryAttributeSet on gapped route with multiple input line and point events that belong to a different LRS Network, with measure translation occurring between the networks (RH Dataset)

| Network Name | RouteID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network2 | RouteA | 1/1/2000 | <Null> | County |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide15.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 0 mi | 10 mi | Adams | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 mi | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 mi | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent. Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteA | 1/1/2000 | <Null> | 0 ft | 10560 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 10560 ft | 10560 ft | County | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | RouteA | 1/1/2000 | <Null> | 10560 ft | 15840 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 31680 ft | 42240 ft | County | Adams | Active | <Null> | <Null> | Private | Proposed |
| Line | RouteA | 1/1/2000 | <Null> | 42240 ft | 52800 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |

![image10.png](../media/doc603_image10.png) ![image5.png](../media/doc603_image5.png)

## Slide 16

7B. Overlay Events/queryAttributeSet on gapped routes with input line and point events that belong to a different network. Each network has a different gap calibration (RH Dataset)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network2 | RouteA | 1/1/2000 | <Null> | County |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide16.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 4 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 6 | 10 | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 4 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 4.1 | 6.1 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 6.1 | 8.1 | Interstate | Laporte | Active | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8.1 | 10.1 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |

![image11.png](../media/doc603_image11.png) ![image7.png](../media/doc603_image7.png)

## Slide 17

![Schematic redrawn from the slide's data: gapped route R1 after the split at measure 1.5: event Red2 as 0–1.5 and 1.5–3.](../media/doc603_slide17_fig2.svg)

7C. Overlay Events/queryAttributeSet on routes with multiple input gapped line and point events that belong to a different LRS Network, with measure translation occurring between the networks (RH Dataset)

| Network Name | RouteID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network2 | RouteA | 1/1/2000 | <Null> | County |

![Schematic redrawn from the slide's data: gapped route R1, event Red2 from measure 0 to 3, before the split at measure 1.5.](../media/doc603_slide17_fig1.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 0 mi | 3 mi | Adams | Active |
| Red Event | Red3 | 1/1/2000 | <Null> | 7 mi | 10 mi | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 mi | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 mi | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent. Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteA | 1/1/2000 | <Null> | 0 ft | 10560 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 10560 ft | 10560 ft | County | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | RouteA | 1/1/2000 | <Null> | 10560 ft | 15840 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | RouteA | 1/1/2000 | <Null> | 15840 ft | 36960 ft | County | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | <Null> | 42240 ft | 42240 ft | County | Adams | Active | <Null> | <Null> | Private | Proposed |
| Line | RouteA | 1/1/2000 | <Null> | 42240 ft | 52800 ft | County | Adams | Active | <Null> | <Null> | <Null> | <Null> |

![image9.png](../media/doc603_image9.png) ![image5.png](../media/doc603_image5.png)

## Case 8 <!-- slide 18 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple line and point events with multiple time slices (RH Dataset)**
Input:
Route1

| Network Name | Route ID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 6 connectors.](../media/doc603_slide18.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | 1/1/2005 | 0 | 10 | Adams | Retired |
| Red Event | Red1 | 1/1/2005 | 1/1/2010 | 0 | 5 | Adams | Retired |
| Red Event | Red2 | 1/1/2005 | 1/1/2010 | 5 | 10 | Laporte | Retired |
| Red Event | Red1 | 1/1/2010 | <Null> | 0 | 10 | Adams | Active |
| Blue Event | Blue1 | 1/1/2000 | 1/1/2005 | 0 | 8 | Full Access | Retired |
| Blue Event | Blue2 | 1/1/2005 | <Null> | 0 | 10 | No Access | Active |
| Purple Event | Purple1 | 1/1/2000 | 1/1/2005 | 2 | N/A | Yield | Retired |
| Purple Event | Purple1 | 1/1/2005 | <Null> | 2 | N/A | Stop | Active |

| Type | Route ID | FromDate | ToDate | FromMeasure | ToMeasure | Network1.Type | RedEvent.Red1 | RedEvent.Red2 | BlueEvent.Blue1 | BlueEvent.Blue2 | PurpleEvent.Purple1 | PurpleEvent.Purple2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 0 | 2 | Interstate | Adams | Retired | Full Access | Retired | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | 1/1/2005 | 2 | 2 | Interstate | Adams | Retired | Full Access | Retired | Yield | Retired |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 2 | 8 | Interstate | Adams | Retired | Full Access | Retired | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 8 | 10 | Interstate | Adams | Retired | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 0 | 2 | Interstate | Adams | Retired | No Access | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2005 | 1/1/2010 | 2 | 2 | Interstate | Adams | Retired | No Access | Active | Stop | Active |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 2 | 5 | Interstate | Adams | Retired | No Access | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 5 | 10 | Interstate | Laporte | Retired | No Access | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2010 | <Null> | 0 | 2 | Interstate | Adams | Active | No Access | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2010 | <Null> | 2 | 2 | Interstate | Adams | Active | No Access | Active | Stop | Active |
| Line | Route1 | 1/1/2010 | <Null> | 2 | 10 | Interstate | Adams | Active | No Access | Active | <Null> | <Null> |

Output:

![image5.png](../media/doc603_image5.png)

## Slide 19

8A. Overlay Events/queryAttributeSet on routes with multiple line and point events with multiple time slices, with different LRS Network as input
(RH Dataset)

| Network Name | Route ID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network2 | RouteA | 1/1/2000 | <Null> | County |

![Diagram drawn from the slide's own shapes: 2 nodes, 6 connectors.](../media/doc603_slide19.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | 1/1/2005 | 0 mi | 10 mi | Adams | Retired |
| Red Event | Red1 | 1/1/2005 | 1/1/2010 | 0 mi | 5 mi | Adams | Retired |
| Red Event | Red2 | 1/1/2005 | 1/1/2010 | 5 mi | 10 mi | Laporte | Retired |
| Red Event | Red1 | 1/1/2010 | <Null> | 0 mi | 10 mi | Adams | Active |
| Blue Event | Blue1 | 1/1/2000 | 1/1/2005 | 0 mi | 8 mi | Full Access | Retired |
| Blue Event | Blue2 | 1/1/2005 | <Null> | 0 mi | 10 mi | No Access | Active |
| Purple Event | Purple1 | 1/1/2000 | 1/1/2005 | 2 mi | N/A | Yield | Retired |
| Purple Event | Purple1 | 1/1/2005 | <Null> | 2 mi | N/A | Stop | Active |

| Type | Route ID | FromDate | ToDate | FromMeasure | ToMeasure | Network1.Type | RedEvent.Red1 | RedEvent.Red2 | BlueEvent.Blue1 | BlueEvent.Blue2 | PurpleEvent.Purple1 | PurpleEvent.Purple2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteA | 1/1/2000 | 1/1/2005 | 0 ft | 10560 ft | County | Adams | Retired | Full Access | Retired | <Null> | <Null> |
| Point | RouteA | 1/1/2000 | 1/1/2005 | 10560 ft | 10560 ft | County | Adams | Retired | Full Access | Retired | Yield | Retired |
| Line | RouteA | 1/1/2000 | 1/1/2005 | 10560 ft | 42240 ft | County | Adams | Retired | Full Access | Retired | <Null> | <Null> |
| Line | RouteA | 1/1/2000 | 1/1/2005 | 42240 ft | 52800 ft | County | Adams | Retired | <Null> | <Null> | <Null> | <Null> |
| Line | RouteA | 1/1/2005 | 1/1/2010 | 0 ft | 10560 ft | County | Adams | Retired | No Access | Active | <Null> | <Null> |
| Point | RouteA | 1/1/2005 | 1/1/2010 | 10560 ft | 10560 ft | County | Adams | Retired | No Access | Active | Stop | Active |
| Line | RouteA | 1/1/2005 | 1/1/2010 | 10560 ft | 26400 ft | County | Adams | Retired | No Access | Active | <Null> | <Null> |
| Line | RouteA | 1/1/2005 | 1/1/2010 | 26400 ft | 52800 ft | County | Laporte | Retired | No Access | Active | <Null> | <Null> |
| Line | RouteA | 1/1/2010 | <Null> | 0 ft | 10560 ft | County | Adams | Active | No Access | Active | <Null> | <Null> |
| Point | RouteA | 1/1/2010 | <Null> | 10560 ft | 10560 ft | County | Adams | Active | No Access | Active | Stop | Active |
| Line | RouteA | 1/1/2010 | <Null> | 10560 ft | 52800 ft | County | Adams | Active | No Access | Active | <Null> | <Null> |

![image9.png](../media/doc603_image9.png) ![image5.png](../media/doc603_image5.png)

## Case 9 <!-- slide 20 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 1.3: event Red1 as 0–1.3 and 1.3–2.5.](../media/doc603_slide20_fig2.svg)

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with point events at the end/begin of two line events (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Schematic redrawn from the slide's data: straight route R1, event Red1 from measure 0 to 2.5, before the split at measure 1.3.](../media/doc603_slide20_fig1.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Blue Event | Blue1 | 1/1/2000 | <Null> | 0 | 10 | Full Access | Active |
| Green Event | Green1 | 1/1/2000 | <Null> | 0 | 10 | 45 MPH | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2.5 | N/A | Yield | Active |

Output (attributes are taken from the line event that has a higher measure value):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | BlueEvent . Blue1 | BlueEvent . Blue2 | GreenEvent . Green1 | GreenEvent . Green2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Interstate | Adams | Active | Full Access | Active | 45 MPH | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2.5 | 2.5 | Interstate | Laporte | Proposed | Full Access | Active | 45 MPH | Active | Yield | Active |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 10 | Interstate | Laporte | Proposed | Full Access | Active | 45 MPH | Active | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 10 <!-- slide 21 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and point events, with no line events on input route with line events still included in input (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |
| Network1 | RouteX | 1/1/2000 | <Null> | County |

Input:

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc603_slide21.svg)

| Input Layer | RouteID | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Purple Event | Route1 | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Route1 | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Private | Proposed |

Output (Input line events are not on route, but are still included in the input):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | BlueEvent . Blue1 | BlueEvent . Blue2 | GreenEvent . Green1 | GreenEvent . Green2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 8 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8 | 8 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8 | 10 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 11 <!-- slide 22 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with multiple point events of the same layer at a location (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 3 nodes, 2 connectors.](../media/doc603_slide22.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 9 | N/A | Limited | Proposed |

Output (When more than one point event, an event is randomly selected):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

![image5.png](../media/doc603_image5.png)

## Case 12 <!-- slide 23 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events, with point events at the start and end of a route (RH Dataset)**
Input:

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide23.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 0 | 10 | Adams | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 0 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 10 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 10 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 10 | 10 | Interstate | Adams | Active | <Null> | <Null> | Private | Proposed |

Output:

![image5.png](../media/doc603_image5.png)

## Case 13 <!-- slide 24 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with point events existing at the intersecting point of complex route (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 2 nodes, 2 freeform paths.](../media/doc603_slide24.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 1.5 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8.5 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 1.5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 1.5 | 1.5 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 1.5 | 5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 8.5 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 8.5 | 8.5 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 8.5 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Output:

Route1

![image6.png](../media/doc603_image6.png)

## Case 14 <!-- slide 25 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events, with overlapping point events from different event layers (RH Dataset)**
Input:

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide25.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red2 | 1/1/2000 | <Null> | 0 | 10 | Adams | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 5 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 5 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Interstate | Adams | Active | Yield | Active | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 10 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |

Output:

![image5.png](../media/doc603_image5.png)

## Case 15 <!-- slide 26 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple input line and point events, with line events that don’t fully cover a route (RH Dataset)**
Input:
Route1

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide26.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 2.5 | 5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 7.5 | Laporte | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2.5 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 7.5 | N/A | Private | Proposed |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2.5 | 2.5 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 7.5 | Interstate | Laporte | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 7.5 | 7.5 | Interstate | Laporte | Active | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 7.5 | 10 | Interstate | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

Output:

![image5.png](../media/doc603_image5.png)

## Case 16 <!-- slide 27 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, but there is a selection set (Yellow1) on the point event layer (RH Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Interstate |

Input:

![Diagram drawn from the slide's own shapes: 5 nodes, 2 connectors.](../media/doc603_slide27.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Adams | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Laporte | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Yield | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 9 | N/A | Private | Proposed |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 1 | N/A | Private | Proposed |
| Yellow Event | Yellow3 | 1/1/2000 | <Null> | 4 | N/A | Private | Proposed |
| Yellow Event | Yellow4 | 1/1/2000 | <Null> | 7 | N/A | Private | Proposed |

Output:

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Interstate | Adams | Active | Yield | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Interstate | Adams | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 9 | 9 | Interstate | Laporte | Proposed | <Null> | <Null> | Private | Proposed |
| Line | Route1 | 1/1/2000 | <Null> | 9 | 10 | Interstate | Laporte | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1

![image5.png](../media/doc603_image5.png)

## Case 1 <!-- slide 28 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide28.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 450psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 2 <!-- slide 29 -->

### Overlay Events / QueryAttributeSet on Complex Routes with No

**Overlay Events/queryAttributeSet on complex routes with no input tVD and multiple input line and point events**
(APR Dataset)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 2 freeform paths.](../media/doc603_slide29.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 5 | 10 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 6 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 17.5 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 5 | 6 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 6 | 6 | Upstream | 500 psi | Proposed | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 6 | 10 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 15 | 17.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 17.5 | 17.5 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 17.5 | 20 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image4.png](../media/doc603_image4.png)

## Case 3 <!-- slide 30 -->

### Overlay Events / QueryAttributeSet on Vertical Routes with No

**Overlay Events/queryAttributeSet on vertical routes with no input tVD and multiple spanning and non-spanning input events (APR Dataset)**

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 8 connectors.](../media/doc603_slide30.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 20 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 17.5 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 500 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 15 | 17.5 | Midstream | 500 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 17.5 | 17.5 | Midstream | 500 psi | Active | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 17.5 | 20 | Midstream | 500 psi | Active | <Null> | <Null> | <Null> | <Null> |

## Case 4 <!-- slide 31 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide31.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 15 | Route1 | Route1 | 450 psi | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 5 | Upstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 14 | Midstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 450 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 5 <!-- slide 32 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, including point events that overlap (APR Dataset)**

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide32.svg)

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 2.5 | 12.5 | Route1 | Route2 | 450 psi | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | <Null> | <Null> | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 14 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | <Null> | <Null> | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 6 <!-- slide 33 -->

### Overlay Events / QueryAttributeSet on Gapped Routes with

**Overlay Events/queryAttributeSet on gapped routes with multiple input line and point events (APR Dataset)**

![Measured route diagram drawn from the slide's own shapes.](../media/doc603_slide33.svg)

| Network Name | RouteID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 4 | 15 | Route1 | Route2 | 450 psi | Active |
| Blue Event | Blue1 | 1/1/2000 | <Null> | 0 | 1 | Route1 | Route1 | Low | Active |
| Green Event | Green1 | 1/1/2000 | <Null> | 0 | 1 | Route1 | Route1 | Complete | Active |
| Green Event | Green2 | 1/1/2000 | <Null> | 4 | 12.5 | Route1 | Route2 | Incomplete | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 0.5 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | BlueEvent . Blue1 | BlueEvent . Blue2 | GreenEvent . Green1 | GreenEvent . Green2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 0.5 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 0.5 | 0.5 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 0.5 | 1 | Upstream | <Null> | <Null> | Low | Active | Complete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 4 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | Incomplete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | Incomplete | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 14 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image12.png](../media/doc603_image12.png)

## Case 7 <!-- slide 34 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with input network as a different LRS Network (APR Dataset)**

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide34.svg)

| Network Name | RouteID | From Date | To Date | Attribute |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |
| Network2 | RouteX | 1/1/2000 | <Null> | Public |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 mi | 10 mi | Route1 | Route1 | 450 psi | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 mi | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 13 mi | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network2. Access | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | RouteX | 1/1/2000 | <Null> | 0 ft | 10560 ft | Public | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | RouteX | 1/1/2000 | <Null> | 10560 ft | 10560 ft | Public | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Line | RouteX | 1/1/2000 | <Null> | 10560 ft | 42240 ft | Public | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | RouteX | 1/1/2000 | <Null> | 42240 ft | 42240 ft | Public | 450 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | RouteX | 1/1/2000 | <Null> | 42240 ft | 52800 ft | Public | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png) ![image9.png](../media/doc603_image9.png)

## Case 8 <!-- slide 35 -->

### Overlay Events / QueryAttributeSet on Routes with Multiple

**Overlay Events/queryAttributeSet on routes with multiple time slices of input line and point events (APR Dataset)**

| Network Name | Route ID | From Date | To Date | Type |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Type | Route ID | From Date | To Date | From Measure | To Measure | Network1. Type | RedEvent . Red1 | RedEvent . Red2 | BlueEvent . Blue1 | BlueEvent . Blue2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 0 | 2.5 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | 1/1/2005 | 2.5 | 2.5 | Upstream | 450 psi | Retired | Low | Retired | Dent | Retired |
| Line | Route1 | 1/1/2000 | 1/1/2005 | 2.5 | 5 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | 1/1/2005 | 10 | 13 | Upstream | 450 psi | Retired | Low | Retired | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | 1/1/2005 | 13 | 15 | Upstream | 450 psi | Retired | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 0 | 2.5 | Upstream | 450 psi | Retired | Medium | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2005 | 1/1/2010 | 2.5 | 2.5 | Upstream | 450 psi | Retired | Medium | Active | Corrosion | Active |
| Line | Route1 | 1/1/2005 | 1/1/2010 | 2.5 | 5 | Upstream | 450 psi | Retired | Medium | Active | <Null> | <Null> |
| Line | Route2 | 1/1/2005 | 1/1/2010 | 10 | 15 | Upstream | 500 psi | Retired | Medium | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2010 | <Null> | 0 | 2.5 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2010 | <Null> | 2.5 | 2.5 | Upstream | 450 psi | Active | Medium | Active | Corrosion | Active |
| Line | Route1 | 1/1/2010 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> |
| Line | Route2 | 1/1/2010 | <Null> | 10 | 15 | Upstream | 450 psi | Active | Medium | Active | <Null> | <Null> |

![Diagram drawn from the slide's own shapes: 2 nodes, 6 connectors.](../media/doc603_slide35.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | 1/1/2005 | 0 | 15 | Route1 | Route2 | 450 psi | Retired |
| Red Event | Red1 | 1/1/2005 | 1/1/2010 | 0 | 5 | Route1 | Route1 | 450 psi | Retired |
| Red Event | Red2 | 1/1/2005 | 1/1/2010 | 10 | 15 | Route2 | Route2 | 500 psi | Retired |
| Red Event | Red1 | 1/1/2010 | <Null> | 0 | 15 | Route1 | Route2 | 450 psi | Active |
| Blue Event | Blue1 | 1/1/2000 | 1/1/2005 | 0 | 13 | Route1 | Route2 | Low | Retired |
| Blue Event | Blue2 | 1/1/2005 | <Null> | 0 | 15 | Route1 | Route2 | Medium | Active |
| Purple Event | Purple1 | 1/1/2000 | 1/1/2005 | 2.5 | N/A | Route1 | N/A | Dent | Retired |
| Purple Event | Purple1 | 1/1/2005 | <Null> | 2.5 | N/A | Route1 | N/A | Corrosion | Active |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 9 <!-- slide 36 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with a point event on the cusp of two line events (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

Input:

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc603_slide36.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 13 | N/A | Route2 | N/A | 1500 | Active |

Output (higher measure value line event attributes will be used for point):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2.5 | 2.5 | Upstream | 500 psi | Proposed | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 13 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 13 | 13 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 13 | 15 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

Route1
Route2

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 10 <!-- slide 37 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 1.3: event Red1 as 0–1.3 and 1.3–2.5.](../media/doc603_slide37_fig2.svg)

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with the line events found on a different route (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Schematic redrawn from the slide's data: straight route R1, event Red1 from measure 0 to 2.5, before the split at measure 1.3.](../media/doc603_slide37_fig1.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | RouteX | RouteX | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | RouteX | RouteY | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 13 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2 | 2 | Upstream | <Null> | <Null> | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 13 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 13 | 13 | Midstream | <Null> | <Null> | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 13 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 11 <!-- slide 38 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with multiple point events at a location (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 3 nodes, 4 connectors.](../media/doc603_slide38.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 10 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 8 | N/A | Route2 | N/A | 1500 | Active |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 8 | N/A | Route2 | N/A | 1200 | Proposed |

Output (when more than one point event of the same layer exists at a location, an event is randomly chosen):

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 450psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 5 | 8 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 8 | 8 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 8 | 10 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

## Case 12 <!-- slide 39 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with point events on start/end of each route(APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 4 nodes, 2 connectors.](../media/doc603_slide39.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 0 | N/A | Route1 | N/A | Dent | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 5 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 10 | N/A | Route2 | N/A | 1500 | Active |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 15 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Point | Route1 | 1/1/2000 | <Null> | 0 | 0 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 5 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 10 | 10 | Midstream | 450 psi | Active | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 15 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 15 | 15 | Midstream | 450 psi | Active | <Null> | <Null> | 1500 | Active |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 13 <!-- slide 40 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with overlapping point events that are part of different layers (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc603_slide40.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 15 | Route1 | Route1 | 450 psi | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Purple Event | Purple2 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route1 | N/A | 1500 | Active |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 14 | N/A | Route1 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450 psi | Active | Dent | Active | 1500 | Active |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 5 | Upstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 14 | Midstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 450 psi | Proposed | Dent | Active | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 450 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 14 <!-- slide 41 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with point events on cusp of line events (APR Dataset)**

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc603_slide41.svg)

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 2.5 | 12.5 | Route1 | Route2 | 450 psi | Active |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2.5 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 12.5 | N/A | Route2 | N/A | 1500 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2.5 | Upstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |
| Point | Route1 | 1/1/2000 | <Null> | 2.5 | 2.5 | Upstream | 450 psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 12.5 | 12.5 | Midstream | 450 psi | Active | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 12.5 | 15 | Midstream | <Null> | <Null> | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)

## Case 15 <!-- slide 42 -->

### Overlay Events / QueryAttributeSet on Simple Routes with No

**Overlay Events/queryAttributeSet on simple routes with no input tVD and multiple input line and point events, with a selection set on the Yellow event layer (APR Dataset)**

| Network Name | RouteID | From Date | To Date | PipeType |
| --- | --- | --- | --- | --- |
| Network1 | Route1 | 1/1/2000 | <Null> | Upstream |
| Network1 | Route2 | 1/1/2000 | <Null> | Midstream |

![Diagram drawn from the slide's own shapes: 6 nodes, 2 connectors.](../media/doc603_slide42.svg)

| Input Layer | Event ID | From Date | To Date | From Measure | To Measure | From RouteID | To RouteID | Attribute [Color1] | Attribute [Color2] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Red Event | Red1 | 1/1/2000 | <Null> | 0 | 2.5 | Route1 | Route1 | 450 psi | Active |
| Red Event | Red2 | 1/1/2000 | <Null> | 2.5 | 15 | Route1 | Route2 | 500 psi | Proposed |
| Purple Event | Purple1 | 1/1/2000 | <Null> | 2 | N/A | Route1 | N/A | Dent | Active |
| Yellow Event | Yellow1 | 1/1/2000 | <Null> | 14 | N/A | Route2 | N/A | 1500 | Active |
| Yellow Event | Yellow2 | 1/1/2000 | <Null> | 0 | N/A | Route1 | N/A | 1600 | Active |
| Yellow Event | Yellow3 | 1/1/2000 | <Null> | 4 | N/A | Route1 | N/A | 1700 | Active |
| Yellow Event | Yellow4 | 1/1/2000 | <Null> | 11 | N/A | Route2 | N/A | 1400 | Active |
| Yellow Event | Yellow5 | 1/1/2000 | <Null> | 15 | N/A | Route2 | N/A | 1300 | Active |

| Type | RouteID | From Date | To Date | From Measure | To Measure | Network1. PipeType | RedEvent . Red1 | RedEvent . Red2 | PurpleEvent . Purple1 | PurpleEvent . Purple2 | YellowEvent . Yellow1 | YellowEvent . Yellow2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Line | Route1 | 1/1/2000 | <Null> | 0 | 2 | Upstream | 450 psi | Active | <Null> | <Null> | <Null> | <Null> |
| Point | Route | 1/1/2000 | <Null> | 2 | 2 | Upstream | 450psi | Active | Dent | Active | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2 | 2.5 | Upstream | 450psi | Active | <Null> | <Null> | <Null> | <Null> |
| Line | Route1 | 1/1/2000 | <Null> | 2.5 | 5 | Upstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Line | Route2 | 1/1/2000 | <Null> | 10 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |
| Point | Route2 | 1/1/2000 | <Null> | 14 | 14 | Midstream | 500 psi | Proposed | <Null> | <Null> | 1500 | Active |
| Line | Route2 | 1/1/2000 | <Null> | 14 | 15 | Midstream | 500 psi | Proposed | <Null> | <Null> | <Null> | <Null> |

![image2.png](../media/doc603_image2.png) ![image3.png](../media/doc603_image3.png)
