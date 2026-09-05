# Support Event Behaviors on Vertical Route Shapes in Reassign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [VerticalRoutesEventBehaviorReassign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorReassign.pptx>) |
| **Edited** | 2020-08-14 00:24 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Vertical Route Shapes in Reassign Route"
source_file: "VerticalRoutesEventBehaviorReassign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorReassign.pptx"
doc_id: 758
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-14T00:24:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical route", "event behavior", "reassign route", "location referencing", "route editing", "event measures", "vertical segment"]
tools: []
products: []
issues: []
related: [{"doc":761,"file":"support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md","s":9.601},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":9.37},{"doc":763,"file":"support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md","s":9.238},{"doc":760,"file":"support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md","s":8.728},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":8.47}]
```
-->

## Summary

This document describes the user story for supporting event behaviors on vertical route shapes during route reassignment in Location Referencing. It details the expected behaviors for event measures and shapes when vertical segments are modified, created, or removed, and outlines testing and automation plans. The story ensures event behaviors like Stay Put, Move, Snap, and Retire are applied correctly for vertical routes in both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md>) — similar text 0.80 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.72 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md>) — similar text 0.77 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md>) — similar text 0.71 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.57 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Vertical Route Shapes in Reassign Route

User Story

## Slide 2 — User Story

As a Location Referencing editor, I need to be able to apply event behaviors for vertical route shapes that are reassigned in Location Referencing, so the events located on the reassigned route(s) have their measures and shapes kept up to date.

## Slide 3 — Reassign Route Event Behaviors

When reassigning a vertical route, continue to write to the edit log as we do today
Reassignments can result in the following for both the source and target routes:

  - Vertical segments being shortened/lengthened
  - Vertical segments being created
  - Vertical segments being removed
For each of these scenarios, we should continue to apply Reassign Route Event Behaviors the same way, even if the reassignment could result in the route type changing:

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Snap, move the event features to the concurrent route, update the route and measure if needed
  - For Retire, retire the event if it’s impacted by the edit
After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
Should work for vertical route test cases from the Reassign vertical route user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with reassign at the beginning/middle/end/all of the route on routes with the following events:

  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
Limit the testing to just these event types

## Slide 5 — Automation

Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Slide 6 — Documentation

Add a note to reassign route event behavior topic to mention vertical shapes being supported

## Slide 7 — Assignment

Story Points:
Dev:
Test Plan PE:
