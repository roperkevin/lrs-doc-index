# Support Realign Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportRealignRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRealignRouteinScenes.pptx>) |
| **Edited** | 2020-07-28 21:25 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Realign Route in Local Scenes in Pro"
source_file: "SupportRealignRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRealignRouteinScenes.pptx"
doc_id: 771
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-28T21:25:45Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["realign route", "vertical centerline", "local scene", "3d support", "route editing", "centerline reorder"]
tools: ["Realign Route"]
products: []
issues: []
related: [{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":8.901},{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":7.826},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":7.64},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":7.526},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":7.313}]
```
-->

## Summary

This document describes a user story for enabling route realignment using vertical pipe segments in local scenes within ArcGIS Pro. It details UI behavior, 3D support requirements, testing scenarios including vertical and non-vertical centerlines, and automation test plans. It also includes documentation update instructions for realign route topics regarding vertical pipe segments.

## Related documents

<!-- related:begin -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.86 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.72 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.66 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Slide 1 — Support Realign Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to realign routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When clicking the Realign Route tool in a local scene, the UI should open like it does in normal maps within Pro today

## Slide 4 — Realign Route in local scene

In a local scene, users should be able to do the following:

  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Realign Route UI
  - Use those selected centerlines, include vertical centerlines, to Realign a route
  - Any graphics on the map (blue centerline selection arrow and order number) should appear in 3D
  - Suggested measures should be in 3D

## Slide 5 — Realign Route 3D

Verify 3D support in Realign Route; verify Z values are honored:

  - For the suggested measures in the UI (should already be there for non vertical centerlines)
  - For the calibration applied to the route (should already be there for non vertical routes)
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with vertical (focus on this) centerlines, non vertical centerlines, and a mix of both (focus on this)
Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
Select vertical centerlines and verify the centerline reorder options work in the Realign Route UI
Test a case where a route is realign with centerlines with a vertical gap
Test a case or two with a non vertical centerline that makes up a complex shape
Use a combination of a single and multiple centerlines to extend a route; for multiple centerlines make sure at least one is verical

## Slide 7 — Automation

UI Automation – Should have 4-5 tests for the UI for Realign Route

## Slide 8 — Documentation

Add a note to the existing realign route topics that outlines how to make edits if there is a vertical pipe segment.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
