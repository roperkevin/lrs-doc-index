# LRS Identify in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [LRSIdentifyScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LRSIdentifyScenes.pptx>) |
| **Edited** | 2020-08-06 21:28 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Identify in Local Scenes in Pro"
source_file: "LRSIdentifyScenes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LRSIdentifyScenes.pptx"
doc_id: 769
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-06T21:28:36Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["vertical segment", "measure", "route attributes", "local scene", "3d measure", "lrs identify"]
tools: ["LRS Identify"]
products: []
issues: []
related: [{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":5.902},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":5.845},{"doc":778,"file":"support-create-route-in-local-scenes-in-pro__doc778.md","s":5.599},{"doc":774,"file":"support-calibrate-route-in-local-scenes-in-pro__doc774.md","s":5.15},{"doc":766,"file":"split-centerlines-in-local-scenes-in-pro__doc766.md","s":5.076}]
```
-->

## Summary

This document describes a user story for the LRS Identify tool in ArcGIS Pro local scenes. It specifies the need to identify measures and attributes on routes including vertical pipe segments, ensuring correct 3D measure display. Testing scenarios include line and non-line networks with projected and unprojected data, focusing on measure accuracy at various vertical and non-vertical locations.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.55 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:770 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.53 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:773 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro__doc778.md>) — similar text 0.45 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:778 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro__doc774.md>) — similar text 0.42 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:774 -->
- [Split Centerlines in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-centerlines-in-local-scenes-in-pro__doc766.md>) — similar text 0.56 · 3 title words · same kind/surface/folder <!-- rel:766 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — LRS Identify in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to identify measures and other LRS characteristics on routes that include vertical pipe segments, so that I can find the measure/attributes for the route at any location.

## Slide 3 — LRS Identify in local scene

In a local scene, users should be able to do the following:

  - Select the LRS Identify tool from the Location Referencing ribbon
  - Click any route in the scene and have the LRS Identify pop up appear with the correct measure and all attributes populated (this should include getting the correct measure for any part of a vertical segment of pipe)
  - Verify that the measure included is in 3D (should already be there)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test the measure provided is correct at the following locations:

  - On the middle of a vertical section
  - On either end of a vertical section
  - On a non vertical section
Verify 3D is honored (only 2-3 test cases needed) in the measure shown (make sure at least one of these includes a vertical segment on the route)

## Slide 5 — Automation

None

## Slide 6 — Documentation

Add a note to the LRS Identify topic to mention it works with scenes in Pro

## Slide 7 — Assignment

Story Points:
Dev:
PE:
