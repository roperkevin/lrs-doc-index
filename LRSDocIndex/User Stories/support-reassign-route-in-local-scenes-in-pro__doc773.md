# Support Reassign Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportReassignRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReassignRouteinScenes.pptx>) |
| **Edited** | 2020-07-29 18:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Reassign Route in Local Scenes in Pro"
source_file: "SupportReassignRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportReassignRouteinScenes.pptx"
doc_id: 773
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-29T18:21:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign route", "vertical pipe segment", "local scene", "3d support", "calibration", "route reassignment"]
tools: ["Reassign Route"]
products: []
issues: []
related: [{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":9.029},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":7.797},{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":7.771},{"doc":771,"file":"support-realign-route-in-local-scenes-in-pro__doc771.md","s":7.64},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":7.564}]
```
-->

## Summary

This document describes a user story for enabling LRS editors to reassign routes that include vertical pipe segments within local scenes in ArcGIS Pro. It specifies UI behavior, 3D measure support, and testing scenarios for reassigning routes with vertical segments. It also outlines automation testing and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.82 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.57 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro__doc771.md>) — similar text 0.66 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.51 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html)
<!-- docs:end -->

---

## Slide 1 — Support Reassign Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to reassign routes that include vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When clicking the Reassign Route tool in a local scene, the UI should open like it does in normal maps within Pro today

## Slide 4 — Reassign Route in local scene

In a local scene, users should be able to do the following:

  - Suggested measures should be in 3D (this includes any vertical section)
  - If the selected From/To Measure fall on a vertical section of the route, make sure they display the graphic in the correct location

## Slide 5 — Reassign Route 3D

Verify 3D support in Reassign Route; verify Z values are honored:

  - For the calibration applied to the source and target routes (should already be there for everything but vertical pipe segments)
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with reassignments:

  - Target route portion is completely on a vertical segment, is partially on a vertical segment, is on a non vertical segment
  - Source route portion is completely on a vertical segment, is partially on a vertical segment, is on a non vertical segment
Verify 3D is honored (only 2-3 test cases needed) in the calibration applied (make sure at least one of these includes a vertical segment on the route)
Test a case where a either the source or target reassigned portion includes a vertical gap
Test a case where either the source or target route is a complex route shape

## Slide 7 — Automation

UI Automation – Should have 4-5 tests for the UI for Reassign Route

## Slide 8 — Documentation

Add a note to the existing reassign route topics that outlines how to make edits if there is a vertical pipe segment.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
