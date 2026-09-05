# Support Retire Route in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 770 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportRetireRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRetireRouteinScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-29 01:57 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | retire route · vertical pipe segment · local scene · 3d support · route retirement · calibration · ui automation |
| **Tools** | Retire Route |

## Summary

This document describes a user story for enabling the retirement of routes that include vertical pipe segments within local scenes in ArcGIS Pro. It specifies UI behavior, 3D measure support, and testing scenarios for retiring routes in vertical and non-vertical segments. It also outlines automation testing and documentation updates related to this functionality.

## Related documents

<!-- related:begin -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.82 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 s=9.029 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.68 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 s=7.948 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 s=7.938 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro.md>) — similar text 0.72 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 s=7.826 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro.md>) — similar text 0.56 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 s=7.717 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html)
<!-- docs:end -->

---

## Story
### Support Retire Route in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to retire routes that include vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Acceptance Criteria
### Local Scene <!-- slide 3 -->
- When clicking the Retire Route tool in a local scene, the UI should open like it does in normal maps within Pro today

### Retire Route in local scene <!-- slide 4 -->
- In a local scene, users should be able to do the following:
  - Suggested measures should be in 3D
  - If the selected From/To Measure fall on a vertical section of the route, make sure they display the graphic in the correct location

### Retire Route 3D <!-- slide 5 -->
- Verify 3D support in Retire Route; verify Z values are honored:
  - For the calibration applied to the route (should already be there for everything but vertical pipe segments)
- Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Testing
<!-- slide 6 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with retirements:
  - Completely in/on vertical segments of the route (focus on this)
  - Spanning across vertical segments of the route (focus on this)
  - On non-vertical segments of the route (1-2 cases to ensure it works)
- Verify 3D is honored (only 2-3 test cases needed) in the calibration applied (make sure at least one of these includes a vertical segment on the route)
- Test a case where a route is retired on a vertical gap

## Automation
<!-- slide 7 -->
UI Automation – Should have 4-5 tests for the UI for Retire Route

## Documentation
<!-- slide 8 -->
Add a note to the existing retire route topics that outlines how to make edits if there is a vertical pipe segment.

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
