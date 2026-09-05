# Support Event Behaviors on Vertical Route Shapes in Retire Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [VerticalRoutesEventBehaviorRetire.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorRetire.pptx>) |
| **Edited** | 2020-08-14 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Vertical Route Shapes in Retire Route"
source_file: "VerticalRoutesEventBehaviorRetire.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorRetire.pptx"
doc_id: 763
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-14T00:03:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical route", "retire route", "event behavior", "location referencing", "route editing", "event measures"]
tools: []
products: []
issues: []
related: [{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":9.238},{"doc":760,"file":"support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md","s":9.166},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":9.152},{"doc":761,"file":"support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md","s":8.987},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":8.428}]
```
-->

## Summary

This document describes the user story for supporting event behaviors on vertical routes that are retired in Location Referencing. It details the expected behaviors for events on vertical route segments during retire operations and outlines testing and automation plans. The document also includes notes on updating documentation to reflect vertical route support.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.77 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-extend-route__doc760.md>) — similar text 0.85 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.79 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.56 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Vertical Route Shapes in Retire Route

User Story

## Slide 2 — User Story

As a Location Referencing editor, I need to be able to apply event behaviors for vertical routes that are retire in Location Referencing, so the events located on the extended route have their measures and shapes kept up to date.

## Slide 3 — Retire Route Event Behaviors

When retiring a vertical route (beginning, middle, end, all), continue to write to the edit log as we do today
Retirements on vertical shapes will not result in the shape changing (but could introduce a vertical gap; continue to apply event behaviors in the same way we do today.

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
Should work for all vertical route test cases from the Retire vertical route user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with retire at the beginning, middle, end, and all of the route on routes with the following events:

  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
Limit the testing to just these event types

## Slide 5 — Automation

Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Slide 6 — Documentation

Add a note to retire route event behavior topic to mention vertical routes being supported

## Slide 7 — Assignment

Story Points:
Dev:
Test Plan PE:
