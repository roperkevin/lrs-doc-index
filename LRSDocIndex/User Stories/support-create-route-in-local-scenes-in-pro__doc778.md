# Support Create Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportCreateRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCreateRouteinScenes.pptx>) |
| **Edited** | 2020-07-21 23:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Create Route in Local Scenes in Pro"
source_file: "SupportCreateRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCreateRouteinScenes.pptx"
doc_id: 778
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-21T23:26:41Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical pipe", "local scene", "create route", "centerline", "3d measures"]
tools: ["Create Route"]
products: []
issues: []
related: [{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":7.717},{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":7.647},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":7.564},{"doc":771,"file":"support-realign-route-in-local-scenes-in-pro__doc771.md","s":7.313},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":7.292}]
```
-->

## Summary

This document describes a user story for enabling route creation using vertical pipe segments within local scenes in ArcGIS Pro. It covers requirements for the Location Referencing ribbon activation, 3D measure support, and testing scenarios including vertical centerlines. It also outlines automation testing and documentation needs related to LRS editing in local scenes.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.56 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.51 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro__doc771.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.58 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html)
<!-- docs:end -->

---

## Slide 1 — Support Create Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to create routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When a user switches a map in ArcGIS Pro to a local scene and there are LRS layers in the map, the Location Referencing ribbon should appear and be active (no buttons greyed out)
Only support local scenes right now, we can revisit global scenes in the future

## Slide 4 — Create Route in local scene

In a local scene, users should be able to do the following:

  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Create Route UI
  - Use those selected centerlines, include vertical centerlines, to create a route
  - Suggested measures should be in 3D
Only support local scenes right now, we can revisit global scenes in the future

## Slide 5 — Create Route 3D

3D for Create Route has already been tested; verify Z values are honored:

  - For the suggested measures in the UI
  - For the calibration applied to the route
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with both vertical and non vertical centerlines
Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
Select vertical centerlines and verify the centerline reorder options work in the Create Route UI

## Slide 7 — Automation

TestComplete – Should have 4-5 tests for the UI for Create Route
ReadyAPI – Should have a 2-3 tests for REST using vertical pipes

## Slide 8 — Documentation

Create a topic related to support for LRS editing within local scenes.  Make sure to mention that this is how users would be able to edit vertical pipes.  As we complete future user stories related to vertical pipes, this topic can be added to.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
