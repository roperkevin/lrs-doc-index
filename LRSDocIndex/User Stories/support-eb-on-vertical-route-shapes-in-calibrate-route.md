# Support Event Behaviors on Vertical Route Shapes in Calibrate Route

| Field | Value |
| --- | --- |
| **Doc** | 759 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [VerticalRoutesEventBehaviorCalibrate.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorCalibrate.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-14 00:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical route · event behavior · calibrate route · stay put · move · retire · location referencing |
| **Tools** | — |

## Summary

This user story describes the need for Location Referencing editors to apply event behaviors on vertical route shapes calibrated in Location Referencing, ensuring events on calibrated routes have updated measures and shapes. It specifies behavior for Stay Put, Move, and Retire event behaviors during calibration and outlines testing and automation requirements for vertical route scenarios in both line and non line networks.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.72 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 s=9.37 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-realign-route.md>) — similar text 0.69 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 s=9.268 -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-retire-route.md>) — similar text 0.79 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 s=9.152 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-extend-route.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 s=8.821 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.54 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 s=8.218 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [calibrate route](https://www.google.com/search?q=%22calibrate%20route%22+site%3Adoc.esri.com) · [calibration point layer](https://www.google.com/search?q=%22calibration%20point%20layer%22+site%3Adoc.esri.com) · [apply event behavior](https://www.google.com/search?q=%22apply%20event%20behavior%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Vertical Route Shapes in Calibrate Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing editor, I need to be able to apply event behaviors for vertical route shapes that are calibrated in Location Referencing, so the events located on the calibrated route have their measures and shapes kept up to date.

## Acceptance Criteria
### Calibrate Route Event Behaviors <!-- slide 3 -->
- When calibrating a vertical route, continue to write to the edit log as we do today
- Remember that recalibration downstream will result in a calibrate record in the edit log
- For calibration, the shape of the route doesn’t change, but the measures do. When a calibration edit takes place (either by adding/editing/deleting a CP or through recalibration downstream from another edit type), continue to apply event behaviors in the same way we do today.
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
- Should work for all vertical route test cases from the Calibrate Complex Route shapes user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with calibrate at the beginning/middle/end on routes with the following events:
  - Completely on a vertical segment of a route
  - Beginning upstream of a vertical segment of route ending on the middle of the vertical segment
  - Beginning in the middle of a vertical segment of a route ending downstream of the vertical segment
  - Beginning upstream of the vertical segment ending downstream of the vertical segment
- Limit the testing to just these event types

## Automation
<!-- slide 5 -->
- Add automation for vertical route test cases to the existing python automation we have today for Apply Event Behaviors.

## Documentation
<!-- slide 6 -->
- Add a note to calibrate route event behavior topic to mention vertical shapes being supported

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
Test Plan PE:
