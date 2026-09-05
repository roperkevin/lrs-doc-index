# Support Search Tolerance Parameter in Update Measures from LRS Tool

| Field | Value |
| --- | --- |
| **Doc** | 273 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Search Tolerance Parameter in Update Measures from LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Search%20Tolerance%20Parameter%20in%20Update%20Measures%20from%20LRS.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-12-12 16:33 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | search tolerance · update measures · route · measure · event · tolerance parameter · off route |
| **Tools** | Update Measures from LRS |

## Summary

This document describes a user story for adding a search tolerance parameter to the Update Measures from LRS tool. The parameter allows route and measure information to be assigned to features near but not on routes, supporting management of off-route events. It includes testing, automation updates, and documentation changes for this new capability.

## Related documents

<!-- related:begin -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4100-support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.25 · 6 title words · 2 filename words · same surface <!-- rel:229 s=5.516 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs.md>) — similar text 0.28 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:266 s=4.923 -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs.md>) — similar text 0.17 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:704 s=4.651 -->
- [Support rounding output measures in Derive Event Measures tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-rounding-output-measures-in-derive-event-measures.md>) — similar text 0.16 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:823 s=4.327 -->
- [Support automatic deselection of centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-automatic-deselection-of-centerlines.md>) — similar text 0.10 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:705 s=4.098 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support search tolerance parameter in Update Measures from LRS tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Editor, I want to be able to get route and measure information on characteristics/assets that are within the road/pipe corridor, but not on the route, so I can load them into LRS Events and manage them within the software moving forward.
Persona

- LRS Editor: This user is responsible for maintaining the LRS via route and potentially event edits as well.  One of the tasks this user will complete is to bulk load new event data that comes from outside sources (contractor vendors, field crews, other business units).  This data is sometimes delivered as features that are close to, but not on the routes in the LRS.  These users would like to get route and measure information onto these features so they can be managed as LRS Events.  Adding a search tolerance parameter to Update Measures from LRS will allow this to happen.  An additional use case this can be used for is user that want to get route/measure information onto events that should be off the route (perpendicular offset).  We don’t support this in the software yet, so this would be a temporary solution until we do.

## Acceptance Criteria
### Search tolerance in Update Measures from LRS <!-- slide 3 -->
- Add an optional parameter to the Update Measures from LRS tool called Search tolerance
- This parameter would always be available no matter what event type or network is selected
- The units for the tolerance should be the same as the M tolerance of the LRS Network
- When the parameter is populated, utilize that tolerance value as a search radius for any feature that isn’t located on an existing route
- If there is more than one route/measure location that falls within the search radius, populate the event with the closest (smallest distance from the point) value
- Any feature that has no route/measures within the radius should continue to get no route/measure populated like we do today

## Testing
<!-- slide 4 -->
- Test a mix of roads and pipeline data
- Test with point and line events
- Test with cases where there is one, multiple, and no route/measure locations within the tolerance
- Test with a case where the distance between the point and route/measure location is slightly larger and slightly smaller than the tolerance
- Test with python and model builder

## Automation
<!-- slide 5 -->
Update existing automation to account for this new parameter
Existing automation may break for any negative test cases where the feature was off the route
Add additional test cases for these new capabilities in the tool

## Documentation
<!-- slide 6 -->
Update the tool documentation for the new parameter.  Make sure to mention the tolerance measure is based on the M units of the LRS Network.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
