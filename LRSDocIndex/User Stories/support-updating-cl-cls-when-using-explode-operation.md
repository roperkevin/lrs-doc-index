# Support updating CL/CLS when using explode operation

| Field | Value |
| --- | --- |
| **Doc** | 829 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support updating CL_CLS when using explode operation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20CL_CLS%20when%20using%20explode%20operation.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-03-26 23:04 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerline · explode operation · centerline id guid · centerline sequence · feature service · conflict prevention |
| **Tools** | explode |

## Summary

Describes a user story for enabling the explode tool to break multi part centerlines into single part centerlines in Location Referencing enabled feature services. Details the expected behavior of updating centerline IDs and sequence tables, conflict prevention, and testing scenarios for both positive and negative cases.

## Related documents

<!-- related:begin -->
- [Support LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-explode-operation.md>) — similar text 0.78 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:813 s=8.091 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation.md>) — similar text 0.35 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:815 s=6.492 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:817 s=4.577 -->
- [Spike: Patterns to hook into Explode tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/patterns-to-hook-into-explode-tool.md>) — similar text 0.32 · 1 title word · 1 filename word · same surface/folder <!-- rel:825 s=3.448 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping.md>) — similar text 0.19 · 1 title word · same kind/surface/folder <!-- rel:776 s=2.978 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)

_No page matched:_ [explode](https://www.google.com/search?q=%22explode%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support updating CL/CLS when using explode operation <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able use the explode tool to break multi part centerlines into single part, so that routes with complex shapes can be edited and calibrated in the software.

## Acceptance Criteria
### Exploding multi part centerlines <!-- slide 3 -->
- Support this only for LR enabled Feature Services
- When running the explode editing operation on a multi part centerline with a centerline ID GUID populated:
  - Allow the explode operation to go through to the geodatabase and split the multi part centerline into multiple single part centerlines
  - Alert the LRS Controller Dataset that one centerline has become more than one centerline
  - Create a new centerline ID GUID for each new centerline record created by the Explode; update the centerline sequence table
- If the centerline ID GUID is not populated, explode the centerline into multiple centerlines and honor the gdb split rules in place (no LRS action)
- Support Conflict Prevention in the same manner we do for split centerline operation

## Testing
<!-- slide 4 -->
- Verify in REST and Pro
- Negative
  - Explode a multi part centerline with no centerline ID GUID (no LRS action)
  - Explode a single part centerline (should fail)
  - Use the multi part to single part centerline GP tool (shouldn’t do anything)
- Positive
  - Explode a gapped multi part centerline
  - Explode a complex shape multi part centerline

## Automation
<!-- slide 5 -->
- Should we automate?  If so, REST and Test Complete

## Documentation
### Doc <!-- slide 6 -->
- Add a note about explode being able to update the centerline and centerline sequence tables when executed on the centerline feature class
- Where should we document this?

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
