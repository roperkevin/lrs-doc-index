# Support Event Behaviors on Complex Route Shapes in Extend Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorExtend.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorExtend.pptx>) |
| **Edited** | 2020-01-06 16:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Extend Route"
source_file: "ComplexRouteShapesEventBehaviorExtend.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorExtend.pptx"
doc_id: 839
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-06T16:58:05Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event behavior", "complex route shape", "extend route", "loop", "lollipop", "alpha route", "branch route", "barbell route"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":10.647},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":10.59},{"doc":841,"file":"support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md","s":10.224},{"doc":840,"file":"support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md","s":10.155},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":9.849}]
```
-->

## Summary

This document describes a user story for applying event behaviors to complex route shapes extended in Roads and Highways, including loops, lollipops, alpha, and branched routes. It outlines the expected behaviors for Stay Put, Move, and Retire event behaviors during route extension and specifies testing scenarios for various complex shapes in both line and non-line networks. It also includes notes on documentation updates and automation testing.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.61 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md>) — similar text 0.70 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md>) — similar text 0.68 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.54 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Extend Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc64_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are extended in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the extended route have their measures and shapes kept up to date.

## Slide 3 — Extend Route Event Behaviors

When extending a complex route (at the beginning or end), continue to write to the edit log as we do today
Since the route can only be extended at the beginning/end and the segment where existing measures exist can only have its measures changed, follow the same pattern like when a simple route geometry is extended.

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
Should work for all the test cases from the Extend Complex Route shapes user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Positive (for both existing and newly created complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network
  - All examples from Extend Route Complex Shapes test plan
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Slide 5 — Documentation

Add a note to extend route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
