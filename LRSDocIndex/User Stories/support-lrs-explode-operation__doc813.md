# Support LRS Explode Operation

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Support LRS Explode operation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20LRS%20Explode%20operation.pptx>) |
| **Edited** | 2020-05-04 16:34 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support LRS Explode Operation"
source_file: "Support LRS Explode operation.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20LRS%20Explode%20operation.pptx"
doc_id: 813
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: ""
last_edited: "2020-05-04T16:34:50Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerlines", "explode operation", "multi part centerline", "single part centerline", "rest endpoint", "location referencing"]
tools: ["Explode Centerline"]
products: []
issues: []
related: [{"doc":829,"file":"support-updating-cl-cls-when-using-explode-operation__doc829.md","s":8.091},{"doc":815,"file":"support-conflict-prevention-on-lrs-explode-operation__doc815.md","s":6.388},{"doc":817,"file":"explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md","s":4.574},{"doc":825,"file":"spike-patterns-to-hook-into-explode-tool__doc825.md","s":3.412},{"doc":776,"file":"support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md","s":2.933}]
```
-->

## Summary

User story for creating an Explode Centerline tool to break multi part centerlines into single part centerlines for editing and calibration. Includes UI and REST endpoint requirements, testing scenarios, and documentation needs.

## Related documents

<!-- related:begin -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation__doc829.md>) — similar text 0.78 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:829 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation__doc815.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:815 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:817 -->
- [Spike: Patterns to hook into Explode tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-patterns-to-hook-into-explode-tool__doc825.md>) — similar text 0.31 · 1 title word · 1 filename word · same surface/folder <!-- rel:825 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:776 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-multipart-centerlines-into-single-part-features.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [Explode Centerline](https://www.google.com/search?q=%22Explode%20Centerline%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support LRS explode operation

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to break multi part centerlines into single part, so that routes with complex shapes can be edited and calibrated in the software.

## Slide 3 — Exploding multi part centerlines (UI)

Create an Explode Centerline tool to be placed on the Location Referencing ribbon
Will need an icon for the tool
Support this only for LR/VMS enabled services
UX is for the user is as following:

  - Select one or more centerlines using the Pro selection tools
  - Click the new explode tool then execute the logic

## Slide 4 — Exploding multi part centerlines (REST)

Create a REST endpoint for this tool to execute the logic outlined below
When executing the tool on a multi part centerline with a centerline ID GUID populated:

  - Explode the multi part centerline into multiple single part centerline features
  - Create a new centerline ID GUID for each new centerline record created by the Explode; update the centerline sequence table
If the centerline ID GUID is not populated, explode the centerline into multiple centerlines and leave the centerline ID GUID empty
Use the LRS split centerline tool as a guide for how to build this tool

## Slide 5 — Testing

Verify in REST and Pro
Negative

  - Explode a multi part centerline with no centerline ID GUID
  - Explode a single part centerline
  - Use the multi part to single part centerline GP tool (shouldn’t do anything)
Positive

  - Explode on a single centerline
  - Explode on selection of multiple centerlines
  - Explode a gapped multi part centerline
  - Explode a complex shape multi part centerline

## Slide 6 — Doc

Create a help topic for the tool that discusses its usage
Document the new REST operation within the existing REST help for linear referencing operations

## Slide 7 — Assignment

Story Points:
Dev:
PE:
