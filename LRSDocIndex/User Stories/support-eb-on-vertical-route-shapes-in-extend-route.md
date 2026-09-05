# Support Event Behaviors on Vertical Route Shapes in Extend Route

| Field | Value |
| --- | --- |
| **Doc** | 760 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [VerticalRoutesEventBehaviorExtend.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/VerticalRoutesEventBehaviorExtend.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-08-14 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | vertical route · event behavior · extend route · location referencing · route extension · event measures · event shape |
| **Tools** | — |

## Summary

User story describing the need to apply event behaviors for vertical routes extended in Location Referencing, ensuring events on extended routes have updated measures and shapes. It includes behavior rules for Stay Put, Move, and Retire during route extension, testing scenarios for line and non-line networks, and plans for automation and documentation updates.

## Related documents

<!-- related:begin -->
- [Support Event Behaviors on Vertical Route Shapes in Retire Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-retire-route.md>) — similar text 0.85 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:763 s=9.166 -->
- [Support Event Behaviors on Vertical Route Shapes in Calibrate Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-calibrate-route.md>) — similar text 0.74 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:759 s=8.821 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-reassign-route.md>) — similar text 0.71 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:758 s=8.728 -->
- [Support Event Behaviors on Vertical Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-realign-route.md>) — similar text 0.67 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:761 s=8.62 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-vertical-route-shapes-in-cartographic.md>) — similar text 0.52 · 6 title words · 4 filename words · same kind/surface/folder <!-- rel:762 s=8.167 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html)
<!-- docs:end -->

---

## Story
### Support Event Behaviors on Vertical Route Shapes in Extend Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing editor, I need to be able to apply event behaviors for vertical routes that are extended in Location Referencing, so the events located on the extended route have their measures and shapes kept up to date.

## Acceptance Criteria
### Extend Route Event Behaviors <!-- slide 3 -->
- When extending a vertical route (at the beginning or end), continue to write to the edit log as we do today
- Since the route can only be extended at the beginning/end and the segment where existing measures exist can only have its measures changed, follow the same pattern like when a simple route geometry is extended.
  - For Stay Put, keep the shape the same and update the measure(s)
  - For Move, keep the measures and locate the shape where those measures are on the route
  - For Retire, retire the event if it’s impacted by the edit
- After the math is calculated for event behaviors, ensure the shape for vertical sections on the route are drawn correctly
- Consider the recalibrate downstream is now exposed and calibrate event behavior will apply to the downstream events
- Should work for all vertical route test cases from the Extend vertical route user story
- Works in both non line and line networks (no Postmile as they don’t have events)

## Testing
<!-- slide 4 -->
- Test in both line and non line networks
- Test with projected and unprojected data
- Test with extend at the beginning/end on routes with the following events:
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
- Add a note to extend route event behavior topic to mention vertical routes being supported

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
Test Plan PE:
