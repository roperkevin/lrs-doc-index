# Support automatic deselection of centerlines

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Support automatic deselection of centerlines option.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20automatic%20deselection%20of%20centerlines%20option.pptx>) |
| **Edited** | 2021-07-15 23:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support automatic deselection of centerlines"
source_file: "Support automatic deselection of centerlines option.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20automatic%20deselection%20of%20centerlines%20option.pptx"
doc_id: 705
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-07-15T23:52:46Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerlines", "route edit", "deselection", "lrs editor", "roads data", "pipeline data"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":273,"file":"support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md","s":4.098},{"doc":684,"file":"update-centerline-measures-when-splitting-un-pipelines__doc684.md","s":3.359},{"doc":736,"file":"support-updating-measures-option-in-cartographic-realignment__doc736.md","s":3.232},{"doc":435,"file":"only-show-centerlines-with-active-routes-option__doc435.md","s":2.852},{"doc":703,"file":"provide-option-to-not-apply-event-behaviors-for-calibration-point-edits__doc703.md","s":2.838}]
```
-->

## Summary

This user story describes the need for an option in ArcGIS Pro to automatically deselect centerline features after completing an LRS edit. It targets LRS editors who want to streamline their workflow by avoiding manual deselection of centerlines used in route edits. The story includes requirements for the option behavior, testing scenarios, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures-from-lrs-tool__doc273.md>) — similar text 0.10 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:273 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines__doc684.md>) — similar text 0.28 · 1 filename word · same kind/surface/folder <!-- rel:684 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment__doc736.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:736 -->
- [Only Show Centerlines with Active Routes option](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/only-show-centerlines-with-active-routes-option__doc435.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:435 -->
- [Provide option to not apply event behaviors for calibration point edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/provide-option-to-not-apply-event-behaviors-for-calibration-point-edits__doc703.md>) — similar text 0.19 · 1 filename word · same kind/surface/folder <!-- rel:703 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html)
<!-- docs:end -->

---

## Slide 1 — Support automatic deselection of centerlines

User Story

## Slide 2 — User Story

As an LRS editor, I need the option to deselect centerline features once an edit is complete, so that I don’t have to manually click after each edit to deselect.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  These users may utilize multiple centerlines as part of their edits.  An odd part of the workflow to them is that once an edit is complete, the centerline(s) used in the route edit is still selected.  They want an option to automatically have the centerline(s) used in the route edit be deselected after the edit is completed so they don’t have to make additional clicks to do it manually.

## Slide 3 — Automatic deselection of centerline(s)

Add a new option in LRS Options in Pro called “Deselect centerlines used in LRS edits”
If the option is enabled, any centerlines that are selected for use in an LRS edit activity (create, extend, realign), should be deselected after the edit completes
If the option is not enabled, the tools should behave as they do currently today

## Slide 4 — Testing

Test on all 3 route edit types that utilize centerlines
Test with a single and multiple centerlines used for the edit
Test on both Roads and Pipeline data (test at least one APR-UN scenario)

## Slide 5 — Automation

No automation

## Slide 6 — Documentation

Update the screenshot in the existing topic https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-location-referencing-options.htm (and the pipeline version as well)

## Slide 7 — Assignment

Story Points:
Dev:
PE:
