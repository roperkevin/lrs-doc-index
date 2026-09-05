# Support Event Behaviors on Complex Route Shapes in Reassign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorReassign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorReassign.pptx>) |
| **Edited** | 2020-01-17 01:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Reassign Route"
source_file: "ComplexRouteShapesEventBehaviorReassign.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorReassign.pptx"
doc_id: 837
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-17T01:02:18Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex shape", "event behavior", "reassign route", "route shape", "roads and highways", "loop", "lollipop", "alpha route", "branch route", "barbell"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":11.785},{"doc":841,"file":"support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md","s":10.963},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":10.647},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":10.398},{"doc":840,"file":"support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md","s":10.191}]
```
-->

## Summary

This user story describes the need for Roads and Highways editors to apply event behaviors for complex route shapes such as loops, lollipops, alpha, and branched routes during route reassignment. It outlines how event behaviors like Stay Put, Move, Snap, and Retire should be handled for various complex shape scenarios and specifies testing and documentation requirements.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.80 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-retire-route__doc841.md>) — similar text 0.69 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:841 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.63 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Reassign Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc68_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are reassigned in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the reassigned route(s) have their measures and shapes kept up to date.

## Slide 3 — Reassign Route Event Behaviors

When reassigning a complex route, continue to write to the edit log as we do today
Reassignments can result in the following for both the source and target routes:

  - Non complex shapes become complex
  - Complex shapes remain complex
  - Complex shapes become a different type of complex shape
  - Complex shapes become non complex
For each of these scenarios, we should continue to apply Reassign Route Event Behaviors the same way, even if the realignment could result in the route type changing:

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Snap, move the event features to the concurrent/abandoned route, update the route and measure if needed
  - For Retire, retire the event if it’s impacted by the edit
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
Should work for complex shape type test cases from the Reassign Complex Route shapes user story
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

Add a note to reassign route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
