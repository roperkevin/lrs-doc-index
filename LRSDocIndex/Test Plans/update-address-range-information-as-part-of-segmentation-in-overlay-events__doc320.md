# Update Address Range Information as Part of Segmentation in Overlay Events & Query Attribute Sets – Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#5537](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5537) |
| **Source** | [AddressingOverlayEvents_Testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddressingOverlayEvents_Testplan.pptx>) |
| **Edited** | 2024-08-29 20:44 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update Address Range Information as Part of Segmentation in Overlay Events & Query Attribute Sets – Test Plan"
source_file: "AddressingOverlayEvents_Testplan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddressingOverlayEvents_Testplan.pptx"
doc_id: 320
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: "Lakshmi"
dev: "Dan"
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Lakshmi Ananthanarayanan"
last_edited: "2024-08-29T20:44:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["address range", "segmentation", "overlay events", "query attribute set", "line event", "point event", "address centerline", "test plan"]
tools: ["Overlay Events", "Query Attribute Set"]
products: []
issues: ["ArcGISPro/ps-location-referencing#5537"]
related: [{"doc":344,"file":"update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md","s":1007.044},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":5.917},{"doc":257,"file":"overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md","s":5.482},{"doc":392,"file":"consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md","s":4.27},{"doc":436,"file":"rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md","s":4.261}]
```
-->

## Summary

Test plan for verifying address range updates during segmentation in overlay events and query attribute sets. Includes tests with file geodatabases, enterprise geodatabases, and direct connect, covering point and line events, simple and complex routes, and time slice scenarios. Validation focuses on address range fields updating correctly in overlay events geoprocessing tool and query attribute set REST endpoint.

## Related documents

<!-- related:begin -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md>) — shared issue ArcGISPro/ps-location-referencing#5537 · similar text 0.45 · 6 title words · 2 filename words · same surface <!-- rel:344 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.41 · 6 title words · 2 filename words · same surface <!-- rel:294 -->
- [Overlay Events/queryAttributeSet: Update Address Range info via Address Points](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/overlay-events-queryattributeset-update-address-range-info-via-address-points__doc257.md>) — similar text 0.36 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:257 -->
- [Consider Point Events in Query Attribute Set and Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md>) — similar text 0.20 · 4 title words · 2 filename words · same surface <!-- rel:392 -->
- [REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md>) — similar text 0.30 · 4 title words · 2 filename words · same surface <!-- rel:436 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Update Address Range information as part of segmentation in Overlay Events & Query Attribute Sets – Test Plan

https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5537

PE: Lakshmi
Dev: Dan

## Slide 2

Test with fs, fgdb, and direct connect egdb
Test with the address layer with block range fields that is configured as the LRS Centerline, as well as an LRS event
Test with point and line events
Sanity check if an event layer has block range fields but it’s not configured as part of ADM-LR, the block range fields do not update

Verification
For the line event records , verify the range fields for each segment in the output gets updated(Left From; Left To; Right From; Right To)
For the point event record in the output, populate null for 4 Address range fields
Verify both overlay Events GP tool and Query Attribute Set REST endpoint

## Case 1 <!-- slide 3 -->

### Overlay Events / QueryAttributeSet on Simple Routes

**Overlay Events/queryAttributeSet on simple routes – Address centerline All centerlines in same direction**

![Diagram drawn from the slide's own shapes: 2 nodes (STOP), 18 connectors.](../media/doc665_slide3.svg)

| CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | null |
| 1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | null |
| 2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | 3 | null |
| 2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | Stop |
| 2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | null |
| 3 | 20 | 25 | 200 | 248 | Even | 201 | 249 | Odd | R1 | 3 | null |
| 3 | 25 | 30 | 250 | 298 | Even | 251 | 299 | Odd | R1 | 2 | null |

## Case 2 <!-- slide 4 -->

### Overlay Events / QueryAttributeSet on Simple Routes

**Overlay Events/queryAttributeSet on simple routes – Address centerline one centerline in opposite direction**

![Diagram drawn from the slide's own shapes: 2 nodes (STOP), 18 connectors.](../media/doc665_slide4.svg)

| CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | null |
| 1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | null |
| 2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | 3 | null |
| 2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | Stop |
| 2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | null |
| 3 | 25 | 20 | 629 | 649 | Odd | 630 | 648 | Even | R1 | 3 | null |
| 3 | 30 | 25 | 651 | 699 | Odd | 650 | 700 | Even | R1 | 2 | null |

## Slide 5

3 . Overlay Events/queryAttributeSet on simple routes – Address data as event layer

![Diagram drawn from the slide's own shapes: 2 nodes (STOP), 18 connectors.](../media/doc665_slide5.svg)

| Event ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | null |
| E1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | null |
| E2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | 3 | null |
| E2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | Stop |
| E2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | null |
| E3 | 20 | 25 | 630 | 648 | Even | 629 | 649 | Odd | R1 | 3 | null |
| E3 | 25 | 30 | 650 | 700 | Even | 651 | 699 | Odd | R1 | 2 | null |

## Slide 6

4 . Overlay Events/queryAttributeSet on simple routes – Address data as event layer

![Diagram drawn from the slide's own shapes: 2 nodes (STOP), 18 connectors.](../media/doc665_slide6.svg)

| Event ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | null |
| E1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | null |
| E2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | 3 | null |
| E2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | Stop |
| E2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | null |
| E3 | 25 | 20 | 629 | 649 | Odd | 630 | 648 | Even | R1 | 3 | null |
| E3 | 30 | 25 | 651 | 699 | Odd | 251 | 299 | Even | R1 | 2 | null |

## Slide 7

5 . Overlay Events/queryAttributeSet on  Complex route

![Diagram drawn from the slide's own shapes: 6 nodes (STOP, STOP, 5 . Overlay Events/queryAttributeSet on Complex route, STOP), 14 connectors, 6 freeform paths.](../media/doc665_slide7.svg)

| CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | Speed | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cl1 | 0 | 10 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 25 | null |
| Cl2 | 10 | 20 | 100 | 150 | Even | 101 | 149 | Odd | R1 | 25 | null |
| Cl3 | 20 | 30 | 200 | 250 | Even | 201 | 249 | Odd | R1 | 25 | null |
| Cl4 | 32 | 30 | 647 | 649 | Odd | 648 | 650 | Even | R1 | 35 | null |
| Cl4 | 32 | 32 | Null | Null | Odd | Null | Null | Even | R1 | 35 | stop |
| Cl4 | 62 | 32 | 511 | 645 | Odd | 510 | 646 | Even | R1 | 35 | null |
| Cl4 | 62 | 62 | Null | Null | Odd | Null | Null | Even | R1 | 35 | Stop |
| Cl4 | 65 | 62 | 501 | 509 | Odd | 500 | 508 | Even | R1 | 35 | null |

![image1.png](../media/doc665_image1.png)

## Slide 8

6 . Overlay Events/queryAttributeSet on simple routes – Multiple line events and point events

![Diagram drawn from the slide's own shapes: 4 nodes (STOP, STOP), 25 connectors.](../media/doc665_slide8.svg)

| CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Speed | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cl1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | 25 | null |
| cl1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | 25 | null |
| cl2 | 10 | 12 | 100 | 118 | Even | 101 | 119 | Odd | R1 | 3 | 25 | null |
| cl2 | 12 | 15 | 120 | 148 | Even | 121 | 147 | Odd | R1 | 3 | 35 | null |
| cl2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | 35 | Stop |
| cl2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | 35 | null |
| cl3 | 20 | 22 | 200 | 218 | Even | 201 | 219 | Odd | R1 | 3 | 35 | null |
| cl3 | 22 | 25 | 220 | 248 | Even | 221 | 249 | Odd | R1 | 3 | 40 | null |
| cl3 | 25 | 27 | 250 | 258 | Even | 251 | 259 | Odd | R1 | 2 | 40 | null |
| cl3 | 27 | 27 | Null | Null | Even | Null | Null | Odd | R1 | 2 | 40 | Stop |
| cl3 | 27 | 30 | 260 | 298 | Even | 261 | 299 | Odd | R1 | 2 | 40 | null |

## Slide 9

7 . Overlay Events/queryAttributeSet on simple routes – Spanning line event

![Diagram drawn from the slide's own shapes: 4 nodes (STOP, STOP), 26 connectors.](../media/doc665_slide9.svg)

| CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Speed | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cl1 | 0 | 10 | 0 | 98 | Even | 1 | 99 | Odd | R1 | 3 | 25 | Null |
| Cl2 | 10 | 12 | 100 | 118 | Even | 101 | 119 | Odd | R1 | 3 | 25 | Null |
| Cl2 | 12 | 15 | 120 | 148 | Even | 121 | 147 | Odd | R1 | 3 | 35 | Null |
| Cl2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | 35 | Stop |
| Cl2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 2 | 35 | Null |
| Cl3 | 20 | 27 | 200 | 258 | Even | 201 | 259 | Odd | R1 | 2 | 35 | Null |
| Cl3 | 27 | 27 | Null | Null | Even | Null | Null | Odd | R1 | 2 | 35 | Stop |
| Cl3 | 27 | 30 | 260 | 298 | Even | 261 | 299 | Odd | R1 | 2 | 40 | Null |
| ClR2 | 100 | 102 | 300 | 318 | Even | 301 | 319 | Odd | R1 | 2 | 35 | Null |
| ClR2 | 102 | 110 | 320 | 398 | Even | 321 | 399 | Odd | R1 | 2 | 35 | Null |

## Slide 10

10 . Overlay Events/queryAttributeSet on simple routes – time slice

![Diagram drawn from the slide's own shapes: 2 nodes (STOP), 18 connectors.](../media/doc665_slide10.svg)

|  | From Date | To Date |
| --- | --- | --- |
| Route | 1/1/2000 | Null |
| Sign | 1/1/2005 | Null |
| Lane | 1/1/2010 | Null |

| From Date | To Date | CL ID | From M | To M | Left From | Left To | Parity Left | Right From | Right To | Parity Right | RID | # Lanes | Sign Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | cl1 | 0 | 10 | 0 | 98 | Even | 1 | 99 | Odd | R1 | Null | Null |
| 1/1/2000 | 1/1/2005 | cl2 | 10 | 20 | 100 | 198 | Even | 101 | 199 | Odd | R1 | Null | Null |
| 1/1/2000 | 1/1/2005 | cl3 | 20 | 30 | 200 | 298 | Even | 201 | 299 | Odd | R1 | Null | Null |
| 1/1/2005 | 1/1/2010 | cl1 | 0 | 10 | 0 | 98 | Even | 1 | 99 | Odd | R1 | Null | Null |
| 1/1/2005 | 1/1/2010 | cl2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | Null | Null |
| 1/1/2005 | 1/1/2010 | cl2 | 15 | 15 | Null | Null | Even | Null | Null | Odd | R1 | Null | Stop |
| 1/1/2005 | 1/1/2010 | cl2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | Null | Null |
| 1/1/2005 | 1/1/2010 | cl3 | 20 | 30 | 200 | 298 | Even | 201 | 299 | Odd | R1 | Null | Null |
| 1/1/2010 | Null | cl1 | 0 | 5 | 0 | 48 | Even | 1 | 49 | Odd | R1 | 2 | Null |
| 1/1/2010 | Null | cl1 | 5 | 10 | 50 | 98 | Even | 51 | 99 | Odd | R1 | 3 | Null |
| 1/1/2010 | Null | cl2 | 10 | 15 | 100 | 148 | Even | 101 | 149 | Odd | R1 | 3 | Null |
| 1/1/2010 | Null | cl2 | 15 | 15 | null | null | Even | null | null | Odd | R1 | 3 | Stop |
| 1/1/2010 | Null | cl2 | 15 | 20 | 150 | 198 | Even | 151 | 199 | Odd | R1 | 3 | Null |
| 1/1/2010 | Null | cl3 | 20 | 25 | 200 | 248 | Even | 201 | 249 | Odd | R1 | 3 | Null |
| 1/1/2010 | Null | cl3 | 25 | 30 | 250 | 298 | Even | 251 | 299 | Odd | R1 | 2 | Null |
