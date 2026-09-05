# Consider Point Events in Query Attribute Set and Overlay Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportPointEventsOverlayEventsQueryAttSet.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportPointEventsOverlayEventsQueryAttSet.pptx>) |
| **Edited** | 2024-03-20 18:45 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Consider Point Events in Query Attribute Set and Overlay Events"
source_file: "SupportPointEventsOverlayEventsQueryAttSet.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportPointEventsOverlayEventsQueryAttSet.pptx"
doc_id: 392
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2024-03-20T18:45:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["point event", "dynamic segmentation", "route editing", "overlay events", "attribute set", "linear event"]
tools: ["Query Attribute Set", "Overlay Events"]
products: []
issues: []
related: [{"doc":436,"file":"rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md","s":7.647},{"doc":394,"file":"dynamic-segmentation-table-consider-point-events-in-dynseg-table__doc394.md","s":7.068},{"doc":475,"file":"rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md","s":7.039},{"doc":290,"file":"support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md","s":5.977},{"doc":344,"file":"update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md","s":5.844}]
```
-->

## Summary

This document describes a user story for including point events in dynamic segmentation within the Query Attribute Set REST endpoint and Overlay Events geoprocessing tool. It outlines requirements for handling point events alongside linear events, testing scenarios, automation updates, and documentation enhancements. The goal is to enable LRS editors to see a complete representation of all events along a route.

## Related documents

<!-- related:begin -->
- [REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md>) — similar text 0.45 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:436 -->
- [Dynamic Segmentation Table: Consider Point Events in DynSeg Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-table-consider-point-events-in-dynseg-table__doc394.md>) — similar text 0.65 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:394 -->
- [REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-support-the-centerline-feature-class-like-an-event-in-query-attribute__doc475.md>) — similar text 0.38 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:475 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md>) — similar text 0.20 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:290 -->
- [Update Address Range Information in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-address-range-information-in-overlay-events-and-query-attribute-sets__doc344.md>) — similar text 0.23 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:344 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — REST/GP: Consider point events in Query Attribute Set/Overlay Events

User Story
ArcGIS Pro

## Slide 2 — User Story

As an LRS data editor, I need point events to be included in dynamic segmentation, so that I can see a complete representation of all events along a route.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  This user will also dynamically segment data as needed for analysis.  Users want to be able to include point events along side linear events in the dynamic segmentation so they can see a complete representation of the route(s) being dynseged.

## Slide 3 — Requirements

In the Query Attribute Set REST endpoint and Overlay Events GP tool, allow point events to be included as input event layers
When a point event from a route is overlaid, make sure the tool does the following:

  - For point event, a record will be created, that shows the same From/To Measure and From/To Route ID. These records should include the point event attribute(s) and the linear event(s) attributes at that location
  - Continue to create the linear event output records like we do today; leave the point event attribute(s) null
  - Make sure other field information is correct such as From Date, To Date, and other attribute fields
  - The correct shape should be built (if the output format is a feature class) as a point where the point event exists
  - If there a multiple point events (in the same layer or different input point event layers) at the same location, only include one record with the attributes for all the point events at that location
  - Make sure user can input multiple point event layers in the GP tool (like we do for the input line events)
  - Support allowing both point and line events as part of the input event layers

## Slide 4 — Example

2 lanes						        3 lanes
0                                     7           8                      12                                          18			   20

![Diagram drawn from the slide's own shapes: 2 nodes, 10 connectors.](../media/doc569_slide4.svg)

| From Measure | To Measure | Route | Speed | Lanes | Sign |
| --- | --- | --- | --- | --- | --- |
| 0 | 7 | Rte1 | 40 | 2 | Null |
| 7 | 8 | Rte1 | 30 | 2 | Null |
| 8 | Null | Rte1 | 30 | 2 | Stop |
| 8 | 12 | Rte1 | 30 | 2 | Null |
| 12 | 18 | Rte1 | 30 | 3 | Null |
| 18 | Null | Rte1 | 30 | 3 | Yield |
| 18 | 20 | Rte1 | 30 | 3 | Null |

                                                 Stop Sign				Yield Sign

## Slide 5 — Testing

Test with services with the VMS enabled, fgdb, and direct connect egdb
Test a variety of route types

  - Non-Line network normal routes
  - Line network normal routes
  - Vertical routes
  - Complex routes
Test at least one case where events are associated with a different network and translation needs to occur

## Slide 6 — Automation

Add to the existing automation cases for the endpoint and gp tool.

## Slide 7 — Documentation

Update language to the existing REST API and GP topic that mentions that point and line events are supported as inputs.
Providing a diagram to show the example input/output for a scenario with both point and line events would be good.

## Slide 8 — Story Points

Story Points:
Dev:
PE:
