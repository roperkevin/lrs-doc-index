# Support Complex Route Shapes in Apply Edits

|   |   |
| --- | --- |
| **Kind** | User Story · Server |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [ComplexRouteShapesApplyEdits.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesApplyEdits.pptx>) |
| **Edited** | 2019-12-17 19:51 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Complex Route Shapes in Apply Edits"
source_file: "ComplexRouteShapesApplyEdits.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesApplyEdits.pptx"
doc_id: 845
doc_kind: "User Story"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2019-12-17T19:51:35Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["complex route shape", "event editing", "apply edits", "rest endpoint", "roads and highways", "event merging", "event retiring"]
tools: ["Apply Edits"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":848,"file":"support-complex-route-shapes-in-generate-events__doc848.md","s":6.685},{"doc":844,"file":"support-complex-route-shapes-in-append-events__doc844.md","s":6.587},{"doc":872,"file":"support-complex-route-shapes-in-retire-route__doc872.md","s":6.367},{"doc":849,"file":"support-complex-route-shapes-in-generate-routes__doc849.md","s":6.032},{"doc":854,"file":"support-complex-route-shapes-in-realign-route__doc854.md","s":5.96}]
```
-->

## Summary

This user story addresses the need for Roads and Highways users to create, update, and delete event shapes on complex routes such as loops, lollipops, alpha, and branched routes using the Apply Edits REST endpoint. It ensures correct event shape handling for add, update, delete, merging, retiring, and splitting on complex route shapes in both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-events__doc848.md>) — similar text 0.58 · 4 title words · 3 filename words · same kind/folder <!-- rel:848 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events__doc844.md>) — similar text 0.63 · 4 title words · 3 filename words · same kind/folder <!-- rel:844 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route__doc872.md>) — similar text 0.42 · 4 title words · 3 filename words · same kind/folder <!-- rel:872 -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes__doc849.md>) — similar text 0.45 · 4 title words · 3 filename words · same kind/folder <!-- rel:849 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route__doc854.md>) — similar text 0.40 · 4 title words · 3 filename words · same kind/folder <!-- rel:854 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Apply Edits](https://www.google.com/search?q=%22Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support Complex Route Shapes in Apply Edits

User Story

## Slide 2 — User Story

As a Roads and Highways user, I need to be able to create, update, and delete event shapes located on complex route in Roads and Highways, such as loops, lollipops, alpha, and branched routes using REST, so the events can be used for analysis, reporting, and other needs.

## Slide 3 — Apply Edits

In the Apply Edits REST endpoint, ensure events that will be located on a complex route get the correct beginning/end points and the correct shape
This is just for the REST endpoint (Event Editor will be another user story)
Support this for add, update, and delete
Make sure to handle all of the methods related to merging and retiring (allowMerge, retireMeasureOverlap, and retireByEventID)
Honor the existing rules for splitting events (split at gaps with measure difference greater than 0)
Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
Works in both non line and line networks

## Slide 4 — Testing

Positive (Apply Edits to add, update, and delete)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Include cases to merge events on complex shapes
  - Include cases to retire events that overlap or have the same EventID
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Caltrans
  - With/without Z values (only for considering self intersection)
Negative

  - Underlying route not calibrated
Automation

  - Add cases to the existing REST automation for the endpoint

## Slide 5 — Documentation

Add a note to the existing Apply Edits topic (https://developers.arcgis.com/rest/services-reference/apply-edits.htm) about support for events on complex route shapes

## Slide 6 — Assignment

Story Points:
Dev:
Test Plan PE:
