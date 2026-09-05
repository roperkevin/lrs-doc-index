# Support LRS Explode Operation

| Field | Value |
| --- | --- |
| **Doc** | 813 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support LRS Explode operation.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20LRS%20Explode%20operation.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-05-04 16:34 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerlines · explode operation · multi part centerline · single part centerline · rest endpoint · location referencing |
| **Tools** | Explode Centerline |

## Summary

User story for creating an Explode Centerline tool to break multi part centerlines into single part centerlines for editing and calibration. Includes UI and REST endpoint requirements, testing scenarios, and documentation needs.

## Related documents

<!-- related:begin -->
- [Support updating CL/CLS when using explode operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-cl-cls-when-using-explode-operation.md>) — similar text 0.78 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:829 s=8.091 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:815 s=6.388 -->
- [Explode multipart centerlines in editing activities and Append Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/explode-multipart-centerlines-in-editing-activities.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:817 s=4.574 -->
- [Spike: Patterns to hook into Explode tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/patterns-to-hook-into-explode-tool.md>) — similar text 0.31 · 1 title word · 1 filename word · same surface/folder <!-- rel:825 s=3.412 -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:776 s=2.933 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-multipart-centerlines-into-single-part-features.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [Explode Centerline](https://www.google.com/search?q=%22Explode%20Centerline%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support LRS explode operation <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to break multi part centerlines into single part, so that routes with complex shapes can be edited and calibrated in the software.

## Acceptance Criteria
### Exploding multi part centerlines (UI) <!-- slide 3 -->
- Create an Explode Centerline tool to be placed on the Location Referencing ribbon
- Will need an icon for the tool
- Support this only for LR/VMS enabled services
- UX is for the user is as following:
  - Select one or more centerlines using the Pro selection tools
  - Click the new explode tool then execute the logic

### Exploding multi part centerlines (REST) <!-- slide 4 -->
- Create a REST endpoint for this tool to execute the logic outlined below
- When executing the tool on a multi part centerline with a centerline ID GUID populated:
  - Explode the multi part centerline into multiple single part centerline features
  - Create a new centerline ID GUID for each new centerline record created by the Explode; update the centerline sequence table
- If the centerline ID GUID is not populated, explode the centerline into multiple centerlines and leave the centerline ID GUID empty
- Use the LRS split centerline tool as a guide for how to build this tool

## Testing
<!-- slide 5 -->
- Verify in REST and Pro
- Negative
  - Explode a multi part centerline with no centerline ID GUID
  - Explode a single part centerline
  - Use the multi part to single part centerline GP tool (shouldn’t do anything)
- Positive
  - Explode on a single centerline
  - Explode on selection of multiple centerlines
  - Explode a gapped multi part centerline
  - Explode a complex shape multi part centerline

## Documentation
### Doc <!-- slide 6 -->
- Create a help topic for the tool that discusses its usage
- Document the new REST operation within the existing REST help for linear referencing operations

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
