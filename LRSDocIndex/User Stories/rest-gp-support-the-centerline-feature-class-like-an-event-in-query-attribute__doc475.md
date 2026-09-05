# REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [RESTGPSupportCenterlinelikeanEventinQueryAttributeSetOverlayEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RESTGPSupportCenterlinelikeanEventinQueryAttributeSetOverlayEvents.pptx>) |
| **Edited** | 2023-10-26 23:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "REST/GP: Support the centerline feature class like an event in Query Attribute Set/Overlay Events"
source_file: "RESTGPSupportCenterlinelikeanEventinQueryAttributeSetOverlayEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RESTGPSupportCenterlinelikeanEventinQueryAttributeSetOverlayEvents.pptx"
doc_id: 475
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-10-26T23:53:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "dynamic segmentation", "query attribute set", "overlay events", "lrs editor", "utility network"]
tools: ["Query Attribute Set", "Overlay Events"]
products: ["Utility Network"]
issues: []
related: [{"doc":436,"file":"rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md","s":8.302},{"doc":392,"file":"consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md","s":7.039},{"doc":290,"file":"support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md","s":5.629},{"doc":294,"file":"update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md","s":5.201},{"doc":765,"file":"support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md","s":4.858}]
```
-->

## Summary

This user story describes the need for LRS data editors to include the LRS centerline feature class as an event in the Query Attribute Set REST endpoint and Overlay Events GP tool. It covers requirements for handling centerlines with or without Utility Network configuration and temporal views, as well as testing, automation, and documentation updates.

## Related documents

<!-- related:begin -->
- [REST/GP: Consider Centerline Direction in Query Attribute Set/Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rest-gp-consider-centerline-direction-in-query-attribute-set-overlay-events__doc436.md>) — similar text 0.40 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:436 -->
- [Consider Point Events in Query Attribute Set and Overlay Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-point-events-in-query-attribute-set-and-overlay-events__doc392.md>) — similar text 0.38 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:392 -->
- [Support Overlapping Events in Query Attribute Set and Overlay Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-query-attribute-set-and-overlay-events-gp-tool__doc290.md>) — similar text 0.22 · 6 title words · 1 filename word · same kind/surface/folder <!-- rel:290 -->
- [Update Address Range via Address Points in Overlay Events and Query Attribute Sets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/update-address-range-via-address-points-in-overlay-events-and-query-attribute__doc294.md>) — similar text 0.24 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:294 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:765 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — REST/GP: Support the centerline/ feature class like an event in Query Attribute Set/Overlay Events

User Story
ArcGIS Pro

## Slide 2 — User Story

As an LRS data editor in local government, I need the ability to include the LRS centerline feature class like an event in Query Attribute Set/Overlay Events, so that I can correctly dynamically segment this layer with other event layers for reporting and other integrity processes.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  This user will also dynamically segment data as needed for analysis.  At local governments that also manage address data, the centerline will need to be included so this address data can be included in the dynseg.

## Slide 3 — Requirements

In the Query Attribute Set REST endpoint and Overlay Events GP tool, allow the LRS centerline feature class to be included as an input
If the LRS is configured with a Utility Network, continue to read the RouteID and measure columns from the LRS Metadata or LRS Controller Dataset like we do today
If the LRS is not configured with a Utility Network, either:

  - If not spatial, get routes and measure information onto the centerline in memory so it can be included with the dynseg
Or

  - If spatial, include the centerlines in the overlay so they can be included in the dynseg
Whatever temporal view date/date range is passed in the request, assume all features in the pipeline/centerline feature class exist during that time (treat it like null to null as the date range, remove any time slices where the feature would get a “route not found” location error)

## Slide 4 — Testing

Test with services with the VMS enabled, fgdb, and direct connect egdb.
Test with UN pipeline/centerline, centerlines with measures, centerlines without measures.
Add to the existing automation cases for the endpoint/gp tool.

## Slide 5 — Automation

Add to the existing automation cases for the endpoint and gp tool.

## Slide 6 — Documentation

Add language to the existing REST API and GP topic that mentions that the centerline can now be included in the dynamic segmentation.

## Slide 7 — Story Points

Story Points:
Dev:
PE:
