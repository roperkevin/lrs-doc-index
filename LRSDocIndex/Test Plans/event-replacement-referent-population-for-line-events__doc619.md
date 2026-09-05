# Event Replacement Referent Population for Line Events

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | 3.1 |
| **Issue** | [ArcGISPro/ps-location-referencing#3910](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3910) · [ArcGISPro/ps-location-referencing#3925](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3925) · [arcgispro/ps-location-referencing#4681](https://devtopia.esri.com/arcgispro/ps-location-referencing/issues/4681) · [ArcGISPro/ps-location-referencing#3911](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/3911) |
| **Source** | [4681-EventReplacementReferentPopulation_V2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4681-EventReplacementReferentPopulation_V2.pptx>) |
| **Edited** | 2022-11-17 18:39 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Event Replacement Referent Population for Line Events"
source_file: "4681-EventReplacementReferentPopulation_V2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4681-EventReplacementReferentPopulation_V2.pptx"
doc_id: 619
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V2"
target_release: "3.1"
pe: "Praveen"
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2022-11-17T18:39:20Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event replacement", "referent population", "line event", "spanning line event", "route and measure", "coordinate offset", "location offset", "event retirement"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#3910", "ArcGISPro/ps-location-referencing#3925", "arcgispro/ps-location-referencing#4681", "ArcGISPro/ps-location-referencing#3911"]
related: [{"doc":636,"file":"add-line-event-tool-coordinate-offset-method-test-plan__doc636.md","s":1003.595},{"doc":618,"file":"add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md","s":1003.38},{"doc":638,"file":"add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md","s":3.422},{"doc":365,"file":"point-events-dynamic-segmentation-test-plan__doc365.md","s":3.082},{"doc":906,"file":"exb-auto-populate-referents-for-add-point-and-add-line-widgets-test-plan__doc906.md","s":3.057}]
```
-->

## Summary

Test plan for event replacement referent population involving line and spanning line events with referents configured on line and non-line networks. Covers positive test cases for Route and Measure, Coordinate Offset, and Location Offset methods, including different From and To method combinations. Testing focuses on event retirement and replacement workflows with data captured from the field.

## Related documents

<!-- related:begin -->
- [Add Line Event Tool Coordinate Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tool-coordinate-offset-method-test-plan__doc636.md>) — shared issue ArcGISPro/ps-location-referencing#3911 · similar text 0.21 · 2 title words · same kind/surface/folder <!-- rel:636 -->
- [Add Line Event Tools – Intersection Location Offset Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-intersection-location-offset-method-test-plan__doc618.md>) — shared issue ArcGISPro/ps-location-referencing#3910 · similar text 0.16 · 2 title words · 1 filename word · same kind/folder <!-- rel:618 -->
- [Add Point Event tool/ Add Multipoint Events tool Coordinate offset method – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/add-point-event-tool-add-multipoint-events-tool-coordinate-offset-method-test__doc638.md>) — similar text 0.25 · 2 title words · same kind/surface/folder <!-- rel:638 -->
- [Point Events Dynamic Segmentation Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/point-events-dynamic-segmentation-test-plan__doc365.md>) — similar text 0.28 · 1 title word · same kind/surface/folder <!-- rel:365 -->
- [ExB: Auto-Populate Referents for Add Point and Add Line widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-auto-populate-referents-for-add-point-and-add-line-widgets-test-plan__doc906.md>) — similar text 0.09 · 1 title word · 1 filename word · same kind/folder <!-- rel:906 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html) · [Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-behavior-for-route-retirement.html)
<!-- docs:end -->

---

## Slide 1

4681-Event Replacement Referent Population for Line Events

| Notes |
| --- |
| Test with combination of line and spanning line events with referents configured on line and non-line networks Event replacement will still work the same even with events without referents configured Test with Route and Measure, Coordinate Offset, and Location Offset Methods Test with different From and To Methods on the same replacement Common workflow for users will be bulk replacing existing events with new data that has come from the field that was captured using either coordinates or an offset from a point location (intersections) Referent population will only occur upon event retirement and replacement. Events that are only retired will not have any referent population as no new event records will be created Test plan has been created using Praveen’s Event Replacement Test Plan as a template for Route and Measure method ( Devtopia Link ), Mac’s Add Line Event(s): Location Offset Method ( Devtopia Link ) for Location Offset Method and Claire’s Add Line Event(s): Coordinate Offset Method for Coordinate Offset Method ( Devtopia Link ) per Rahul’s suggestion Testing will be executed upon Praveen’s Event Replacement testing data Location Offset method for Event Replacement will not be a part of the 3.1 release, so all Location Offset Method test cases will not be tested as part of this test plan. They will remain in the test plan for testing in a later release. |

Devtopia Link

## Slide 2

| Positive Tests: Route and Measure Method |
| --- |
| Single route – events covering route entirely, referent fields populated with relevant Route and Measure info Single route - events covering route partially, referent fields populated with relevant Route and Measure info Multiple routes – spanning events cover route partially, referent fields populated with relevant Route and Measure info |

| Positive Tests: Coordinate Offset Method |
| --- |
| Single route – events covering route entirely, referent fields populated with relevant Coordinate Offset info Single route - events covering route partially, referent fields populated with relevant Coordinate Offset info Multiple routes – spanning events cover route partially, referent fields populated with relevant Coordinate Offset info |

| Positive Tests: Different From and To Methods |
| --- |
| Single route - events cover route entirely, From Method is Route and Measure, To Method is Location Offset Single route - events cover route entirely, From Method is Coordinate Offset, To Method is Route and Measure Single route – events cover route entirely, From Method is Location Offset, To Method is Coordinate Offset |

| Positive Tests: Location Offset Method |
| --- |
| Single route – events covering route entirely, referent fields populated with relevant Location Offset info Single route - events covering route partially, referent fields populated with relevant Location Offset info Multiple routes – spanning events cover route partially, referent fields populated with relevant Location Offset info |

## Slide 3 — 1. Single route – events covering route entirely

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 24 text rows. 19 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide3_fig2.svg)

Output:
Existing events are retired as of 1/1/2010
0
25000

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide3_fig1.svg)

| Event | Route ID | From Measure | To Measure | Fro Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Continuous Network | Route L45 | 25000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Continuous Network | Route L45 | 25000 |

![image1.png](../media/doc314_image1.png) ![image2.png](../media/doc314_image2.png)

## Slide 4 — 2 . Single route – events covering route partially

Output:
Existing  events are retired as of 1/1/2010
0
25000

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide4.svg)

| Event | Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Continuous Network | Route L45 | 25000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Continuous Network | Route L45 | 25000 |

![image1.png](../media/doc314_image1.png) ![image3.png](../media/doc314_image3.png)

## Slide 5 — 3. Multiple routes – spanning events cover route partially

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 0.5: event E1 as 0–0.5 and 0.5–1.](../media/doc314_slide5_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 fields, 5 icons, 14 text rows. 9 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide5_fig3.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 buttons, 17 icons, 18 text rows. 2 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide5_fig4.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 1, before the split at measure 0.5.](../media/doc314_slide5_fig1.svg)

| Event | From Route ID | To Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engg_Event3 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | Continuous Network | Route 1 | 0 | Continuous Network | Route 3 | 1 |
| Engg_Event4 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | Continuous Network | Route 1 | 0 | Continuous Network | Route 3 | 1 |

Output:
Existing events are retired as of 1/1/2010

![image4.png](../media/doc314_image4.png) ![image5.png](../media/doc314_image5.png)

## Slide 6 — 4. Single route – events covering route entirely, referent fields populated with relevant Location Offset info

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide6_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 24 text rows. 19 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide6_fig3.svg)

Output:
Existing events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 3 nodes, 4 connectors.](../media/doc314_slide6_fig1.svg)

| Event | Route ID | From Measure | To Measure | Fro Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | -10000 | Intersections | Intersection X | 15000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | -10000 | Intersections | Intersection X | 15000 |

![image1.png](../media/doc314_image1.png) ![image2.png](../media/doc314_image2.png)

## Slide 7 — 5. Single route - events covering route partially, referent fields populated with relevant Location Offset info

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide7_fig2.svg)

Output:
Existing  events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 3 nodes, 4 connectors.](../media/doc314_slide7_fig1.svg)

| Event | Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | -10000 | Intersections | Intersection X | 15000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | -10000 | Intersections | Intersection X | 15000 |

![image1.png](../media/doc314_image1.png) ![image3.png](../media/doc314_image3.png)

## Slide 8 — 6. Multiple routes – spanning events cover route partially, referent fields populated with relevant Location Offset info

![Interface screenshot redrawn as a standardized wireframe: 2 fields, 5 icons, 14 text rows. 9 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide8_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 buttons, 17 icons, 18 text rows. 2 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide8_fig3.svg)

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc314_slide8_fig1.svg)

| Event | From Route ID | To Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engg_Event3 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | Intersections | Intersection X | -1.5 | Intersections | Intersection X | 1.5 |
| Engg_Event4 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | Intersections | Intersection X | -1.5 | Intersections | Intersection X | 1.5 |

Output:
Existing events are retired as of 1/1/2010

![image4.png](../media/doc314_image4.png) ![image5.png](../media/doc314_image5.png)

## Slide 9 — 7. Single route – events covering route entirely, referent fields populated with relevant Coordinate Offset info

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide9_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 24 text rows. 19 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide9_fig3.svg)

Output:
Existing events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 2 nodes, 3 connectors.](../media/doc314_slide9_fig1.svg)

| Event | Route ID | From Measure | To Measure | Fro Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |

![image1.png](../media/doc314_image1.png) ![image2.png](../media/doc314_image2.png)

## Slide 10 — 8. Single route - events covering route partially, referent fields populated with relevant Coordinate Offset info

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide10_fig2.svg)

Output:
Existing  events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 2 nodes, 3 connectors.](../media/doc314_slide10_fig1.svg)

| Event | Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L46 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |
| Cont_Event4 | Route L46 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |

![image1.png](../media/doc314_image1.png) ![image3.png](../media/doc314_image3.png)

## Slide 11 — 9. Multiple routes – spanning events cover route partially, referent fields populated with relevant Coordinate Offset

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 0.5: event E1 as 0–0.5 and 0.5–1.](../media/doc314_slide11_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 fields, 5 icons, 14 text rows. 9 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide11_fig3.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 buttons, 17 icons, 18 text rows. 2 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide11_fig4.svg)

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 1, before the split at measure 0.5.](../media/doc314_slide11_fig1.svg)

| Event | From Route ID | To Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engg_Event3 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |
| Engg_Event4 | Route 1 | Route 3 | 0 | 1 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | X/Y | 800,800, 0 | 0 |

Output:
Existing events are retired as of 1/1/2010

![image4.png](../media/doc314_image4.png) ![image5.png](../media/doc314_image5.png)

## Slide 12 — 10. Single route - events cover route entirely, From Method is Route and Measure, To Method is Location Offset

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide12_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 24 text rows. 19 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide12_fig3.svg)

Output:
Existing events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 3 nodes, 3 connectors.](../media/doc314_slide12_fig1.svg)

| Event | Route ID | From Measure | To Measure | Fro Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Intersections | Intersection X | 15000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Continuous Network | Route L45 | 0 | Intersections | Intersection X | 15000 |

![image1.png](../media/doc314_image1.png) ![image2.png](../media/doc314_image2.png)

## Slide 13 — 11. Single route - events cover route entirely, From Method is Coordinate Offset, To Method is Route and Measure

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 6 buttons, 24 text rows. 19 of 24 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide13_fig2.svg)

Output:
Existing events are retired as of 1/1/2010
0
25000

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide13_fig1.svg)

| Event | Route ID | From Measure | To Measure | Fro Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | Continuous Network | Route L45 | 25000 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | X/Y | 000,000, 0 | 0 | Continuous Network | Route L45 | 25000 |

From Coordinate Location

![image1.png](../media/doc314_image1.png) ![image2.png](../media/doc314_image2.png)

## Slide 14 — 12. Single route – events cover route entirely, From Method is Location Offset, To Method is Coordinate Offset

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 6 icons, 16 text rows. 11 of 16 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc314_slide14_fig2.svg)

Output:
Existing  events are retired as of 1/1/2010

![Diagram drawn from the slide's own shapes: 4 nodes, 4 connectors.](../media/doc314_slide14_fig1.svg)

| Event | Route ID | From Measure | To Measure | From Date | To Date | From Ref Method | From Ref Location | From Ref Offset | To Ref Method | To Ref Location | To Ref Offset |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cont_Event3 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | W 10000 | X/Y | 800,800, 0 | 0 |
| Cont_Event4 | Route L45 | 0 | 25000 | 1/1/2010 | Null | Intersections | Intersection X | W 10000 | X/Y | 800,800, 0 | 0 |

![image1.png](../media/doc314_image1.png) ![image3.png](../media/doc314_image3.png)
