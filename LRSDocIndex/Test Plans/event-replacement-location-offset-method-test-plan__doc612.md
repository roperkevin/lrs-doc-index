# Event Replacement: Location Offset Method Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4768](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4768) |
| **Source** | [4768-EventReplacementLocationOffsetMethod_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4768-EventReplacementLocationOffsetMethod_TestPlanV1.pptx>) |
| **Edited** | 2023-02-15 22:19 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Event Replacement: Location Offset Method Test Plan"
source_file: "4768-EventReplacementLocationOffsetMethod_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4768-EventReplacementLocationOffsetMethod_TestPlanV1.pptx"
doc_id: 612
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-02-15T22:19:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event replacement", "location offset", "route", "intersection", "attribute set", "cardinal offsets", "linear referencing"]
tools: ["Event Replacement"]
products: []
issues: ["ArcGISPro/ps-location-referencing#4768"]
related: [{"doc":618,"file":"add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md","s":6.418},{"doc":619,"file":"event-replacement-referent-population-for-line-events__doc619.md","s":4.456},{"doc":679,"file":"add-event-intersection-offset-method__doc679.md","s":4.332},{"doc":268,"file":"add-line-events-point-offset-method__doc268.md","s":3.957},{"doc":48,"file":"location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md","s":3.78}]
```
-->

## Summary

Test plan for the Event Replacement tool using the Location Offset method in linear referencing systems. Covers positive and negative UI tests, various route configurations including simple, gap, vertical, and line routes, and attribute set scenarios with cardinal offsets and intersection selections. Includes expected results for event replacement with location offsets on routes and intersections.

## Related documents

<!-- related:begin -->
- [Add Line Event Tools – Intersection Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md>) — similar text 0.15 · 3 title words · 3 filename words · same kind/folder <!-- rel:618 -->
- [Event Replacement Referent Population for Line Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/event-replacement-referent-population-for-line-events__doc619.md>) — similar text 0.22 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:619 -->
- [Add Event Intersection Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-event-intersection-offset-method__doc679.md>) — similar text 0.17 · 3 title words · 3 filename words · same surface <!-- rel:679 -->
- [Add Line Events Point Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-point-offset-method__doc268.md>) — similar text 0.12 · 2 title words · 3 filename words · same surface <!-- rel:268 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md>) — similar text 0.19 · 2 title words · 1 filename word · same kind/folder <!-- rel:48 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

_No page matched:_ [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Event Replacement: Location Offset Method

| Notes |
| --- |
| Test with Line and Nonline networks Test Auto, Single, and Multifield RouteID configurations FS only, no EGDB or FGDB. Test with and without referents configured Method is only usable when an LRS intersection feature class is found within the map Test with normal and complex routes Test with and without cardinal direction Test referent population (see Event Replacement Referent Population Location Offset test cases) |

Devtopia Issue

## Slide 2

| Positive Tests: UI |
| --- |
| Verify Event Replacement tool shows Location Offset in method dropdown Moving in-between panes preserves input values Clear form if input LRS Network is changed If user changes the From/To Method to a different method, reset the corresponding From or To section of 2 nd pane If unit of measure is changed, update location on map If more than one intersection exists at the same location on the same route, show modal window with possible intersections to select Selecting offset from map will reset cardinal direction drop-down. Add a drop-down above the location name to include intersection offset layers and label it "Location" If there exists only one intersection layer in the map, select that layer automatically Show only the intersection offset layers that are present in the TOC If the form is filled up and the intersection offset layer is removed from the TOC, then reset the layer name, ID and offset value Show intersection layers for the selected network when more than one intersection layer The intersection name displayed in the UI should be based on the selected route and its From date |

| Negative Tests: UI Error |
| --- |
| Intersection FC must be in map for 2 nd pane to allow input for intersection name. Should display error message if no intersection FC |
|  |

| Positive Tests |
| --- |
| Simple route, all events are present, use attribute set 1 with cardinal offsets Simple route, all events are present, use attribute set 1 with different intersections and positive offsets Simple route, all events are present, use attribute set 1 with positive and negative offsets Gap route, all events are present, use attribute set 2 with positive and negative offsets Simple line, all events are present, use attribute set 1 with positive offsets Vertical route, all events are present, use attribute set 2 Simple route, all events are present, use attribute set 1 with different From and To Methods (one will be Location Offset, other will be Route and Measure or Coordinates) |

| Negative Tests |
| --- |
| Simple route, all events are present, use attribute set 1 with offsets that exceed the From and To Measures of Route Invalid input values for offset |

## Slide 3

![Interface screenshot redrawn as a standardized wireframe: 1 button, 6 text rows. 4 of 6 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide3_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 icon, 4 text rows. 4 of 4 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide3_fig2.svg)

2 networks:
Continuous: 2 LEs (speed, width), 2 PEs (accident, traffic light)
Line: 3LEs (2 spanning (length, pave), 1 non-spanning (functional class)), 2 PEs (friction, station)
Attribute set 1 (default):

  - retire all PEs (accident, traffic light, friction, station) and non-spanning LE on line (functional class), replace speed, width, length, and pave.
Attribute set 2:

  - retire 2 PEs (accident, station). Leave traffic light, friction, width & length as is. Replace speed, pave, and func.
Legend

![image3.png](../media/doc322_image3.png) ![image4.png](../media/doc322_image4.png) ![image5.png](../media/doc322_image5.png) ![image6.png](../media/doc322_image6.png) ![image7.png](../media/doc322_image7.png) ![image8.png](../media/doc322_image8.png)

## Slide 4 — 1. Simple route, all events are present, use attribute set 1 with cardinal offsets

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 buttons, 23 text rows. 20 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide4.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | L45 | 0 | 25 | NO ERROR | 50 |
| Width | Width1 | L45 | 0 | 25 | NO ERROR | 10 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 25 | NO ERROR | 50 |
| Speed | Speed1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 40 |
| Width | Width1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 4 | NO ERROR | 10 |
| Width | Width1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 20 |

        0                                                                                           25
Expected

| RouteID | From Location | To Location | From Offset | To Offset | From Date | To Date | Speed | Width |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L45 | Int1 (10) | Int1 (10) | W 10 | E 15 | 1/1/2020 | Null | 40 | 20 |

Int1

![image9.png](../media/doc322_image9.png) ![image10.png](../media/doc322_image10.png) ![image11.png](../media/doc322_image11.png) ![image12.png](../media/doc322_image12.png)

## Slide 5 — 2. Simple route, all events are present, use attribute set 1, dif intersections

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 buttons, 23 text rows. 20 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide5.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | L45 | 0 | 25 | NO ERROR | 50 |
| Width | Width1 | L45 | 0 | 25 | NO ERROR | 10 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 25 | NO ERROR | 50 |
| Speed | Speed1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 40 |
| Width | Width1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 4 | NO ERROR | 10 |
| Width | Width1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 20 |

| RouteID | From Location | To Location | From Offset | To Offset | From Date | To Date | Speed | Width |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L45 | Int1 (10) | Int2 (20) | -10 | 5 | 1/1/2020 | Null | 40 | 20 |

![image9.png](../media/doc322_image9.png) ![image10.png](../media/doc322_image10.png) ![image11.png](../media/doc322_image11.png) ![image12.png](../media/doc322_image12.png)

## Slide 6 — 3. Simple route, all events are present, use attribute set 1 with positive and negative offsets

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 buttons, 23 text rows. 20 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide6.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | L45 | 0 | 25 | NO ERROR | 50 |
| Width | Width1 | L45 | 0 | 25 | NO ERROR | 10 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 25 | NO ERROR | 50 |
| Speed | Speed1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 40 |
| Width | Width1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 4 | NO ERROR | 10 |
| Width | Width1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 20 |

        0                                                                                           25
Expected
Int1

| RouteID | From Location | To Location | From Offset | To Offset | From Date | To Date | Speed | Width |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L45 | Int1 (10) | Int1 (10) | -10 | 15 | 1/1/2020 | Null | 40 | 20 |

![image9.png](../media/doc322_image9.png) ![image10.png](../media/doc322_image10.png) ![image11.png](../media/doc322_image11.png) ![image12.png](../media/doc322_image12.png)

## Slide 7 — 4. Gap route, all events are present, use attribute set 2 with positive and negative offsets

![Diagram drawn from the slide's own shapes: 4 nodes, 3 connectors.](../media/doc322_slide7.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | L50 | 20 |  | NO ERROR | Light1 |
| Accident | Accident1 | L50 | 20 |  | NO ERROR | minor |
| Speed | Speed1 | L50 | 10 | 15 | NO ERROR | 50 |
| Width | Width1 | L50 | 15 | 25 | NO ERROR | 10 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | 1/1/2000 | null | L50 | 20 |  | NO ERROR | Light1 |
| Accident | Accident1 | 1/1/2000 | 1/1/2020 | L50 | 20 |  | NO ERROR | minor |
| Speed | Speed1 | 1/1/2000 | 1/1/2020 | L50 | 10 | 15 | NO ERROR | 50 |
| Speed | Speed1new | 1/1/2020 | null | L50 | 2 | 5 | NO ERROR | 40 |
| Speed | Speed1new | 1/1/2020 | null | L50 | 10 | 25 | NO ERROR | 40 |
| Width | Width1 | 1/1/2000 | null | L50 | 15 | 25 | NO ERROR | 10 |

| Route ID | From Location | To Location | From Offset | To Offset | From Date | To Date | Speed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L50 | Int1 (16) | Int1 (16) | -11 | 9 | 1/1/2020 | Null | 40 |

![image12.png](../media/doc322_image12.png)

## Slide 8 — 5. Simple line, all events are present, use attribute set 1 with positive offsets

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 7 buttons, 20 icons, 26 text rows. 16 of 26 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide8.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToRtName | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Friction | friction1 | R299 | 2500 |  |  | NO ERROR | light |
| Station | station1 | R299 | 2500 |  |  | NO ERROR | St1 |
| Functional Class | func1 | R296 | 0 |  | 5000 | NO ERROR | local |
| Functional Class | Func2 | R297 | 0 |  | 5000 | NO ERROR | local |
| Functional Class | Func3 | R298 | 0 |  | 5000 | NO ERROR | local |
| Functional Class | Func4 | R299 | 0 |  | 5000 | NO ERROR | local |
| Functional Class | func5 | R300 | 0 |  | 5000 | NO ERROR | local |
| Pave | pave1 | R296 | 0 | R300 | 5000 | NO ERROR | good |
| Length | length1 | R296 | 0 | R300 | 5000 | NO ERROR | 200 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToRtName | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Friction | friction1 | 1/1/2000 | 1/1/2020 | R299 | 2500 |  |  | NO ERROR | light |
| Station | station1 | 1/1/2000 | 1/1/2020 | R299 | 2500 |  |  | NO ERROR | St1 |
| Functional Class | func1 | 1/1/2000 | null | L1R1 | 0 |  | 6 | NO ERROR | local |
| Functional Class | Func2 | 1/1/2000 | null | L1R2 | 0 |  | 2 | NO ERROR | local |
| Pave | pave1 | 1/1/2000 | 1/1/2020 | R296 | 0 | R300 | 5000 | NO ERROR | good |
| Pave | pave1 | 1/1/2020 | null | R296 | 0 | R297 | 5000 | NO ERROR | good |
| Pave | pave1new | 1/1/2020 | null | R298 | 0 | R300 | 5000 | NO ERROR | poor |
| Length | length1 | 1/1/2000 | 1/1/2020 | R296 | 0 | R300 | 5000 | NO ERROR | 200 |
| Length | length1 | 1/1/2020 | null | R296 | 0 | R297 | 5000 | NO ERROR | 200 |
| Pave | pave1new | 1/1/2020 | null | R298 | 0 | R300 | 5000 | NO ERROR | 300 |

Expected

| Line ID | From Route Name | To Route Name | From Location | To Location | From Offset | To Offset | From Date | To Date | Pave | Length |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L60 | R298 | R300 | Int1 (2500) | Int1 (2500) | 2500 | 17500 | 1/1/2020 | Null | Poor | 300 |

Int1

![image12.png](../media/doc322_image12.png)

## Slide 9 — 6. Vertical route, all events are present, use attribute set 2

|  |
| --- |

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light8 | V1 | 2.38 |  | NO ERROR | Light8_coor |
| Accident | Accident8 | V1 | 2.38 |  | NO ERROR | Major_coor |
| Speed | Speed8 | V1 | 0 | 8 | NO ERROR | 50 |
| Width | Width9 | V1 | 0 | 8 | NO ERROR | 15 |

Expected

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light8 | 1/1/2000 | null | V1 | 2.38 |  | NO ERROR | Light8_coor |
| Accident | Accident8 | 1/1/2000 | 1/1/2020 | V1 | 2.38 |  | NO ERROR | Major_coor |
| Speed | Speed8 | 1/1/2000 | 1/1/2020 | V1 | 0 | 8 | NO ERROR | 50 |
| Speed | Speed8new_a | 1/1/2020 | null | V1 | 0 | 10 | NO ERROR | 40 |
| Width | Width9 | 1/1/2000 | null | V1 | 0 | 8 | NO ERROR | 15 |

| Route ID | From Location | To Location | From Offset | To Offset | From Date | To Date | Speed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | Int1 (5) | Int1 (5) | -5 | 5 | 1/1/2020 | Null | 40 |

Int1

![image19.png](../media/doc322_image19.png) ![image20.png](../media/doc322_image20.png) ![image12.png](../media/doc322_image12.png)

## Slide 10 — 7. Simple Route, Attribute Set 1, different methods

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 buttons, 23 text rows. 20 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc322_slide10.svg)

|  |
| --- |

| Event Layer | EventId | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | L45 | 0 | 25 | NO ERROR | 50 |
| Width | Width1 | L45 | 0 | 25 | NO ERROR | 10 |

| Event Layer | EventId | FromDate | ToDate | (From) RtName | (From)M | ToM | LocError | Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TrafficLight | Light1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | Light1 |
| Accident | Accident1 | 1/1/2000 | 1/1/2020 | L45 | 12.2 |  | NO ERROR | minor |
| Speed | Speed1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 25 | NO ERROR | 50 |
| Speed | Speed1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 40 |
| Width | Width1 | 1/1/2000 | 1/1/2020 | L45 | 0 | 4 | NO ERROR | 10 |
| Width | Width1new | 1/1/2020 | null | L45 | 0 | 25 | NO ERROR | 20 |

        0                                                                                           25
Expected
Int2

| RouteID | From Route ID | From Measure | To Location | To Offset | From Date | To Date | Speed | Width |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L45 | Int1 (10) | 0 | Int1 (10) | E 15 | 1/1/2020 | Null | 40 | 20 |

![image9.png](../media/doc322_image9.png) ![image10.png](../media/doc322_image10.png) ![image11.png](../media/doc322_image11.png) ![image12.png](../media/doc322_image12.png)
