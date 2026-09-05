# Support Vertical Route Segments in Overlay Events GP tool

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [OverlayEventsVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsVerticalRoutes.pptx>) |
| **Edited** | 2020-08-06 23:23 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Vertical Route Segments in Overlay Events GP tool"
source_file: "OverlayEventsVerticalRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OverlayEventsVerticalRoutes.pptx"
doc_id: 765
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-06T23:23:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical segment", "vertical gap", "overlay events", "route", "dynamic segmentation"]
tools: ["Overlay Events"]
products: []
issues: []
related: [{"doc":767,"file":"support-vertical-route-segments-in-translate-events-gp-tool__doc767.md","s":8.661},{"doc":799,"file":"support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md","s":6.483},{"doc":746,"file":"support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md","s":6.106},{"doc":768,"file":"support-vertical-segments-in-append-routes__doc768.md","s":5.878},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":4.953}]
```
-->

## Summary

This user story describes the need to support overlaying events located on routes with vertical segments or gaps in the Overlay Events geoprocessing tool. It specifies requirements for correct route and measure attributes in output and the impact on the Query Attribute Set REST endpoint. Testing scenarios and automation updates are outlined to validate this functionality.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Translate Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-translate-events-gp-tool__doc767.md>) — similar text 0.71 · 6 title words · 3 filename words · same kind/surface/folder <!-- rel:767 -->
- [Support Complex Route Shapes in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-overlay-events-gp-tool__doc799.md>) — similar text 0.54 · 5 title words · 2 filename words · same kind/surface/folder <!-- rel:799 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md>) — similar text 0.54 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:746 -->
- [Support Vertical Segments in Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-segments-in-append-routes__doc768.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:768 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.30 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:758 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Vertical Route Segments in Overlay Events GP tool

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to overlay events that are located on routes with vertical segments, so that they dynamically segment correctly like events on non vertical routes.

## Slide 3 — Vertical Segments/Gaps in Overlay Events

In the overlay events GP tool, events that are located on vertical segments/gaps need to be supported.
Vertical routes themselves need to be supported as well since the network feature class is an input in the tool.
When an event from a route with vertical segment/gap is overlaid, make sure the tool does the following:

  - The correct From RouteID, From Measure, To Measure, and From Date, To Date should be applied to the output record
  - The correct shape should be built (if the output format is a feature class), which begins/ends at the correct locations on the route
This will also impact the Query Attribute Set REST endpoint since the code is shared

## Slide 4 — Testing

Test the following scenarios:

  - Route with vertical segment
  - Route with vertical gap
  - Line Network
  - Non Line Network
  - Test events that go across an entire vertical segment, across an entire vertical gap, are completely on a vertical segment, start in a vertical segment and end beyond it, start before a vertical segment and ends on the vertical segment
Will also need to verify the behavior in the Query Attribute Set REST endpoint
Test plan will need to include both inputs and outputs, including measures, for all cases

## Slide 5 — Automation

Add vertical segment/gaps cases to the existing python automation for Overlay Events

## Slide 6 — Documentation

Add a usage note to the Overlay Events topic mentioning support for vertical segments/gaps

## Slide 7 — Assignment

Story Points:
Dev:
PE:
