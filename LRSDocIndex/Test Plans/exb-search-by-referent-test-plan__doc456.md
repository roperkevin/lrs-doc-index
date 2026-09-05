# ExB Search By Referent – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16462](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16462) |
| **Source** | [ExB_SearchbyReferent_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_SearchbyReferent_testplan.pptx>) |
| **Edited** | 2023-11-29 22:40 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "ExB Search By Referent – Test Plan"
source_file: "ExB_SearchbyReferent_testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_SearchbyReferent_testplan.pptx"
doc_id: 456
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: "Claire Wang"
dev: "1"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Claire Wang"
last_edited: "2023-11-29T22:40:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "offset", "route search", "experience builder widget", "positive test case", "negative test case", "route"]
tools: ["Route Search widget"]
products: ["Roads & Highways"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16462"]
related: [{"doc":241,"file":"add-point-events-by-offsetting-from-other-points-test-plan__doc241.md","s":4.414},{"doc":48,"file":"location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md","s":4.132},{"doc":476,"file":"search-by-referent-experience-builder-widget__doc476.md","s":4.1},{"doc":458,"file":"search-by-coordinate-method-in-route-search-widget-test-plan__doc458.md","s":3.896},{"doc":375,"file":"data-action-support-for-lrs-identify-widget-test-plan__doc375.md","s":3.84}]
```
-->

## Summary

Test plan for the Search By Referent feature in the Experience Builder Route Search widget. Covers configuration options, positive and negative test cases involving various route types, referent layers, offset values, and UI behaviors across browsers and layouts. Includes automation and documentation updates for the new referent search method.

## Related documents

<!-- related:begin -->
- [Add Point Events by offsetting from other points – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-point-events-by-offsetting-from-other-points-test-plan__doc241.md>) — similar text 0.25 · 1 filename word · same kind/folder <!-- rel:241 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/location-offset-method-in-add-point-and-add-line-widgets-test-plan__doc48.md>) — similar text 0.21 · same kind/surface/folder <!-- rel:48 -->
- [Search by Referent Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-referent-experience-builder-widget__doc476.md>) — similar text 0.32 · 2 title words · 2 filename words · same surface <!-- rel:476 -->
- [Search by Coordinate Method in Route Search Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-coordinate-method-in-route-search-widget-test-plan__doc458.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:458 -->
- [Data Action Support for LRS Identify widget– Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/data-action-support-for-lrs-identify-widget-test-plan__doc375.md>) — similar text 0.22 · 1 filename word · same kind/surface/pe/folder <!-- rel:375 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Route Search widget](https://www.google.com/search?q=%22Route%20Search%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — ExB Search By Referent – Test Plan

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16462

PE: Claire Wang
Dev:

## Slide 2

Data:

- Test with APRGCS and RH data
- Test with referent layers that are intersections, point events, and non LRS point features
- Test on Normal, Gapped, Complex (more on RH side), and Vertical (limited as ExB can’t view 3D) routes
- Test with positive and negative offset values
- Test time slicing
- Test where a single result will be returned as well as multiple results
- Test various offset units
- Test in different browsers (Chrome, Edge, (Firefox and Safari can be done through automation))
- Test deploying in tab and mobile layouts (UI testing and execute one or two test cases).
- Web testing in chrome and safari in mobile (use ExB provided screen size)
- 508 and i18n testing
- Test on different themes
Automation:
Add automation to the existing Route and Measure automation for this tool
Documentation:
Add to the existing Route and Measure widget documentation that covers this new method

## Slide 3

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 1 button, 15 text rows. 10 of 15 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc492_slide3.svg)

Configuration

- Verify additional options are available in the existing configuration widget
  - Add referent as one the methods (default is route and measure)
  - Allow the user choose the default network
  - Allow the user to choose the default referent layer
  - Allow the user to choose the display field for the referent layer
  - Allow the user to choose the unit of measure for the offset
Verification – tool pane

- Referents/Referent Offset is added to Route Search widget
- Network should be whatever network was configured in the backstage configuration
- User can change the network in the UI to any valid LRS networks in the map
- Any point layer can be chosen from Referent Layer dropdown
- Referent display field should be whatever is configured in the backstage
- Referent field has intellisense when typing
- The offset is optional; if it’s left empty, treat as 0
- No picker for Referent – users can only type

![image1.png](../media/doc492_image1.png)

### Notes

Note: The button for the map interaction with the Referent field can be removed

## Slide 4

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc492_slide4.svg)

Verification – tool pane

- If the referent and/or offset value are invalid, provide a message that the values provided aren’t valid
- If a required field is missing, provide an error message and a red box when users click search (double check when the other methods are developed to keep consistency)
- When the user clicks search do the following:
  - Find all the routes/measures that are present at that referent/offset and return them in the results
  - Transition the widget to a results pane that shows the route(s)/measure(s) that are returned by the search
  - Show scrollbar when result pane is too long
  - Paging experience when result has many pages – very rare but test once
  - If no route/measure is present at the referent/offset, let the user know that no route/measure was found

![image2.png](../media/doc492_image2.png)

## Slide 5 — Positive cases

  - RH
  - Normal route - A positive offset from LRS intersection and return one result
  - Normal route - A 0 offset from LRS intersection and return multiple results
  - Gapped route - A negative offset from LRS intersection and return multiple results
  - Loop – A 0 offset from LRS intersection and return multiple results
  - Lollipop - A positive offset from point event and return multiple results
  - Alpha - A negative offset from point event and return one result
  - Branch - A positive offset from NonLRS point layer and return multiple results
  - Vertical - A 0 offset from NonLRS point layer and return one result
  - Concurrent Normal - A positive offset from intersection and return multiple results
    - Concurrent Normal - A positive offset from intersection and return fewer results because a route does not exist in the map time
  - Concurrent Loop and Lollipop - A 0 offset from point event and return multiple results

## Slide 6 — Positive cases

  - APRGCS
  - Normal route - A positive offset from LRS intersection and return one result
  - Normal route - A 0 offset from point event and return multiple results
  - Gapped route - A negative offset from point event and return multiple results
  - Concurrent Normal - A positive offset from point event and return multiple results
  - Concurrent Vertical Gapped routes - A negative offset from NonLRS point layer and return  fewer results because a route does not exist in the map time

Negative cases

  - Invalid referent value
  - Invalid offset value
  - No result at the input referent/offset

## Slide 7 — Positive 1: Normal route - A positive offset from LRS intersection and return one result

Input: 5
Output: R1 (5)
Positive 2: Normal route - A 0 offset from LRS intersection and return multiple results
Input: 0
Output: R1 (0); R2 (0.5)
Positive 3: Gapped route - A negative offset from LRS intersection and return multiple results
Input: -0.5
Output: R3 (4.5); R4 (0)

[figure: R1 · R2 · 0 · 10 · 1 · R4 · 5 · R3]

![image3.png](../media/doc492_image3.png) ![image5.png](../media/doc492_image5.png)

## Slide 8 — Positive 4: Loop – A 0 offset from LRS intersection and return multiple results

![Diagram drawn from the slide's own shapes: 2 nodes, 1 connector.](../media/doc492_slide8.svg)

Input: 0
Output: R5 (0); R5 (30); R6 (2.5)
Input: 5
Output: R7 (10); R7 (40)
Positive 5: Lollipop - A positive offset from point event and return multiple results

![image7.png](../media/doc492_image7.png) ![image5.png](../media/doc492_image5.png) ![image3.png](../media/doc492_image3.png)

## Slide 9 — Positive 6: Alpha - A negative offset from point event and return one result

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc492_slide9.svg)

Positive 7: Branch - A positive offset from NonLRS point layer and return multiple results

Input: -6 (point event is at measure 30)
Output: R8 (24) (should not return R8 (0))

Input: 6
Output: R9 (12); R9 (24)

![image7.png](../media/doc492_image7.png) ![image5.png](../media/doc492_image5.png)

## Slide 10 — Positive 8: Vertical - A 0 offset from NonLRS point layer and return one result

Positive 9: Concurrent Normal - A positive offset from intersection and return multiple results
Input: 0
Output: R10 (4)

Input: 5 (map time 2010)
Output: R11a (5); R11b (5); R12 (5)
Positive 9b: Concurrent Normal - A positive offset from intersection and return fewer results because a route does not exist in the map time
Use routes above, set map time to current date
Input: 5
Output: R11a (5); R12 (5)

[figure: R10 · 0 · 10 · R11a 2000-null · R11b 2000-2020 · R12 2000-null]

![image5.png](../media/doc492_image5.png) ![image3.png](../media/doc492_image3.png)

## Slide 11 — Positive 10: Loop – Concurrent Loop and Lollipop - A 0 offset from point event and return multiple results

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc492_slide11.svg)

Input: 0
Output: R13a (10); R13a (40); R13b (0); R13b (30)

![image9.png](../media/doc492_image9.png) ![image7.png](../media/doc492_image7.png) ![image5.png](../media/doc492_image5.png)

## Slide 12 — Positive 1: Normal route - A positive offset from LRS intersection and return one result

Input: 5
Output: L1R1 (5)
Positive 2: Normal route - A 0 offset from point event and return multiple results
Input: 5
Output: L1R1 (0); L1R2 (0.5)
Positive 3: Gapped route - A negative offset from point event and return multiple results
Input: -1
Output: L2R1 (4); L3R1 (0)

[figure: L1R1 · L1R2 · 0 · 10 · 1 · L3R1 · 5 · L2R1]

![image3.png](../media/doc492_image3.png) ![image5.png](../media/doc492_image5.png)

## Positive 4: Concurrent Normal - A Positive Offset From Point Event and Return Multiple Results <!-- slide 13 -->

### Input: 5 Output: L5R1 (5); L6R1 (5); L7R1 (5)

Positive 6: Concurrent Vertical routes - A negative offset from NonLRS point layer and return multiple results

Input: -8 (point at L8R1 (8) and L9R1 (190)
Output: R14a (0); R14b (182)

[figure: L5R1 · L6R1 · L7R1 · 0 · 10 · L9R1 2000-2020 · L8R1 2000-null · 100 · 200 · 150]

![image5.png](../media/doc492_image5.png)

## Slide 14 — Negative 1: Invalid referent value

Negative 2: Invalid offset value
Negative 3: No result at the input referent/offset
Input: 500
Output: message provided by dev
Input: 5 from qignjkero
Output: message provided by dev
Input: %##^* from an intersection
Output: message provided by dev

[figure: R1 · R2 · 0 · 10 · 1]

![image3.png](../media/doc492_image3.png)
