# Split Centerlines in Local Scenes in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SplitCenterlineVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitCenterlineVerticalRoutes.pptx>) |
| **Edited** | 2020-08-06 22:55 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Split Centerlines in Local Scenes in Pro"
source_file: "SplitCenterlineVerticalRoutes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitCenterlineVerticalRoutes.pptx"
doc_id: 766
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-08-06T22:55:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["split centerline", "vertical pipe segment", "local scene", "route", "centerline", "arcgis pro"]
tools: ["Split Centerline by Point", "Split Centerline by Measure", "Split Centerline into Single Part Features", "Core Split Tool"]
products: []
issues: []
related: [{"doc":769,"file":"lrs-identify-in-local-scenes-in-pro__doc769.md","s":5.076},{"doc":772,"file":"support-cartorealign-in-local-scenes-in-pro__doc772.md","s":4.681},{"doc":770,"file":"support-retire-route-in-local-scenes-in-pro__doc770.md","s":4.65},{"doc":775,"file":"support-extend-route-in-local-scenes-in-pro__doc775.md","s":4.642},{"doc":773,"file":"support-reassign-route-in-local-scenes-in-pro__doc773.md","s":4.566}]
```
-->

## Summary

User story describing the need for LRS editors to split centerlines on routes with vertical pipe segments in local scenes within ArcGIS Pro. It details the expected functionality of split centerline tools and outlines testing scenarios for various segment types including vertical segments and gaps.

## Related documents

<!-- related:begin -->
- [LRS Identify in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-in-local-scenes-in-pro__doc769.md>) — similar text 0.56 · 3 title words · same kind/surface/folder <!-- rel:769 -->
- [Support CartoRealign in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-cartorealign-in-local-scenes-in-pro__doc772.md>) — similar text 0.43 · 3 title words · same kind/surface/folder <!-- rel:772 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro__doc770.md>) — similar text 0.47 · 3 title words · same kind/surface/folder <!-- rel:770 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro__doc775.md>) — similar text 0.42 · 3 title words · same kind/surface/folder <!-- rel:775 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro__doc773.md>) — similar text 0.44 · 3 title words · same kind/surface/folder <!-- rel:773 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-point.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-multipart-centerlines-into-single-part-features.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Core Split Tool](https://www.google.com/search?q=%22Core%20Split%20Tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Split Centerlines in Local Scenes in Pro

User Story

## Slide 2 — User Story

As an LRS editor, I need to be able to split centerlines on routes that include vertical pipe segments, so that I can keep the centerlines in sync with the routes they’re associated with.

## Slide 3 — Split Centerline in local scene

In a local scene, users should be able to do the following:

  - Select all 3 of the split centerline tools from the Location Referencing ribbon
  - Click any centerline/route in the scene and have the correct measure/location be selected for splitting
In split centerline by point, when the user clicks a point (including on a vertical pipe segment or vertical gap), the graphic should appear where the click took place and the centerline should split at that location when executed
In split centerline by measure, when the user clicks the route (including on a vertical pipe segment or vertical gap), the UI should include the measure at the click location and the centerline should split at the location when executed
In split centerline into single part features, the centerlines selected should be exploded into single part features (including any vertical pipe segments or vertical gap)
For the core split tool, it should split wherever the user clicks (including on a vertical pipe segment or vertical gap)

## Slide 4 — Testing

Test in both line and non line networks
Test with projected and unprojected data
Test being able to split centerlines with all 4 methods (point, measure, into single part, core split)

  - On the middle of a vertical segment
  - On the end of a vertical segment
  - On a non vertical segment
  - On a vertical gap

## Slide 5 — Automation

None

## Slide 6 — Documentation

Add a note to the Split centerline topics to mention it works with scenes in Pro

## Slide 7 — Assignment

Story Points:
Dev:
PE:
