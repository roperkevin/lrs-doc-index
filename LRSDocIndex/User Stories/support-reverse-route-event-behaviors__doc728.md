# Support Reverse Route Event Behaviors

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [SupportConfiguringReverseRouteEventBehaviors.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportConfiguringReverseRouteEventBehaviors.pptx>) |
| **Edited** | 2021-03-08 18:03 by Jim Gardner |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Reverse Route Event Behaviors"
source_file: "SupportConfiguringReverseRouteEventBehaviors.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportConfiguringReverseRouteEventBehaviors.pptx"
doc_id: 728
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Jim Gardner"
last_edited: "2021-03-08T18:03:22Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse route", "event behavior", "route calibration", "lrs editor", "retire route", "stay put", "move"]
tools: ["Configure Event Behaviors", "Configure External Event"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":739,"file":"support-reverse-route-event-behaviors__doc739.md","s":8.768},{"doc":743,"file":"support-reverse-route-in-pro__doc743.md","s":6.89},{"doc":742,"file":"support-reverse-route-in-rest__doc742.md","s":5.924},{"doc":730,"file":"support-snap-event-behavior-in-realign-route__doc730.md","s":5.196},{"doc":759,"file":"support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md","s":5.107}]
```
-->

## Summary

This document describes the user story for supporting reverse route event behaviors in the LRS. It covers the need for LRS editors to reverse route directions and apply event behaviors such as Stay Put, Move, and Retire. It also includes testing, automation, and documentation updates related to reverse route event behaviors.

## Related documents

<!-- related:begin -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-event-behaviors__doc739.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:739 -->
- [Support Reverse Route in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-pro__doc743.md>) — similar text 0.61 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:743 -->
- [Support Reverse Route in REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-in-rest__doc742.md>) — similar text 0.56 · 3 title words · 3 filename words · same kind/folder <!-- rel:742 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-event-behavior-in-realign-route__doc730.md>) — similar text 0.20 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:730 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-calibrate-route__doc759.md>) — similar text 0.19 · 4 title words · 1 filename word · same kind/surface/folder <!-- rel:759 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reverse-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html)

_No page matched:_ [Configure Event Behaviors](https://www.google.com/search?q=%22Configure%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Configure External Event](https://www.google.com/search?q=%22Configure%20External%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Reverse Route Event Behaviors

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to reverse routes and have event behaviors applied, so that the direction of calibration for the routes matches what is expected from design and engineering documents within the GIS and the events align as well.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these document.  A scenario that can occur is that the calibration direction of a route in the LRS is in the wrong direction.  Sometimes the route was calibrated incorrectly when added to the LRS and other times another edit that needs to be made in the LRS, like a realignment, requires the route calibration direction to be reversed.  When this occurs, the user will need to be able to reverse the route direction followed by having event behaviors applied to the route.

## Slide 3 — Configure Reverse Route Event Behaviors

Support configuration of Reverse Route Event Behaviors in the Configure Event Behaviors and Configure External Event geoprocessing tools

  - Support being able to configure Stay Put, Move, and Retire for Retire Route
Add Reverse Route event behaviors to the LRS Event Properties

## Slide 4 — Testing

Test in both line and non line networks (mix in projected and unprojected data)
Test on both Roads and Highways (focus on this) and Pipeline Referencing data (with the UN)

## Slide 5 — Automation

Add Reverse Route cases to the existing Configure Event Behaviors GP/Configure External Event GP automation

## Slide 6 — Documentation

Update all existing locations in the documentation where we list the event behaviors that can be configured to add Reverse Route
Includes the following topics: Configure Event Behaviors GP tool, Configure External Event GP tool, and the Event Behaviors topic (and possibly the Event Data Model topic as well)

## Slide 7 — Assignment

Story Points:
Dev:
PE:
