# Support Event Behaviors on Complex Route Shapes in Cartographic Realignment

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCartoRealign.pptx>) |
| **Edited** | 2020-01-16 22:58 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Cartographic Realignment"
source_file: "ComplexRouteShapesEventBehaviorCartoRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorCartoRealign.pptx"
doc_id: 838
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-16T22:58:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "cartographic realignment", "event behavior", "route editing", "roads and highways", "loop", "lollipop", "alpha route", "branch route"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":10.919},{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":10.398},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":9.849},{"doc":841,"file":"support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md","s":9.643},{"doc":840,"file":"support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md","s":9.553}]
```
-->

## Summary

This user story addresses the need for Roads and Highways editors to apply event behaviors on complex route shapes that undergo cartographic realignment, including loops, lollipops, alpha, and branched routes. It ensures that events on these realigned routes maintain accurate measures and shapes. The story includes scenarios for different complex shape transformations and testing plans for both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.73 · 6 title words · 6 filename words · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.54 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md>) — similar text 0.55 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Cartographic Realignment

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc69_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are cartographically realigned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the cartographically realigned route(s) have their measures and shapes kept up to date.

## Slide 3 — Cartographic Realignment Route Event Behaviors

When making a cartographic realignment to a complex route, continue to write to the edit log as we do today
Cartographic Realignments can result in the following for both the source and target routes:

  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
For each of these scenarios, we should continue to apply Cartographic Realignment event behaviors in the same way we do today.
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Should work for complex shape type test cases from the Cartographic Realignment Complex Route shapes user story
Works in both non line and line networks (no Postmile as they don’t have events)

## Slide 4 — Testing

Positive (for existing, newly created, and former complex shapes)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (include abandonment)
  - Test begin-end, begin-middle, middle-middle, and middle-end
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Slide 5 — Documentation

Add a note to cartographic realignment route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
