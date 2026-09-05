# Support Complex Route Shapes in Apply Edits

| Field | Value |
| --- | --- |
| **Doc** | 845 · User Story · Server |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [ComplexRouteShapesApplyEdits.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ComplexRouteShapesApplyEdits.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2019-12-17 19:51 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | complex route shape · event editing · apply edits · rest endpoint · roads and highways · event merging · event retiring |
| **Tools** | Apply Edits |

## Summary

This user story addresses the need for Roads and Highways users to create, update, and delete event shapes on complex routes such as loops, lollipops, alpha, and branched routes using the Apply Edits REST endpoint. It ensures correct event shape handling for add, update, delete, merging, retiring, and splitting on complex route shapes in both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Complex Route Shapes in Generate Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-events.md>) — similar text 0.58 · 4 title words · 3 filename words · same kind/folder <!-- rel:848 s=6.685 -->
- [Support Complex Route Shapes in Append Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-append-events.md>) — similar text 0.63 · 4 title words · 3 filename words · same kind/folder <!-- rel:844 s=6.587 -->
- [Support Complex Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-retire-route.md>) — similar text 0.42 · 4 title words · 3 filename words · same kind/folder <!-- rel:872 s=6.367 -->
- [Support Complex Route Shapes in Generate Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-generate-routes.md>) — similar text 0.45 · 4 title words · 3 filename words · same kind/folder <!-- rel:849 s=6.032 -->
- [Support Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-complex-route-shapes-in-realign-route.md>) — similar text 0.40 · 4 title words · 3 filename words · same kind/folder <!-- rel:854 s=5.96 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Apply Edits](https://www.google.com/search?q=%22Apply%20Edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Complex Route Shapes in Apply Edits <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Roads and Highways user, I need to be able to create, update, and delete event shapes located on complex route in Roads and Highways, such as loops, lollipops, alpha, and branched routes using REST, so the events can be used for analysis, reporting, and other needs.

![Figure 1 — User Story](../media/support-complex-route-shapes-in-apply-edits/fig-01-slide-02-user-story.svg)

## Acceptance Criteria
### Apply Edits <!-- slide 3 -->
- In the Apply Edits REST endpoint, ensure events that will be located on a complex route get the correct beginning/end points and the correct shape
- This is just for the REST endpoint (Event Editor will be another user story)
- Support this for add, update, and delete
- Make sure to handle all of the methods related to merging and retiring (allowMerge, retireMeasureOverlap, and retireByEventID)
- Honor the existing rules for splitting events (split at gaps with measure difference greater than 0)
- Should work for any complex route shape (see the sample shapes used in Generate Calibration Points story)
- Works in both non line and line networks

## Testing
<!-- slide 4 -->
Positive (Apply Edits to add, update, and delete)

  - Loop
  - Lollipop
  - Alpha
  - Branch
  - Barbell
  - Complex shape with gap
  - Include cases to merge events on complex shapes
  - Include cases to retire events that overlap or have the same EventID
  - Non Line Network (focus on this)
  - Line Network (events spanning routes)
  - Caltrans
  - With/without Z values (only for considering self intersection)
Negative

  - Underlying route not calibrated
Automation

  - Add cases to the existing REST automation for the endpoint

## Documentation
<!-- slide 5 -->
- Add a note to the existing Apply Edits topic (https://developers.arcgis.com/rest/services-reference/apply-edits.htm) about support for events on complex route shapes

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
Test Plan PE:
