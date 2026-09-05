# REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [RESTGPCenterlineDirectioninQueryAttributeSetOverlayEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RESTGPCenterlineDirectioninQueryAttributeSetOverlayEvents.pptx>) |
| **Edited** | 2024-01-19 01:44 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events"
source_file: "RESTGPCenterlineDirectioninQueryAttributeSetOverlayEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RESTGPCenterlineDirectioninQueryAttributeSetOverlayEvents.pptx"
doc_id: 436
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-01-19T01:44:08Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline direction", "query attribute set", "overlay events", "addressing", "route calibration", "dynamic segmentation", "lrs editor"]
tools: ["Query Attribute Set", "Overlay Events"]
products: []
issues: []
related: [{"doc":475,"file":"rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md","s":8.302},{"doc":392,"file":"consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md","s":7.647},{"doc":344,"file":"update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md","s":5.358},{"doc":290,"file":"support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md","s":5.173},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":5.118}]
```
-->

## Summary

This document describes a user story for LRS data editors to ensure centerline direction is considered in the Query Attribute Set REST endpoint and Overlay Events GP tool outputs. It covers the need to maintain correct addressing information by honoring centerline direction, including requirements, testing scenarios, automation additions, and documentation updates.

## Related documents

<!-- related:begin -->
- [REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md>) — similar text 0.40 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:475 -->
- [Consider Point Events in Query Attribute Set and Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md>) — similar text 0.45 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:392 -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md>) — similar text 0.20 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:344 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md>) — similar text 0.20 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:290 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.21 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:294 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — REST/GP: Consider centerline direction in Query Attribute Set/Overlay Events

User Story
ArcGIS Pro

## Slide 2 — User Story

As an LRS data editor in local government, I need the direction of each centerline considered in Query Attribute Set/Overlay Events, so that the addressing information doesn’t reverse direction incorrectly in the output.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  This user will also dynamically segment data as needed for analysis.  At local governments that also manage address data, the centerline will need to be included so this address data can be included in the dynseg.  Although the centerline direction should be consistent between centerlines that make up a single route in the LRS, there are exception cases when the route passes through multiple jurisdictions, each with different business rules.  We need to be able to maintain the centerline direction in the Overlay Output to ensure the addressing information doesn’t get reversed.

## Slide 3 — Example

![Schematic redrawn from the slide's data: straight route R1 after the split at measure 3.5: event E1 as 0–3.5 and 3.5–7.](../media/doc498_slide3_fig2.svg)

CL1 (LF 1, LT 99, RF 2, RT100)		    CL2 (RF 149, RT 101, LF 150, LT 102)	          CL3 (LF 151, LT 199, RF 152, RT 200)
2 lanes						        3 lanes
0                                     7           8                      12                        15				   20

![Schematic redrawn from the slide's data: straight route R1, event E1 from measure 0 to 7, before the split at measure 3.5.](../media/doc498_slide3_fig1.svg)

| From Measure | To Measure | Route | Speed | Lanes | CL | LF | LT | RF | RT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 7 | Rte1 | 40 | 2 | CL1 | 1 | 99 | 2 | 100 |
| 7 | 8 | Rte1 | 30 | 2 | CL1 | 1 | 99 | 2 | 100 |
| 12 | 8 | Rte1 | 30 | 2 | CL2 | 150 | 102 | 149 | 101 |
| 15 | 12 | Rte1 | 30 | 3 | CL2 | 150 | 102 | 149 | 101 |
| 15 | 20 | Rte1 | 40 | 3 | CL3 | 151 | 199 | 152 | 200 |

## Slide 4 — Requirements

In the Query Attribute Set REST endpoint and Overlay Events GP tool, when the centerline that is part of an addressing configuration is an input layer, we need to consider the direction of the centerline in the output generated for the tool (note this is only for this configuration that we’ll apply this to the output)
If all centerlines that are part of a route are in the same direction as the route's direction of calibration, do what the tool does today
If one or more of the centerlines that are part of a route are in the opposite direction of calibration, then each of the output records that include those opposite direction centerlines will need to honor the direction of the centerline

  - This means that the from and to measures of the output record would be reversed
  - This also means if a geometry is included in the output, it would be in the opposite direction as the calibration direction of the input route

## Slide 5 — Testing

Test with services with the VMS enabled, fgdb, and direct connect egdb
Test on a variety of centerline/route configurations

  - Both in same direction
  - All centerlines in opposite direction
  - Some centerlines in opposite direction
  - One centerline per route
  - Multiple centerlines per route
Test a few cases with complex routes

## Slide 6 — Automation

Add to the existing automation cases for the endpoint and gp tool.

## Slide 7 — Documentation

Add language to the existing REST API and GP topic that mentions that when configured with addressing, the centerline direction will be considered in these tools.
Providing a diagram to show the example input/output would be good.

## Slide 8 — Story Points

Story Points:
Dev:
PE:
