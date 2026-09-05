# Merge coincident option in DynSeg tool in Pro

| Field | Value |
| --- | --- |
| **Doc** | 604 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Merge option in DynSeg tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Merge%20option%20in%20DynSeg%20tool.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2023-03-01 01:41 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · merge · coincident events · event editing · attribute set · arcgis pro |
| **Tools** | Dynamic Segmentation |

## Summary

Describes a user story for adding a merge coincident events option in the Dynamic Segmentation (DynSeg) tool in ArcGIS Pro. The feature aims to reduce excessive segmentation by merging coincident events with the same attributes after edits. Testing scenarios and documentation updates are outlined.

## Related documents

<!-- related:begin -->
- [Merge Coincident Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-add-events-tools-in-pro.md>) — similar text 0.39 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:663 s=6.186 -->
- [Dynamic Segmentation Table: Consider Point Events in DynSeg Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-table-consider-point-events-in-dynseg-table.md>) — similar text 0.24 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:394 s=4.198 -->
- [Auto-Populate Referents for Merge, Split, DynSeg, and Table Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/auto-populate-referents-for-merge-split-dynseg-and-table.md>) — similar text 0.16 · 2 title words · 3 filename words · same kind/folder <!-- rel:910 s=4.166 -->
- [Retire Overlaps Option in Add Events tools in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/retire-overlaps-option-in-add-events-tools-in-pro.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:664 s=3.56 -->
- [Dynamic Segmentation Merge Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4902-dynseg-merge-option.md>) — similar text 0.17 · 2 title words · 2 filename words <!-- rel:592 s=3.549 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Story
### Merge coincident option in DynSeg tool in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need the capability for coincident events to edited events to be merged in the DynSeg tool in Pro, so that I reduce excessive segmentation within any event layer.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For many users, they need the ability for events they edit via the DynSeg table to merge with any existing coincident events to ensure there isn’t unnecessary segmentation on any of their event layers.  This also keeps the number of event records to a minimum.

## Acceptance Criteria
### Merge coincident option in DynSeg table <!-- slide 3 -->
- In the DynSeg results table in ArcGIS Pro, add an option to allow users to merge coincident events resulting from edits made to the table
- This can be a checkbox on the table header that users can check to enable
- Disabled is the default state
- If enabled, when a user makes an edit to LRS event attributes, we should attempt to merge any coincident events that now have the same attributes
- Note that the dynseg table can include many different event layers, we should look at each event individually to see if coincident events can be merged
- There is the possibility that only some of the event layers in the attribute set will merge

## Testing
<!-- slide 4 -->
- Test with a mix or RH and APR data
- Test with and without events that span routes
- Test with a variety of non LRS attributes field types in various events in an attribute set
- Test with at least one scenario where there are coincident events both upstream and downstream of the newly created event (both should merge)
- Verify a case or two in REST (since that’s where the parameter resides)

## Automation
<!-- slide 5 -->
Add 1-2 automation cases to the existing UI automation for the tool

## Documentation
<!-- slide 6 -->
Add a note about this option to the Edit records in the output section of the existing topics
https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/apply-dynamic-segmentation.htm
https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.htm

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
