# Support updating CL/CLS when using explode operation

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Support updating CL_CLS when using explode operation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20CL_CLS%20when%20using%20explode%20operation.pptx>) |
| **Edited** | 2020-03-26 23:04 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support updating CL/CLS when using explode operation"
source_file: "Support updating CL_CLS when using explode operation.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20CL_CLS%20when%20using%20explode%20operation.pptx"
doc_id: 829
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-03-26T23:04:09Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "explode operation", "centerline id guid", "centerline sequence", "feature service", "conflict prevention"]
tools: ["explode"]
products: []
issues: []
related: [{"doc":813,"file":"support-lrs-explode-operation__doc813.md","s":8.091},{"doc":815,"file":"support-conflict-prevention-on-lrs-explode-operation__doc815.md","s":6.492},{"doc":817,"file":"explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md","s":4.577},{"doc":825,"file":"spike-patterns-to-hook-into-explode-tool__doc825.md","s":3.448},{"doc":776,"file":"support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md","s":2.978}]
```
-->

## Summary

Describes a user story for enabling the explode tool to break multi part centerlines into single part centerlines in Location Referencing enabled feature services. Details the expected behavior of updating centerline IDs and sequence tables, conflict prevention, and testing scenarios for both positive and negative cases.

## Related documents

<!-- related:begin -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation__doc813.md>) — similar text 0.78 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:813 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation__doc815.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:815 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities-and-append-routes__doc817.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:817 -->
- [Spike: Patterns to hook into Explode tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-patterns-to-hook-into-explode-tool__doc825.md>) — similar text 0.32 · 1 title word · 1 filename word · same surface/folder <!-- rel:825 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping-centerlines-gp-tool__doc776.md>) — similar text 0.19 · 1 title word · same kind/surface/folder <!-- rel:776 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [explode](https://www.google.com/search?q=%22explode%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support updating CL/CLS when using explode operation

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able use the explode tool to break multi part centerlines into single part, so that routes with complex shapes can be edited and calibrated in the software.

## Slide 3 — Exploding multi part centerlines

Support this only for LR enabled Feature Services
When running the explode editing operation on a multi part centerline with a centerline ID GUID populated:

  - Allow the explode operation to go through to the geodatabase and split the multi part centerline into multiple single part centerlines
  - Alert the LRS Controller Dataset that one centerline has become more than one centerline
  - Create a new centerline ID GUID for each new centerline record created by the Explode; update the centerline sequence table
If the centerline ID GUID is not populated, explode the centerline into multiple centerlines and honor the gdb split rules in place (no LRS action)
Support Conflict Prevention in the same manner we do for split centerline operation

## Slide 4 — Testing

Verify in REST and Pro
Negative

  - Explode a multi part centerline with no centerline ID GUID (no LRS action)
  - Explode a single part centerline (should fail)
  - Use the multi part to single part centerline GP tool (shouldn’t do anything)
Positive

  - Explode a gapped multi part centerline
  - Explode a complex shape multi part centerline

## Slide 5 — Automation

Should we automate?  If so, REST and Test Complete

## Slide 6 — Doc

Add a note about explode being able to update the centerline and centerline sequence tables when executed on the centerline feature class
Where should we document this?

## Slide 7 — Assignment

Story Points:
Dev:
PE:
