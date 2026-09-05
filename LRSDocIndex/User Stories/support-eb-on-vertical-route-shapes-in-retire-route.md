# Support Event Behaviors on Vertical Route Shapes in Retire Route

| Field | Value |
| --- | --- |
| **Doc** | 763 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [VerticalRoutesEventBehaviorRetire.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorRetire.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-14 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical route · retire route · event behavior · location referencing · route editing · event measures |
| **Tools** | — |

## Summary

This document describes the user story for supporting event behaviors on vertical routes that are retired in Location Referencing. It details the expected behaviors for events on vertical route segments during retire operations and outlines testing and automation plans. The document also includes notes on updating documentation to reflect vertical route support.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.77 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 s=9.238 -->
- [Support Event Behaviors on Vertical Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-extend-route.md>) — similar text 0.85 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:760 s=9.166 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-calibrate-route.md>) — similar text 0.79 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 s=9.152 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-realign-route.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 s=8.987 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.56 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 s=8.428 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Vertical Route Shapes in Retire Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing editor, I need to be able to apply event behaviors for vertical routes that are retire in Location Referencing, so the events located on the extended route have their measures and shapes kept up to date.

## Acceptance Criteria
### Retire Route Event Behaviors <!-- slide 3 -->
- When retiring a vertical route (beginning, middle, end, all), continue to write to the edit log as we do today
- Retirements on vertical shapes will not result in the shape changing (but could introduce a vertical gap; continue to apply event behaviors in the same way we do today.
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
- Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
- Should work for all vertical route test cases from the Retire vertical route user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with retire at the beginning, middle, end, and all of the route on routes with the following events:
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
- Add a note to retire route event behavior topic to mention vertical routes being supported

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
Test Plan PE:
