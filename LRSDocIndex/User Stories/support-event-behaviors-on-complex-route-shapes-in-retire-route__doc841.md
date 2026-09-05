# Support Event Behaviors on Complex Route Shapes in Retire Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesEventBehaviorRetire.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorRetire.pptx>) |
| **Edited** | 2020-01-07 17:28 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Event Behaviors on Complex Route Shapes in Retire Route"
source_file: "ComplexRouteShapesEventBehaviorRetire.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesEventBehaviorRetire.pptx"
doc_id: 841
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-07T17:28:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event behavior", "complex shape", "retire route", "loop", "lollipop", "alpha route", "branch route", "barbell"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":837,"file":"support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md","s":10.963},{"doc":836,"file":"support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md","s":10.771},{"doc":840,"file":"support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md","s":10.422},{"doc":839,"file":"support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md","s":10.224},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":9.643}]
```
-->

## Summary

Describes the need for Roads and Highways editors to apply event behaviors for complex route shapes such as loops, lollipops, alpha, and branched routes when retiring routes. Specifies how event behaviors like Stay Put, Move, and Retire should be handled and outlines testing scenarios including positive and negative cases. Mentions documentation updates to include support for complex shapes.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-reassign-route__doc837.md>) — similar text 0.69 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:837 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-realign-route__doc836.md>) — similar text 0.67 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:836 -->
- [Support Event Behaviors on Complex Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-calibrate-route__doc840.md>) — similar text 0.72 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:840 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-extend-route__doc839.md>) — similar text 0.70 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:839 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/complex-shapes.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)
<!-- docs:end -->

---

## Slide 1 — Support Event Behaviors on Complex Route Shapes in Retire Route

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc65_slide2.svg)

As a Roads and Highways editor, I need to be able to apply event behaviors for complex route shapes that are retired in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events located on the retired route have their measures and shapes kept up to date.

## Slide 3 — Retire Route Event Behaviors

When retiring a complex route, continue to write to the edit log as we do today
Most retirements on complex shapes will not result in the shape changing to a different type of complex shape.  For retirements where the complex shape type changes (retire the loop portion of an alpha, retire the middle portion of a loop, etc.), continue to apply event behaviors in the same way we do today.

  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
Don’t split events that span across self intersection points, but do allow them to be multi part like the route is at those locations
Consider the recalibrate downstream and calibrate event behavior will apply to the downstream events if checked
Should work for all the test cases from the Retire Complex Route shapes user story
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
  - All examples from Retire Route Complex Shapes test plan
Negative

  - LocErrors for partial matches
Automation

  - Python – Add a set of tests for complex route shapes in the same manner as the non-complex and gapped route shape tests in place today

## Slide 5 — Documentation

Add a note to retire route event behavior topic to mention complex shapes being supported

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
