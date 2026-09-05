# Explode multipart centerlines in editing activities and Append Routes

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Explode multipart centerlines in Network Edting and Append Routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Explode%20multipart%20centerlines%20in%20Network%20Edting%20and%20Append%20Routes.pptx>) |
| **Edited** | 2020-05-01 00:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Explode multipart centerlines in editing activities and Append Routes"
source_file: "Explode multipart centerlines in Network Edting and Append Routes.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Explode%20multipart%20centerlines%20in%20Network%20Edting%20and%20Append%20Routes.pptx"
doc_id: 817
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-01T00:15:19Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "multipart", "explode", "editing activities", "append routes", "complex shape"]
tools: ["Append Routes"]
products: []
issues: []
related: [{"doc":815,"file":"support-conflict-prevention-on-lrs-explode-operation__doc815.md","s":6.196},{"doc":486,"file":"append-routes-consider-existing-centerlines__doc486.md","s":4.931},{"doc":829,"file":"support-updating-cl-cls-when-using-explode-operation__doc829.md","s":4.577},{"doc":813,"file":"support-lrs-explode-operation__doc813.md","s":4.574},{"doc":776,"file":"support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md","s":4.037}]
```
-->

## Summary

This user story describes the need for LRS editing activities and the Append Routes tool to automatically explode multipart centerlines to handle complex shapes and geometries more effectively. It specifies that multipart centerlines should be exploded during key editing operations and in Append Routes, with testing scenarios for both single part and complex geometries.

## Related documents

<!-- related:begin -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation__doc815.md>) — similar text 0.56 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:815 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-consider-existing-centerlines__doc486.md>) — similar text 0.16 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:486 -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation__doc829.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:829 -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation__doc813.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:813 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md>) — similar text 0.26 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:776 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-multipart-centerlines-into-singlepart-features.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-shapes.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Explode multipart centerlines in editing activities and Append Routes

User Story

## Slide 2 — User Story

As a LRS editor, I need LRS editing activities and Append Routes to automatically explode multipart centerlines, so that complex shapes and other geometries are more easily handled throughout LRS operations.

## Slide 3 — Exploding in LRS editing activities

Confirm that as part of the following LRS editing activities (Create, Extend, Realign, Reassign, Retire) that any multipart centerline is exploded as part of the operation

  - Realign Route already supports this; other network editing activities might as well
  - Follow the same pattern as in Realign Route for any editing activities that need this explode operation implemented
  - Document in the devtopia issue which tools already had this support and which had it implemented as part of this story
In Append Routes, any input route feature that is multi part should have the associated centerline exploded into single part centerlines (and ensure the centerline sequence bookkeeping is completed as part of this process)

## Slide 4 — Testing

Negative

  - Single part geometries as the input (ensure no regression)
Positive

  - Complex shape geometry
  - Physically gapped geometry

## Slide 5 — Doc

No documentation updates

## Slide 6 — Assignment

Story Points:
Dev:
PE:
