# Support Event Behaviors on Complex Route Shapes in Calibrate Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorCalibrate.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCalibrate.pptx>) |
| **Edited** | 2020-01-07 21:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Calibrate Route"
source_file: "ComplexRouteShapesEventBehaviorCalibrate.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCalibrate.pptx"
doc_id: 840
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-07T21:53:56Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "event behavior", "calibrate route", "route calibration", "loop route", "branched route", "event measures"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":841,"file":"support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md","s":10.422},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":10.338},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":10.191},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":10.155},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":9.553}]
```
-->

## Summary

This document describes a user story for applying event behaviors on complex calibrated route shapes such as loops, lollipops, alpha, and branched routes in Roads and Highways. It details how event measures and shapes should be updated during calibration, including behavior rules for Stay Put, Move, and Retire. Testing scenarios cover various complex shapes and network types, with automation planned via Python tests.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.68 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.55 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)

_No page matched:_ [calibrate route](https://www.google.com/search?q=%22calibrate%20route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Calibrate Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc63_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are calibrated in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the calibrated route have their measures and shapes kept up to date.

## Slide 3 — Calibrate Route Event Behaviors

When calibrating a complex route, continue to write to the edit log as we do today
Remember that recalibration downstream will result in a calibrate record in the edit log
For calibration, the shape of the route doesn’t change, but the measures do. When a calibration edit takes place (either by adding/editing/deleting a CP or through recalibration downstream from another edit type), continue to apply event behaviors in the same way we do today.

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Should work for all the test cases from the Calibrate Complex Route shapes user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Positive (for existing complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network
  - All examples from Calibrate Route Complex Shapes test plan
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Slide 5 — Documentation

Add a note to calibrate route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
