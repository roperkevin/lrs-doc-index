# Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment

| Field | Value |
| --- | --- |
| **Doc** | 762 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [VerticalRoutesEventBehaviorCartoRealign.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorCartoRealign.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-13 21:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical route · cartographic realignment · event behavior · location referencing · route editing · event testing |
| **Tools** | — |

## Summary

This document describes the need to support event behaviors for vertical route shapes during cartographic realignment in Location Referencing. It outlines scenarios for vertical and non-vertical segment edits and specifies testing and automation requirements for these behaviors in both line and non-line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-realign-route.md>) — similar text 0.64 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:761 s=9.021 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.57 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 s=8.47 -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-retire-route.md>) — similar text 0.56 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 s=8.428 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-calibrate-route.md>) — similar text 0.54 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 s=8.218 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-extend-route.md>) — similar text 0.52 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 s=8.167 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing editor, I need to be able to apply event behaviors for vertical route shapes that are cartographically realigned in Location Referencing, so the events located on the cartographically realigned route(s) have their measures and shapes kept up to date.

## Acceptance Criteria
### Cartographic Realignment Route Event Behaviors <!-- slide 3 -->
- When making a cartographic realignment to a vertical route, continue to write to the edit log as we do today
- Cartographic Realignments can result in the following for both the source and target routes:
  - Existing vertical segments are edited but remain vertical
  - Existing vertical segments are edited to become non vertical
  - Existing non vertical segments are edited to become vertical
- For each of these scenarios, we should continue to apply Cartographic Realignment event behaviors in the same way we do today.  This includes building the correct shape for both vertical and non vertical segments
- Should work for vertical route test cases from the Cartographic Realignment Vertical Route shapes user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks (can be combined to a single carto realignment)
- Test with projected and unprojected data
- Test with cartographic realignments on the following events:
  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
- Limit the testing to just these event types and focus the cartographic realignments to editing the vertical segment(s)

## Automation
<!-- slide 5 -->
- Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Documentation
<!-- slide 6 -->
- Add a note to cartographic realignment route event behavior topic to mention vertical routes being supported

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
Test Plan PE:
