# Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#5141](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5141) |
| **Source** | [5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6.pptx>) |
| **Edited** | 2023-07-26 21:42 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan"
source_file: "5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5141-ReassignRoutetoAnotherLineSupportMoveEventBehavior_TestPlan_V6.pptx"
doc_id: 533
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V6"
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Mac Christmas"
last_edited: "2023-07-26T21:42:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign route", "move event behavior", "transfer to another line", "route reassignment", "spanning line events", "event location error", "measure recalibration", "route renaming", "partial route reassignment", "route transfer", "engineering network", "test plan"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#5141"]
related: [{"doc":528,"file":"reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md","s":6.879},{"doc":527,"file":"transfer-to-another-line-support-snap-event-behavior-test-plan__doc527.md","s":6.223},{"doc":526,"file":"transfer-to-another-line-support-snap-event-behavior-test-plan__doc526.md","s":5.899},{"doc":583,"file":"support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md","s":5.487},{"doc":538,"file":"reassign-route-supporting-transferring-to-another-line-test-plan__doc538.md","s":5.382}]
```
-->

## Summary

This test plan covers the reassignment of routes to another line using the transfer to another line method with move event behavior. It includes tests for point, line, and spanning line events on simple and complex route shapes, with scenarios involving whole routes, partial routes, multiple routes, and recalibration of source and target routes. The plan verifies event location errors and measure recalibration across various test cases and network types.

## Related documents

<!-- related:begin -->
- [Reassign - Transfer to Another Line with StayPut and Retire Event Behavior - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md>) — similar text 0.38 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:528 -->
- [Transfer to Another Line – Support Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/transfer-to-another-line-support-snap-event-behavior-test-plan__doc527.md>) — similar text 0.18 · 6 title words · 1 filename word · same kind/folder <!-- rel:527 -->
- [Transfer to Another Line – Support Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/transfer-to-another-line-support-snap-event-behavior-test-plan__doc526.md>) — similar text 0.19 · 6 title words · 1 filename word · same kind/folder <!-- rel:526 -->
- [Support Reassign: Transfer as New Route(s) to Adjacent Line Method in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-transfer-as-new-route-s-to-adjacent-line-method-in-arcgis-pro__doc583.md>) — similar text 0.23 · 6 title words · 2 filename words · same surface <!-- rel:583 -->
- [Reassign Route Supporting Transferring to Another Line - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-supporting-transferring-to-another-line-test-plan__doc538.md>) — similar text 0.29 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:538 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide1.svg)

Reassign Route Transfer to Another Line Method: Support Move Event Behavior

| Notes |
| --- |
| Test with Line Network only, do not test PoM since PoM routes do not store events Test with Transfer to another line method only Test with Move event behavior only Test point, line, and spanning line events Test with both simple and complex route shapes Test with events that cover whole routes, partial routes, span routes, etc. Test with reassignment of whole routes, partial routes, multiple routes, etc. Check Edit Log following Reassign Routes and Apply Event Behaviors |

![image1.png](../media/doc409_image1.png)

## Slide 2

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

| Test ID | 1 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide2.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2020 |
|  |  |

![image2.png](../media/doc409_image2.png)

## Slide 3

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 1A | L1 | 12/31/2010 | Null | 100 | 2 | 4 |
| 2A | L1 | 12/31/2010 | Null | 200 | 0 | 2 |
| 3A | L1 | 12/31/2010 | Null | 300 | 0 | 4 |
| 1B | L1 | 12/31/2010 | Null | 400 | 3 | 5 |
| 2B | L1 | 12/31/2010 | Null | 500 | 4 | 8 |
| 3B | L1 | 12/31/2010 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

| Test ID | 1 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. |  |  |

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide3.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |

![image3.png](../media/doc409_image3.png) ![image4.png](../media/doc409_image4.png)

## Slide 4

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide4.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 2 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 5

![Diagram drawn from the slide's own shapes: 2 connectors, 4 freeform paths.](../media/doc409_slide5.svg)

| Test ID | 2 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed. |  |  |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 1A-Change | L1 | 12/31/2010 | Null | 100 | 5 | 8 |
| 2A | L1 | 12/31/2010 | Null | 200 | 0 | 2 |
| 3A | L1 | 12/31/2010 | Null | 300 | 0 | 4 |
| 1B | L1 | 12/31/2010 | Null | 400 | 3 | 5 |
| 2B | L1 | 12/31/2010 | Null | 500 | 4 | 8 |
| 3B | L1 | 12/31/2010 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | Route not Found |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | Route not Found |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | Route not Found |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | Route not Found |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | Route not Found |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | Route not Found |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |

![image4.png](../media/doc409_image4.png) ![image5.png](../media/doc409_image5.png)

## Slide 6

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide6.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 3 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign in the middle spanning routes to the line on the right. Rename one route |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 7

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 2A | L0 | 12/31/2010 | Null | 200 | 0 | 1 |
| 2A Line1 | L1 | 12/31/2010 | Null | 100 | 1 | 2 |
| 3A | L1 | 12/31/2010 | Null | 200 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 1B | L1 | 12/31/2010 | Null | 300 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 2B | L1 | 12/31/2010 | Null | 400 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 3B | L1 | 12/31/2010 | Null | 500 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![Measured route diagram drawn from the slide's own shapes, measures 4 to 1.](../media/doc409_slide7.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | Different From Route And To Route Line IDs |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | Different From Route And To Route Line IDs |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | Different From Route And To Route Line IDs |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | Different From Route And To Route Line IDs |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | Partial Match for the To Measure |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | Different From Route And To Route Line IDs |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | Different From Route And To Route Line IDs |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | Partial Match for the To Measure |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |

| Test ID | 3 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign in the middle spanning routes to the line on the right. Rename one route |  |  |

![image4.png](../media/doc409_image4.png)

## Slide 8

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2020 |
|  |  |

| Test ID | 4 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to a new line. No Change. |  |  |

New Line

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide8.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 9

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide9.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2020 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2020 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2020 | 300 | 0 | 4 |
| 1A | LX | 12/31/2020 | Null | 100 | 2 | 4 |
| 2A | LX | 12/31/2020 | Null | 200 | 0 | 2 |
| 3A | LX | 12/31/2020 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |

| Test ID | 4 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to a new line. No Change. |  |  |

![image4.png](../media/doc409_image4.png) ![image6.png](../media/doc409_image6.png)

## Slide 10

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide10.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2020 |
|  |  |

| Test ID | 5 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign the middle route in a line to a new line. Change measures. |  |  |

New Line

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

![image7.png](../media/doc409_image7.png)

## Slide 11

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 3: event E1 as 2–3 and 3–4.](../media/doc409_slide11_fig2.svg)

| Test ID | 5 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign the middle route in a line to a new line. Change measures. |  |  |

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 2 to 4, before the split at measure 3.](../media/doc409_slide11_fig1.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2020 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2010 | 300 | 0 | 4 |
| 3A | L0 | 12/31/2020 | Null | 200 | 0 | 4 |
| 2A | LX | 12/31/2020 | Null | 100 | 10 | 20 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

100
100

![Interface screenshot redrawn as a standardized wireframe: 1 button, 10 icons, 25 text rows. 11 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc409_slide11_fig3.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | Different From Route And To Route Line IDs |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | Different From Route And To Route Line IDs |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | Different From Route And To Route Line IDs |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | Different From Route And To Route Line IDs |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | Different From Route And To Route Line IDs |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | Different From Route And To Route Line IDs |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | Different From Route And To Route Line IDs |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | Different From Route And To Route Line IDs |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |

![image4.png](../media/doc409_image4.png) ![image8.png](../media/doc409_image8.png)

## Slide 12

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide12.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2030 |
|  |  |

| Test ID | 6 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 13

| Test ID | 6 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. |  |  |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2030 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2030 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2030 | 300 | 0 | 4 |
| 1A | LX | 12/31/2030 | Null | 100 | 2 | 4 |
| 2A | LX | 12/31/2030 | Null | 200 | 0 | 2 |
| 3A LineX | LX | 12/31/2030 | Null | 300 | 0 | 2 |
| 3A | L0 | 12/31/2030 | Null | 100 | 2 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | 12/31/2030 | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | 12/31/2030 | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | 12/31/2030 | 300 | 4 | 8 |

3A LineX, 300

![Measured route diagram drawn from the slide's own shapes, measures 4 to 2.](../media/doc409_slide13.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2030 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2030 | Null | 1A | 3A | 2 | 4 | Different From Route And To Route Line IDs |
| 003 | 12/31/2030 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2030 | Null | 2A | 3A | 1 | 2 | Different From Route And To Route Line IDs |
| 005 | 12/31/2030 | Null | 1A | 3A | 3 | 2 | Different From Route And To Route Line IDs |
| 006 | 12/31/2030 | Null | 2A | 3A | 1 | 4 | Different From Route And To Route Line IDs |
| 007 | 12/31/2030 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2030 | Null | 2A | 3A | 0 | 4 | Different From Route And To Route Line IDs |
| 009 | 12/31/2030 | Null | 2A | 3A | 0 | 2 | Different From Route And To Route Line IDs |
| 010 | 12/31/2030 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2030 | Null | 3A | 3A | 0 | 4 | Partial Match for the From Measure |

![image4.png](../media/doc409_image4.png)

## Slide 14

| Test ID | 7 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date |  |  |

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 1/1/2000 |
|  |  |

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide14.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 15

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L1 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L1 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 400 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 500 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![Diagram drawn from the slide's own shapes: 2 connectors, 10 freeform paths.](../media/doc409_slide15.svg)

| Test ID | 7 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

![image4.png](../media/doc409_image4.png) ![image3.png](../media/doc409_image3.png)

## Slide 16

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

| Test ID | 8 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. |  |  |

![Diagram drawn from the slide's own shapes: 4 nodes (100, 200, X1, X2), 9 connectors, 3 freeform paths.](../media/doc409_slide16.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | Null | 1B | 3B | 4 | 1 | No Error |

![image9.png](../media/doc409_image9.png)

## Slide 17

![Diagram drawn from the slide's own shapes: 4 nodes (100, 300, X1, X2), 4 freeform paths.](../media/doc409_slide17.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 100 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2023 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| 1B | L3 | 12/31/2023 | Null | 200 | 4 | 5 |
| 3B | L1 | 12/31/2023 | Null | 200 | 0 | 2 |
| 2B | L1 | 12/31/2023 | Null | 100 | 4 | 8 |

| Test ID | 8 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 1 | No Error |
| 001 | 12/31/2023 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 12/31/2023 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 12/31/2023 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 12/31/2023 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3B | 3 | 2 | Different From Route and To Route LineIDs |
| 006 | 12/31/2023 | Null | 1B | 3B | 4 | 2 | Different From Route and To Route LineIDs |
| 007 | 12/31/2023 | Null | 1B | 3B | 4 | 1 | Different From Route and To Route LineIDs |

![image4.png](../media/doc409_image4.png)

## Slide 18

| Test ID | 9 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. |  |  |

![Diagram drawn from the slide's own shapes: 4 nodes (100, 200, X1, X2), 9 connectors, 3 freeform paths.](../media/doc409_slide18.svg)

| Recalibrate Source | No |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |
|  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | Null | 1B | 3B | 4 | 1 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image11.png](../media/doc409_image11.png)

## Slide 19

![Diagram drawn from the slide's own shapes: 3 nodes (100, X1, X2), 2 connectors, 10 freeform paths.](../media/doc409_slide19.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| 1B-New | L3 | 12/31/2023 | Null | 200 | 3 | 4 |
| 1B | L1 | 12/31/2023 | Null | 100 | 4 | 5 |

| Test ID | 9 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 1 | No Error |
| 001 | 12/31/2023 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 12/31/2023 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 12/31/2023 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 12/31/2023 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3B | 3 | 2 | Partial Match for the From Measure |
| 006 | 12/31/2023 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 12/31/2023 | Null | 1B | 3B | 4 | 1 | No Error |

![image4.png](../media/doc409_image4.png)

## Slide 20

| Test ID | 10 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line - 2. Update measures on route 1B_New |  |  |

![Diagram drawn from the slide's own shapes: 4 nodes (100, 200, X1, X2), 9 connectors, 3 freeform paths.](../media/doc409_slide20.svg)

| Recalibrate Source | No |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | Null | 1B | 3B | 4 | 1 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image13.png](../media/doc409_image13.png)

## Slide 21

![Diagram drawn from the slide's own shapes: 5 nodes (X1, X2), 5 connectors, 7 freeform paths.](../media/doc409_slide21.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| X1 | L3 | 12/31/2023 | Null | 100 | 2 | 6 |
| 1B-New | L3 | 12/31/2023 | Null | 200 | 5 | 14 |
| 1B | L1 | 12/31/2023 | Null | 100 | 3 | 4 |

| Test ID | 10 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line - 2. Update measures on route 1B_New |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 1 | No Error |
| 001 | 12/31/2023 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 12/31/2023 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 12/31/2023 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 12/31/2023 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3B | 3 | 2 | No Error |
| 006 | 12/31/2023 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 12/31/2023 | Null | 1B | 3B | 4 | 1 | No Error |

X1
X2

![image4.png](../media/doc409_image4.png) ![image14.png](../media/doc409_image14.png)

## Slide 22

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide22.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 11 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign last route to adjacent line |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |
| 012 | 1/1/2000 | Null | 3A | 3A | 0 | 2 | No Error |
| 013 | 1/1/2000 | Null | 3A | 3A | 2 | 4 | No Error |
| 014 | 1/1/2000 | Null | 3A | 3A | 1 | 3 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 23

| R Name | L NAME | From Date | To Date | Line Order | F0rom Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 3A | L1 | 12/31/2010 | Null | 100 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 1B | L1 | 12/31/2010 | Null | 200 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 2B | L1 | 12/31/2010 | Null | 300 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 3B | L1 | 12/31/2010 | Null | 400 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![Measured route diagram drawn from the slide's own shapes, measures 4 to 1.](../media/doc409_slide23.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 012 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 2 | No Error |
| 013 | 1/1/2000 | 12/31/2010 | 3A | 3A | 2 | 4 | No Error |
| 014 | 1/1/2000 | 12/31/2010 | 3A | 3A | 1 | 3 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | Different From and To Route Line IDs |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | Different From and To Route Line IDs |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | Different From and To Route Line IDs |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | Different From and To Route Line IDs |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | Different From and To Route Line IDs |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | Different From and To Route Line IDs |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | No Error |
| 012 | 12/31/2010 | Null | 3A | 3A | 0 | 2 | No Error |
| 013 | 12/31/2010 | Null | 3A | 3A | 2 | 4 | No Error |
| 014 | 12/31/2010 | Null | 3A | 3A | 1 | 3 | No Error |

| Test ID | 11 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign last route to adjacent line |  |  |

![image4.png](../media/doc409_image4.png)

## Slide 24

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide24.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 12 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign last route to adjacent line. Change measures |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |
| 012 | 1/1/2000 | Null | 3A | 3A | 0 | 2 | No Error |
| 013 | 1/1/2000 | Null | 3A | 3A | 2 | 4 | No Error |
| 014 | 1/1/2000 | Null | 3A | 3A | 1 | 3 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 25

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 1A | L0 | 12/31/2010 | Null | 100 | 2 | 3 |
| 2A | L0 | 12/31/2010 | Null | 200 | 10 | 20 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 3A | L1 | 12/31/2010 | Null | 100 | 1 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 1B | L1 | 12/31/2010 | Null | 200 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 2B | L1 | 12/31/2010 | Null | 300 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 3B | L1 | 12/31/2010 | Null | 400 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![Measured route diagram drawn from the slide's own shapes, measures 3 to 8.](../media/doc409_slide25.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 012 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 2 | No Error |
| 013 | 1/1/2000 | 12/31/2010 | 3A | 3A | 2 | 4 | No Error |
| 014 | 1/1/2000 | 12/31/2010 | 3A | 3A | 1 | 3 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2A | 2 | 1 | Partial Match for the To Measure |
| 002 | 12/31/2010 | Null | 1A | 3A | 2 | 4 | Different From and To Route Line IDs |
| 003 | 12/31/2010 | Null | 1A | 2A | 3 | 1 | Partial Match for the To Measure |
| 004 | 12/31/2010 | Null | 2A | 3A | 1 | 2 | Different From and To Route Line IDs |
| 005 | 12/31/2010 | Null | 1A | 3A | 3 | 2 | Different From and To Route Line IDs |
| 006 | 12/31/2010 | Null | 2A | 3A | 1 | 4 | Different From and To Route Line IDs |
| 007 | 12/31/2010 | Null | 1A | 2A | 2 | 2 | Partial Match for the To Measure |
| 008 | 12/31/2010 | Null | 2A | 3A | 0 | 4 | Different From and To Route Line IDs |
| 009 | 12/31/2010 | Null | 2A | 3A | 0 | 2 | Different From and To Route Line IDs |
| 010 | 12/31/2010 | Null | 1A | 2A | 3 | 2 | Partial Match for the To Measure |
| 011 | 12/31/2010 | Null | 3A | 3A | 0 | 4 | Partial Match for the From Measure |
| 012 | 12/31/2010 | Null | 3A | 3A | 0 | 2 | Partial Match for the From Measure |
| 013 | 12/31/2010 | Null | 3A | 3A | 2 | 4 | No Error |
| 014 | 12/31/2010 | Null | 3A | 3A | 1 | 3 | No Error |

| Test ID | 12 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign last route to adjacent line. Change measures |  |  |

![image4.png](../media/doc409_image4.png)

## Slide 26

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide26.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |
|  |  |

| Test ID | 13 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to adjacent line with complex time slices |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2010 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2020 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2010 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2020 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2020 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2020 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2010 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2020 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2020 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2010 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 1A | 1A | 2 | 4 | No Error |
| 012 | 1/1/2000 | Null | 1A | 1A | 2 | 3 | No Error |
| 013 | 1/1/2000 | Null | 1A | 1A | 3 | 4 | No Error |
| 014 | 1/1/2000 | Null | 1A | 1A | 2.5 | 3.5 | No Error |
| 015 | 1/1/2010 | Null | 2A | 2A | 0 | 2 | No Error |
| 016 | 1/1/2010 | Null | 2A | 2A | 0 | 1 | No Error |
| 017 | 1/1/2010 | Null | 2A | 2A | 1 | 2 | No Error |
| 018 | 1/1/2010 | Null | 2A | 2A | 0.5 | 1.5 | No Error |
| 019 | 1/1/2020 | Null | 3A | 3A | 0 | 4 | No Error |
| 020 | 1/1/2020 | Null | 3A | 3A | 0 | 2 | No Error |
| 021 | 1/1/2020 | Null | 3A | 3A | 2 | 4 | No Error |
| 022 | 1/1/2020 | Null | 3A | 3A | 1 | 3 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 27

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide27.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |
|  |  |

| Test ID | 13 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to adjacent line with complex time slices |  |  |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2023 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2023 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2023 | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2023 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| 1A | L1 | 12/31/2023 | Null | 100 | 2 | 4 |
| 2A | L1 | 12/31/2023 | Null | 200 | 0 | 2 |
| 3A | L1 | 12/31/2023 | Null | 300 | 0 | 4 |
| 1B | L1 | 12/31/2023 | Null | 400 | 3 | 5 |
| 2B | L1 | 12/31/2023 | Null | 500 | 4 | 8 |
| 3B | L1 | 12/31/2023 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 12/31/2023 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2023 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2023 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2023 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2023 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2023 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2023 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2023 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2023 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2023 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2023 | Null | 1A | 1A | 2 | 4 | No Error |
| 012 | 12/31/2023 | Null | 1A | 1A | 2 | 3 | No Error |
| 013 | 12/31/2023 | Null | 1A | 1A | 3 | 4 | No Error |
| 014 | 12/31/2023 | Null | 1A | 1A | 2.5 | 3.5 | No Error |
| 015 | 12/31/2023 | Null | 2A | 2A | 0 | 2 | No Error |
| 016 | 12/31/2023 | Null | 2A | 2A | 0 | 1 | No Error |
| 017 | 12/31/2023 | Null | 2A | 2A | 1 | 2 | No Error |
| 018 | 12/31/2023 | Null | 2A | 2A | 0.5 | 1.5 | No Error |
| 019 | 12/31/2023 | Null | 3A | 3A | 0 | 4 | No Error |
| 020 | 12/31/2023 | Null | 3A | 3A | 0 | 2 | No Error |
| 021 | 12/31/2023 | Null | 3A | 3A | 2 | 4 | No Error |
| 022 | 12/31/2023 | Null | 3A | 3A | 1 | 3 | No Error |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2010 | 12/31/2023 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2020 | 12/31/2023 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2010 | 12/31/2023 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2020 | 12/31/2023 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2020 | 12/31/2023 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2020 | 12/31/2023 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2010 | 12/31/2023 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2020 | 12/31/2023 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2020 | 12/31/2023 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2010 | 12/31/2023 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2023 | 1A | 1A | 2 | 4 | No Error |
| 012 | 1/1/2000 | 12/31/2023 | 1A | 1A | 2 | 3 | No Error |
| 013 | 1/1/2000 | 12/31/2023 | 1A | 1A | 3 | 4 | No Error |
| 014 | 1/1/2000 | 12/31/2023 | 1A | 1A | 2.5 | 3.5 | No Error |
| 015 | 1/1/2010 | 12/31/2023 | 2A | 2A | 0 | 2 | No Error |
| 016 | 1/1/2010 | 12/31/2023 | 2A | 2A | 0 | 1 | No Error |
| 017 | 1/1/2010 | 12/31/2023 | 2A | 2A | 1 | 2 | No Error |
| 018 | 1/1/2010 | 12/31/2023 | 2A | 2A | 0.5 | 1.5 | No Error |
| 019 | 1/1/2020 | 12/31/2023 | 3A | 3A | 0 | 4 | No Error |
| 020 | 1/1/2020 | 12/31/2023 | 3A | 3A | 0 | 2 | No Error |
| 021 | 1/1/2020 | 12/31/2023 | 3A | 3A | 2 | 4 | No Error |
| 022 | 1/1/2020 | 12/31/2023 | 3A | 3A | 1 | 3 | No Error |

![image4.png](../media/doc409_image4.png)

## Slide 28

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide28.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2030 |
|  |  |

| Test ID | 14 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source route downstream. |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 29

![Measured route diagram drawn from the slide's own shapes, measures 4 to 0.](../media/doc409_slide29.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2030 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2030 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2030 | 300 | 0 | 4 |
| 1A | LX | 12/31/2030 | Null | 100 | 2 | 4 |
| 2A | LX | 12/31/2030 | Null | 200 | 0 | 2 |
| 3A LineX | LX | 12/31/2030 | Null | 300 | 0 | 2 |
| 3A | L0 | 12/31/2030 | Null | 100 | 0 | 2 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | 12/31/2030 | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | 12/31/2030 | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | 12/31/2030 | 300 | 4 | 8 |

3A LineX, 300

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2010 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2010 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2030 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2030 | Null | 1A | 3A | 2 | 4 | Different From Route And To Route Line IDs |
| 003 | 12/31/2030 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2030 | Null | 2A | 3A | 1 | 2 | Different From Route And To Route Line IDs |
| 005 | 12/31/2030 | Null | 1A | 3A | 3 | 2 | Different From Route And To Route Line IDs |
| 006 | 12/31/2030 | Null | 2A | 3A | 1 | 4 | Different From Route And To Route Line IDs |
| 007 | 12/31/2030 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2030 | Null | 2A | 3A | 0 | 4 | Different From Route And To Route Line IDs |
| 009 | 12/31/2030 | Null | 2A | 3A | 0 | 2 | Different From Route And To Route Line IDs |
| 010 | 12/31/2030 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2030 | Null | 3A | 3A | 0 | 4 | Partial Match for the To Measure |

| Test ID | 14 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source route downstream. |  |  |

![image4.png](../media/doc409_image4.png)

## Slide 30

| Test ID | 15 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. Recalibrate source route downstream |  |  |

![Diagram drawn from the slide's own shapes: 4 nodes (100, 200, X1, X2), 9 connectors, 3 freeform paths.](../media/doc409_slide30.svg)

| Recalibrate Source | No |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |
|  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | Null | 1B | 3B | 4 | 1 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 4 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image11.png](../media/doc409_image11.png)

## Slide 31

![Diagram drawn from the slide's own shapes: 5 nodes (100, X1, X2, 0), 2 connectors, 10 freeform paths.](../media/doc409_slide31.svg)

| R Name | L NAME | From Date | To Date | Line Order |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| 1B-New | L3 | 12/31/2023 | Null | 200 | 3 | 4 |
| 1B | L1 | 12/31/2023 | Null | 100 | 0 | 2 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 28 | No Error |
| 002 | 1/1/2000 | 12/31/2023 | X1 | X2 | 2 | 26 | No Error |
| 003 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 26 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | X1 | X2 | 4 | 28 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3B | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2023 | 1B | 3B | 4 | 1 | No Error |
| 001 | 12/31/2023 | Null | X1 | X2 | 2 | 28 | No Error |
| 002 | 12/31/2023 | Null | X1 | X2 | 2 | 26 | No Error |
| 003 | 12/31/2023 | Null | X1 | X2 | 4 | 26 | No Error |
| 004 | 12/31/2023 | Null | X1 | X2 | 4 | 28 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3B | 3 | 2 | Partial Match for the From Measure |
| 006 | 12/31/2023 | Null | 1B | 3B | 4 | 2 | Partial Match for the From measure |
| 007 | 12/31/2023 | Null | 1B | 3B | 4 | 1 | Partial Match for the From Measure |

| Test ID | 15 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. Recalibrate source route downstream |  |  |

![image4.png](../media/doc409_image4.png)

## Slide 32

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide32.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2030 |
|  |  |

| Test ID | 16 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to a new line. Adjust measures of each route to overlap with previous measures |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 33

| Test ID | 16 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to a new line. Adjust measures of each route to overlap with previous measures |  |  |

![Measured route diagram drawn from the slide's own shapes, measures 5 to 8.](../media/doc409_slide33.svg)

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2030 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2030 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2030 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2030 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2030 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2030 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2030 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2030 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2030 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2030 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2030 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2030 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2030 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2030 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2030 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2030 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2030 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2030 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2030 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2030 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2030 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2030 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2030 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2030 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2030 | 300 | 0 | 4 |
| 1A | L_New | 12/31/2030 | Null | 100 | 1 | 5 |
| 2A | L_New | 12/31/2030 | Null | 200 | 0 | 3 |
| 3A | L_New | 12/31/2030 | Null | 300 | 0 | 5 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 34

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide34.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 17 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to a new line. Routes are irregularly portioned. Do not transfer calibration points |  |  |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | Null | 3A | 3A | 0 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 35

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide35.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 17 | Network Type | Engineering (Spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all routes to a new line. Routes are irregularly portioned. Do not transfer calibration points |  |  |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1A | L_New | 12/31/2010 | Null | 100 | 2 | 4 |
| 2A | L_New | 12/31/2010 | Null | 200 | 0 | 2 |
| 3A | L_New | 12/31/2010 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

| EventID | From Date | To Date | From RouteID | To RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2030 | 1A | 2A | 2 | 1 | No Error |
| 002 | 1/1/2000 | 12/31/2030 | 1A | 3A | 2 | 4 | No Error |
| 003 | 1/1/2000 | 12/31/2030 | 1A | 2A | 3 | 1 | No Error |
| 004 | 1/1/2000 | 12/31/2030 | 2A | 3A | 1 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2030 | 1A | 3A | 3 | 2 | No Error |
| 006 | 1/1/2000 | 12/31/2030 | 2A | 3A | 1 | 4 | No Error |
| 007 | 1/1/2000 | 12/31/2030 | 1A | 2A | 2 | 2 | No Error |
| 008 | 1/1/2000 | 12/31/2030 | 2A | 3A | 0 | 4 | No Error |
| 009 | 1/1/2000 | 12/31/2030 | 2A | 3A | 0 | 2 | No Error |
| 010 | 1/1/2000 | 12/31/2030 | 1A | 2A | 3 | 2 | No Error |
| 011 | 1/1/2000 | 12/31/2030 | 3A | 3A | 0 | 4 | No Error |
| 001 | 12/31/2030 | Null | 1A | 2A | 2 | 1 | No Error |
| 002 | 12/31/2030 | Null | 1A | 3A | 2 | 4 | No Error |
| 003 | 12/31/2030 | Null | 1A | 2A | 3 | 1 | No Error |
| 004 | 12/31/2030 | Null | 2A | 3A | 1 | 2 | No Error |
| 005 | 12/31/2030 | Null | 1A | 3A | 3 | 2 | No Error |
| 006 | 12/31/2030 | Null | 2A | 3A | 1 | 4 | No Error |
| 007 | 12/31/2030 | Null | 1A | 2A | 2 | 2 | No Error |
| 008 | 12/31/2030 | Null | 2A | 3A | 0 | 4 | No Error |
| 009 | 12/31/2030 | Null | 2A | 3A | 0 | 2 | No Error |
| 010 | 12/31/2030 | Null | 1A | 2A | 3 | 2 | No Error |
| 011 | 12/31/2030 | Null | 3A | 3A | 0 | 4 | No Error |

## Slide 36

| Test ID | 1 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide36.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

![image2.png](../media/doc409_image2.png)

## Slide 37

| Test ID | 1 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide37.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 3A | 2 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2 | 4 | No Error |
| 002 | 12/31/2010 | Null | 1A | 2 | 3 | No Error |
| 003 | 12/31/2010 | Null | 1A | 3 | 4 | No Error |
| 004 | 12/31/2010 | Null | 2A | 0 | 2 | No Error |
| 005 | 12/31/2010 | Null | 2A | 0 | 1 | No Error |
| 006 | 12/31/2010 | Null | 2A | 1 | 2 | No Error |
| 007 | 12/31/2010 | Null | 3A | 0 | 4 | No Error |
| 008 | 12/31/2010 | Null | 3A | 0 | 2 | No Error |
| 009 | 12/31/2010 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 1A | L1 | 12/31/2010 | Null | 100 | 2 | 4 |
| 2A | L1 | 12/31/2010 | Null | 200 | 0 | 2 |
| 3A | L1 | 12/31/2010 | Null | 300 | 0 | 4 |
| 1B | L1 | 12/31/2010 | Null | 400 | 3 | 5 |
| 2B | L1 | 12/31/2010 | Null | 500 | 4 | 8 |
| 3B | L1 | 12/31/2010 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image3.png](../media/doc409_image3.png) ![image4.png](../media/doc409_image4.png)

## Slide 38

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 2 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide38.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 39

| Test ID | 2 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed. |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 3A | 2 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2 | 4 | Route not Found |
| 002 | 12/31/2010 | Null | 1A | 2 | 3 | Route not Found |
| 003 | 12/31/2010 | Null | 1A | 3 | 4 | Route not Found |
| 004 | 12/31/2010 | Null | 2A | 0 | 2 | No Error |
| 005 | 12/31/2010 | Null | 2A | 0 | 1 | No Error |
| 006 | 12/31/2010 | Null | 2A | 1 | 2 | No Error |
| 007 | 12/31/2010 | Null | 3A | 0 | 4 | No Error |
| 008 | 12/31/2010 | Null | 3A | 0 | 2 | No Error |
| 009 | 12/31/2010 | Null | 3A | 2 | 4 | No Error |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide39.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 1A-Change | L1 | 12/31/2010 | Null | 100 | 5 | 8 |
| 2A | L1 | 12/31/2010 | Null | 200 | 0 | 2 |
| 3A | L1 | 12/31/2010 | Null | 300 | 0 | 4 |
| 1B | L1 | 12/31/2010 | Null | 400 | 3 | 5 |
| 2B | L1 | 12/31/2010 | Null | 500 | 4 | 8 |
| 3B | L1 | 12/31/2010 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png) ![image5.png](../media/doc409_image5.png)

## Slide 40

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2010 |
|  |  |

| Test ID | 3 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign in the middle spanning routes to the line on the right. Rename one route |  |  |

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide40.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 41

| Test ID | 3 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign in the middle spanning routes to the line on the right |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 3A | 2 | 4 | No Error |
| 004 | 12/31/2010 | Null | 2A | 0 | 2 | Partial Match for the To Measure |
| 006 | 12/31/2010 | Null | 2A | 1 | 2 | Partial Match for the To Measure |
| 007 | 12/31/2010 | Null | 3A | 0 | 4 | No Error |
| 008 | 12/31/2010 | Null | 3A | 0 | 2 | No Error |
| 009 | 12/31/2010 | Null | 3A | 2 | 4 | No Error |

![Measured route diagram drawn from the slide's own shapes, measures 4 to 1.](../media/doc409_slide41.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 2A | L0 | 12/31/2010 | Null | 200 | 0 | 1 |
| 2A Line1 | L1 | 12/31/2010 | Null | 100 | 1 | 2 |
| 3A | L1 | 12/31/2010 | Null | 200 | 0 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 1B | L1 | 12/31/2010 | Null | 300 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 2B | L1 | 12/31/2010 | Null | 400 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 3B | L1 | 12/31/2010 | Null | 500 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png)

## Slide 42

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide42.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2020 |
|  |  |

| Test ID | 4 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to a new line. No Change. |  |  |

New Line

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 43

| Test ID | 4 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to a new line. No Change. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide43.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 3A | 2 | 4 | No Error |
| 001 | 12/31/2020 | Null | 1A | 2 | 4 | No Error |
| 002 | 12/31/2020 | Null | 1A | 2 | 3 | No Error |
| 003 | 12/31/2020 | Null | 1A | 3 | 4 | No Error |
| 004 | 12/31/2020 | Null | 2A | 0 | 2 | No Error |
| 005 | 12/31/2020 | Null | 2A | 0 | 1 | No Error |
| 006 | 12/31/2020 | Null | 2A | 1 | 2 | No Error |
| 007 | 12/31/2020 | Null | 3A | 0 | 4 | No Error |
| 008 | 12/31/2020 | Null | 3A | 0 | 2 | No Error |
| 009 | 12/31/2020 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2020 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2020 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2020 | 300 | 0 | 4 |
| 1A | LX | 12/31/2020 | Null | 100 | 2 | 4 |
| 2A | LX | 12/31/2020 | Null | 200 | 0 | 2 |
| 3A | LX | 12/31/2020 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png) ![image6.png](../media/doc409_image6.png)

## Slide 44

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide44.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2020 |
|  |  |

| Test ID | 5 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign the middle route in a line to a new line. Change measures. |  |  |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

New Line

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

![image7.png](../media/doc409_image7.png)

## Slide 45

![Measured route diagram drawn from the slide's own shapes, measures 100 to 100.](../media/doc409_slide45_fig1.svg)

| Test ID | 5 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign the middle route in a line to a new line. Change measures. |  |  |

100
100

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide45_fig2.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |
| 004 | 12/31/2020 | Null | 2A | 0 | 2 | Route Location not Found |
| 005 | 12/31/2020 | Null | 2A | 0 | 1 | Route Location not Found |
| 006 | 12/31/2020 | Null | 2A | 1 | 2 | Route Location not Found |

![Interface screenshot redrawn as a standardized wireframe: 1 button, 10 icons, 25 text rows. 11 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc409_slide45_fig3.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2020 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2020 | 300 | 0 | 4 |
| 2A | L_New | 12/31/2020 | Null | 100 | 10 | 20 |
| 3A | L0 | 12/31/2020 | Null | 200 | 0 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | Null | 300 | 4 | 8 |

10

![image4.png](../media/doc409_image4.png) ![image8.png](../media/doc409_image8.png)

## Slide 46

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide46.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2030 |
|  |  |

| Test ID | 6 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 47

| Test ID | 6 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign partial routes in a line to a new line. Change names of partial routes. |  |  |

3A LineX, 300

![Measured route diagram drawn from the slide's own shapes, measures 4 to 2.](../media/doc409_slide47.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |
| 001 | 12/31/2030 | Null | 1A | 2 | 4 | No Error |
| 002 | 12/31/2030 | Null | 1A | 2 | 3 | No Error |
| 003 | 12/31/2030 | Null | 1A | 3 | 4 | No Error |
| 004 | 12/31/2030 | Null | 2A | 0 | 2 | No Error |
| 005 | 12/31/2030 | Null | 2A | 0 | 1 | No Error |
| 006 | 12/31/2030 | Null | 2A | 1 | 2 | No Error |
| 007 | 12/31/2030 | Null | 3A | 0 | 4 | Partial Match for the From Measure |
| 008 | 12/31/2030 | Null | 3A | 0 | 2 | Partial Match for the From Measure |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2030 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2010 | 12/31/2030 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2020 | 12/31/2030 | 300 | 0 | 4 |
| 1A | LX | 12/31/2030 | Null | 100 | 2 | 4 |
| 2A | LX | 12/31/2030 | Null | 200 | 0 | 2 |
| 3A LineX | LX | 12/31/2030 | Null | 300 | 0 | 2 |
| 3A | L0 | 12/31/2030 | Null | 100 | 2 | 4 |
| 1B | L1 | 1/1/2002 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2005 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2010 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2020 | 12/31/2030 | 100 | 4 | 6 |
| 2C | L2 | 1/1/2020 | 12/31/2030 | 200 | 2 | 6 |
| 3C | L2 | 1/1/2020 | 12/31/2030 | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png)

## Slide 48

| Test ID | 7 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date |  |  |

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 1/1/2000 |
|  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide48.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image2.png](../media/doc409_image2.png)

## Slide 49

| Test ID | 7 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide49.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L1 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L1 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L1 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 400 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 500 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png) ![image3.png](../media/doc409_image3.png)

## Slide 50

| Test ID | 8 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. |  |  |

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide50.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | Null | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | Null | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image9.png](../media/doc409_image9.png)

## Slide 51

| Test ID | 8 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign to fill the gap in a line by transferring route. |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |
| 004 | 12/31/2023 | Null | 1B | 3 | 5 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3 | 4 | No Error |
| 006 | 12/31/2023 | Null | 1B | 4 | 5 | No Error |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide51.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 100 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2023 | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| 1B | L3 | 12/31/2023 | Null | 200 | 3 | 5 |
| 3B | L1 | 12/31/2023 | Null | 200 | 0 | 2 |
| 2B | L1 | 12/31/2023 | Null | 100 | 4 | 8 |

![image4.png](../media/doc409_image4.png)

## Slide 52

| Test ID | 9 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide52.svg)

| Recalibrate Source | No |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |
|  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | Null | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | Null | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 4 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image11.png](../media/doc409_image11.png)

## Slide 53

| Test ID | 9 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide53_fig2.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |
| 004 | 12/31/2023 | Null | 1B | 3 | 5 | Partial Match for the From Measure |
| 005 | 12/31/2023 | Null | 1B | 3 | 4 | Route Location not Found |
| 006 | 12/31/2023 | Null | 1B | 4 | 5 | No Error |

![Measured route diagram drawn from the slide's own shapes, measures 200 to 200.](../media/doc409_slide53_fig1.svg)

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2023 | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| 1B-New | L3 | 12/31/2023 | Null | 200 | 3 | 4 |
| 1B | L1 | 12/31/2023 | Null | 100 | 4 | 5 |

![image4.png](../media/doc409_image4.png)

## Slide 54

| Test ID | 10 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line - 2. |  |  |

| Recalibrate Source | No |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2023 |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide54.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | Null | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | Null | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | Null | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | Null | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |

![image13.png](../media/doc409_image13.png)

## Slide 55

| Test ID | 10 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign part of a route to another line - 2. |  |  |

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide55.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | X1 | 2 | 6 | No Error |
| 002 | 1/1/2000 | Null | X1 | 2 | 4 | No Error |
| 003 | 1/1/2000 | Null | X1 | 4 | 6 | No Error |
| 004 | 1/1/2000 | 12/31/2023 | 1B | 3 | 5 | No Error |
| 005 | 1/1/2000 | 12/31/2023 | 1B | 3 | 4 | No Error |
| 006 | 1/1/2000 | 12/31/2023 | 1B | 4 | 5 | No Error |
| 007 | 1/1/2000 | Null | X2 | 24 | 28 | No Error |
| 008 | 1/1/2000 | Null | X2 | 24 | 26 | No Error |
| 009 | 1/1/2000 | Null | X2 | 26 | 28 | No Error |
| 004 | 12/31/2023 | Null | 1B | 3 | 5 | No Error |
| 005 | 12/31/2023 | Null | 1B | 3 | 4 | No Error |
| 006 | 12/31/2023 | Null | 1B | 4 | 5 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| X1 | L3 | 1/1/2000 | Null | 100 | 2 | 6 |
| X2 | L3 | 1/1/2000 | 12/31/2023 | 200 | 24 | 28 |
| 1B | L1 | 1/1/2000 | 12/31/2023 | 100 | 4 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| X2 | L3 | 12/31/2023 | Null | 300 | 24 | 28 |
| X1 | L3 | 12/31/2023 | Null | 100 | 2 | 6 |
| 1B-New | L3 | 12/31/2023 | Null | 200 | 5 | 14 |
| 1B | L1 | 12/31/2023 | Null | 100 | 3 | 5 |

![image4.png](../media/doc409_image4.png) ![image14.png](../media/doc409_image14.png)

## Slide 56

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide56.svg)

| Test ID | 11 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, adjusting measures. |  |  |

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | Null | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | Null | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | Null | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | Null | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | Null | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | Null | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | Null | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | Null | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | Null | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | Null | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | Null | 300 | 0 | 4 |
| 1B | L1 | 1/1/2000 | Null | 100 | 3 | 5 |
| 2B | L1 | 1/1/2000 | Null | 200 | 4 | 8 |
| 3B | L1 | 1/1/2000 | Null | 300 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

## Slide 57

| Test ID | 11 | Network Type | Engineering (Non-spanning Line Events) |
| --- | --- | --- | --- |
| Test | Reassign all the routes in a line to another line on right, adjusting measures. |  |  |

![Measured route diagram drawn from the slide's own shapes, measures 3 to 8.](../media/doc409_slide57.svg)

| EventID | From Date | To Date | RouteID | From Measure | To Measure | Loc Error |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 1/1/2000 | 12/31/2010 | 1A | 2 | 4 | No Error |
| 002 | 1/1/2000 | 12/31/2010 | 1A | 2 | 3 | No Error |
| 003 | 1/1/2000 | 12/31/2010 | 1A | 3 | 4 | No Error |
| 004 | 1/1/2000 | 12/31/2010 | 2A | 0 | 2 | No Error |
| 005 | 1/1/2000 | 12/31/2010 | 2A | 0 | 1 | No Error |
| 006 | 1/1/2000 | 12/31/2010 | 2A | 1 | 2 | No Error |
| 007 | 1/1/2000 | 12/31/2010 | 3A | 0 | 4 | No Error |
| 008 | 1/1/2000 | 12/31/2010 | 3A | 0 | 2 | No Error |
| 009 | 1/1/2000 | 12/31/2010 | 3A | 2 | 4 | No Error |
| 001 | 12/31/2010 | Null | 1A | 2 | 4 | Partial Match for the To Measure |
| 002 | 12/31/2010 | Null | 1A | 2 | 3 | No Error |
| 003 | 12/31/2010 | Null | 1A | 3 | 4 | Partial Match for the To Measure |
| 004 | 12/31/2010 | Null | 2A | 0 | 2 | Route Location not Found |
| 005 | 12/31/2010 | Null | 2A | 0 | 1 | Route Location not Found |
| 006 | 12/31/2010 | Null | 2A | 1 | 2 | Route Location not Found |
| 007 | 12/31/2010 | Null | 3A | 0 | 4 | Partial Match for the From Measure |
| 008 | 12/31/2010 | Null | 3A | 0 | 2 | Partial Match for the From Measure |
| 009 | 12/31/2010 | Null | 3A | 2 | 4 | No Error |

| R Name | L NAME | From Date | To Date | Line Order | F0rom Measure | To Measure |
| --- | --- | --- | --- | --- | --- | --- |
| 1A | L0 | 1/1/2000 | 12/31/2010 | 100 | 2 | 4 |
| 2A | L0 | 1/1/2000 | 12/31/2010 | 200 | 0 | 2 |
| 3A | L0 | 1/1/2000 | 12/31/2010 | 300 | 0 | 4 |
| 1A | L1 | 12/31/2010 | Null | 100 | 2 | 3 |
| 2A | L1 | 12/31/2010 | Null | 200 | 10 | 20 |
| 3A | L1 | 12/31/2010 | Null | 300 | 1 | 4 |
| 1B | L1 | 1/1/2000 | 12/31/2010 | 100 | 3 | 5 |
| 1B | L1 | 12/31/2010 | Null | 400 | 3 | 5 |
| 2B | L1 | 1/1/2000 | 12/31/2010 | 200 | 4 | 8 |
| 2B | L1 | 12/31/2010 | Null | 500 | 4 | 8 |
| 3B | L1 | 1/1/2000 | 12/31/2010 | 300 | 0 | 2 |
| 3B | L1 | 12/31/2010 | Null | 600 | 0 | 2 |
| 1C | L2 | 1/1/2000 | Null | 100 | 4 | 6 |
| 2C | L2 | 1/1/2000 | Null | 200 | 2 | 6 |
| 3C | L2 | 1/1/2000 | Null | 300 | 4 | 8 |

![image4.png](../media/doc409_image4.png)

## Slide 58

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide58.svg)

| Recalibrate Source | Yes |
| --- | --- |
| Recalibrate Target | Yes |
| Date | 12/31/2030 |
|  |  |

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source route downstream

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
Null
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
Null
2A
1
2
No Error
007
1/1/2000
Null
3A
0
4
No Error
008
1/1/2000
Null
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 59

![Measured route diagram drawn from the slide's own shapes, measures 4 to 0.](../media/doc409_slide59.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source routes downstream.

3A LineX, 300

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
4
No Error
002
1/1/2000
12/31/2010
1A
2
3
No Error
003
1/1/2000
12/31/2010
1A
3
4
No Error
004
1/1/2000
12/31/2010
2A
0
2
No Error
005
1/1/2000
12/31/2010
2A
0
1
No Error
006
1/1/2000
12/31/2010
2A
1
2
No Error
007
1/1/2000
12/31/2010
3A
0
4
No Error
008
1/1/2000
12/31/2010
3A
0
2
No Error
009
1/1/2000
12/31/2010
3A
2
4
No Error
001
12/31/2030
Null
1A
2
4
No Error
002
12/31/2030
Null
1A
2
3
No Error
003
12/31/2030
Null
1A
3
4
No Error
004
12/31/2030
Null
2A
0
2
No Error
005
12/31/2030
Null
2A
0
1
No Error
006
12/31/2030
Null
2A
1
2
No Error
007
12/31/2030
Null
3A
0
4
Partial Match for the To Measure
008
12/31/2030
Null
3A
0
2
No Error
009
12/31/2030
Null
3A
2
4
Partial Match for the To Measure
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2010
12/31/2030
200
0
2
3A
L0
1/1/2020
12/31/2030
300
0
4
1A
LX
12/31/2030
Null
100
2
4
2A
LX
12/31/2030
Null
200
0
2
3A LineX
LX
12/31/2030
Null
300
0
2
3A
L0
12/31/2030
Null
100
0
2
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
12/31/2030
100
4
6
2C
L2
1/1/2020
12/31/2030
200
2
6
3C
L2
1/1/2020
12/31/2030
300
4
8

![image4.png](../media/doc409_image4.png)

## Slide 60

![Measured route diagram drawn from the slide's own shapes.](../media/doc409_slide60.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
13
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign to fill the gap in a line by transferring route. Recalibrate source routes downstream

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
No
Recalibrate Target
Yes
Date
12/31/2023

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
X1
2
6
No Error
002
1/1/2000
Null
X1
2
4
No Error
003
1/1/2000
Null
X1
4
6
No Error
004
1/1/2000
Null
1B
3
5
No Error
005
1/1/2000
Null
1B
3
4
No Error
006
1/1/2000
Null
1B
4
5
No Error
007
1/1/2000
Null
X2
24
28
No Error
008
1/1/2000
Null
X2
24
26
No Error
009
1/1/2000
Null
X2
26
28
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2

![image11.png](../media/doc409_image11.png)

## Slide 61

![Measured route diagram drawn from the slide's own shapes, measures 200 to 200.](../media/doc409_slide61.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
X1
2
6
No Error
002
1/1/2000
Null
X1
2
4
No Error
003
1/1/2000
Null
X1
4
6
No Error
004
1/1/2000
12/31/2023
1B
3
5
No Error
005
1/1/2000
12/31/2023
1B
3
4
No Error
006
1/1/2000
12/31/2023
1B
4
5
No Error
007
1/1/2000
Null
X2
24
28
No Error
008
1/1/2000
Null
X2
24
26
No Error
009
1/1/2000
Null
X2
26
28
No Error
004
12/31/2023
Null
1B
3
5
Route Location not Found
005
12/31/2023
Null
1B
3
4
Route Location not Found
006
12/31/2023
Null
1B
4
5
Route Location Not Found
{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
13
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign to fill the gap in a line by transferring route. Recalibrate source routes downstream

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
200
24
28
1B
L1
1/1/2000
12/31/2023
100
4
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
12/31/2023
300
0
2
X2
L3
12/31/2023
Null
300
24
28
1B-New
L3
12/31/2023
Null
200
3
4
1B
L1
12/31/2023
Null
100
0
2

![image4.png](../media/doc409_image4.png)

## Slide 62

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide62.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
14
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign all routes to a new line.  Adjust all measures to overlap previous measures

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
Null
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
Null
2A
1
2
No Error
007
1/1/2000
Null
3A
0
4
No Error
008
1/1/2000
Null
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 63

![Measured route diagram drawn from the slide's own shapes, measures 5 to 8.](../media/doc409_slide63.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
14
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign all routes to a new line.  Adjust all measures to overlap previous measures

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2000
12/31/2030
200
0
2
3A
L0
1/1/2000
12/31/2030
300
0
4
1A
L_New
12/31/2030
Null
100
1
5
2A
L_New
12/31/2030
Null
200
0
3
3A
L_New
12/31/2030
Null
300
0
5
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2030
1A
2
4
No Error
002
1/1/2000
12/31/2030
1A
2
3
No Error
003
1/1/2000
12/31/2030
1A
3
4
No Error
004
1/1/2000
12/31/2030
2A
0
2
No Error
005
1/1/2000
12/31/2030
2A
0
1
No Error
006
1/1/2000
12/31/2030
2A
1
2
No Error
007
1/1/2000
12/31/2030
3A
0
4
No Error
008
1/1/2000
12/31/2030
3A
0
2
No Error
009
1/1/2000
12/31/2030
3A
2
4
No Error
001
12/31/2030
Null
1A
2
4
No Error
002
12/31/2030
Null
1A
2
3
No Error
003
12/31/2030
Null
1A
3
4
No Error
004
12/31/2030
Null
2A
0
2
No Error
005
12/31/2030
Null
2A
0
1
No Error
006
12/31/2030
Null
2A
1
2
No Error
007
12/31/2030
Null
3A
0
4
No Error
008
12/31/2030
Null
3A
0
2
No Error
009
12/31/2030
Null
3A
2
4
No Error

## Slide 64

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide64.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
15
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign Routes to a new line.  Routes are irregularly portioned.  Do not transfer calibration points.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
Null
1A
2
4
No Error
002
1/1/2000
Null
1A
2
3
No Error
003
1/1/2000
Null
1A
3
4
No Error
004
1/1/2000
Null
2A
0
2
No Error
005
1/1/2000
Null
2A
0
1
No Error
006
1/1/2000
Null
2A
1
2
No Error
007
1/1/2000
Null
3A
0
4
No Error
008
1/1/2000
Null
3A
0
2
No Error
009
1/1/2000
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 65

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide65.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
15
Network Type
Engineering (Non-spanning Line Events)
Test
Reassign Routes to a new line.  Routes are irregularly portioned.  Do not transfer calibration points.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
From
Measure
To
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
4
No Error
002
1/1/2000
12/31/2010
1A
2
3
No Error
003
1/1/2000
12/31/2010
1A
3
4
No Error
004
1/1/2000
12/31/2010
2A
0
2
No Error
005
1/1/2000
12/31/2010
2A
0
1
No Error
006
1/1/2000
12/31/2010
2A
1
2
No Error
007
1/1/2000
12/31/2010
3A
0
4
No Error
008
1/1/2000
12/31/2010
3A
0
2
No Error
009
1/1/2000
12/31/2010
3A
2
4
No Error
001
12/31/2030
Null
1A
2
4
No Error
002
12/31/2030
Null
1A
2
3
No Error
003
12/31/2030
Null
1A
3
4
No Error
004
12/31/2030
Null
2A
0
2
No Error
005
12/31/2030
Null
2A
0
1
No Error
006
12/31/2030
Null
2A
1
2
No Error
007
12/31/2030
Null
3A
0
4
No Error
008
12/31/2030
Null
3A
0
2
No Error
009
12/31/2030
Null
3A
2
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1A
L_New
12/31/2010
Null
100
2
4
2A
L_New
12/31/2010
Null
200
0
2
3A
L_New
12/31/2010
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 66

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide66.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8
{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

![image2.png](../media/doc409_image2.png)

## Slide 67

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide67.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
1
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2010
Null
1A
2
No Error
002
12/31/2010
Null
1A
3
No Error
003
12/31/2010
Null
1A
4
No Error
004
12/31/2010
Null
2A
0
No Error
005
12/31/2010
Null
2A
1
No Error
006
12/31/2010
Null
2A
2
No Error
007
12/31/2010
Null
3A
0
No Error
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
1A
L1
12/31/2010
Null
100
2
4
2A
L1
12/31/2010
Null
200
0
2
3A
L1
12/31/2010
Null
300
0
4
1B
L1
12/31/2010
Null
400
3
5
2B
L1
12/31/2010
Null
500
4
8
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image3.png](../media/doc409_image3.png) ![image4.png](../media/doc409_image4.png)

## Slide 68

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide68.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
2
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
1A
L1
12/31/2010
Null
100
2
4
2A
L1
12/31/2010
Null
200
0
2
3A
L1
12/31/2010
Null
300
0
4
1B
L1
12/31/2010
Null
400
3
5
2B
L1
12/31/2010
Null
500
4
8
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image2.png](../media/doc409_image2.png)

## Slide 69

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc409_slide69.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
2
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, 2/3 route names and measures maintained. The first route in the line has changed.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2010
Null
1A
2
Route not Found
002
12/31/2010
Null
1A
3
Route not Found
003
12/31/2010
Null
1A
4
Route not Found
004
12/31/2010
Null
2A
0
No Error
005
12/31/2010
Null
2A
1
No Error
006
12/31/2010
Null
2A
2
No Error
007
12/31/2010
Null
3A
0
No Error
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
1A-Change
L1
12/31/2010
Null
100
5
8
2A
L1
12/31/2010
Null
200
0
2
3A
L1
12/31/2010
Null
300
0
4
1B
L1
12/31/2010
Null
400
3
5
2B
L1
12/31/2010
Null
500
4
8
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image4.png](../media/doc409_image4.png) ![image5.png](../media/doc409_image5.png)

## Slide 70

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide70.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Point Events)
Test
Reassign in the middle spanning routes to the line on the right.  Rename one route

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 71

![Measured route diagram drawn from the slide's own shapes, measures 4 to 1.](../media/doc409_slide71.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
3
Network Type
Engineering (Point Events)
Test
Reassign in the middle spanning routes to the line on the right

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
006
12/31/2010
Null
2A
2
Route Location not Found
007
12/31/2010
Null
3A
0
No Error
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line
Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
2A
L0
12/31/2010
Null
200
0
1
2A Line1
L1
12/31/2010
Null
100
1
2
3A
L1
12/31/2010
Null
200
0
4
1B
L1
1/1/2000
12/31/2010
100
3
5
1B
L1
12/31/2010
Null
300
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
400
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
500
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image4.png](../media/doc409_image4.png)

## Slide 72

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide72.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2020

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
4
Network Type
Engineering (Point Events)
Test
Reassign to a new line. No Change.

New Line
{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image2.png](../media/doc409_image2.png)

## Slide 73

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide73.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
4
Network Type
Engineering (Point Events)
Test
Reassign to a new line. No Change.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2020
Null
1A
2
No Error
002
12/31/2020
Null
1A
3
No Error
003
12/31/2020
Null
1A
4
No Error
004
12/31/2020
Null
2A
0
No Error
005
12/31/2020
Null
2A
1
No Error
006
12/31/2020
Null
2A
2
No Error
007
12/31/2020
Null
3A
0
No Error
008
12/31/2020
Null
3A
2
No Error
009
12/31/2020
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2020
100
2
4
2A
L0
1/1/2010
12/31/2020
200
0
2
3A
L0
1/1/2020
12/31/2020
300
0
4
1A
LX
12/31/2020
Null
100
2
4
2A
LX
12/31/2020
Null
200
0
2
3A
LX
12/31/2020
Null
300
0
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
Null
100
4
6
2C
L2
1/1/2020
Null
200
2
6
3C
L2
1/1/2020
Null
300
4
8

![image4.png](../media/doc409_image4.png) ![image6.png](../media/doc409_image6.png)

## Slide 74

![Diagram drawn from the slide's own shapes: 7 nodes, 1 connector.](../media/doc409_slide74.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2020

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
5
Network Type
Engineering (Point Events)
Test
Reassign the middle route in a line to a new line. Change measures.

New Line
{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
Null
100
4
6
2C
L2
1/1/2020
Null
200
2
6
3C
L2
1/1/2020
Null
300
4
8

![image7.png](../media/doc409_image7.png)

## Slide 75

![Diagram drawn from the slide's own shapes: 6 nodes (10), 1 connector.](../media/doc409_slide75_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 button, 10 icons, 25 text rows. 11 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc409_slide75_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
5
Network Type
Engineering (Point Events)
Test
Reassign the middle route in a line to a new line. Change measures.

100
100

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
004
12/31/2020
Null
2A
0
No Error
005
12/31/2020
Null
2A
1
Route Location not Found
006
12/31/2020
Null
2A
2
Route Location not Found
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
1/1/2020
100
2
4
2A
L0
1/1/2000
1/1/2020
200
0
2
3A
L0
1/1/2000
1/1/2020
300
0
4
1A
L0
1/1/2020
Null
100
2
4
2A
L_New
1/1/2020
Null
100
10
20
3A
L0
1/1/2020
Null
200
0
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
Null
100
4
6
2C
L2
1/1/2020
Null
200
2
6
3C
L2
1/1/2020
Null
300
4
8

10

![image4.png](../media/doc409_image4.png) ![image8.png](../media/doc409_image8.png)

## Slide 76

![Measured route diagram drawn from the slide's own shapes, measures 4 to 8.](../media/doc409_slide76.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2030

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
6
Network Type
Engineering (Point Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

## Slide 77

![Measured route diagram drawn from the slide's own shapes, measures 4 to 2.](../media/doc409_slide77.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
6
Network Type
Engineering (Point Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

3A LineX, 300

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2030
1A
2
No Error
002
1/1/2000
12/31/2030
1A
3
No Error
003
1/1/2000
12/31/2030
1A
4
No Error
004
1/1/2000
12/31/2030
2A
0
No Error
005
1/1/2000
12/31/2030
2A
1
No Error
006
1/1/2000
12/31/2030
2A
2
No Error
007
1/1/2000
12/31/2030
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
001
12/31/2030
Null
1A
2
No Error
002
12/31/2030
Null
1A
3
No Error
003
12/31/2030
Null
1A
4
No Error
004
12/31/2030
Null
2A
0
No Error
005
12/31/2030
Null
2A
1
No Error
006
12/31/2030
Null
2A
2
No Error
007
12/31/2030
Null
3A
0
Route Location not Found

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2010
12/31/2030
200
0
2
3A
L0
1/1/2020
12/31/2030
300
0
4
1A
LX
12/31/2030
Null
100
2
4
2A
LX
12/31/2030
Null
200
0
2
3A LineX
LX
12/31/2030
Null
300
0
2
3A
L0
12/31/2030
Null
100
2
4
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
12/31/2030
100
4
6
2C
L2
1/1/2020
12/31/2030
200
2
6
3C
L2
1/1/2020
12/31/2030
300
4
8

![image4.png](../media/doc409_image4.png)

## Slide 78

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc409_slide78.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
7
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
1/1/2000

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image2.png](../media/doc409_image2.png)

## Slide 79

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 2 to 4, before the split at measure 3.](../media/doc409_slide79_fig1.svg)
![Schematic redrawn from the slide's data: straight route R1 after the split at measure 3: event E1 as 2–3 and 3–4.](../media/doc409_slide79_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
7
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, transferring routes and measures. The effective date is same as one the source route’s From Date

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L1
1/1/2000
Null
100
2
4
2A
L1
1/1/2000
Null
200
0
2
3A
L1
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
400
3
5
2B
L1
1/1/2000
Null
500
4
8
3B
L1
1/1/2000
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

![image4.png](../media/doc409_image4.png) ![image3.png](../media/doc409_image3.png)

## Slide 80

![Schematic redrawn from the slide's data: gap route R1, event E1 from measure 2 to 6, before the split at measure 4.](../media/doc409_slide80_fig1.svg)
![Schematic redrawn from the slide's data: gap route R1 after the split at measure 4: event E1 as 2–4 and 4–6.](../media/doc409_slide80_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
8
Network Type
Engineering (Point Events)
Test
Reassign to fill the gap in a line by transferring route.

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2023
{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
Null
1B
3
No Error
005
1/1/2000
Null
1B
4
No Error
006
1/1/2000
Null
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2

![image9.png](../media/doc409_image9.png)

## Slide 81

![Schematic redrawn from the slide's data: gap route R1, event E1 from measure 2 to 6, before the split at measure 4.](../media/doc409_slide81_fig1.svg)
![Schematic redrawn from the slide's data: gap route R1 after the split at measure 4: event E1 as 2–4 and 4–6.](../media/doc409_slide81_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
8
Network Type
Engineering (Point Events)
Test
Reassign to fill the gap in a line by transferring route.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
12/31/2023
1B
3
No Error
005
1/1/2000
12/31/2023
1B
4
No Error
006
1/1/2000
12/31/2023
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error
004
12/31/2023
Null
1B
3
No Error
005
12/31/2023
Null
1B
4
No Error
006
12/31/2023
Null
1B
5
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line
Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
100
24
28
1B
L1
1/1/2000
12/31/2023
100
3
5
2B
L1
1/1/2000
12/31/2023
200
4
8
3B
L1
1/1/2000
12/31/2023
300
0
2
X2
L3
12/31/2023
Null
300
24
28
1B
L3
12/31/2023
Null
200
3
5
3B
L1
12/31/2023
Null
200
0
2
2B
L1
12/31/2023
Null
100
4
8

![image4.png](../media/doc409_image4.png)

## Slide 82

![Schematic redrawn from the slide's data: gap route R1, event E1 from measure 2 to 6, before the split at measure 4.](../media/doc409_slide82_fig1.svg)
![Schematic redrawn from the slide's data: gap route R1 after the split at measure 4: event E1 as 2–4 and 4–6.](../media/doc409_slide82_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
9
Network Type
Engineering (Point Events)
Test
Reassign to fill the gap in a line by transferring route.

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
No
Recalibrate Target
Yes
Date
12/31/2023

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
Null
1B
3
No Error
005
1/1/2000
Null
1B
4
No Error
006
1/1/2000
Null
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
4
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2

![image11.png](../media/doc409_image11.png)

## Slide 83

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 2 to 6, before the split at measure 4.](../media/doc409_slide83_fig1.svg)
![Schematic redrawn from the slide's data: straight route R1 after the split at measure 4: event E1 as 2–4 and 4–6.](../media/doc409_slide83_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
9
Network Type
Engineering (Point Events)
Test
Reassign part of a route to another line.

200
X1
X2

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
12/31/2023
1B
3
No Error
005
1/1/2000
12/31/2023
1B
4
No Error
006
1/1/2000
12/31/2023
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error
004
12/31/2023
Null
1B
3
Route Location not Found
005
12/31/2023
Null
1B
4
No Error
006
12/31/2023
Null
1B
5
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
200
24
28
1B
L1
1/1/2000
12/31/2023
100
4
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
12/31/2023
300
0
2
X2
L3
12/31/2023
Null
300
24
28
1B-New
L3
12/31/2023
Null
200
3
4
1B
L1
12/31/2023
Null
100
4
5

![image4.png](../media/doc409_image4.png)

## Slide 84

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 2 to 6, before the split at measure 4.](../media/doc409_slide84_fig1.svg)
![Schematic redrawn from the slide's data: straight route R1 after the split at measure 4: event E1 as 2–4 and 4–6.](../media/doc409_slide84_fig2.svg)

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
10
Network Type
Engineering (Point Events)
Test
Reassign part of a route to another line - 2.

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
No
Recalibrate Target
Yes
Date
12/31/2023

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
Null
1B
3
No Error
005
1/1/2000
Null
1B
4
No Error
006
1/1/2000
Null
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
43
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2

![image13.png](../media/doc409_image13.png)

## Slide 85

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
10
Network Type
Engineering (Point Events)
Test
Reassign part of a route to another line - 2.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
12/31/2023
1B
3
No Error
005
1/1/2000
12/31/2023
1B
4
No Error
006
1/1/2000
12/31/2023
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error
004
12/31/2023
Null
1B
3
No Error
005
12/31/2023
Null
1B
4
No Error
006
12/31/2023
Null
1B
5
Route Location not Found

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
200
24
28
1B
L1
1/1/2000
12/31/2023
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
X2
L3
12/31/2023
Null
300
24
28
X1
L3
12/31/2023
Null
100
2
6
1B-New
L3
12/31/2023
Null
200
5
14
1B
L1
12/31/2023
Null
100
3
4

[figure: 100 · 200 · X1 · X2]

![image4.png](../media/doc409_image4.png) ![image14.png](../media/doc409_image14.png)

## Slide 86

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
11
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, adjusting measures

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

## Slide 87

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
11
Network Type
Engineering (Point Events)
Test
Reassign all the routes in a line to another line on right, adjusting measures

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2010
Null
1A
2
No Error
002
12/31/2010
Null
1A
3
No Error
003
12/31/2010
Null
1A
4
Route Location not Found
004
12/31/2010
Null
2A
0
Route Location not Found
005
12/31/2010
Null
2A
1
Route Location not Found
006
12/31/2010
Null
2A
2
Route Location not Found
007
12/31/2010
Null
3A
0
Route Location not Found
008
12/31/2010
Null
3A
2
No Error
009
12/31/2010
Null
3A
4
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
F0rom
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1A
L1
12/31/2010
Null
100
2
3
2A
L1
12/31/2010
Null
200
10
20
3A
L1
12/31/2010
Null
300
1
4
1B
L1
1/1/2000
12/31/2010
100
3
5
1B
L1
12/31/2010
Null
400
3
5
2B
L1
1/1/2000
12/31/2010
200
4
8
2B
L1
12/31/2010
Null
500
4
8
3B
L1
1/1/2000
12/31/2010
300
0
2
3B
L1
12/31/2010
Null
600
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 400 · 2B, 500 · 3B, 600 · 2C, 200 · 1C, 100 · 3C, 300 · 3 · 2 · 20 · 10 · 1 · 4 · 5 · 8 · 0 · 6]

![image4.png](../media/doc409_image4.png)

## Slide 88

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2030

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Point Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source routes downstream

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: New Line · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

## Slide 89

3A LineX, 300

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2030
Null
1A
2
No Error
002
12/31/2030
Null
1A
3
No Error
003
12/31/2030
Null
1A
4
No Error
004
12/31/2030
Null
2A
0
No Error
005
12/31/2030
Null
2A
1
No Error
006
12/31/2030
Null
2A
2
No Error
007
12/31/2030
Null
3A
0
No Error
008
12/31/2030
Null
3A
2
No Error
009
12/31/2030
Null
3A
4
Route Location not Found

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
12
Network Type
Engineering (Point Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes. Recalibrate source routes downstream

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2010
12/31/2030
200
0
2
3A
L0
1/1/2020
12/31/2030
300
0
4
1A
LX
12/31/2030
Null
100
2
4
2A
LX
12/31/2030
Null
200
0
2
3A LineX
LX
12/31/2030
Null
300
0
2
3A
L0
12/31/2030
Null
100
0
2
1B
L1
1/1/2002
Null
100
3
5
2B
L1
1/1/2005
Null
200
4
8
3B
L1
1/1/2010
Null
300
0
2
1C
L2
1/1/2020
12/31/2030
100
4
6
2C
L2
1/1/2020
12/31/2030
200
2
6
3C
L2
1/1/2020
12/31/2030
300
4
8

[figure: 1A, 100 · 2A, 200 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 1 · 3 · 5 · 8 · 6 · 3A, 100]

![image4.png](../media/doc409_image4.png)

## Slide 90

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
9
Network Type
Engineering (Point Events)
Test
Reassign part of a route to another line. Recalibrating downstream.

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
No
Recalibrate Target
Yes
Date
12/31/2023

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
Null
1B
3
No Error
005
1/1/2000
Null
1B
4
No Error
006
1/1/2000
Null
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
Null
200
24
28
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2

[figure: 100 · 200 · X1 · X2]

![image11.png](../media/doc409_image11.png)

## Slide 91

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
9
Network Type
Engineering (Point Events)
Test
Reassign part of a route to another line. Recalibrating downstream.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
X1
2
No Error
002
1/1/2000
Null
X1
4
No Error
003
1/1/2000
Null
X1
6
No Error
004
1/1/2000
12/31/2023
1B
3
No Error
005
1/1/2000
12/31/2023
1B
4
No Error
006
1/1/2000
12/31/2023
1B
5
No Error
007
1/1/2000
Null
X2
24
No Error
008
1/1/2000
Null
X2
26
No Error
009
1/1/2000
Null
X2
28
No Error
004
12/31/2023
Null
1B
3
Route Location not Found
005
12/31/2023
Null
1B
4
Route Location not Found
006
12/31/2023
Null
1B
5
Route Location not Found
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
X1
L3
1/1/2000
Null
100
2
6
X2
L3
1/1/2000
12/31/2023
200
24
28
1B
L1
1/1/2000
12/31/2023
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
12/31/2023
300
0
2
X2
L3
12/31/2023
Null
300
24
28
1B-New
L3
12/31/2023
Null
200
3
4
1B
L1
12/31/2023
Null
100
0
2

[figure: 200 · X1 · X2 · 0 · 2]

![image4.png](../media/doc409_image4.png)

## Slide 92

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2030

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
10
Network Type
Engineering (Point Events)
Test
Reassign all routes to a new line.  Adjust measures to overlap previous measures

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: New Line · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

## Slide 93

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2030

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
10
Network Type
Engineering (Point Events)
Test
Reassign partial routes in a line to a new line. Change names of partial routes.

{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2030
100
2
4
2A
L0
1/1/2000
12/31/2030
200
0
2
3A
L0
1/1/2000
12/31/2030
300
0
4
1A
L_New
12/31/2030
Null
100
1
5
2A
L_New
12/31/2030
Null
200
0
3
3A
L_New
12/31/2030
Null
300
0
5
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2030
1A
2
No Error
002
1/1/2000
12/31/2030
1A
3
No Error
003
1/1/2000
12/31/2030
1A
4
No Error
004
1/1/2000
12/31/2030
2A
0
No Error
005
1/1/2000
12/31/2030
2A
1
No Error
006
1/1/2000
12/31/2030
2A
2
No Error
007
1/1/2000
12/31/2030
3A
0
No Error
008
1/1/2000
12/31/2030
3A
2
No Error
009
1/1/2000
12/31/2030
3A
4
No Error
001
12/31/2030
Null
1A
2
No Error
002
12/31/2030
Null
1A
3
No Error
003
12/31/2030
Null
1A
4
No Error
004
12/31/2030
Null
2A
0
No Error
005
12/31/2030
Null
2A
1
No Error
006
12/31/2030
Null
2A
2
No Error
007
12/31/2030
Null
3A
0
No Error
008
12/31/2030
Null
3A
2
No Error
009
12/31/2030
Null
3A
4
No Error

[figure: New Line · 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 5 · 1 · 3 · 0 · 4 · 2 · 8 · 6]

![image4.png](../media/doc409_image4.png)

## Slide 94

{5940675A-B579-460E-94D1-54222C63F5DA}Recalibrate Source
Yes
Recalibrate Target
Yes
Date
12/31/2010

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
11
Network Type
Engineering (Point Events)
Test
Reassign all routes to a new line.  Routes are irregularly portioned.  Do not transfer calibration points.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
Null
1A
2
No Error
002
1/1/2000
Null
1A
3
No Error
003
1/1/2000
Null
1A
4
No Error
004
1/1/2000
Null
2A
0
No Error
005
1/1/2000
Null
2A
1
No Error
006
1/1/2000
Null
2A
2
No Error
007
1/1/2000
Null
3A
0
No Error
008
1/1/2000
Null
3A
2
No Error
009
1/1/2000
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
Null
100
2
4
2A
L0
1/1/2000
Null
200
0
2
3A
L0
1/1/2000
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 1 · 5 · 8 · 6]

## Slide 95

{5940675A-B579-460E-94D1-54222C63F5DA}Test ID
11
Network Type
Engineering (Point Events)
Test
Reassign all routes to a new line.  Routes are irregularly portioned.  Do not transfer calibration points.

{5940675A-B579-460E-94D1-54222C63F5DA}EventID
From
Date
To
Date
RouteID
Measure
Loc
Error
001
1/1/2000
12/31/2010
1A
2
No Error
002
1/1/2000
12/31/2010
1A
3
No Error
003
1/1/2000
12/31/2010
1A
4
No Error
004
1/1/2000
12/31/2010
2A
0
No Error
005
1/1/2000
12/31/2010
2A
1
No Error
006
1/1/2000
12/31/2010
2A
2
No Error
007
1/1/2000
12/31/2010
3A
0
No Error
008
1/1/2000
12/31/2010
3A
2
No Error
009
1/1/2000
12/31/2010
3A
4
No Error
001
12/31/2030
Null
1A
2
No Error
002
12/31/2030
Null
1A
3
No Error
003
12/31/2030
Null
1A
4
No Error
004
12/31/2030
Null
2A
0
No Error
005
12/31/2030
Null
2A
1
No Error
006
12/31/2030
Null
2A
2
No Error
007
12/31/2030
Null
3A
0
No Error
008
12/31/2030
Null
3A
2
No Error
009
12/31/2030
Null
3A
4
No Error
{5940675A-B579-460E-94D1-54222C63F5DA}R Name
L NAME
From  Date
To Date
Line Order
From
Measure
To
Measure
1A
L0
1/1/2000
12/31/2010
100
2
4
2A
L0
1/1/2000
12/31/2010
200
0
2
3A
L0
1/1/2000
12/31/2010
300
0
4
1A
L_New
12/31/2010
Null
100
2
4
2A
L_New
12/31/2010
Null
200
0
2
3A
L_New
12/31/2010
Null
300
0
4
1B
L1
1/1/2000
Null
100
3
5
2B
L1
1/1/2000
Null
200
4
8
3B
L1
1/1/2000
Null
300
0
2
1C
L2
1/1/2000
Null
100
4
6
2C
L2
1/1/2000
Null
200
2
6
3C
L2
1/1/2000
Null
300
4
8

[figure: 1A, 100 · 2A, 200 · 3A, 300 · 1B, 100 · 2B, 200 · 3B, 300 · 2C, 200 · 1C, 100 · 3C, 300 · 4 · 2 · 0 · 3 · 5 · 8 · 1 · 6]

![image4.png](../media/doc409_image4.png)

*(tables truncated at 200 — remaining tables render as plain text)*
