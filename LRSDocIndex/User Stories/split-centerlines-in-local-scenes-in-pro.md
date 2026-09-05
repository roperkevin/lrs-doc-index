# Split Centerlines in Local Scenes in Pro

| Field | Value |
| --- | --- |
| **Doc** | 766 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SplitCenterlineVerticalRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SplitCenterlineVerticalRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-06 22:55 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | split centerline · vertical pipe segment · local scene · route · centerline · arcgis pro |
| **Tools** | Split Centerline by Point · Split Centerline by Measure · Split Centerline into Single Part Features · Core Split Tool |

## Summary

User story describing the need for LRS editors to split centerlines on routes with vertical pipe segments in local scenes within ArcGIS Pro. It details the expected functionality of split centerline tools and outlines testing scenarios for various segment types including vertical segments and gaps.

## Related documents

<!-- related:begin -->
- [LRS Identify in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-identify-in-local-scenes-in-pro.md>) — similar text 0.56 · 3 title words · same kind/surface/folder <!-- rel:769 s=5.076 -->
- [Support CartoRealign in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-cartorealign-in-local-scenes-in-pro.md>) — similar text 0.43 · 3 title words · same kind/surface/folder <!-- rel:772 s=4.681 -->
- [Support Retire Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-retire-route-in-local-scenes-in-pro.md>) — similar text 0.47 · 3 title words · same kind/surface/folder <!-- rel:770 s=4.65 -->
- [Support Extend Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-extend-route-in-local-scenes-in-pro.md>) — similar text 0.42 · 3 title words · same kind/surface/folder <!-- rel:775 s=4.642 -->
- [Support Reassign Route in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reassign-route-in-local-scenes-in-pro.md>) — similar text 0.44 · 3 title words · same kind/surface/folder <!-- rel:773 s=4.566 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-point.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Split multipart centerlines into singlepart features](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-multipart-centerlines-into-single-part-features.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html)

_No page matched:_ [Core Split Tool](https://www.google.com/search?q=%22Core%20Split%20Tool%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Split Centerlines in Local Scenes in Pro <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to split centerlines on routes that include vertical pipe segments, so that I can keep the centerlines in sync with the routes they’re associated with.

## Acceptance Criteria
### Split Centerline in local scene <!-- slide 3 -->
- In a local scene, users should be able to do the following:
  - Select all 3 of the split centerline tools from the Location Referencing ribbon
  - Click any centerline/route in the scene and have the correct measure/location be selected for splitting
- In split centerline by point, when the user clicks a point (including on a vertical pipe segment or vertical gap), the graphic should appear where the click took place and the centerline should split at that location when executed
- In split centerline by measure, when the user clicks the route (including on a vertical pipe segment or vertical gap), the UI should include the measure at the click location and the centerline should split at the location when executed
- In split centerline into single part features, the centerlines selected should be exploded into single part features (including any vertical pipe segments or vertical gap)
- For the core split tool, it should split wherever the user clicks (including on a vertical pipe segment or vertical gap)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test being able to split centerlines with all 4 methods (point, measure, into single part, core split)
  - On the middle of a vertical segment
  - On the end of a vertical segment
  - On a non vertical segment
  - On a vertical gap

## Automation
<!-- slide 5 -->
None

## Documentation
<!-- slide 6 -->
Add a note to the Split centerline topics to mention it works with scenes in Pro

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
