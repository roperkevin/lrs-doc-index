# Support Event Behaviors on Vertical Route Shapes in Extend Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [VerticalRoutesEventBehaviorExtend.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorExtend.pptx>) |
| **Edited** | 2020-08-14 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Vertical Route Shapes in Extend Route"
source_file: "VerticalRoutesEventBehaviorExtend.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorExtend.pptx"
doc_id: 760
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-14T00:03:54Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical route", "event behavior", "extend route", "location referencing", "route extension", "event measures", "event shape"]
tools: []
products: []
issues: []
related: [{"doc":763,"file":"support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md","s":9.166},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":8.821},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":8.728},{"doc":761,"file":"support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md","s":8.62},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":8.167}]
```
-->

## Summary

User story describing the need to apply event behaviors for vertical routes extended in Location Referencing, ensuring events on extended routes have updated measures and shapes. It includes behavior rules for Stay Put, Move, and Retire during route extension, testing scenarios for line and non-line networks, and plans for automation and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-retire-route__doc763.md>) — similar text 0.85 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.71 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-realign-route__doc761.md>) — similar text 0.67 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.52 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Vertical Route Shapes in Extend Route

User Story

## Slide 2 — User Story

As a Location Referencing editor, I need to be able to apply event behaviors for vertical routes that are extended in Location Referencing, so the events located on the extended route have their measures and shapes kept up to date.

## Slide 3 — Extend Route Event Behaviors

When extending a vertical route (at the beginning or end), continue to write to the edit log as we do today
Since the route can only be extended at the beginning/end and the segment where existing measures exist can only have its measures changed, follow the same pattern like when a simple route geometry is extended.

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
Should work for all vertical route test cases from the Extend vertical route user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with extend at the beginning/end on routes with the following events:

  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
Limit the testing to just these event types

## Slide 5 — Automation

Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Slide 6 — Documentation

Add a note to extend route event behavior topic to mention vertical routes being supported

## Slide 7 — Assignment

Story Points:
Dev:
Test Plan PE:
