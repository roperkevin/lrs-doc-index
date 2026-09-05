# Location Offset Method in Add Point and Add Line Widgets Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24790](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24790) |
| **Source** | [24790-LocationOffsetMethodinAddPointandLine_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/24790-LocationOffsetMethodinAddPointandLine_TestPlanV1.pptx>) |
| **Edited** | 2025-05-30 21:27 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Location Offset Method in Add Point and Add Line Widgets Test Plan"
source_file: "24790-LocationOffsetMethodinAddPointandLine_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/24790-LocationOffsetMethodinAddPointandLine_TestPlanV1.pptx"
doc_id: 48
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2025-05-30T21:27:40Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location offset", "add point event", "add line event", "calibration point", "referent method", "offset units", "route", "point event", "line event", "gapped route", "self intersecting location", "conflict prevention", "intellisense", "pop-up selection"]
tools: ["Add Point Event", "Add Line Event", "Search by Route Widget"]
products: []
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24790"]
related: [{"doc":231,"file":"add-line-events-by-offsetting-from-other-points-test-plan__doc231.md","s":8.659},{"doc":49,"file":"coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md","s":7.47},{"doc":177,"file":"experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md","s":6.326},{"doc":618,"file":"add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md","s":6.206},{"doc":241,"file":"add-point-events-by-offsetting-from-other-points-test-plan__doc241.md","s":5.691}]
```
-->

## Summary

Test plan for adding Location Offset functionality to the Add Point Event and Add Line Event widgets in Experience Builder. It covers configuration, UI behavior, positive and negative test cases involving offsets with calibration points, LRS intersections, and non-LRS features across various route types and units. The plan includes validation of conflict prevention, intellisense, pop-up selection, and data action integration.

## Related documents

<!-- related:begin -->
- [Add Line Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-by-offsetting-from-other-points-test-plan__doc231.md>) — similar text 0.77 · 2 title words · 3 filename words · same kind/folder <!-- rel:231 -->
- [Coordinates Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md>) — similar text 0.19 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:49 -->
- [Experience Builder Referent method in Add Point and Line widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-referent-method-in-add-point-and-line-widgets__doc177.md>) — similar text 0.13 · 5 title words · 3 filename words · same surface <!-- rel:177 -->
- [Add Line Event Tools – Intersection Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md>) — similar text 0.20 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:618 -->
- [Add Point Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-events-by-offsetting-from-other-points-test-plan__doc241.md>) — similar text 0.58 · 2 title words · 2 filename words · same kind/folder <!-- rel:241 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Search by Route Widget](https://www.google.com/search?q=%22Search%20by%20Route%20Widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

ExB – Location Offset Method in Add Line and Add Point Widgets

| Notes |
| --- |
| Add Location Offset functionality to the Add Point Event and Add Line Event widgets Widgets will use same referent logic as in the Search by Route Referent method Test with LRS intersections, calibration points (new), LRS point events, and non-LRS point features as offset locations Test with complex shapes, including offset features that exist at self-intersecting locations along routes Test with nonline (auto-generated, single-field, and multi-field RouteID configurations) and line networks Test with different units of offset value Test positive and negative offsets. Cardinal offset will not be included as part of this user story Test with offsets that exceed route measures Test conflict prevention continues to work as expected Only event layers associated with the chosen network can be used as an offset feature Sanity test Merge coincident events and Retire overlapping events data validation options i18n and 508 Referent population will not be part of this user story Use Pro Location Offset test cases for testing Sanity test Search by Route Widget’s Referent search functionality |

Devtopia Issue

| Positive Tests: Configuration |
| --- |
| Add Location Offset in the Methods (Add Line will have it for both the From and To Methods) Location Offset can be configured as the default Method in Add Point and the From/To Methods in Add Line Add Default Offset Layer parameter Any point layer from the web map can be configured as the Default Offset Layer (including calibration points) Add Default Offset Units configuration parameter Any supported unit can be set as the Default Offset Units For individual layers that will be used as an offset layer, add a new configuration option for a display field that will be displayed in the tool UI (similar to Search by Route) Chosen web map does not include any point features, don’t show the Location Offset method |

| Positive Tests: Add Point/Add Line UI |
| --- |
| Location Offset method can be chosen (when enabled) Location Offset method is not displayed when disabled Location Offset method is chosen as the default method (when configured) RouteID/RouteName parameter continues to work as expected RouteID/RouteName picker continues to work as expected Offset feature can be chosen by entering the identifier field value or picked from the map Offset measure can be chosen by entering the offset value or picking from the map Offset units can be chosen, every supported Esri unit is available |

## Slide 2

| Negative Tests |
| --- |
| Input offset value does not fall on route Input offset feature does not belong to the same route as the chosen route Input invalid date range Input invalid RouteID/RouteName Input invalid feature identifier Input invalid offset Input calibration point associated with other LRS Network as the offset feature. Show error that calibration point feature must belong to input route/network |

| Positive Tests: Add Point/Add Line UI (Continued) |
| --- |
| For Add Line, test the above for the From and To Methods Ensure data actions from other widgets continue to populate Add Point and Add Line widgets as expected Markers appear on map when a valid offset is chosen Ensure intellisense experience works as expected for feature identifier parameters (Text or GUID values) Once an offset feature is chosen, blink it in the map but do not keep it highlighted If more than one point feature exists at the clicked location, display pop-up that allows user to pick which feature they would like to use Fields to display for each layer type within pop-up: Calibration Points: Measure LRS Intersections: Intersection Name, Measure LRS Point Events: EventID, Display Field, Measure (do not show EventID twice if it is configured as the Display Field) Non-LRS Point Features: Display Field, Measure If an LRS intersection or non-LRS point feature is picked and the feature falls at a self-intersecting measure, display pop-up that allows user to pick which measure they would like to use If a non-LRS feature is chosen as the offset, ensure intellisense only displays features on the route. If non-LRS point features have the same display field value, only the feature on the route should be selected and a pop-up should not appear Picking an offset feature vs. typing in the Display Field value provides the same offset feature selection experience Chosen web map does not include any point features, don’t show the Location Offset method |

## Slide 3

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide3.svg)

| EventID | RouteID | Measure | From Date | ToDate | AttenuatorCode |
| --- | --- | --- | --- | --- | --- |
| Attenuator1 | CM00A | 4.485485 mi. | 1/1/2000 |  | S1 |

Continuous – multi-field RID, point events do not have referent fields
1 - Add a point event using a positive offset with direction and a different unit from a calibration point on a simple route

| RouteID | Point Layer Name | Offset |
| --- | --- | --- |
| CM00A | Measure 2 (Calibration Point) | 4 km |

![image1.png](../media/doc848_image1.png)

## Slide 4

Continuous – auto-generated RID
3 - Add a point event using a negative offset with a different unit from a calibration point

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| R3 | Measure 2 (Calibration Point) | -800 meters |

CP has a defined measure, so offset will be from measure 2 even though the CP is at a self-intersecting measure

![Diagram drawn from the slide's own shapes: 3 nodes (R3), 6 connectors.](../media/doc848_slide4.svg)

| EventID | RouteName | Measure | From Date | ToDate | Sign Type |
| --- | --- | --- | --- | --- | --- |
| Sign3 | R3 | 1.502903 mi | 1/1/2000 |  | Stop Sign |

## Slide 5

Continuous - multi-field RID, point events do not have referent fields
2 - Add multiple point events using a negative offset from a calibration point on a gapped route (different measures on the ends)

![Diagram drawn from the slide's own shapes: 3 nodes (CM00B), 2 connectors.](../media/doc848_slide5_fig1.svg)

| EventID | RouteID | Measure | From Date | ToDate | AttenuatorCode |
| --- | --- | --- | --- | --- | --- |
| Attenuator2 | CM00B | 2 | 1/1/2000 |  | S1 |

| RouteID | Point Layer Name | Offset |
| --- | --- | --- |
| CM00B | Measure 7 (Calibration Point) | -5 |

Use this case to sanity test a negative case: offset -1.95 but 5.05 is not on route

![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide5_fig2.svg)

| EventID | RouteID | Measure | From Date | ToDate | NBI |
| --- | --- | --- | --- | --- | --- |
| Bridge1 | CM00B | 2 | 1/1/2000 |  | 96 |

![image2.png](../media/doc848_image2.png)

## Slide 6

![Diagram drawn from the slide's own shapes: 3 nodes (L1R1, L1R2), 2 connectors.](../media/doc848_slide6.svg)

| EventID | RouteName | Measure | From Date | ToDate | Anomaly |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R1 | 3000 | 1/1/2000 |  | Crack |

Line – some point events have referent fields, some do not
1 - Add a point event with no referent fields using a negative offset from a calibration point on a simple route

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L1R1 | Measure 10000 (Calibration Point) | -7000 |

![image4.png](../media/doc848_image4.png)

## Slide 7

![Diagram drawn from the slide's own shapes: 3 nodes (L1R1, L1R2), 2 connectors.](../media/doc848_slide7.svg)

| EventID | RouteName | Measure | From Date | ToDate | Anomaly |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R1 | 0 | 1/1/2000 |  | Crack |

Line – some point events have referent fields, some do not
1a - Add a point event with no referent fields using an offset from a calibration point on a simple route

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L1R2 | Measure 0 (Calibration Point) | 0 |

![image4.png](../media/doc848_image4.png)

## Slide 8

![Diagram drawn from the slide's own shapes: 2 nodes (R1), 1 connector.](../media/doc848_slide8.svg)

| EventID | Route Name | From Measure | To Measure | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | 1/1/2000 |  | 55 |

Continuous – auto-generated RID, line event has referent fields
1 - Add a line event using positive offsets from a calibration point on a simple route

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | Measure 2 (Calibration Point) | 3 | Measure 2 (Calibration Point) | 5 |

![image1.png](../media/doc848_image1.png)

## Slide 9

![Diagram drawn from the slide's own shapes: 3 nodes (R1), 1 connector.](../media/doc848_slide9.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | 1/1/2000 | <Null> | 55 |

Continuous – auto-generated RID, line event has referent fields
1a - Add a line event using offsets from different calibration point features on a simple route

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | Measure 2 (Calibration Point) | 3 | Measure 8 (Calibration Point) | -1 |

![image1.png](../media/doc848_image1.png)

## Slide 10

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 6: event E1 as 5–6 and 6–7.](../media/doc848_slide10_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 5 to 7, before the split at measure 6.](../media/doc848_slide10_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | 1/1/2000 | <Null> | 55 |

Continuous – auto-generated RID, line event has referent fields
1b - Add a line event using offsets from different point features on a simple route, but always include calibration point [Mix and match point features for From and To Point Layer; Int and Point Event, Point Event and Point Feature, etc.]

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | Measure 0 (Calibration Point) | 5 | MilePost 8 ( MilePost ) | -1 |

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png) ![image8.png](../media/doc848_image8.png) ![image10.png](../media/doc848_image10.png)

## Slide 11

![Diagram drawn from the slide's own shapes: 3 nodes (R2), 6 connectors.](../media/doc848_slide11.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R2 | 2 | 9 | 1/1/2000 |  | Stop Sign |

Continuous – auto-generated RID, point events have referent fields
2a - Add multiple line events using a positive offset with direction from a calibration point on a gapped route (same measures on the ends). Input events will not split since measure is same on both ends (also test this case where measures are not same across the gap, events will split

| RouteName | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| R2 | Measure 5 (Calibration Point) | -3 | 4 |

| EventID | Route Name | Measure | To Measure | From Date | ToDate | Func Class |
| --- | --- | --- | --- | --- | --- | --- |
| FuncClass1 | R2 | 2 | 9 | 1/1/2000 |  | Minor Collector |

## Slide 12

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L2R1 | 3000 | L2R2 | 2500 | 1/1/2000 |  | Class 1 |

Line – some line events have referent fields, some do not
2 - Add multiple line events using offsets from a calibration point on a simple route

![Diagram drawn from the slide's own shapes: 4 nodes (L2R1, L2R2), 6 connectors.](../media/doc848_slide12.svg)

| From Route Name | To Route Name | From Point Layer Name | To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- | --- | --- |
| L2R1 | L2R2 | Measure 2000 (Calibration Point) | Measure 4000 (Calibration Point) | 1000 | -1500 |

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | Inspect. Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Inspection Range1 | L2R1 | 3000 | L2R2 | 2500 | 1/1/2000 |  | Visual Survey |

## Slide 13

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L2R1 | 2000 | L2R2 | 4000 | 1/1/2000 |  | Class 1 |

Line – some line events have referent fields, some do not
2a - Add multiple line events using 0 offsets from a calibration point on a simple route

![Diagram drawn from the slide's own shapes: 4 nodes (L2R1, L2R2), 6 connectors.](../media/doc848_slide13.svg)

| From Route Name | To Route Name | From Point Layer Name | To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- | --- | --- |
| L2R1 | L2R2 | Measure 2000 (Calibration Point) | Measure 4000 (Calibration Point) | 0 | 0 |

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | Inspect. Type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Inspection Range1 | L2R1 | 2000 | L2R2 | 4000 | 1/1/2000 |  | Visual Survey |

## Slide 14

![Diagram drawn from the slide's own shapes: 3 nodes (R2), 2 connectors.](../media/doc848_slide14.svg)

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sign2 | R2 | 2 | MilePost | 801 | -5 | 1/1/2000 |  | Stop Sign |

Continuous – auto-generated RID, point events have referent fields
2 - Add multiple point events using a positive offset with direction from a point event on a gapped route (same measures on the ends)

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| R2 | 801 ( MilePost ) | W 5 |

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crash1 | R2 | 2 | MilePost | 801 | -5 | 1/1/2000 |  | Minor |

![image8.png](../media/doc848_image8.png)

## Slide 15

Continuous – auto-generated RID, point events have referent fields
3 - Add a point event using a negative offset with a different unit from a point feature that is not added to dReferentMethod domain on a lollipop route

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| R3 | 2 (Café) | -800 meters |

Point feature does not have M, so we use the smallest M at self intersection. In this test case, M is 2 (2,14).

![Diagram drawn from the slide's own shapes: 2 nodes (R3), 6 connectors.](../media/doc848_slide15.svg)

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sign3 | R3 | 1.502903 | C1 network | {R0003- | 1.502903 (mi) | 1/1/2000 |  | Stop Sign |

![image10.png](../media/doc848_image10.png)

## Slide 16

Continuous - single field RID, 1 point event without referent fields
1 - Add a point event using a negative offset from an intersection on a lollipop route (point event is at self intersection)

| RouteID | Point Layer Name | Offset |
| --- | --- | --- |
| CS2 | CS2 & CS599 | -4 |

![Diagram drawn from the slide's own shapes: 2 nodes (CS2), 6 connectors.](../media/doc848_slide16.svg)

| EventID | RouteID | Measure | From Date | ToDate | Friction System |
| --- | --- | --- | --- | --- | --- |
| Friction2 | CS2 | 2 | 1/1/2000 |  | X |

![image6.png](../media/doc848_image6.png)

## Slide 17

![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide17.svg)

| EventID | RouteID | Measure | From Date | ToDate | AttenuatorCode |
| --- | --- | --- | --- | --- | --- |
| Attenuator1 | CM00A | 4.485485 | 1/1/2000 |  | S1 |

Continuous – multi-field RID, point events do not have referent fields
1 - Add a point event using a positive offset with direction and a different unit from a point event on a simple route

| RouteID | Point Layer Name | Offset |
| --- | --- | --- |
| CM00A | 1093 (bridge) | N 4 km (there is no N, so it follows calibration direction) |

![image1.png](../media/doc848_image1.png) ![image2.png](../media/doc848_image2.png)

## Slide 18

Continuous - multi-field RID, point events do not have referent fields
2 - Add multiple point events using a negative offset from a point feature on a gapped route (different measures on the ends)

![Diagram drawn from the slide's own shapes: 2 nodes (CM00B), 2 connectors.](../media/doc848_slide18_fig1.svg)

| EventID | RouteID | Measure | From Date | ToDate | AttenuatorCode |
| --- | --- | --- | --- | --- | --- |
| Attenuator2 | CM00B | 2 | 1/1/2000 |  | S1 |

| RouteID | Point Layer Name | Offset |
| --- | --- | --- |
| CM00B | 88 (Café) | -5 |

Use this case to sanity test a negative case: offset -1.95 but 5.05 is not on route

![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide18_fig2.svg)

| EventID | RouteID | Measure | From Date | ToDate | NBI |
| --- | --- | --- | --- | --- | --- |
| Bridge1 | CM00B | 2 | 1/1/2000 |  | 96 |

![image10.png](../media/doc848_image10.png) ![image2.png](../media/doc848_image2.png)

## Slide 19

![Diagram drawn from the slide's own shapes: 3 nodes (L1R1, L1R2), 2 connectors.](../media/doc848_slide19.svg)

| EventID | RouteName | Measure | From Date | ToDate | Anomaly |
| --- | --- | --- | --- | --- | --- |
| Anomaly1 | L1R1 | 3000 | 1/1/2000 |  | Crack |

Line – some point events have referent fields, some do not
1 - Add a point event with no referent fields using a negative offset from a point event on a simple route

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L1R1 | 1093 ( ILINote ) | -7000 |

![image4.png](../media/doc848_image4.png)

## Slide 20

![Diagram drawn from the slide's own shapes: 3 nodes (L2R1, L2R2), 2 connectors.](../media/doc848_slide20.svg)

| EventID | RouteName | Measure | From Date | ToDate | Anomaly |
| --- | --- | --- | --- | --- | --- |
| Anomaly2 | L2R1 | 3438.32 | 1/1/2000 |  | Crack |

Line – some point events have referent fields, some do not
2 - Add multiple point events (with and without referent fields) using a negative offset with a different unit from a point feature that is not added to dReferentMethod domain on a simple route

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L2R1 | 8 (Station) | -2km |

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ILINote1 | L2R1 | 3438.32 | EngineeringNetwork | {L2R1- | 1047.999936 m | 1/1/2000 |  | abc |

![image4.png](../media/doc848_image4.png) ![image10.png](../media/doc848_image10.png)

## Slide 21

Line – some point events have referent fields, some do not
3 - Add a point event with referent fields using a positive offset with a direction and a different unit from a point event on a 3D multi-gapped route (different measures on the ends)

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L3R1 | 1093 (anomaly) | E 1828.8m |

![Diagram drawn from the slide's own shapes: 3 nodes (L3R1, L3R2), 5 connectors.](../media/doc848_slide21.svg)

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ILINote2 | L3R2 | 16000 | Anomaly | 1093 | 1828.8 m | 1/1/2000 |  | abc |

![image4.png](../media/doc848_image4.png)

## Slide 22

Line – some point events have referent fields, some do not
4 - Add multiple point events (with and without referent fields) using positive offset with direction from a point feature that is added to dReferentMethod domain on a multi-gapped route (different measures on the ends)

| RouteName | Point Layer Name | Offset |
| --- | --- | --- |
| L4R1 | 3 (Station) | E 4000 |

![Diagram drawn from the slide's own shapes: 4 nodes (L4R1, L4R2), 5 connectors.](../media/doc848_slide22.svg)

| EventID | RouteName | Measure | From Date | ToDate | Anomaly |
| --- | --- | --- | --- | --- | --- |
| Anomaly3 | L4R1 | -1000 | 1/1/2000 |  | Crack |

| EventID | RouteName | Measure | Referent Method | ReferentID | Referent Offset | From Date | ToDate | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ILINote3 | L4R1 | -1000 | Station | 3 | 1219.2 (m) | 1/1/2000 |  | abc |

![image4.png](../media/doc848_image4.png)

## Slide 23

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 6: event E1 as 5–6 and 6–7.](../media/doc848_slide23_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 5 to 7, before the split at measure 6.](../media/doc848_slide23_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From/To Referent Method | From/To ReferentID | From RefOffset | To RefOffset | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | C1_Intersection | {Int333} | 3 | 5 | 1/1/2000 |  | 55 |

Continuous – auto-generated RID, line event has referent fields
1 - Add a line event using positive offsets from an intersection on a simple route
Input
Expected Result

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | R1 & Rx | 3 | R1 &Rx | 5 |

R1

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png)

## Slide 24

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 6: event E1 as 5–6 and 6–7.](../media/doc848_slide24_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 5 to 7, before the split at measure 6.](../media/doc848_slide24_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From/To Referent Method | FromRef ID | From RefOffset | ToRefID | To RefOffset | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | C1_Intersection | {Int333} | 3 | {Int444} | -1 | 1/1/2000 | <Null> | 55 |

Continuous – auto-generated RID, line event has referent fields
1a - Add a line event using offsets from different intersection features on a simple route
Input
Expected Result

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | R1 & Rx | 3 | R1 &Ry | -1 |

R1

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png)

## Slide 25

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 6: event E1 as 5–6 and 6–7.](../media/doc848_slide25_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 5 to 7, before the split at measure 6.](../media/doc848_slide25_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Referent Method | FromRef ID | From RefOffset | To Referent Method | ToRefID | To RefOffset | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | C1_Intersection | {Int333} | 3 | MilePost | 58 (OID) | -1 | 1/1/2000 | <Null> | 55 |

Continuous – auto-generated RID, line event has referent fields
1b - Add a line event using offsets from different point features on a simple route [Mix and match point features for From and To Point Layer; Int and Point Event, Point Event and Point Feature, etc.]

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | R1 & Rx | 3 | MilePost | -1 |

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png) ![image8.png](../media/doc848_image8.png)

## Slide 26

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 6: event E1 as 5–6 and 6–7.](../media/doc848_slide26_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 5 to 7, before the split at measure 6.](../media/doc848_slide26_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Referent Method | FromRef ID | From RefOffset | To Referent Method | ToRefID | To RefOffset | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 5 | 7 | Café | OID 3 | 3 | Water Valve | OID 9 | -1 | 1/1/2000 | <Null> | 55 |

Continuous – auto-generated RID, line event has referent fields
1c - Add a line event using offsets from different features on a simple route [Mix and match point features that are/are not entered in the dReferentMethod domain]

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | Café | 3 | Water Valve | -1 |

![image1.png](../media/doc848_image1.png) ![image10.png](../media/doc848_image10.png) ![image12.png](../media/doc848_image12.png)

## Slide 27

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 4: event E1 as 1–4 and 4–7.](../media/doc848_slide27_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 1 to 7, before the split at measure 4.](../media/doc848_slide27_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From/To Referent Method | From/To ReferentID | From RefOffset | To RefOffset | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 1 | 7 | C1_Intersection | {Int333} | -3 | 3 | 1/1/2000 |  | 55 |

Continuous – auto-generated RID, line event has referent fields
1d - Add a line event using negative and positive offsets from an intersection on a simple route
Input
Expected Result

| Route Name | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| R1 | R1 & Rx | -3 | 3 |

R1

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png)

## Slide 28

![Measured route diagram drawn from the slide's own shapes, measures 0 to 7.](../media/doc848_slide28.svg)

| EventID | Route Name | From Measure | To Measure | From RefMethod | From RefID | From RefOffset | To RefMethod | ToR RefID | To RefOffset | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R2 | 2 | 5 | MilePost | 801 | -5 | Network | R2 | 5 | 1/1/2000 |  | 45 |
| Speed2 | R2 | 5.1 | 9 | Network | R2 | 5.1 | MilePost | 801 | 2 | 1/1/2000 |  | 45 |

Continuous – auto-generated RID, point events have referent fields
2 - Add multiple line events using a positive offset with direction from a point event on a gapped route (dif. measures on the ends). Input events will split since measure is different on both ends

| RouteName | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| R2 | 801 ( MilePost ) | W 5 | E 2 |

| EventID | Route Name | From Measure | To Measure | From RefMethod | From RefID | From RefOffset | To RefMethod | ToR RefID | To RefOffset | From Date | ToDate | Func . Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Func Class1 | R2 | 2 | 5 | MilePost | 801 | -5 | Network | R2 | 5 | 1/1/2000 |  | Minor |
| Func Class1 | R2 | 5.1 | 9 | Network | R2 | 5.1 | MilePost | 801 | 2 | 1/1/2000 |  | Minor |

![image8.png](../media/doc848_image8.png)

## Slide 29

![Measured route diagram drawn from the slide's own shapes, measures 0 to 7.](../media/doc848_slide29.svg)

| EventID | Route Name | From Measure | To Measure | From/To RefMethod | RefID | From RefOffset | To RefOffset | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R2 | 2 | 9 | MilePost | 801 | -5 | 2 | 1/1/2000 |  | Stop Sign |

Continuous – auto-generated RID, point events have referent fields
2a - Add multiple line events using a positive offset with direction from a point event on a gapped route (same measures on the ends). Input events will not split since measure is same on both ends

| RouteName | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| R2 | 801 ( MilePost ) | W 5 | E 2 |

| EventID | Route Name | Measure | To Measure | From/To RefMethod | RefID | From RefOffset | To RefOffset | From Date | ToDate | Func Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FuncClass1 | R2 | 2 | 9 | MilePost | 801 | -5 | 2 | 1/1/2000 |  | Minor Collector |

![image8.png](../media/doc848_image8.png)

## Slide 30

![Schematic redrawn from the slide's data: lollipop route R1 after the split at measure 2: event Speed1 as 1.5–2 and 2–2.5.](../media/doc848_slide30_fig2.svg)

Continuous – auto-generated RID, point events have referent fields
3 - Add a line event using a negative offset with a different unit from a point feature that is not added to dReferentMethod domain on a lollipop route

| Route Name | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| R3 | 2 (Café) | -800 meters | 800 m |

Point feature does not have M, so we use the smallest M at self intersection. In this test case, M is 2 (2,14). We can choose the measure when selecting the pt. feature

![Schematic redrawn from the slide's data: lollipop route R1, event Speed1 from measure 1.5 to 2.5, before the split at measure 2.](../media/doc848_slide30_fig1.svg)

| Event ID | Route Name | From Measure | To Measure | From/To Referent Method | From/To Referent ID | From Referent Offset | To Referent Offset | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R3 | 1.502903 | 2.497097 | C1 network | {R0003- | 1.502903 (mi) | 2.497097 (mi) | 1/1/2000 |  | 55 |

![image10.png](../media/doc848_image10.png)

## Slide 31

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 4: event E1 as 1–4 and 4–7.](../media/doc848_slide31_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 1 to 7, before the split at measure 4.](../media/doc848_slide31_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Referent Method | From ReferentID | From RefOffset | To Referent Method | To ReferentID | To RefOffset | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Speed1 | R1 | 1 | 7 | C1_Intersection | {Int333} | -1 | Network | R1 | 7 | 1/1/2000 |  | 55 |

Continuous – auto-generated RID, line event has referent fields
4 - Add a line event using From method of Location Offset and To method of Route and Measure
Input
Expected Result

| Route Name | From Point Layer Name | From Offset | To RouteID | To Measure |
| --- | --- | --- | --- | --- |
| R1 | R1 & Rx | -1 | R1 | 7 |

R1

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png)

## Slide 32

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 3: event E1 as 0–3 and 3–6.](../media/doc848_slide32_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 6, before the split at measure 3.](../media/doc848_slide32_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From/To Referent Method | From/To ReferentID | From RefOffset | To RefOffset | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SpeedOld | R1 | 0 | 6 | Network | R1 | 0 | 6 | 1/1/2000 | 1/1/2010 | 45 |
| SpeedOld | R1 | 0 | 1 | Network | R1 | 0 | 5 | 1/1/2010 |  | 45 |
| SpeedNew | R1 | 2 | 7 | C1_Intersection | {Int333} | 3 | 5 | 1/1/2010 |  | 55 |

Continuous – auto-generated RID, line event has referent fields
5 - Add a line event using positive offsets from an intersection on a simple route, check the retire overlaps option
Input
Expected Result

| Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| R1 | R1 & Rx | -1 | R1 &Rx | 5 |

R1
Blue event is new, orange event is existing

![image1.png](../media/doc848_image1.png) ![image6.png](../media/doc848_image6.png)

## Slide 33

![Schematic redrawn from the slide's data: lollipop route CS2 after the split at measure 6: event E1 as 2–6 and 6–10.](../media/doc848_slide33_fig2.svg)

Continuous - single field RID, 1 point event without referent fields
1 - Add a line event using a negative from offset from an intersection and a positive to offset on a lollipop route

| RouteID | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| CS2 | CS2 & CS599 | -4 | Cafe | 10 |

![Schematic redrawn from the slide's data: lollipop route CS2, event E1 from measure 2 to 10, before the split at measure 6.](../media/doc848_slide33_fig1.svg)

| EventID | Route ID | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CS2 | 2 | 10 | 1/1/2000 |  | 45 |

![image10.png](../media/doc848_image10.png) ![image6.png](../media/doc848_image6.png)

## Slide 34

![Schematic redrawn from the slide's data: loop route CS2 after the split at measure 5: event E1 as 1–5 and 5–9.](../media/doc848_slide34_fig2.svg)

Continuous - single field RID, 1 point event without referent fields
2 - Add a line event using offsets on a Loop route

| RouteID | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| CS2 | 1 (Café) | -9 | Cafe | -1 |

![Schematic redrawn from the slide's data: loop route CS2, event E1 from measure 1 to 9, before the split at measure 5.](../media/doc848_slide34_fig1.svg)

| EventID | Route ID | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CS2 | 1 | 9 | 1/1/2000 |  | 45 |

![image14.png](../media/doc848_image14.png) ![image10.png](../media/doc848_image10.png)

## Slide 35

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 4: event E1 as 1–4 and 4–7.](../media/doc848_slide35_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide35_fig3.svg)

Continuous – multi-field RID, point events do not have referent fields
1 - Add a line event using offsets with direction from a point event on a simple route

| RouteID | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| CM00A | 1093 (bridge) | S 1 km (there is no S, so it follows calibration direction) | N 5 km (there is no N, so it follows calibration direction) |

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 1 to 7, before the split at measure 4.](../media/doc848_slide35_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CM00A | 1 | 7 | 1/1/2000 |  | 45 |

![image1.png](../media/doc848_image1.png) ![image2.png](../media/doc848_image2.png)

## Slide 36

![Schematic redrawn from the slide's data: gapped route R1 after the split at measure 3: event E1 as 2–3 and 3–4.](../media/doc848_slide36_fig2.svg)

Continuous - multi-field RID, line events do not have referent fields
2 - Add multiple line events using offsets from a point feature on a gapped route (different measures on the ends)

| RouteID | Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| CM00B | 88 (Café) | -5 | -3 |

Use this case to sanity test a negative case: offset -1.95 but 5.05 is not on route

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CM00B | 2 | 4 | 1/1/2000 |  | 45 |

![Schematic redrawn from the slide's data: gapped route R1, event E1 from measure 2 to 4, before the split at measure 3.](../media/doc848_slide36_fig1.svg)

| EventID | Route Name | Measure | To Measure | From Date | ToDate | Func Class |
| --- | --- | --- | --- | --- | --- | --- |
| FuncClass1 | CM00B | 2 | 9 | 1/1/2000 |  | Minor Collector |

![image10.png](../media/doc848_image10.png)

## Slide 37

![Schematic redrawn from the slide's data: alpha route R1 after the split at measure 7.8: event E1 as 1–7.8 and 7.8–14.5.](../media/doc848_slide37_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide37_fig3.svg)

Continuous – multi-field RID, point events do not have referent fields
3 - Add a line event using offsets with direction from a point event on a alpha route

| RouteID | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| CM00A | 1093 (bridge) | -13 | 0.5 |

![Schematic redrawn from the slide's data: alpha route R1, event E1 from measure 1 to 14.5, before the split at measure 7.8.](../media/doc848_slide37_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CM00A | 1 | 14.5 | 1/1/2000 |  | 45 |

![image16.png](../media/doc848_image16.png) ![image2.png](../media/doc848_image2.png)

## Slide 38

![Interface screenshot redrawn as a standardized wireframe: 2 colour blocks, 2 icons, 4 text rows. Text inside a screenshot is pixels, so text rows render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc848_slide38_fig2.svg)

Continuous – multi-field RID, point events do not have referent fields
4 - Add a line event using offsets with direction from a point event on a simple route, check the Add to dominant route checkbox (CM00A is dom. Route, CM00B is selected)

| RouteID | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| CM00B (non dom. Route) | 1093 (bridge) | -1 | 5 |

![Diagram drawn from the slide's own shapes: 2 nodes (CM00A, CM00B), 2 connectors.](../media/doc848_slide38_fig1.svg)

| EventID | Route Name | From Measure | To Measure | From Date | ToDate | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Speed1 | CM00A | 1 | 7 | 1/1/2000 |  | 45 |

![image1.png](../media/doc848_image1.png) ![image2.png](../media/doc848_image2.png)

## Slide 39

![Diagram drawn from the slide's own shapes: 3 nodes (L1R1, L1R2), 3 connectors.](../media/doc848_slide39.svg)

| EventID | From Route Name | To Route Name | From Measure | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L1R1 | L1R1 | 3000 | 10000 | 1/1/2000 |  | Class 1 |

Line – Line event does not have referent fields
1 - Add a line event with no referent fields using a negative offset from a point event on a simple route

| From/To Route Name | Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| L1R1 | 1093 ( ILINote ) | -7000 | 0 |

Use this case to sanity test a negative case: offset a value that would fall on route L1R2

## Slide 40

![Diagram drawn from the slide's own shapes: 2 nodes (L2R1, L2R2), 6 connectors.](../media/doc848_slide40.svg)

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L2R1 | 3438.32 ft | L2R2 | 2460.63 ft | 1/1/2000 |  | Class 1 |

Line – some line events have referent fields, some do not
2 - Add multiple line events (with and without referent fields) using offsets from a point feature that is not added to dReferentMethod domain on a simple route

| From Route Name | To Route Name | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- | --- |
| L2R1 | L2R2 | 8 (Station) | -2 km | 0.75 km |

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | FromRef Method | From RefID | FromRef Offset | ToRef Method | To RefID | ToRef Offset | Inspect. Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inspection Range1 | L2R1 | 3438.32 ft | L2R2 | 2460.63 ft | 1/1/2000 |  | Line Network | L2R1 | 3438.32 ft | Line Network | L2R2 | 2460.63 ft | Visual Survey |

![image17.png](../media/doc848_image17.png)

## Slide 41

Line – some line events have referent fields, some do not
3 - Add a line event with referent fields using a positive offset with a direction and a different unit from a point event on a 3D multi-gapped route (different measures on the ends)

| From/To RouteName | Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| L3R1 | 1093 (anomaly) | W 1828.8m | E 2.286 km |

![Diagram drawn from the slide's own shapes: 2 nodes (L3R1, L3R2), 9 connectors.](../media/doc848_slide41.svg)

| EventID | From/To Route Name | From Measure | To Measure | From Referent Method | From ReferentID | From Referent Offset | To Referent Method | To ReferentID | To Referent Offset | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DOT Class1 | L3R2 | 4000 ft. | 5000 ft | Anomaly | 1093 | -1828.8 m | Engineering Network | L3R1 | 5000 m | 1/1/2000 |  | Class 2 |
| DOT Class1 | L3R2 | 6000 ft. | 11000 ft. | Engineering Network | L3R1 | 6000 m | Engineering Network | L3R1 | 11000 m | 1/1/2000 |  | Class 2 |
| DOT Class1 | L3R2 | 12000 ft. | 16000 ft. | Engineering Network | L3R1 | 12000 m | Engineering Network | L3R1 | 16000 m | 1/1/2000 |  | Class 2 |
| DOT Class1 | L3R2 | 17000 ft. | 17500 ft. | Engineering Network | L3R1 | 17000 m | Anomaly | 1093 | 2286 m | 1/1/2000 |  | Class 2 |

Also test this case when measures are the same across gaps. Only one event will be added

![image4.png](../media/doc848_image4.png)

## Slide 42

Line – some line events have referent fields, some do not
4 - Add line point events (with and without referent fields) offset with direction from a point feature that is added to dReferentMethod domain on a multi-gapped route (different measures on the ends)

| From/To Route Name | From Point Layer Name | From Offset | To Point Layer Name | To Offset |
| --- | --- | --- | --- | --- |
| L4R1 | 3 (Station) | 1000 | 4 (Station) | -3000 |

| EventID | From/To Route Name | From Measure | To Measure | From Referent Method | From ReferentID | From Referent Offset | To Referent Method | To ReferentID | To Referent Offset | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inspection Range1 | L3R2 | -4000 | -3000 | Station | 3 | 1000 | Engineering Network | L4R1 | -3000 | 1/1/2000 |  | Aerial Survey |
| Inspection Range1 | L3R2 | -2000 | 0 | Engineering Network | L4R1 | -2000 | Station | 4 | -3000 | 1/1/2000 |  | Aerial Survey |

![Diagram drawn from the slide's own shapes: 4 nodes (L4R1, L4R2), 9 connectors.](../media/doc848_slide42.svg)

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L3R2 | -4000 | L3R2 | -3000 | 1/1/2000 |  | Class 1 |
| DOTClass1 | L3R2 | -2000 | L3R2 | 0 | 1/1/2000 |  | Class 1 |

## Slide 43

![Schematic redrawn from the slide's data: branch route R1 after the split at measure 6: event E1 as 2–6 and 6–10.](../media/doc848_slide43_fig2.svg)

Line – some line events have referent fields, some do not
5 - Add a line event with offsets on a branch route

| From/To RouteName | Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| L5R1 | 6 (Station) | -4 | 4 |

![Schematic redrawn from the slide's data: branch route R1, event E1 from measure 2 to 10, before the split at measure 6.](../media/doc848_slide43_fig1.svg)

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L5R1 | 2 | L5R1 | 10 | 1/1/2000 |  | Class 1 |

![image19.png](../media/doc848_image19.png)

## Slide 44

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 10.1: event E1 as 4.7–10.1 and 10.1–15.4.](../media/doc848_slide44_fig2.svg)

Line – some line events have referent fields, some do not
6 - Add a line event with offsets on a barbell route

| From/To RouteName | From/To Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| L6R1 | Intersection | -5.3 | 5.4 |

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 4.7 to 15.4, before the split at measure 10.1.](../media/doc848_slide44_fig1.svg)

| EventID | From Route Name | From Measure | To Route Name | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClass1 | L6R1 | 4.7 | L6R1 | 15.4 | 1/1/2000 |  | Class 1 |

![image20.png](../media/doc848_image20.png) ![image6.png](../media/doc848_image6.png)

## Slide 45

![Diagram drawn from the slide's own shapes: 3 nodes (L1R1, L1R2), 5 connectors.](../media/doc848_slide45.svg)

| EventID | From Route Name | To Route Name | From Measure | To Measure | From Date | ToDate | DOT Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOTClassOld | L1R1 | L1R2 | 0 | 5000 | 1/1/2000 |  | Class 1 |

Line – Line event does not have referent fields
7 - Add a line event with no referent fields using a negative offset from a point event on a simple route, check Merge coincident events

| From/To Route Name | Point Layer Name | From Offset | To Offset |
| --- | --- | --- | --- |
| L1R1 | 1093 ( ILINote ) | -7000 | 0 |

Orange event is old, green event is new
Both events have same attributes
