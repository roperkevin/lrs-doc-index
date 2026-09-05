# Spike: Reverse Stationing

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike Reverse Stationing.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reverse%20Stationing.pptx>) |
| **Edited** | 2021-09-03 01:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Reverse Stationing"
source_file: "Spike Reverse Stationing.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reverse%20Stationing.pptx"
doc_id: 695
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2021-09-03T01:00:37Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse stationing", "route editing", "centerline direction", "edit log", "event behavior", "line network", "non line network"]
tools: ["Create Route", "Extend Route", "Realign Route", "Reassign Route"]
products: []
issues: []
related: [{"doc":629,"file":"investigate-line-order-with-reverse-stationing__doc629.md","s":4.771},{"doc":630,"file":"investigate-generate-routes-with-reverse-stationing__doc630.md","s":4.391},{"doc":728,"file":"support-reverse-route-event-behaviors__doc728.md","s":2.966},{"doc":739,"file":"support-reverse-route-event-behaviors__doc739.md","s":2.906},{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":2.874}]
```
-->

## Summary

Investigation of how Reverse Stationing is supported in LRS editing tools. Verification of direction requirements for centerlines and measure values in various route editing scenarios. Assessment of edit log correctness and event behavior support for reverse stationing activities.

## Related documents

<!-- related:begin -->
- [Investigate Line Order with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-line-order-with-reverse-stationing__doc629.md>) — similar text 0.31 · 2 title words · 2 filename words · same surface/folder <!-- rel:629 -->
- [Investigate Generate Routes with Reverse Stationing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/investigate-generate-routes-with-reverse-stationing__doc630.md>) — similar text 0.40 · 2 title words · 2 filename words · same surface/folder <!-- rel:630 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc728.md>) — similar text 0.25 · 1 title word · 1 filename word · same surface/folder <!-- rel:728 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc739.md>) — similar text 0.23 · 1 title word · 1 filename word · same surface/folder <!-- rel:739 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.22 · same surface/folder <!-- rel:601 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Reverse Stationing

Spike

## Slide 2 — Reverse Stationing

Investigate how Reverse Stationing in supported in the LRS editing tools
Verify the following for each scenario/tool below:

  - Does the centerline need to be in the opposite direction to make the edit go through? (if applicable to the edit)
  - Does the To Measure need to be less than the From Measure to make the edit go through?
  - Is the edit log written correctly to support whichever event behaviors are supported for the edit activity type?
Try this in the following scenarios/tools:

  - Create Route on a line network when the centerline(s) are in the opposite direction of the existing routes on the line
  - Extend Route when the centerline(s) are in the opposite direction of the route on a line and non line network (this scenario shouldn’t be supported)
  - Realign Route when the centerline(s) are in the opposite direction of the route(s) being realigned in a line network
  - Reassign Route when the newly created route needs to be in the opposite direction in a line and non line network
Based on the findings, we’ll determine what additional changes to the route editing tools, the edit log, or event behaviors need to be made to bring all these tools into alignment for reverse stationing

## Slide 3 — Assignment

Story Points:
Dev:
