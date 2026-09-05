# Support Realign Route in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 771 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportRealignRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportRealignRouteinScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-28 21:25 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | realign route · vertical centerline · local scene · 3d support · route editing · centerline reorder |
| **Tools** | Realign Route |

## Summary

This document describes a user story for enabling route realignment using vertical pipe segments in local scenes within ArcGIS Pro. It details UI behavior, 3D support requirements, testing scenarios including vertical and non-vertical centerlines, and automation test plans. It also includes documentation update instructions for realign route topics regarding vertical pipe segments.

## Related documents

<!-- related:begin -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.86 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 s=8.901 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.72 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 s=7.826 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.66 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 s=7.64 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 s=7.526 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 s=7.313 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Story
### Support Realign Route in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to realign routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Acceptance Criteria
### Local Scene <!-- slide 3 -->
- When clicking the Realign Route tool in a local scene, the UI should open like it does in normal maps within Pro today

### Realign Route in local scene <!-- slide 4 -->
- In a local scene, users should be able to do the following:
  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Realign Route UI
  - Use those selected centerlines, include vertical centerlines, to Realign a route
  - Any graphics on the map (blue centerline selection arrow and order number) should appear in 3D
  - Suggested measures should be in 3D

### Realign Route 3D <!-- slide 5 -->
- Verify 3D support in Realign Route; verify Z values are honored:
  - For the suggested measures in the UI (should already be there for non vertical centerlines)
  - For the calibration applied to the route (should already be there for non vertical routes)
- Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Testing
<!-- slide 6 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with vertical (focus on this) centerlines, non vertical centerlines, and a mix of both (focus on this)
- Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
- Select vertical centerlines and verify the centerline reorder options work in the Realign Route UI
- Test a case where a route is realign with centerlines with a vertical gap
- Test a case or two with a non vertical centerline that makes up a complex shape
- Use a combination of a single and multiple centerlines to extend a route; for multiple centerlines make sure at least one is verical

## Automation
<!-- slide 7 -->
UI Automation – Should have 4-5 tests for the UI for Realign Route

## Documentation
<!-- slide 8 -->
Add a note to the existing realign route topics that outlines how to make edits if there is a vertical pipe segment.

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
