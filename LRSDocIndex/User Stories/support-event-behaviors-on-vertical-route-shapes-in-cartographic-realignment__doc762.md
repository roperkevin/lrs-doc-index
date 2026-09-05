# Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [VerticalRoutesEventBehaviorCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorCartoRealign.pptx>) |
| **Edited** | 2020-08-13 21:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment"
source_file: "VerticalRoutesEventBehaviorCartoRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorCartoRealign.pptx"
doc_id: 762
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-13T21:43:26Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical route", "cartographic realignment", "event behavior", "location referencing", "route editing", "event testing"]
tools: []
products: []
issues: []
related: [{"doc":761,"file":"support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md","s":9.021},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":8.47},{"doc":763,"file":"support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md","s":8.428},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":8.218},{"doc":760,"file":"support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md","s":8.167}]
```
-->

## Summary

This document describes the need to support event behaviors for vertical route shapes during cartographic realignment in Location Referencing. It outlines scenarios for vertical and non-vertical segment edits and specifies testing and automation requirements for these behaviors in both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:761 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.57 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md>) — similar text 0.56 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.54 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md>) — similar text 0.52 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment

User Story

## Slide 2 — User Story

As a Location Referencing editor, I need to be able to apply event behaviors for vertical route shapes that are cartographically realigned in Location Referencing, so the events located on the cartographically realigned route(s) have their measures and shapes kept up to date.

## Slide 3 — Cartographic Realignment Route Event Behaviors

When making a cartographic realignment to a vertical route, continue to write to the edit log as we do today
Cartographic Realignments can result in the following for both the source and target routes:

  - Existing vertical segments are edited but remain vertical
  - Existing vertical segments are edited to become non vertical
  - Existing non vertical segments are edited to become vertical
For each of these scenarios, we should continue to apply Cartographic Realignment event behaviors in the same way we do today.  This includes building the correct shape for both vertical and non vertical segments
Should work for vertical route test cases from the Cartographic Realignment Vertical Route shapes user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Test in both line and non line networks (can be combined to a single carto realignment)
Test with projected and unprojected data
Test with cartographic realignments on the following events:

  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
Limit the testing to just these event types and focus the cartographic realignments to editing the vertical segment(s)

## Slide 5 — Automation

Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Slide 6 — Documentation

Add a note to cartographic realignment route event behavior topic to mention vertical routes being supported

## Slide 7 — Assignment

Story Points:
Dev:
Test Plan PE:
