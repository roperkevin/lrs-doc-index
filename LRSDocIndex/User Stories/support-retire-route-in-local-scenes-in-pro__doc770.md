# Support Retire Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportRetireRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRetireRouteinScenes.pptx>) |
| **Edited** | 2020-07-29 01:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Retire Route in Local Scenes in Pro"
source_file: "SupportRetireRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRetireRouteinScenes.pptx"
doc_id: 770
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-29T01:57:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["retire route", "vertical pipe segment", "local scene", "3d support", "route retirement", "calibration", "ui automation"]
tools: ["Retire Route"]
products: []
issues: []
related: [{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":9.029},{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":7.948},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":7.938},{"doc":771,"file":"support-realign-route-in-local-scenes-in-pro__doc771.md","s":7.826},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":7.717}]
```
-->

## Summary

This document describes a user story for enabling the retirement of routes that include vertical pipe segments within local scenes in ArcGIS Pro. It specifies UI behavior, 3D measure support, and testing scenarios for retiring routes in vertical and non-vertical segments. It also outlines automation testing and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.82 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.68 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro__doc771.md>) — similar text 0.72 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.56 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html)
<!-- docs:end -->

---

## Slide 1 — Support Retire Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to retire routes that include vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When clicking the Retire Route tool in a local scene, the UI should open like it does in normal maps within Pro today

## Slide 4 — Retire Route in local scene

In a local scene, users should be able to do the following:

  - Suggested measures should be in 3D
  - If the selected From/To Measure fall on a vertical section of the route, make sure they display the graphic in the correct location

## Slide 5 — Retire Route 3D

Verify 3D support in Retire Route; verify Z values are honored:

  - For the calibration applied to the route (should already be there for everything but vertical pipe segments)
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with retirements:

  - Completely in/on vertical segments of the route (focus on this)
  - Spanning across vertical segments of the route (focus on this)
  - On non-vertical segments of the route (1-2 cases to ensure it works)
Verify 3D is honored (only 2-3 test cases needed) in the calibration applied (make sure at least one of these includes a vertical segment on the route)
Test a case where a route is retired on a vertical gap

## Slide 7 — Automation

UI Automation – Should have 4-5 tests for the UI for Retire Route

## Slide 8 — Documentation

Add a note to the existing retire route topics that outlines how to make edits if there is a vertical pipe segment.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
