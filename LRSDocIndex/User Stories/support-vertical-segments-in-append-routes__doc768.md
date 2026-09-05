# Support Vertical Segments in Append Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AppendRoutesVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AppendRoutesVerticalRoutes.pptx>) |
| **Edited** | 2020-08-06 23:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Vertical Segments in Append Routes"
source_file: "AppendRoutesVerticalRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AppendRoutesVerticalRoutes.pptx"
doc_id: 768
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-06T23:29:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical segment", "vertical gap", "append routes", "route shape", "centerline"]
tools: ["Append Routes"]
products: []
issues: []
related: [{"doc":767,"file":"support-vertical-route-segments-in-translate-events-gp-tool__doc767.md","s":5.884},{"doc":765,"file":"support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md","s":5.878},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":4.646},{"doc":746,"file":"support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md","s":4.573},{"doc":741,"file":"append-routes-with-existing-utility-network-centerlines__doc741.md","s":4.487}]
```
-->

## Summary

This document describes a user story for enabling the Append Routes tool to support routes with vertical pipe segments and vertical gaps. It outlines the requirements for correct appending of such routes, testing scenarios including line and non-line networks, and automation updates. It also mentions documentation updates to reflect the new capability and removal of obsolete error messages.

## Related documents

<!-- related:begin -->
- [Support Vertical Route Segments in Translate Events GP Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-translate-events-gp-tool__doc767.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:767 -->
- [Support Vertical Route Segments in Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-vertical-route-segments-in-overlay-events-gp-tool__doc765.md>) — similar text 0.40 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:765 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.33 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:758 -->
- [Support Vertical Route Segments/3D Interpolation in Update Measures from LRS GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-vertical-route-segments-3d-interpolation-in-update-measures-from-lrs-gp__doc746.md>) — similar text 0.34 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:746 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-utility-network-centerlines__doc741.md>) — similar text 0.31 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:741 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Vertical Segments in Append Routes

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to append routes that include vertical pipe segments, so that I can properly load these routes as part of the LRS.

## Slide 3 — Append Routes

In the Append Routes tool, any source routes with vertical segments should be appended correctly
The route shape should include the vertical segment(s)
The centerline(s) with the vertical segment(s) should also be loaded
Should also include being able to append routes with vertical gaps
Currently these tools fail with an error message which should be removed and not appear when appending routes with vertical segments

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test all load methods (add, replace by RouteID, retire by RouteID)
Test with the following scenarios:

  - Route that is entirely vertical
  - Route that includes a vertical segment
  - Route that has a vertical gap
No need to test other scenarios as they’re already supported/automated

## Slide 5 — Automation

Add a few cases with vertical pipes to the existing python automation for Append Routes

## Slide 6 — Documentation

Add a usage note to the Append Routes topics to mention it supports the loading vertical segments
Do we need to remove any error messages that are no longer valid?

## Slide 7 — Assignment

Story Points:
Dev:
PE:
