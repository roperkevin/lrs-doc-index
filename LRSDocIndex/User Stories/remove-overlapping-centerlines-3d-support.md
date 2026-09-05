# Remove Overlapping Centerlines 3D support

| Field | Value |
| --- | --- |
| **Doc** | 747 · User Story · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Remove Overlapping Centerlines 3D support.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Remove%20Overlapping%20Centerlines%203D%20support.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-11-18 02:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerlines · overlapping centerlines · 3d support · vertical centerlines · geoprocessing · automation |
| **Tools** | Remove Overlapping Centerlines |

## Summary

User story for enhancing the Remove Overlapping Centerlines geoprocessing tool to consider Z values when identifying overlapping centerlines, including handling vertical centerline segments. The tool should remove only truly overlapping centerlines in 3D, splitting centerlines where overlaps begin and end, and preserve vertical geometry without flattening. Testing scenarios and automation for these cases are planned, along with documentation updates.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Remove Overlapping Centerlines GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-remove-overlapping.md>) — similar text 0.30 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:776 s=5.961 -->
- [Remove Overlapping Centerline Supporting Attributes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/remove-overlapping-centerline-supporting-attributes.md>) — similar text 0.17 · 2 title words · 3 filename words · same surface/folder <!-- rel:808 s=4.447 -->
- [Append Routes with existing Utility Network centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/append-routes-with-existing-un-centerlines.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:741 s=3.973 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:775 s=3.957 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:771 s=3.897 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Remove Overlapping Centerlines 3D support <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing data loader, I need to be able to have overlapping centerlines be removed but consider the elevation of each centerline, so that centerlines that are coincident in 2D but not in 3D aren’t removed.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When a user first adopts APR, they typically oversee or work with a partner to migrate their data into our information model.  Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired).  As part of this bulk loading workflow, the ROC tool would need to be run and we need the tool to be able to consider pipes that are parallel in 2D but have different Z values and are not truly coincident.

## Acceptance Criteria
### Remove Overlapping Centerlines 3D <!-- slide 3 -->
- In the Remove Overlapping Centerlines GP tool, consider the Z values for the centerlines when determining which are coincident/overlapping and which are not
- Centerlines with XYZ that are the same can be considered coincident/overlapping and can be removed like they are today
- For centerlines with the same XY, but different Z values, the tool should identify them as not coincident/overlapping and not remove them
- This should extend to partially overlapping scenarios where parts of centerlines with the same XYZ are considered overlaps and removed, but where the XY or Z is different, they are not treated as overlaps so the centerlines are split where the overlaps begin/end to remove only the overlapping sections
- The technical approach for these capabilities should come from the enhancements that the 3D Analyst team is making to the 3D Intersect tool

### Remove Overlapping Centerlines Vertical <!-- slide 4 -->
- The Remove Overlapping Centerlines tool should handle vertical centerlines/centerline segments as well
- If centerlines have overlapping vertical segments, we should remove the duplicate, but preserve the vertical geometry (don’t flatten it like it used to do)
- For cases where the vertical segment is only partially overlapping, we should follow the same logic we do today for non vertical segments where we split the centerlines at the beginning/end of the overlap and remove only duplicate in the overlapping portion

## Testing
<!-- slide 5 -->
- Doesn’t matter what type of networks are tested since the tool only considers centerlines
- Test with the following scenarios for centerline overlaps:
  - Overlapping centerlines that are completely overlapping
  - Overlapping centerlines where the XY is the same, but the Z values are different both the entirety of the centerline geometry
  - Overlapping centerlines where the XY is the same, but the Z values are different for a portion of the centerline geometry
  - Overlapping centerlines where the difference in Zs is just within the Z tolerance
  - Overlapping centerlines where the difference in Zs is just outside the Z tolerance
  - Overlapping centerlines where the vertical segments are completely overlapping
  - Overlapping centerlines where the vertical segments are partially overlapping
- Consider utilizing the same data from the original Remove Overlapping Centerlines user story that Praveen product engineered

## Automation
<!-- slide 6 -->
- Add automation for vertical and 2D/not 3D overlapping test cases to the existing python automation we have today for the tool (or create new a new set of tests for the tool).
- Create the automation while testing to simplify the effort.

## Documentation
<!-- slide 7 -->
- Add a usage note to the Remove Overlapping Centerlines topic to mention vertical routes being supported and Z values being considered (i.e. only overlaps in XY and Z will be considered overlaps and removed)

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
