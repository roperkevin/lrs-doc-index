# Support Reverse Route Event Behaviors

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [SupportReverseRouteEventBehaviors.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRouteEventBehaviors.pptx>) |
| **Edited** | 2020-12-16 16:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Reverse Route Event Behaviors"
source_file: "SupportReverseRouteEventBehaviors.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReverseRouteEventBehaviors.pptx"
doc_id: 739
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-16T16:56:13Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse route", "event behavior", "route calibration", "lrs editor", "event spanning", "route direction", "automation"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":728,"file":"support-reverse-route-event-behaviors__doc728.md","s":8.768},{"doc":743,"file":"support-reverse-route-in-pro__doc743.md","s":7.33},{"doc":742,"file":"support-reverse-route-in-rest__doc742.md","s":5.927},{"doc":730,"file":"support-snap-event-behavior-in-realign-route__doc730.md","s":5.318},{"doc":838,"file":"support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md","s":5.124}]
```
-->

## Summary

This document describes the user story for enabling LRS editors to reverse route directions and apply event behaviors accordingly. It details the expected behavior for events spanning reversed routes, testing scenarios across different network types and shapes, automation via Python, and documentation updates. The goal is to ensure route calibration direction matches design expectations and events align properly after reversal.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc728.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:728 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro__doc743.md>) — similar text 0.63 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:743 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest__doc742.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:742 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-event-behavior-in-realign-route__doc730.md>) — similar text 0.24 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:730 -->
- [Support Event Behaviors on Complex Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-complex-route-shapes-in-cartographic-realignment__doc838.md>) — similar text 0.24 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)
<!-- docs:end -->

---

## Slide 1 — Support Reverse Route Event Behaviors

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to reverse routes and have event behaviors applied, so that the direction of calibration for the routes matches what is expected from design and engineering documents within the GIS and the events align as well.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur is that the calibration direction of a route in the LRS is in the wrong direction.  Sometimes the route was calibrated incorrectly when added to the LRS and other times another edit that needs to be made in the LRS, like a realignment, requires the route calibration direction to be reversed.  When this occurs, the user will need to be able to reverse the route direction followed by having event behaviors applied to the route.

## Slide 3 — Reverse Route Event Behaviors

When executing Apply Event Behaviors and a Reverse Route record is encountered, process it and apply the behavior configured (use the ArcMap event behaviors as a guide)
When the reverse is applied to an event spanning routes, do the following:

  - If the event is completely within the reversed section, reverse the event along in the same manner the routes were (the old From Route ID becomes the new To Route ID, the old To Route ID becomes the new From Route ID)
  - If the event extends beyond the reversed section, split the event at the boundary of the reverse then apply the rule above (similar to what we do for other event behaviors like realign/reassign for events spanning routes)
Use the ArcMap Reverse Route event behaviors as a guide since they should be applied the same way for non line networks or line networks where the event is located on a single route

## Slide 4 — Testing

Test in both line and non line networks (mix in projected and unprojected data)
Test on both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)
Test on the following shapes:

  - Simple, gapped, loop, lollipop, alpha, branch, barbell, vertical
Test with the following event configurations:

  - Entire Route, Beginning-Middle, Middle-Middle, Middle-End, Upstream of route-Middle, Middle-Beyond end of route
Consider using the same test data as the Reverse Route edit activity story
Utilize the Reverse Route test plan from ArcMap for any additional cases

## Slide 5 — Automation

Automate Reverse Route event behaviors via python in the same manner as the other LRS edit activities today

## Slide 6 — Documentation

Add Reverse Route event behaviors to the existing event behaviors topic we have today (will need both graphics and text)

## Slide 7 — Assignment

Story Points:
Dev:
PE:
