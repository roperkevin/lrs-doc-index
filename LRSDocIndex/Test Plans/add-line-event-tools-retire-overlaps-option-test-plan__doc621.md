# Add Line Event Tools: Retire Overlaps Option Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#3917](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3917) |
| **Source** | [3917-AddLineEventsRetireOverlapsOption_TestPlan_V3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/3917-AddLineEventsRetireOverlapsOption_TestPlan_V3.pptx>) |
| **Edited** | 2022-10-24 18:54 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Line Event Tools: Retire Overlaps Option Test Plan"
source_file: "3917-AddLineEventsRetireOverlapsOption_TestPlan_V3.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/3917-AddLineEventsRetireOverlapsOption_TestPlan_V3.pptx"
doc_id: 621
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V3"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-10-24T18:54:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "retire overlaps", "overlapping events", "route types", "time slices", "event editing", "measure overlap"]
tools: ["Add Line Event"]
products: []
issues: ["ArcGISPro/ps-location-referencing#3917"]
related: [{"doc":664,"file":"retire-overlaps-option-in-add-events-tools-in-pro__doc664.md","s":5.443},{"doc":457,"file":"experience-builder-add-multiple-line-events-widget-test-plan__doc457.md","s":4.908},{"doc":618,"file":"add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md","s":4.868},{"doc":231,"file":"add-line-events-by-offsetting-from-other-points-test-plan__doc231.md","s":4.723},{"doc":528,"file":"reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md","s":4.135}]
```
-->

## Summary

Test plan for the Add Line Event tools focusing on the retire overlaps option. It covers positive and negative test cases involving overlapping line events on various route types including gapped, loops, lollipop, alpha, branch, and vertical routes. The plan verifies correct behavior of the retireMeasureOverlap parameter in LRS Apply Edits and UI functionality of the retire overlaps checkbox.

## Related documents

<!-- related:begin -->
- [Retire Overlaps Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/retire-overlaps-option-in-add-events-tools-in-pro__doc664.md>) — similar text 0.16 · 5 title words · 3 filename words · same surface <!-- rel:664 -->
- [Experience Builder: Add Multiple Line Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-multiple-line-events-widget-test-plan__doc457.md>) — similar text 0.40 · 2 title words · 3 filename words · same kind/folder <!-- rel:457 -->
- [Add Line Event Tools – Intersection Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md>) — similar text 0.22 · 4 title words · 2 filename words · same kind/folder <!-- rel:618 -->
- [Add Line Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-events-by-offsetting-from-other-points-test-plan__doc231.md>) — similar text 0.18 · 2 title words · 3 filename words · same kind/surface/folder <!-- rel:231 -->
- [Reassign - Transfer to Another Line with StayPut and Retire Event Behavior - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-transfer-to-another-line-with-stayput-and-retire-event-behavior-test__doc528.md>) — similar text 0.18 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:528 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Add Line Event Tools: Retire Overlaps Option

| Notes |
| --- |
| Test with spanning and non-spanning line events Test with overlapping measures with and without time slices Test on normal and complex routes (gapped, loops, lollipop, alpha, branch, and vertical) Common workflow will be creating new events upon existing events, but overlapping segments will retire without the user having to manually retire potential overlapping events Test cases will alternate between single or multiple line events addition If the option is selected, for any new event(s) added via the tools, the “ retireMeasureOverlap ” parameter in LRS Apply Edits should be marked as true As per the test plan discussion, only simple tests will be tested due to this functionality being an existing and thoroughly-tested functionality of Event Editor. If any simple test cases deviate from the exact result in Event Editor, then all test cases will be tested to ensure everything works as intended. Because of this, test cases will be split into tested and not-tested categories. Rather than remove these cases from the test plan, they will remain to preserve expected outcomes for the tool. Test cases that have not been tested will be noted with a strikethrough and their corresponding graphic headers will be gray in color. |

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 3 buttons, 4 colour blocks, 4 icons, 24 text rows. 23 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc312_slide2.svg)

![image1.png](../media/doc312_image1.png) ![image2.png](../media/doc312_image2.png)

## Slide 3

| Positive Tests |
| --- |
| Add line event with overlapping section that spans the entire existing event Add multiple line events with overlapping sections that spans a portion of the existing event Add line event with overlapping section that begins at the From Measure of the existing event but does not cover the entire length Add multiple line events with overlapping sections that ends at the To Measure of the existing event but does not cover the entire length Add spanning line event with overlapping section that spans a portion of another spanning line event Add multiple spanning line events that exceeds the From and To Measure of existing event Add line event that spans an existing line event with multiple time slices 7A. Add line event with same From Date as first event in overlapping section with multiple time slices 7B. Add line event with From Date before the first event in overlapping section with multiple time slices Add line event that covers many existing line events of different measures along route Add line event on gapped route that overlaps partially with existing event Add multiple line events on loop route that overlaps partially with existing event Add line event on lollipop route that overlaps with portion of route that intersects itself Add line event on lollipop route that overlaps with portion of route that intersects itself (with different z-values) Add line event on alpha route that overlaps portion of route that intersects itself Add line event on alpha route that overlaps portion of route that intersects itself (with different z-values) Add line event on branch route that overlaps each branch Add multiple line events on branch route that spans only the first branch of route Add line event on vertical route that spans the entire overlapping section Add line event on vertical route with bend that spans only from the From Measure to a portion of the existing event Add line event on vertical route with bend that spans only from a portion of the existing event to the existing event’s To Measure |

| Positive Tests: UI |
| --- |
| Ensure “Retire overlaps” checkbox option is formatted correctly with other aspects of the Add Line Event(s) tool. Ensure checking and unchecking the checkbox correctly selects and deselects the option. Ensure the retire overlaps checkbox works with pressing the Tab key. |

| Negative Tests: Error |
| --- |
| Add line event with no time overlap with the retire overlaps checkbox checked. No change should happen due to each event residing in different time slices Add line event that is temporally before the existing event. No change should happen to the existing event due to each event residing in different time slices |

## Case 1 <!-- slide 4 -->

### Add Line Event with Overlapping Section That Spans the

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 2: event E1 as 0–2 and 2–4.](../media/doc312_slide4_fig2.svg)

**Add line event with overlapping section that spans the entire existing event**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 4, before the split at measure 2.](../media/doc312_slide4_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | Null | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 0 | 4 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 0 | 4 | Paved |

![image3.png](../media/doc312_image3.png)

## Case 2 <!-- slide 5 -->

### Add Multiple Line Events with Overlapping Sections That

**Add multiple line events with overlapping sections that spans a portion of the existing event**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide5.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | Null | 0 | 4 | Gravel |
| SpeedLimit | Event C | Route1 | 1/1/2005 | Null | 0 | 6 | 25 |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 1 | 3 | Paved |
| SpeedLimit | Event D | Route1 | 1/1/2010 | Null | 1 | 3 | 45 |

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| RoadType | Event A | Route1 | 1/1/2010 | Null | 0 | 1 | Gravel |
| SpeedLimit | Event C | Route1 | 1/1/2010 | Null | 0 | 1 | 25 |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 1 | 3 | Paved |
| SpeedLimit | Event D | Route1 | 1/1/2010 | Null | 1 | 3 | 45 |
| SpeedLimit | Event C | Route1 | 1/1/2005 | 1/1/2010 | 0 | 6 | 25 |
| RoadType | Event A | Route1 | 1/1/2010 | Null | 3 | 4 | Gravel |
| SpeedLimit | Event C | Route1 | 1/1/2010 | Null | 3 | 6 | 25 |

Expected:

![image3.png](../media/doc312_image3.png)

## Case 3 <!-- slide 6 -->

### Add Line Event with Overlapping Section That Begins at the

**Add line event with overlapping section that begins at the From Measure of the existing event but does not cover the entire length**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide6.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | Null | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 0 | 3 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 0 | 3 | Paved |
| RoadType | Event A | Route1 | 1/1/2010 | Null | 3 | 4 | Gravel |

![image3.png](../media/doc312_image3.png)

## Case 4 <!-- slide 7 -->

### Add Multiple Line Events with Overlapping Sections That Ends

**Add multiple line events with overlapping sections that ends at the To Measure of the existing event but does not cover the entire length**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide7.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | Null | 0 | 4 | Gravel |
| SpeedLimit | Event C | Route1 | 1/1/2005 | Null | 0 | 4 | 25 |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 2 | 4 | Paved |
| SpeedLimit | Event D | Route1 | 1/1/2010 | Null | 2 | 4 | 45 |

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2010 | Null | 0 | 2 | Gravel |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| SpeedLimit | Event C | Route1 | 1/1/2010 | Null | 0 | 2 | 25 |
| SpeedLimit | Event C | Route1 | 1/1/2005 | 1/1/2010 | 0 | 4 | 25 |
| RoadType | Event B | Route1 | 1/1/2010 | Null | 2 | 4 | Paved |
| SpeedLimit | Event D | Route1 | 1/1/2010 | Null | 2 | 4 | 45 |

Expected:

![image3.png](../media/doc312_image3.png)

## Case 5 <!-- slide 8 -->

### Add Spanning Line Event with Overlapping Section That Spans

**Add spanning line event with overlapping section that spans a portion of another spanning line event**

![Diagram drawn from the slide's own shapes: 2 nodes (L1 R2, L1), 1 connector.](../media/doc312_slide8_fig1.svg)

| Event Layer | EventID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | Route2 | 1/1/2000 | Null | 4 | 4 | Gravel |

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide8_fig2.svg)

| Event Layer | EventID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event B | Route1 | Route 2 | 1/1/2010 | Null | 5 | 2 | Paved |

| Event Layer | EventID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | Route1 | 1/1/2010 | Null | 4 | 5 | Gravel |
| Road Type | Event A | Route1 | Route2 | 1/1/2000 | 1/1/2010 | 4 | 4 | Gravel |
| Road Type | Event B | Route1 | Route2 | 1/1/2010 | Null | 5 | 2 | Paved |
| Road Type | Event A | Route2 | Route2 | 1/1/2010 | Null | 2 | 4 | Gravel |

![image4.png](../media/doc312_image4.png) ![image5.png](../media/doc312_image5.png) ![image6.png](../media/doc312_image6.png)

## Case 6 <!-- slide 9 -->

### Add Multiple Spanning Line Events That Exceeds the From and

**Add multiple spanning line events that exceeds the From and To Measure of existing event**

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc312_slide9_fig1.svg)

| Event Layer | EventID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event B | Route1 | Route 2 | 1/1/2010 | Null | 1 | 5 | Paved |
| Speed Limit | Event D | Route 1 | Route 2 | 1/1/2010 | Null | 1 | 5 | 45 |

| Event Layer | EventID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | Route1 | 1/1/2000 | 1/1/2010 | 5 | 3 | Gravel |
| Speed Limit | Ev ent C | Route1 | Route2 | 1/1/2005 | 1/1/2010 | 2 | 1 | 25 |
| Road Type | Event B | Route1 | Route2 | 1/1/2010 | Null | 1 | 5 | Paved |
| Speed Limit | Event D | Route 1 | Route2 | 1/1/2010 | Null | 1 | 5 | 45 |

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc312_slide9_fig2.svg)

| Event Layer | Event ID | From RouteID | To RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | Route2 | 1/1/2000 | Null | 5 | 3 | Gravel |
| Speed Limit | Event C | Route1 | Route2 | 1/1/2005 | Null | 2 | 1 | 25 |

![image4.png](../media/doc312_image4.png) ![image5.png](../media/doc312_image5.png) ![image6.png](../media/doc312_image6.png)

## Case 7 <!-- slide 10 -->

### Add Line Event That Spans an Existing Line Event with

**Add line event that spans an existing line event with multiple time slices**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide10.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 6 | Gravel |
| Road Type | Event A | Route1 | 1/1/2005 | 1/1/2010 | 2 | 6 | Gravel |
| Road Type | Event B | Route1 | 1/1/2005 | Null | 0 | 2 | Dirt |
| Road Type | Event A | Route1 | 1/1/2010 | 1/1/2015 | 4 | 6 | Gravel |
| Road Type | Event C | Route1 | 1/1/2010 | Null | 2 | 4 | Chip |
| Road Type | Event D | Route1 | 1/1/2015 | Null | 4 | 6 | Paved |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event E | Route1 | 1/1/2020 | Null | 0 | 6 | Asphalt |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 6 | Gravel |
| Road Type | Event A | Route1 | 1/1/2005 | 1/1/2010 | 2 | 6 | Gravel |
| Road Type | Event B | Route1 | 1/1/2005 | 1/1/2020 | 0 | 2 | Dirt |
| Road Type | Event A | Route1 | 1/1/2010 | 1/1/2015 | 4 | 6 | Gravel |
| Road Type | Event C | Route1 | 1/1/2010 | 1/1/2020 | 2 | 4 | Chip |
| Road Type | Event D | Route1 | 1/1/2015 | 1/1/2020 | 4 | 6 | Paved |
| Road Type | Event E | Route1 | 1/1/2020 | Null | 0 | 6 | Asphalt |

![image5.png](../media/doc312_image5.png)

## Slide 11

7A. Add line event with From Date before existing events with time slices

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide11.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 6 | Gravel |
| Road Type | Event A | Route1 | 1/1/2005 | 1/1/2010 | 2 | 6 | Gravel |
| Road Type | Event B | Route1 | 1/1/2005 | Null | 0 | 2 | Dirt |
| Road Type | Event A | Route1 | 1/1/2010 | 1/1/2015 | 4 | 6 | Gravel |
| Road Type | Event C | Route1 | 1/1/2010 | Null | 2 | 4 | Chip |
| Road Type | Event D | Route1 | 1/1/2015 | Null | 4 | 6 | Paved |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event E | Route1 | 1/1/2000 | Null | 0 | 8 | Asphalt |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event E | Route1 | 1/1/2000 | Null | 0 | 8 | Asphalt |

![image5.png](../media/doc312_image5.png)

## Slide 12

7B.    Add line event with From Date before the first event in overlapping section with multiple time slices

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide12.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 6 | Gravel |
| Road Type | Event A | Route1 | 1/1/2005 | 1/1/2010 | 2 | 6 | Gravel |
| Road Type | Event B | Route1 | 1/1/2005 | Null | 0 | 2 | Dirt |
| Road Type | Event A | Route1 | 1/1/2010 | 1/1/2015 | 4 | 6 | Gravel |
| Road Type | Event C | Route1 | 1/1/2010 | Null | 2 | 4 | Chip |
| Road Type | Event D | Route1 | 1/1/2015 | Null | 4 | 6 | Paved |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event E | Route1 | 1/1/1995 | Null | 0 | 8 | Asphalt |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Road Type | Event E | Route1 | 1/1/1995 | Null | 0 | 8 | Asphalt |

![image5.png](../media/doc312_image5.png)

## Case 8 <!-- slide 13 -->

### Add Line Event That Covers Many Existing Line Events of

**Add line event that covers many existing line events of different measures along route on a line network**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide13.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | Null | 0 | 4 | Gravel |
| RoadType | Event C | Route1 | 1/1/2005 | Null | 1 | 3 | Paved |
| RoadType | Event D | Route1 | 1/1/2010 | Null | 5 | 7 | Dirt |
| RoadType | Event E | Route1 | 1/1/2015 | Null | 1 | 7 | Concrete |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2020 | Null | 0 | 8 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2020 | 0 | 4 | Gravel |
| RoadType | Event C | Route1 | 1/1/2005 | 1/1/2020 | 1 | 3 | Paved |
| RoadType | Event D | Route1 | 1/1/2010 | 1/1/2020 | 5 | 7 | Dirt |
| RoadType | Event E | Route1 | 1/1/2015 | 1/1/2020 | 1 | 7 | Concrete |
| RoadType | Event B | Route1 | 1/1/2020 | Null | 0 | 8 | Paved |

![image3.png](../media/doc312_image3.png)

## Case 9 <!-- slide 14 -->

### Add Line Event on Gapped Route That Overlaps Partially with

**Add line event on gapped route that overlaps partially with existing event**

![Diagram drawn from the slide's own shapes: 2 nodes (R2, R2), 2 connectors.](../media/doc312_slide14_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route2 | 1/1/2010 | Null | 6 | 9 | Paved |

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide14_fig2.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route2 | 1/1/2010 | Null | 4 | 6 | Gravel |
| RoadType | Event A | Route2 | 1/1/2000 | 1/1/2010 | 4 | 8 | Gravel |
| RoadType | Event B | Route2 | 1/1/2010 | Null | 6 | 9 | Paved |

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route2 | 1/1/2000 | Null | 4 | 8 | Gravel |

![image7.png](../media/doc312_image7.png)

## Case 10 <!-- slide 15 -->

### Add Multiple Line Events on Loop Route That Overlaps

**Add multiple line events on loop route that overlaps partially with existing event**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide15.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route11 | 1/1/2000 | Null | 1 | 4 | Gravel |
| Speed Limit | Event C | Route11 | 1/1/2005 | Null | 1 | 5 | 25 |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route11 | 1/1/2010 | Null | 0 | 3 | Paved |
| SpeedLimit | Event D | Route11 | 1/1/2010 | Null | 0 | 3 | 45 |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route11 | 1/1/2000 | 1/1/2010 | 1 | 4 | Gravel |
| SpeedLimit | Event C | Route11 | 1/1/2005 | 1/1/2010 | 1 | 5 | 25 |
| RoadType | Event B | Route11 | 1/1/2010 | Null | 0 | 3 | Paved |
| SpeedLimit | Event D | Route11 | 1/1/2010 | Null | 0 | 3 | 45 |
| RoadType | Event A | Route11 | 1/1/2010 | Null | 3 | 4 | Gravel |
| SpeedLimit | Event C | Route11 | 1/1/2010 | Null | 3 | 5 | 25 |

![image8.png](../media/doc312_image8.png)

## Case 11 <!-- slide 16 -->

### Add Line Event on Lollipop Route That Overlaps with Portion

**Add line event on lollipop route that overlaps with portion of route that intersects itself**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide16.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route13 | 1/1/2000 | Null | 10 | 14 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route13 | 1/1/2010 | Null | 11 | 13 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route13 | 1/1/2000 | Null | 10 | 11 | Gravel |
| RoadType | Event A | Route13 | 1/1/2000 | 1/1/2010 | 10 | 14 | Gravel |
| RoadType | Event B | Route13 | 1/1/2010 | Null | 11 | 13 | Paved |
| RoadType | Event A | Route13 | 1/1/2010 | Null | 13 | 14 | Gravel |

![image9.png](../media/doc312_image9.png)

## Case 12 <!-- slide 17 -->

### Add Line Event on Lollipop Route That Overlaps with Portion

**Add line event on lollipop route that overlaps with portion of route that intersects itself (with different z-values)**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide17.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route13 | 1/1/2000 | Null | 10 | 14 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route13 | 1/1/2010 | Null | 11 | 13 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route13 | 1/1/2000 | Null | 10 | 11 | Gravel |
| RoadType | Event A | Route13 | 1/1/2000 | 1/1/2010 | 10 | 14 | Gravel |
| RoadType | Event B | Route13 | 1/1/2010 | Null | 11 | 13 | Paved |
| RoadType | Event A | Route13 | 1/1/2010 | Null | 13 | 14 | Gravel |

z-value at 0 measure: 0
z-value at 12 measure: 5
z-value at 0 measure: 0
z-value at 12 measure: 5

![image9.png](../media/doc312_image9.png)

## Case 13 <!-- slide 18 -->

### Add Line Event on Alpha Route That Overlaps Portion of Route

![Schematic redrawn from the slide's data: alpha route R1 after the split at measure 2: event E1 as 0–2 and 2–4.](../media/doc312_slide18_fig2.svg)

**Add line event on alpha route that overlaps portion of route that intersects itself**

![Schematic redrawn from the slide's data: alpha route R1, event E1 from measure 0 to 4, before the split at measure 2.](../media/doc312_slide18_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route16 | 1/1/2000 | Null | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route16 | 1/1/2010 | Null | 1 | 3 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route16 | 1/1/2010 | Null | 0 | 1 | Gravel |
| RoadType | Event A | Route16 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| RoadType | Event B | Route16 | 1/1/2010 | Null | 1 | 3 | Paved |
| RoadType | Event A | Route16 | 1/1/2010 | Null | 3 | 4 | Gravel |

![image10.png](../media/doc312_image10.png)

## Case 14 <!-- slide 19 -->

### Add Line Event on Alpha Route That Overlaps Portion of Route

![Schematic redrawn from the slide's data: alpha route R1 after the split at measure 2: event E1 as 0–2 and 2–4.](../media/doc312_slide19_fig2.svg)

**Add line event on alpha route that overlaps portion of route that intersects itself (with different z-values)**

![Schematic redrawn from the slide's data: alpha route R1, event E1 from measure 0 to 4, before the split at measure 2.](../media/doc312_slide19_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route16 | 1/1/2000 | Null | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route16 | 1/1/2010 | Null | 1 | 3 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route16 | 1/1/2010 | Null | 0 | 1 | Gravel |
| RoadType | Event A | Route16 | 1/1/2000 | 1/1/2010 | 0 | 4 | Gravel |
| RoadType | Event B | Route16 | 1/1/2010 | Null | 1 | 3 | Paved |
| RoadType | Event A | Route16 | 1/1/2010 | Null | 3 | 4 | Gravel |

z-value at 2 measure: 0
z-value at 14 measure: 5
z-value at 2 measure: 0
z-value at 14 measure: 5

![image10.png](../media/doc312_image10.png)

## Case 15 <!-- slide 20 -->

### Add Line Event on Branch Route That Overlaps Each Branch

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide20.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route17 | 1/1/2000 | Null | 0 | 5 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route17 | 1/1/2010 | Null | 1 | 6 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route17 | 1/1/2000 | 1/1/2010 | 0 | 5 | Gravel |
| RoadType | Event A | Route17 | 1/1/2010 | Null | 0 | 1 | Gravel |
| RoadType | Event B | Route17 | 1/1/2010 | Null | 1 | 6 | Paved |

![image11.png](../media/doc312_image11.png)

## Case 16 <!-- slide 21 -->

### Add Multiple Line Events on Branch Route That Spans Only the

**Add multiple line events on branch route that spans only the first branch of route**

![Measured route diagram drawn from the slide's own shapes.](../media/doc312_slide21.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route17 | 1/1/2000 | Null | 0 | 5 | Gravel |
| SpeedLimit | Event C | Route17 | 1/1/2005 | Null | 0 | 5 | 25 |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route17 | 1/1/2010 | Null | 1 | 4 | Paved |
| SpeedLimit | Event D | Route17 | 1/1/2010 | Null | 1 | 4 | 45 |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route17 | 1/1/2010 | Null | 0 | 1 | Gravel |
| SpeedLimit | Event C | Route17 | 1/1/2010 | Null | 0 | 1 | 25 |
| RoadType | Event A | Route17 | 1/1/2000 | 1/1/2010 | 0 | 5 | Gravel |
| SpeedLimit | Event C | Route17 | 1/1/2005 | 1/1/2010 | 0 | 5 | 25 |
| RoadType | Event B | Route17 | 1/1/2010 | Null | 1 | 4 | Paved |
| SpeedLimit | Event D | Route17 | 1/1/2010 | Null | 1 | 4 | 45 |
| RoadType | Event A | Route17 | 1/1/2010 | Null | 4 | 5 | Gravel |
| SpeedLimit | Event C | Route17 | 1/1/2010 | Null | 4 | 5 | 25 |

![image11.png](../media/doc312_image11.png)

## Case 17 <!-- slide 22 -->

### Add Line Event on Vertical Route That Spans the Entire

![Schematic redrawn from the slide's data: vertical route R1 after the split at measure 4.5: event E1 as 1–4.5 and 4.5–8.](../media/doc312_slide22_fig2.svg)

**Add line event on vertical route that spans the entire overlapping section**

![Schematic redrawn from the slide's data: vertical route R1, event E1 from measure 1 to 8, before the split at measure 4.5.](../media/doc312_slide22_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2000 | Null | 1 | 8 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 0 | 10 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2000 | 1/1/2010 | 1 | 8 | Gravel |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 0 | 10 | Paved |

![image12.png](../media/doc312_image12.png)

## Case 18 <!-- slide 23 -->

### Add Line Event on Vertical Route with Bend That Spans Only

![Schematic redrawn from the slide's data: vertical route R1 after the split at measure 4.5: event E1 as 1–4.5 and 4.5–8.](../media/doc312_slide23_fig2.svg)

**Add line event on vertical route with bend that spans only from the From Measure to a portion of the existing event**

![Schematic redrawn from the slide's data: vertical route R1, event E1 from measure 1 to 8, before the split at measure 4.5.](../media/doc312_slide23_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2000 | Null | 1 | 8 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 0 | 6 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2000 | 1/1/2010 | 1 | 8 | Gravel |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 0 | 6 | Paved |
| RoadType | Event A | Route23 | 1/1/2010 | Null | 6 | 8 | Gravel |

![image12.png](../media/doc312_image12.png)

## Case 19 <!-- slide 24 -->

### Add Line Event on Vertical Route with Bend That Spans Only

![Schematic redrawn from the slide's data: vertical route R1 after the split at measure 4.5: event E1 as 1–4.5 and 4.5–8.](../media/doc312_slide24_fig2.svg)

**Add line event on vertical route with bend that spans only from a portion of the existing event to the existing event’s To Measure**

![Schematic redrawn from the slide's data: vertical route R1, event E1 from measure 1 to 8, before the split at measure 4.5.](../media/doc312_slide24_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2000 | Null | 1 | 8 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 6 | 10 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route23 | 1/1/2010 | Null | 1 | 6 | Gravel |
| RoadType | Event B | Route23 | 1/1/2010 | Null | 6 | 10 | Paved |
| RoadType | Event A | Route23 | 1/1/2000 | 1/1/2010 | 1 | 8 | Gravel |

![image12.png](../media/doc312_image12.png)

## Case 1 <!-- slide 25 -->

### Add Line Event with No Time Overlap with the Retire Overlaps

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 2: event E1 as 0–2 and 2–4.](../media/doc312_slide25_fig2.svg)

**Add line event with no time overlap with the retire overlaps checkbox checked**

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 4, before the split at measure 2.](../media/doc312_slide25_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2006 | Null | 0 | 4 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2000 | 1/1/2005 | 0 | 4 | Gravel |
| RoadType | Event B | Route1 | 1/1/2006 | Null | 0 | 4 | Paved |

No temporal overlap, To Date for existing event is not changed

![image3.png](../media/doc312_image3.png)

## Case 2 <!-- slide 26 -->

### Add Line Event That Is Temporally Before the Existing Event

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 2: event E1 as 0–2 and 2–4.](../media/doc312_slide26_fig2.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 4, before the split at measure 2.](../media/doc312_slide26_fig1.svg)

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2005 | Null | 0 | 4 | Gravel |

Existing:
Input:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event B | Route1 | 1/1/2000 | 1/1/2004 | 0 | 4 | Paved |

Expected:

| Event Layer | EventID | From RouteID | From Date | To Date | From Measure | To Measure | Extra Attribute |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RoadType | Event A | Route1 | 1/1/2005 | Null | 0 | 4 | Gravel |
| RoadType | Event B | Route1 | 1/1/2000 | 1/1/2004 | 0 | 4 | Paved |

No temporal overlap, To Date for existing event is not changed

![image3.png](../media/doc312_image3.png)
