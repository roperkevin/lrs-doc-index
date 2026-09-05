# Support CartoRealign in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 772 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportCartoRealigninScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportCartoRealigninScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-07-29 21:49 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cartographic realignment · local scene · vertical pipe segment · 3d support · route editing · centerline · calibration |
| **Tools** | — |

## Summary

User story for enabling cartographic realignment of routes including vertical pipe segments in local scenes within ArcGIS Pro. Covers requirements for 3D support, testing scenarios for various centerline segment types, and automation of UI tests. Documentation updates are also planned to guide edits involving vertical pipe segments.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.63 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:770 s=7.074 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.60 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:773 s=6.987 -->
- [Support Realign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-realign-route-in-local-scenes-in-pro.md>) — similar text 0.57 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:771 s=6.955 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.53 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:775 s=6.749 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.47 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:774 s=6.573 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html)
<!-- docs:end -->

---

## Story
### Support CartoRealign in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to cartographically realign routes that include vertical pipe segments, so that these routes can be linear referenced and utilized throughout the software.

## Acceptance Criteria
### Cartographic Realignment in local scene <!-- slide 3 -->
- In a local scene, users should be able to do the following:
  - When a centerline that is associated with a route is edited, the cartographic realignment should go through (on both vertical and non vertical centerline segments as well as when bridging/introducing a vertical gap)

### Cartographic Realignment 3D <!-- slide 4 -->
- Verify 3D support in Cartographic Realignment; verify Z values are honored:
  - For the calibration applied to the route
- Note that Z units of measure that are different then XY units of measure will default back to the XY units of measure (this is a known limitation and we’re working to get it fixed by core)

## Testing
<!-- slide 5 -->
- Test in both line and non line networks (can be combined to a single carto realignment)
- Test with projected and unprojected data
- Test with cartographic realignments:
  - Where the centerline being edited is all on a vertical segment
  - Where the centerline being edited includes both vertical and non vertical segments
  - Where the centerline being edited is a non vertical segment
  - Where the centerline being edited closes a vertical gap
  - Where the centerline being edited opens a vertical gap
  - Where the centerline being edited is part of a complex route shape
- Verify 3D is honored (only 2-3 test cases needed) in the calibration applied (make sure at least one of these includes a vertical segment on the route)

## Automation
<!-- slide 6 -->
UI Automation – Should have 4-5 tests for the UI for Cartographic Realignment

## Documentation
<!-- slide 7 -->
Add a note to the existing cartographic realignment topics that outlines how to make edits if there is a vertical pipe segment.

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
