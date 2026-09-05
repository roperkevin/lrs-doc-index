# Support Event Behaviors on Vertical Route Shapes in Realign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [VerticalRoutesEventBehaviorRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorRealign.pptx>) |
| **Edited** | 2020-08-14 00:18 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Vertical Route Shapes in Realign Route"
source_file: "VerticalRoutesEventBehaviorRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorRealign.pptx"
doc_id: 761
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-14T00:18:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical route", "event behavior", "realign route", "stay put", "move", "retire", "location referencing", "route realignment"]
tools: []
products: []
issues: []
related: [{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":9.601},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":9.268},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":9.021},{"doc":763,"file":"support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md","s":8.987},{"doc":760,"file":"support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md","s":8.62}]
```
-->

## Summary

This document describes the user story for supporting event behaviors on vertical route shapes during realignments or abandonments in Location Referencing. It outlines the expected behaviors for events on vertical segments when routes are realigned, including Stay Put, Move, and Retire behaviors, and specifies testing and automation requirements.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.80 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.69 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:762 -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md>) — similar text 0.67 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Vertical Route Shapes in Realign Route

User Story

## Slide 2 — User Story

As a Location Referencing editor, I need to be able to apply event behaviors for vertical route shapes that are realigned/abandoned in Location Referencing, so the events located on the realigned/abandoned route have their measures and shapes kept up to date.

## Slide 3 — Realign Route Event Behaviors

When realigning/abandoning a vertical route, continue to write to the edit log as we do today
Realignments can result in the following:

  - Vertical segments being shortened/lengthened
  - Vertical segments being created
  - Vertical segments being removed
For each of these scenarios, we should continue to apply Realign Route Event Behaviors the same way, even if the realignment could result in the vertical segments changing

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
Abandoned portions of route should be handled the same way they are today for non vertical route shapes
After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
Should work for vertical route test cases from the Realign vertical route user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with realign at the beginning/middle/end/all of the route on routes with the following events:

  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
Limit the testing to just these event types

## Slide 5 — Automation

Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Slide 6 — Documentation

Add a note to realign route event behavior topic to mention vertical shapes being supported

## Slide 7 — Assignment

Story Points:
Dev:
Test Plan PE:
