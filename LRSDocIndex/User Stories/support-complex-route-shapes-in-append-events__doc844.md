# Support Complex Route Shapes in Append Events

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesAppendEvents.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesAppendEvents.pptx>) |
| **Edited** | 2019-12-17 18:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Append Events"
source_file: "ComplexRouteShapesAppendEvents.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesAppendEvents.pptx"
doc_id: 844
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-17T18:56:15Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex route shape", "append events", "roads and highways", "geoprocessing", "event splitting", "line network", "non line network"]
tools: ["Append Events"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":848,"file":"support-complex-route-shapes-in-generate-events__doc848.md","s":9.311},{"doc":849,"file":"support-complex-route-shapes-in-generate-routes__doc849.md","s":7.964},{"doc":873,"file":"support-complex-route-shapes-in-extend-route__doc873.md","s":7.752},{"doc":855,"file":"support-complex-route-shapes-in-reassign-route__doc855.md","s":7.685},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":7.613}]
```
-->

## Summary

Describes the need for Roads and Highways users to append event shapes on complex routes such as loops, lollipops, alpha, and branched routes for analysis and reporting. Details the Append Events geoprocessing tool functionality to correctly handle complex route shapes and event methods, including testing scenarios and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-events__doc848.md>) — similar text 0.71 · 5 title words · 4 filename words · same kind/surface/folder <!-- rel:848 -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes__doc849.md>) — similar text 0.56 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:849 -->
- [Support Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-extend-route__doc873.md>) — similar text 0.39 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:873 -->
- [Support Complex Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-reassign-route__doc855.md>) — similar text 0.43 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:855 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.45 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:872 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Append Events

User Story

## Slide 2 — User Story

As a Roads and Highways user, I need to be able to append event shapes location on complex route in Roads and Highways, such as loops, lollipops, alpha, and branched routes, so the events can be used for analysis, reporting, and other needs.

## Slide 3 — Append Events

Works with source data/event layer as fgdb, direct connect (traditional or branch), and services
In the Append Events GP tool ensure events that will be located on a complex route get the correct beginning/end points and the correct shape
Make sure to handle all of the methods (Add, Retire Overlaps, Retire by EventID, Replace by EventID)
Honor the existing rules for splitting events (split at gaps with measure difference greater than 0)
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Works in both non line and line networks

## Slide 4 — Testing

Positive (Append Point and Line Events on a)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Caltrans
  - With/without Z values (only for considering self intersection)

Negative

  - Underlying route not calibrated
Automation

  - Primary - Python (Add to the existing Append Events automated tests)
  - Secondary - Feature Services as input

## Slide 5 — Documentation

Add a usage note to the existing GP tool topic about support for appending events on complex route shapes

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
