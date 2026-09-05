# Update centerline measures when splitting UN pipelines

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Split UN Centerlines Update Measure Fields.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Split%20UN%20Centerlines%20Update%20Measure%20Fields.pptx>) |
| **Edited** | 2022-01-19 17:59 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Update centerline measures when splitting UN pipelines"
source_file: "Split UN Centerlines Update Measure Fields.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Split%20UN%20Centerlines%20Update%20Measure%20Fields.pptx"
doc_id: 684
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-01-19T17:59:08Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "measure fields", "split centerline", "utility network", "pipeline", "calibration point", "route editing"]
tools: ["Core Split CL", "LRS Split CL", "Retire", "Realign", "Reassign", "Update Measures from LRS"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":601,"file":"flip-centerline-tool-in-memory-flip-user-story__doc601.md","s":3.525},{"doc":609,"file":"flip-centerline-tool-in-memory-flip-user-story__doc609.md","s":3.495},{"doc":485,"file":"lrs-in-gcs-in-memory-only-densification__doc485.md","s":3.374},{"doc":705,"file":"support-automatic-deselection-of-centerlines__doc705.md","s":3.359},{"doc":736,"file":"support-updating-measures-option-in-cartographic-realignment__doc736.md","s":3.132}]
```
-->

## Summary

Describes the need for automatic updating of measure fields on centerlines when they are split in a combined APR-UN deployment, eliminating the need for manual post-processing. Specifies tools and operations affected, testing requirements, automation additions, and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc601.md>) — similar text 0.32 · 1 title word · same kind/surface/folder <!-- rel:601 -->
- [Flip Centerline Tool In-Memory Flip User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/flip-centerline-tool-in-memory-flip-user-story__doc609.md>) — similar text 0.31 · 1 title word · same kind/surface/folder <!-- rel:609 -->
- [LRS in GCS: In-memory only Densification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-in-gcs-in-memory-only-densification__doc485.md>) — similar text 0.18 · same kind/surface/folder <!-- rel:485 -->
- [Support automatic deselection of centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-automatic-deselection-of-centerlines__doc705.md>) — similar text 0.28 · 1 filename word · same kind/surface/folder <!-- rel:705 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment__doc736.md>) — similar text 0.26 · 1 title word · same kind/surface/folder <!-- rel:736 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Core Split CL](https://www.google.com/search?q=%22Core%20Split%20CL%22+site%3Adoc.esri.com) · [LRS Split CL](https://www.google.com/search?q=%22LRS%20Split%20CL%22+site%3Adoc.esri.com) · [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Update centerline measures when splitting UN pipelines

User Story

## Slide 2 — User Story

As a LRS Editor, I want the measure fields on centerline(s) to be updated when a centerline is split in a combined APR-UN deployment, so that the measures are updated without needing to execute the Update Measures from LRS tool.
Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  For utilities and pipeline operators that utilize APR and the UN together, many of their edits can result in centerlines being split as part of an APR edit.  When this split occurs, the measure fields on the impacted centerlines aren’t updated and the user must run the Update Measures from LRS tool to update them as a post processing step.  We should update the measures on the split centerline when the split occurs.

## Slide 3 — Splitting UN pipelines

When utilizing the following tools/operations in a combined APR-UN deployment, any centerlines that are split should have the From and To Measure fields updated as part of the operation:

  - Core Split CL
  - LRS Split CL tools
  - Retire
  - Realign
  - Reassign
Note that the split measures that are populated on these features should come from the route(s) they provide the geometry for
If a centerline is split as part of a split centerline or core split call, we should not only split the centerline and update the measures, but we should also add a calibration point at the split location (this isn’t needed for the route editing tools as they already add 1 or more CPs at the split location)
If there is no route associated with a centerline being split, then do not update the measures on the centerline
If the edit is not able to complete, have the entire edit operation roll back and provide an appropriate error message about not being able to update measures on the split centerlines

## Slide 4 — Testing

Test in both UN configured line and non line networks
Verify that there is no regression in the automated tests for these tools/operations when no UN is present
Test on the following route types (at least a few cases of each, but not one of each for each tool tested)

  - Normal (non-gapped)
  - Gapped
  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Vertical
Test on a variety of route locations (beginning, middle, end)
Utilize the existing UN dataset that we have

## Slide 5 — Automation

Add automation (or create new) for these scenarios for existing tools that are automated (route editing, split centerline)

## Slide 6 — Documentation

Update the Route in a Utility Network sections of Split Centerline(https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/split-a-centerline.htm, https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.htm), Retire (https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/retire-routes.htm), Reassign (https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/reassign-routes.htm), and Realign Route (https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/realign-routes.htm)
Update the Editing Combined LRS and Utility Network data section of https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/manage-pipeline-referencing-and-a-utility-network-together.htm
Key points to add to the documentation are that any centerline that is split by these operations will have their measures updated for the From/To Measure fields on the centerlines
We should also update any graphics to show that the measures on any split centerlines are updated as well

## Slide 7 — Assignment

Story Points:
Dev:
PE:
