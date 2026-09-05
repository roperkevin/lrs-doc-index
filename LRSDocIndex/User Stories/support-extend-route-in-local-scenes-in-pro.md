# Support Extend Route in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 775 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportExtendRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportExtendRouteinScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-24 21:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | extend route · vertical centerline · local scene · 3d support · route extension · centerline reorder |
| **Tools** | Extend Route |

## Summary

This document describes a user story for enabling LRS editors to extend routes using vertical pipe segments in ArcGIS Pro local scenes. It specifies UI behavior, 3D support requirements, and testing scenarios for extending routes with vertical and non-vertical centerlines. It also outlines automation testing and documentation updates related to this feature.

## Related documents

<!-- related:begin -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro.md>) — similar text 0.86 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 s=8.901 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.68 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 s=7.948 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 s=7.855 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 s=7.771 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:778 s=7.647 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

## Story
### Support Extend Route in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to extend routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Acceptance Criteria
### Local Scene <!-- slide 3 -->
- When clicking the Extend Route tool in a local scene, the UI should open like it does in normal maps within Pro today

### Extend Route in local scene <!-- slide 4 -->
- In a local scene, users should be able to do the following:
  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Extend Route UI
  - Use those selected centerlines, include vertical centerlines, to extend a route
  - Any graphics on the map (blue centerline selection arrow and order number) should appear in 3D
  - Suggested measures should be in 3D

### Extend Route 3D <!-- slide 5 -->
- Verify 3D support in Extend Route; verify Z values are honored:
  - For the suggested measures in the UI (should already be there)
  - For the calibration applied to the route (should already be there)
- For extends where the centerline is a vertical pipe, make sure the Extend Location option populates correctly and is honored
- Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Testing
<!-- slide 6 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with both vertical (focus on this) and non vertical centerlines
- Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
- Select vertical centerlines and verify the centerline reorder options work in the Extend Route UI
- Test a case where a route is extended with centerlines with a vertical gap
- Test a case or two with a non vertical centerline that makes up a complex shape
- Use a combination of a single and multiple centerlines to extend a route

## Automation
<!-- slide 7 -->
UI Automation – Should have 4-5 tests for the UI for Extend Route

## Documentation
<!-- slide 8 -->
Add to the existing topic being created for Create Route that outlines support for vertical pipes.

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
