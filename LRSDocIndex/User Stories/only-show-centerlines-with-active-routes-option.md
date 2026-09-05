# Only Show Centerlines with Active Routes option

| Field | Value |
| --- | --- |
| **Doc** | 435 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [OnlyShowCenterlineswithActiveRoutes.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/OnlyShowCenterlineswithActiveRoutes.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-01-19 19:00 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerlines · active routes · location referencing · arcgis pro · cartographic realignment · centerline sequence |
| **Tools** | — |

## Summary

This user story describes a feature for ArcGIS Pro that allows LRS editors to filter the map display to show only centerlines associated with active routes. The feature includes a configurable option in the Location Referencing settings that respects the date configured on the map to show relevant centerlines for editing and cartographic realignment. Testing involves verifying behavior across datasets and dates to ensure correct centerline visibility during edits.

## Related documents

<!-- related:begin -->
- [Generate Intersection at Self-Intersecting Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersection-at-self-intersecting-routes.md>) — similar text 0.08 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:509 s=3.017 -->
- [Support automatic deselection of centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-automatic-deselection-of-centerlines.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:705 s=2.852 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment.md>) — similar text 0.19 · 1 title word · same kind/surface/folder <!-- rel:736 s=2.829 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.11 · 1 filename word · same kind/surface/folder <!-- rel:762 s=2.683 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-cp-impacted.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:611 s=2.648 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-cartographic-realignment.html) · [View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-centerline-sequence-table-properties.html)
<!-- docs:end -->

---

## Story
### Only Show Centerlines with Active Routes option <!-- slide 1 -->
User Story
ArcGIS Pro

### User Story <!-- slide 2 -->
As an LRS editor, I need to be able to only show centerlines associated with active routes, so I can ensure I only end up editing the centerlines that are active in the system when doing cartographic realignment.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  As the LRS changes over the time, there is the potential that multiple centerlines will end up near each other as the system changes over time.  To ensure the users edit/select the correct centerlines, we should provide an option to only show centerlines that are associated with active routes.

## Acceptance Criteria
### Only Show Centerlines with Active Routes <!-- slide 3 -->
- Provide an option in the Location Referencing options of ArcGIS Pro called “Only Show Centerlines associated with active routes”
- The option should be unchecked by default
- When checked, the map should only show the centerlines associated with active routes in the map
  - We should be able to utilize the centerline sequence table to determine this
  - Note that active routes on the map are going to reflect the dates shown from the LRS Network(s) in the map (if no time is configured, show today’s date, otherwise reflect the date on the time ribbon that is being honored on the network)
  - We should treat this drawing as inclusive of the date configured (this will ensure that when an LRS route edit takes place on the same date as the date configured for the map, we will show the before and after centerlines, but not those one day or more in the past)
- We should invoke/redraw the centerlines any time the map is refreshed
- We need to make sure this doesn’t negatively impact performance during refresh/drawing on the map (test before and after on a large dataset to get an idea of performance impact)

## Testing
<!-- slide 4 -->
- Mix testing across a few different datasets (RH, APR, Addressing)
- Test with a variety of dates (none set, current, single in the past, single in the future, a range)
- Test doing an LRS edit on the date set to ensure all centerlines remain after editing
- Test doing an LRS edit on a different date to ensure only the active centerline remains

## Automation
<!-- slide 5 -->
- No automation needed

## Documentation
<!-- slide 6 -->
- Create a new topic called “Show only active centerlines” that will reside in the Prepare the LRS for Editing section of both RH and APR documentation
  - Topic should discuss this option and how it will work
  - Make sure to discuss that it’s configurable in the Location Referencing Pro project options
  - Make sure to discuss that it is inclusive of the date chosen to ensure you see before and after for LRS edits completed on that date

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
