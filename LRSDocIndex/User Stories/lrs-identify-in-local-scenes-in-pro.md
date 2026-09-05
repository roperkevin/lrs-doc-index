# LRS Identify in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 769 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [LRSIdentifyScenes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/LRSIdentifyScenes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-06 21:28 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical segment · measure · route attributes · local scene · 3d measure · lrs identify |
| **Tools** | LRS Identify |

## Summary

This document describes a user story for the LRS Identify tool in ArcGIS Pro local scenes. It specifies the need to identify measures and attributes on routes including vertical pipe segments, ensuring correct 3D measure display. Testing scenarios include line and non-line networks with projected and unprojected data, focusing on measure accuracy at various vertical and non-vertical locations.

## Related documents

<!-- related:begin -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.55 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:770 s=5.902 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.53 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:773 s=5.845 -->
- [Support Create Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-create-route-in-local-scenes-in-pro.md>) — similar text 0.45 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:778 s=5.599 -->
- [Support Calibrate Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-calibrate-route-in-local-scenes-in-pro.md>) — similar text 0.42 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:774 s=5.15 -->
- [Split Centerlines in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-centerlines-in-local-scenes-in-pro.md>) — similar text 0.56 · 3 title words · same kind/surface/folder <!-- rel:766 s=5.076 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### LRS Identify in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to identify measures and other LRS characteristics on routes that include vertical pipe segments, so that I can find the measure/attributes for the route at any location.

## Acceptance Criteria
### LRS Identify in local scene <!-- slide 3 -->
- In a local scene, users should be able to do the following:
  - Select the LRS Identify tool from the Location Referencing ribbon
  - Click any route in the scene and have the LRS Identify pop up appear with the correct measure and all attributes populated (this should include getting the correct measure for any part of a vertical segment of pipe)
  - Verify that the measure included is in 3D (should already be there)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test the measure provided is correct at the following locations:
  - On the middle of a vertical section
  - On either end of a vertical section
  - On a non vertical section
- Verify 3D is honored (only 2-3 test cases needed) in the measure shown (make sure at least one of these includes a vertical segment on the route)

## Automation
<!-- slide 5 -->
None

## Documentation
<!-- slide 6 -->
Add a note to the LRS Identify topic to mention it works with scenes in Pro

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
