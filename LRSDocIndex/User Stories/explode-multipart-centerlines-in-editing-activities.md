# Explode multipart centerlines in editing activities and Append Routes

| Field | Value |
| --- | --- |
| **Doc** | 817 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Explode multipart centerlines in Network Edting and Append Routes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Explode%20multipart%20centerlines%20in%20Network%20Edting%20and%20Append%20Routes.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-01 00:15 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · multipart · explode · editing activities · append routes · complex shape |
| **Tools** | Append Routes |

## Summary

This user story describes the need for LRS editing activities and the Append Routes tool to automatically explode multipart centerlines to handle complex shapes and geometries more effectively. It specifies that multipart centerlines should be exploded during key editing operations and in Append Routes, with testing scenarios for both single part and complex geometries.

## Related documents

<!-- related:begin -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation.md>) — similar text 0.56 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:815 s=6.196 -->
- [Append Routes Consider Existing Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3004-append-routes-consider-existing-centerlines.md>) — similar text 0.16 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:486 s=4.931 -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:829 s=4.577 -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:813 s=4.574 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping.md>) — similar text 0.26 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:776 s=4.037 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-multipart-centerlines-into-singlepart-features.html) · [Complex shapes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/complex-shapes.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Explode multipart centerlines in editing activities and Append Routes <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS editor, I need LRS editing activities and Append Routes to automatically explode multipart centerlines, so that complex shapes and other geometries are more easily handled throughout LRS operations.

## Acceptance Criteria
### Exploding in LRS editing activities <!-- slide 3 -->
- Confirm that as part of the following LRS editing activities (Create, Extend, Realign, Reassign, Retire) that any multipart centerline is exploded as part of the operation
  - Realign Route already supports this; other network editing activities might as well
  - Follow the same pattern as in Realign Route for any editing activities that need this explode operation implemented
  - Document in the devtopia issue which tools already had this support and which had it implemented as part of this story
- In Append Routes, any input route feature that is multi part should have the associated centerline exploded into single part centerlines (and ensure the centerline sequence bookkeeping is completed as part of this process)

## Testing
<!-- slide 4 -->
- Negative
  - Single part geometries as the input (ensure no regression)
- Positive
  - Complex shape geometry
  - Physically gapped geometry

## Documentation
### Doc <!-- slide 5 -->
- No documentation updates

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
