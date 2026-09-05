# Support Extend Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportExtendRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportExtendRouteinScenes.pptx>) |
| **Edited** | 2020-07-24 21:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Extend Route in Local Scenes in Pro"
source_file: "SupportExtendRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportExtendRouteinScenes.pptx"
doc_id: 775
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-24T21:09:02Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["extend route", "vertical centerline", "local scene", "3d support", "route extension", "centerline reorder"]
tools: ["Extend Route"]
products: []
issues: []
related: [{"doc":771,"file":"support-realign-route-in-local-scenes-in-pro__doc771.md","s":8.901},{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":7.948},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":7.855},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":7.771},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":7.647}]
```
-->

## Summary

This document describes a user story for enabling LRS editors to extend routes using vertical pipe segments in ArcGIS Pro local scenes. It specifies UI behavior, 3D support requirements, and testing scenarios for extending routes with vertical and non-vertical centerlines. It also outlines automation testing and documentation updates related to this feature.

## Related documents

<!-- related:begin -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro__doc771.md>) — similar text 0.86 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.68 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

## Slide 1 — Support Extend Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to extend routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When clicking the Extend Route tool in a local scene, the UI should open like it does in normal maps within Pro today

## Slide 4 — Extend Route in local scene

In a local scene, users should be able to do the following:

  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Extend Route UI
  - Use those selected centerlines, include vertical centerlines, to extend a route
  - Any graphics on the map (blue centerline selection arrow and order number) should appear in 3D
  - Suggested measures should be in 3D

## Slide 5 — Extend Route 3D

Verify 3D support in Extend Route; verify Z values are honored:

  - For the suggested measures in the UI (should already be there)
  - For the calibration applied to the route (should already be there)
For extends where the centerline is a vertical pipe, make sure the Extend Location option populates correctly and is honored
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with both vertical (focus on this) and non vertical centerlines
Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
Select vertical centerlines and verify the centerline reorder options work in the Extend Route UI
Test a case where a route is extended with centerlines with a vertical gap
Test a case or two with a non vertical centerline that makes up a complex shape
Use a combination of a single and multiple centerlines to extend a route

## Slide 7 — Automation

UI Automation – Should have 4-5 tests for the UI for Extend Route

## Slide 8 — Documentation

Add to the existing topic being created for Create Route that outlines support for vertical pipes.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
