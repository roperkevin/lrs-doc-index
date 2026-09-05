# Support Create Route in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 778 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportCreateRouteinScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCreateRouteinScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-21 23:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical pipe · local scene · create route · centerline · 3d measures |
| **Tools** | Create Route |

## Summary

This document describes a user story for enabling route creation using vertical pipe segments within local scenes in ArcGIS Pro. It covers requirements for the Location Referencing ribbon activation, 3D measure support, and testing scenarios including vertical centerlines. It also outlines automation testing and documentation needs related to LRS editing in local scenes.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.56 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:770 s=7.717 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.65 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:775 s=7.647 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.51 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:773 s=7.564 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro.md>) — similar text 0.62 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:771 s=7.313 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.58 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:774 s=7.292 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html)
<!-- docs:end -->

---

## Story
### Support Create Route in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to create routes using vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Acceptance Criteria
### Local Scene <!-- slide 3 -->
- When a user switches a map in ArcGIS Pro to a local scene and there are LRS layers in the map, the Location Referencing ribbon should appear and be active (no buttons greyed out)
- Only support local scenes right now, we can revisit global scenes in the future

### Create Route in local scene <!-- slide 4 -->
- In a local scene, users should be able to do the following:
  - Select any centerline geometry, including vertical centerlines, and have them be honored in the Create Route UI
  - Use those selected centerlines, include vertical centerlines, to create a route
  - Suggested measures should be in 3D
- Only support local scenes right now, we can revisit global scenes in the future

### Create Route 3D <!-- slide 5 -->
- 3D for Create Route has already been tested; verify Z values are honored:
  - For the suggested measures in the UI
  - For the calibration applied to the route
- Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Testing
<!-- slide 6 -->
- Test in both line and non line networks
- Test with both vertical and non vertical centerlines
- Verify 3D is honored (only 1-2 test cases needed) in both the suggested measures and the calibration applied
- Select vertical centerlines and verify the centerline reorder options work in the Create Route UI

## Automation
<!-- slide 7 -->
TestComplete – Should have 4-5 tests for the UI for Create Route
ReadyAPI – Should have a 2-3 tests for REST using vertical pipes

## Documentation
<!-- slide 8 -->
Create a topic related to support for LRS editing within local scenes.  Make sure to mention that this is how users would be able to edit vertical pipes.  As we complete future user stories related to vertical pipes, this topic can be added to.

## Assignment
<!-- slide 9 -->
Story Points:
Dev:
PE:
