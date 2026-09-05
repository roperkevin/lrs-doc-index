# Support automatic deselection of centerlines

| Field | Value |
| --- | --- |
| **Doc** | 705 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support automatic deselection of centerlines option.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20automatic%20deselection%20of%20centerlines%20option.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-07-15 23:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerlines · route edit · deselection · lrs editor · roads data · pipeline data |
| **Tools** | — |

## Summary

This user story describes the need for an option in ArcGIS Pro to automatically deselect centerline features after completing an LRS edit. It targets LRS editors who want to streamline their workflow by avoiding manual deselection of centerlines used in route edits. The story includes requirements for the option behavior, testing scenarios, and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.10 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:273 s=4.098 -->
- [Update centerline measures when splitting UN pipelines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/update-centerline-measures-when-splitting-un-pipelines.md>) — similar text 0.28 · 1 filename word · same kind/surface/folder <!-- rel:684 s=3.359 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:736 s=3.232 -->
- [Only Show Centerlines with Active Routes option](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/only-show-centerlines-with-active-routes-option.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:435 s=2.852 -->
- [Provide option to not apply event behaviors for calibration point edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/provide-option-to-not-apply-eb-for-cp-edits.md>) — similar text 0.19 · 1 filename word · same kind/surface/folder <!-- rel:703 s=2.838 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html)
<!-- docs:end -->

---

## Story
### Support automatic deselection of centerlines <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need the option to deselect centerline features once an edit is complete, so that I don’t have to manually click after each edit to deselect.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  These users may utilize multiple centerlines as part of their edits.  An odd part of the workflow to them is that once an edit is complete, the centerline(s) used in the route edit is still selected.  They want an option to automatically have the centerline(s) used in the route edit be deselected after the edit is completed so they don’t have to make additional clicks to do it manually.

## Acceptance Criteria
### Automatic deselection of centerline(s) <!-- slide 3 -->
- Add a new option in LRS Options in Pro called “Deselect centerlines used in LRS edits”
- If the option is enabled, any centerlines that are selected for use in an LRS edit activity (create, extend, realign), should be deselected after the edit completes
- If the option is not enabled, the tools should behave as they do currently today

## Testing
<!-- slide 4 -->
- Test on all 3 route edit types that utilize centerlines
- Test with a single and multiple centerlines used for the edit
- Test on both Roads and Pipeline data (test at least one APR-UN scenario)

## Automation
<!-- slide 5 -->
No automation

## Documentation
<!-- slide 6 -->
Update the screenshot in the existing topic https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/set-location-referencing-options.htm (and the pipeline version as well)

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
