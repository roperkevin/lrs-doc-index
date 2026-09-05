# Update Measures From LRS: Support Events and Intersections

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#3882](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3882) · [ArcGISPro/ps-location-referencing#3881](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3881) |
| **Source** | [UpdateMeasureFromLRS_Events-Intersections_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/UpdateMeasureFromLRS_Events-Intersections_TestPlanV1.pptx>) |
| **Edited** | 2024-11-25 21:24 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Measures From LRS: Support Events and Intersections"
source_file: "UpdateMeasureFromLRS_Events-Intersections_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/UpdateMeasureFromLRS_Events-Intersections_TestPlanV1.pptx"
doc_id: 277
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Praveen Kumar"
last_edited: "2024-11-25T21:24:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["events", "intersections", "measure update", "route", "linear referencing"]
tools: ["Update Measures from LRS"]
products: ["Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#3882", "ArcGISPro/ps-location-referencing#3881"]
related: [{"doc":230,"file":"update-measures-from-lrs-support-spanning-events-test-plan__doc230.md","s":1006.381},{"doc":229,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool-test-plan__doc229.md","s":3.833},{"doc":280,"file":"update-measures-from-lrs-populate-route-name-test-plan__doc280.md","s":3.387},{"doc":588,"file":"test-plan-for-rest-referent-to-geometry-in-linear-referencing__doc588.md","s":3.027},{"doc":612,"file":"event-replacement-location-offset-method-test-plan__doc612.md","s":3.022}]
```
-->

## Summary

Test plan for the Update Measures from LRS tool focusing on support for events and intersections. Includes positive and negative test cases covering various scenarios such as overlapping events, concurrent routes, different LRS networks, and measure validation. Tests are conducted in multiple environments including Pro, Python, Model Builder, and various geodatabases.

## Related documents

<!-- related:begin -->
- [Update Measures From LRS: Support Spanning Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/update-measures-from-lrs-support-spanning-events-test-plan__doc230.md>) — shared issue ArcGISPro/ps-location-referencing#3881 · similar text 0.42 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:230 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-search-tolerance-parameter-in-update-measures-from-lrs-tool-test-plan__doc229.md>) — similar text 0.10 · 2 title words · same kind/surface/folder <!-- rel:229 -->
- [Update Measures From LRS: Populate Route Name Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/update-measures-from-lrs-populate-route-name-test-plan__doc280.md>) — similar text 0.05 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:280 -->
- [Test Plan for REST Referent To Geometry in Linear Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-for-rest-referent-to-geometry-in-linear-referencing__doc588.md>) — similar text 0.11 · same kind/surface/folder <!-- rel:588 -->
- [Event Replacement: Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/event-replacement-location-offset-method-test-plan__doc612.md>) — similar text 0.08 · same kind/surface/folder <!-- rel:612 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Update Measures From LRS: Support Events and Intersections

| Positive Tests: GP UI |
| --- |
| Provide LRS Events and LRS Intersections as inputs to be updated Test with overlapping Events Test with events having loc error Verify that the Events and Intersections are filtered based on the TVD Test with Concurrent routes Test with different LRS Networks with different measure units. |

| Notes |
| --- |
| Test with both UN and APR data Test In Pro, Python inline, Python Stand alone and Model Builder Test with non spanning events (spanning events are covered in #3881) Test in FGDB, EGDB DC, and FS |

Devtopia Issue

![Interface screenshot redrawn as a standardized wireframe: 7 fields, 10 icons, 15 text rows. 13 of 15 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc711_slide1.svg)

| Negative Tests: |
| --- |
| Measure columns provided do not exist RouteID columns provided does not exist Route is uncalibrated LRS Date is not in range when routes exist The measure fields are not DOUBLE Provide routeID , measure(s), derived routeID , or derived measure(s) as the routeID , From Measure, or To Measure fields in the Update Measures from LRS tool |

![image1.png](../media/doc711_image1.png)

## Slide 2

![Diagram drawn from the slide's own shapes: 7 nodes, 16 connectors.](../media/doc711_slide2.svg)

| ID | RouteID | From M | To M |
| --- | --- | --- | --- |
| Ev1 | R1 | 0 | 5.42 |
| Ev2 | R2 | 3 | 13 |
| Ev3 | R2 | 13 | 23 |
| Ev4 | R1 | 1.75 | 3.75 |
| Ev10 | Null | Null | Null |

| ID | RouteID | Measure |
| --- | --- | --- |
| Ev5 | Null | Null |
| Ev6 | R1 | 0 |
| Ev7 | R1 | 3 |
| Ev8* | R2 | 3 |
| Ev9 | R2 | 23 |

| ID | RouteID | Measure |
| --- | --- | --- |
| Int2* | R1 | 5.42 |
| Int1 | R1 | 0 |

## Slide 3

![Diagram drawn from the slide's own shapes: 6 nodes, 19 connectors.](../media/doc711_slide3.svg)

| ID | RouteID | From M | To M |
| --- | --- | --- | --- |
| Ev1 | R11 | 0 | 6 |
| Ev2 | R11 | 3 | 6 |
| Ev3 | R11 | 14 | 9 |
| Ev4 | Null | Null | Null |
| Ev10 | R11 | 0 | 3 |
| Ev11 | R11 | 6 | 9 |
| Ev13 | Null | Null | Null |

| ID | RouteID | Measure |
| --- | --- | --- |
| Ev5 | R11 | 0 |
| Ev6 | R11 | 3 |
| Ev7 | R11 | 3 |
| Ev8 | R11 | 6 |
| Ev9 | R11 | 9 |
| Ev12 | Null | Null |

## Slide 4

![Diagram drawn from the slide's own shapes: 4 nodes, 21 connectors.](../media/doc711_slide4.svg)

| ID | RouteID | From M | To M |
| --- | --- | --- | --- |
| Ev1* | R21 | 18 | 24 |
| Ev2* | R21 | 0 | 4.5 |
| Ev3* | R21 | 0 | 24 |
| Ev4 | R21 | 18 | 15 |
| Ev10 | R21 | 6 | 12 |
| Ev11 | R21 | 15 | 21 |

| ID | RouteID | Measure |
| --- | --- | --- |
| Ev5 | R21 | 18 |
| Ev6 | R21 | 9 |
| Ev7 | R21 | 12 |
| Ev9* | R21 | 0 |
| Ev12* | R21 | 24 |

## Slide 5

| ID | RouteID | From M | To M |
| --- | --- | --- | --- |
| Ev1* | R31 | 8 | 12 |
| Ev2 | R31 | 4 | 12 |
| Ev3 | R31 | 9 | 11 |
| Ev4* | R31 | 0 | 4 |

![Measured route diagram drawn from the slide's own shapes, measures 0 to 4.](../media/doc711_slide5.svg)

| ID | RouteID | Measure |
| --- | --- | --- |
| Ev5 | R31 | 4 |
| Ev6 | R31 | 12 |
| Ev7 | R31 | 4 |
| Ev9* | R31 | 0 |
| Ev12* | R31 | 0 |

## Slide 6
