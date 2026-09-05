# Support Event Behaviors on Complex Route Shapes in Realign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorRealign.pptx>) |
| **Edited** | 2020-01-16 18:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Realign Route"
source_file: "ComplexRouteShapesEventBehaviorRealign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorRealign.pptx"
doc_id: 836
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-16T18:47:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "realign route", "event behavior", "roads and highways", "loop", "lollipop", "alpha route", "branch route", "barbell"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":11.785},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":10.919},{"doc":841,"file":"support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md","s":10.771},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":10.59},{"doc":840,"file":"support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md","s":10.338}]
```
-->

## Summary

Describes the need for Roads and Highways editors to apply event behaviors on complex route shapes such as loops, lollipops, alpha, and branched routes during realignment or abandonment. Specifies how event behaviors like Stay Put, Move, and Retire should be applied to maintain event measures and shapes. Includes testing scenarios for various complex shapes and networks, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.80 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.73 · 6 title words · 6 filename words · same kind/surface/folder <!-- rel:838 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md>) — similar text 0.67 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.61 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Realign Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc67_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are realigned/abandoned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the realigned/abandoned route have their measures and shapes kept up to date.

## Slide 3 — Realign Route Event Behaviors

When realigning/abandoning a complex route, continue to write to the edit log as we do today
Realignments can result in the following:

  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
For each of these scenarios, we should continue to apply Realign Route Event Behaviors the same way, even if the realignment could result in the route type changing

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
Abandoned portions of route should be handled the same way they are today for non complex route shapes
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
Should work for complex shape type test cases from the Realign Complex Route shapes user story
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
  - Line Network
  - Test begin-end, begin-middle, middle-middle, and middle-end
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Slide 5 — Documentation

Add a note to realign route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
