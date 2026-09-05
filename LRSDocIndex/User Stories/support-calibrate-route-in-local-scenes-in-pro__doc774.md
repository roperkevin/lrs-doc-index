# Support Calibrate Route in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportCalibrateRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCalibrateRouteinScenes.pptx>) |
| **Edited** | 2020-07-27 20:38 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Calibrate Route in Local Scenes in Pro"
source_file: "SupportCalibrateRouteinScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCalibrateRouteinScenes.pptx"
doc_id: 774
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-07-27T20:38:49Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calibration point", "vertical pipe", "local scene", "3d support", "route calibration"]
tools: ["Add Calibration Point", "Edit Calibration Point", "Delete Calibration Point"]
products: []
issues: []
related: [{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":7.938},{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":7.855},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":7.797},{"doc":771,"file":"support-realign-route-in-local-scenes-in-pro__doc771.md","s":7.526},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":7.292}]
```
-->

## Summary

This document describes a user story for enabling calibration of routes using vertical pipe segments in local scenes within ArcGIS Pro. It details the expected behavior for adding, editing, and deleting calibration points in 3D scenes, including UI interactions and 3D measure support. Testing and automation plans are outlined to verify functionality across different network types and route complexities.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.57 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro__doc771.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.58 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html) · [Delete calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/delete-calibration-points.html)

_No page matched:_ [Edit Calibration Point](https://www.google.com/search?q=%22Edit%20Calibration%20Point%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Calibrate Route in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to calibrate routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Slide 3 — Local Scene

When clicking the Add, Edit, and Delete Calibration Point tools in a local scene, the map selection and UIs should open like they do in normal maps within Pro today

## Slide 4 — Calibrate Route in local scene

In a local scene, users should be able to do the following:

  - Add Calibration Point – once the tool is selected from the ribbon, the user should be able to click a route location on the scene and have the Add CP UI appear with the routeID/name of the route, the From Date of the route selected, and current measure at the selected location populated like it does in a normal map today.  When the user clicks run, the CP should be added and appear on the map.
  - Edit Calibration Point – once the tool is selected from the ribbon, the user should be able to click an existing calibration point on the scene and have the Edit CP UI appear with the routeID/name, From Date, and measure populated like it does in a normal map today.  When the user clicks run, the CP should be edited and appear on the map.
  - Delete Calibration Point – once the tool is selected from the ribbon, the user should be able to click an existing calibration point on the scene and have the Delete CP UI appear with the routeID/name, From Date, and measure populated, but greyed out and not editable like it does in a normal map today.  When the user clicks run, the CP should be deleted and the map should be refreshed.
  - Any graphics on the map should appear in 3D
  - Suggested measures for Add CP should be in 3D

## Slide 5 — Calibrate Route 3D

Verify 3D support in Add/Edit/Delete Calibration Point; verify Z values are honored:

  - For the suggested measures in the UI (Add only)
  - For the calibration applied to the route (all three)
Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Slide 6 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test with add/edit/delete CP on vertical pipes on both the vertical and non vertical portions
Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
Test one case on a route with a vertical gap
Test one case on a complex route shape

## Slide 7 — Automation

UI Automation – Should have 4-5 tests for the UI for Add/Edit/Delete CP

## Slide 8 — Documentation

Add to the existing topic being created for Calibrate Route that outlines support for vertical pipes.

## Slide 9 — Assignment

Story Points:
Dev:
PE:
