# Support Events Spanning Routes in Update Measures from LRS

| Field | Value |
| --- | --- |
| **Doc** | 266 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Events Spanning Routes in Update Measures from LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Events%20Spanning%20Routes%20in%20Update%20Measures%20from%20LRS.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-12-19 18:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | spanning event · route id · to route id · update measures · lrs event · search tolerance |
| **Tools** | Update Measures from LRS |

## Summary

This document describes a user story for adding support for events spanning multiple routes in the Update Measures from LRS tool. It details the addition of optional parameters to handle spanning events, testing scenarios, automation updates, and documentation changes. The goal is to enable LRS Analysts to populate from and to route IDs for events that span routes.

## Related documents

<!-- related:begin -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs.md>) — similar text 0.61 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:704 s=5.694 -->
- [Support Search Tolerance Parameter in Update Measures from LRS Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-search-tolerance-parameter-in-update-measures.md>) — similar text 0.28 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:273 s=5.058 -->
- [Update Measures From LRS: Support Spanning Events Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3881-update-measures-from-lrs-support-spanning-events.md>) — similar text 0.05 · 4 title words · 2 filename words · same surface <!-- rel:230 s=4.234 -->
- [Consider concurrencies in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/consider-concurrencies-in-update-measures-from-lrs.md>) — similar text 0.43 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:710 s=4.046 -->
- [Related Table for Intersection Measures](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/related-table-for-intersection-measures.md>) — similar text 0.36 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:678 s=3.476 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-event-properties.html)

_No page matched:_ [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support spanning events in Update Measures from LRS tool <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS Analyst, I want the from and to routeID populated when running Update Measures from LRS tool, so I can treat these feature classes as events that span routes.
Persona

- LRS Analyst: This user is responsible for analysis and reporting on LRS data.  This user may also have other titles/responsibilities within the organization, such as LRS editor or HPMS coordinator.  For the analyst role, this user utilizes other tools/capabilities within the Esri ecosystem as well as via home built and partner solutions. These users may have features that aren’t managed by the LRS that they need to get the route and measure via the Update Measures from LRS tool.  For users in an organization that utilizes events that span routes, they want to be able to utilize the Update Measures from LRS tool to get From and To RouteIDs populated so the events can be stored like events spanning routes within the LRS.

## Acceptance Criteria
### Events Spanning Routes in Update Measures from LRS <!-- slide 3 -->
- Add an optional parameter to the Update Measures from LRS called “To Route ID Field”
- This parameter would only appear in the UI when the Input Features layer/fc is a line, but will remain optional
- Place the parameter in the UI after the measure field
- If a network without route name configured is selected, the parameter shouldn’t appear in the UI
- The parameter UI dropdown in Pro should include any fields that would be available for the Route ID Field
- If the parameter is populated, we should treat the event as a spanning event and calculate the To Route ID and To Measure the same way we would for spanning LRS event within the LRS
- Enforce the same rules that we do when building/updating a spanning event (needs to be on the same line, etc.)
- If this parameter is populated, then the To Measure Field must also be populated
- If the LRS Network selected supports Route Name, then make another optional parameter called To Route Name available
- If the Route Name is populated and the To Route ID is populated, then the To Route Name must be populated as well
- If a search tolerance is populated, utilize that distance for both the From and To locations of the event, but continue to enforce the rules for building a spanning event (needs to be on the same line, etc.)
- If the feature class/layer being updated is an LRS Event, continue to not allow any of the LRS fields to be mapped

## Testing
<!-- slide 4 -->
- Test on a mix of spanning and non spanning events
- Test on a mix of LRS Events and non LRS Events
- Test with and without a search tolerance
- Test on a mix of APR-UN and RH data (more APR-UN)
- Test scenarios where spanning Loc Errors would appear

## Automation
<!-- slide 5 -->
Existing python automation may break with this new parameter.  Update it if that’s the case.
Add a few cases for spanning events to the existing automation for the tool.

## Documentation
<!-- slide 6 -->
Update the tool documentation for the new parameter.  Add a usage note about when the parameter would/wouldn’t appear and how it adds support for spanning event types in the tool.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
