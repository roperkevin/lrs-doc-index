# Cover Event Behavior in Extend Route

| Field | Value |
| --- | --- |
| **Doc** | 731 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Cover Event Behavior in Extend Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Cover%20Event%20Behavior%20in%20Extend%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-03-05 22:55 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cover event behavior · extend route · event behavior · functional class · route extension · event stretching · spanning routes · event splitting |
| **Tools** | — |

## Summary

Describes a user story for implementing a cover event behavior that automatically extends events like Functional Class to cover the entire route when the route is extended. It includes rules for applying cover behavior at the beginning or end of routes, handling physical gaps, and spanning routes. Testing and automation plans are outlined, along with documentation updates.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Extend Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-extend-route-with-concurrencies.md>) — similar text 0.57 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:726 s=8.458 -->
- [Cover Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route.md>) — similar text 0.68 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:725 s=8.414 -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.46 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:715 s=7.979 -->
- [Support configuration of Cover event behavior](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-configuration-of-cover-eb.md>) — similar text 0.52 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:732 s=6.627 -->
- [Support Event Behaviors on Complex Route Shapes in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-extend-route.md>) — similar text 0.36 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:839 s=6.156 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/extend-a-route.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

## Story
### Cover Event Behavior in Extend Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I would like an event behavior that will always cover the entire route for events like Functional Class when I perform an extend since there is usually one event record for these events that goes across the entire route, so that I don't have to go to Event Editor to add/merge events after performing one of these edits.

Persona
LRS data loader: This user is responsible for initial and supplemental bulk data loading in the LRS.  When a user first adopts Roads and Highways, they typically oversee or work with a partner to migrate their data into our information model.  Once their organization is in production, this user would be responsible for bulk loading new data as needed (for example a pipeline operator is acquired).  Many DoTs have events that should be “full coverage” for each route in the network.  An example is functional class.  Typically, the functional class for each route doesn’t change over time across the entire route (i.e. if the functional class for a route is state road, it’s going to be state road across the entire route and only have one event record for the entire route).  Cover event behavior provides a way for users to have these events continue to provide full coverage on a route even when it’s extended or realigned.

## Acceptance Criteria
### Cover Event Behavior in Extend Route <!-- slide 3 -->
- When a route is extended and the event behavior configured is Cover, do the following:
  - For Extend at the beginning, any event with cover behavior configured that is at the beginning of the route would be stretched to cover the new beginning of the route.  For cover to be applied, the event needs to begin at the beginning of the route.
  - For Extend at the end, any event with cover behavior configured that is at the end of the route would be stretched to cover the new end of the route.  For cover to be applied, the event needs to end at the end of the route.
  - If the extended portion doesn’t touch the existing route (a physical gap is introduced), we can still apply cover if the event touches the begin/end of the route (depending on whether the user selects to extend the route and the beginning/end when prompted), but the event should be split so it doesn’t span the gap.  This would also apply is the extended portion has a physical gap (for example two physically gapped centerlines make up the extended portion).
- For events that span routes, we should apply the same rules to determine when to cover.  If the extend is at the beginning, apply cover if the event begins at the beginning of the route being extended.  If the extend is at the end, apply cover if the event ends at the end of the route being extended.
- Follow the ArcMap cover behavior as there shouldn’t be any changes from that experience (just additional support for events spanning routes).

## Testing
<!-- slide 4 -->
- Test on non spanning and spanning line events
- It shouldn’t matter whether the data is Roads and Highways or Pipeline Referencing
- Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
- Cover is automated in the ArcMap experience, use the test plan and test data from that story (we should be able to take the ArcMap data, make the same edits in Pro then compare it with the expected results)
- Look at the bugs reported for cover extend since the capability was released in ArcMap and include those scenarios as test cases

## Automation
<!-- slide 5 -->
- Create a new python automated test that follows the same pattern as other automated tests for event behaviors.

## Documentation
<!-- slide 6 -->
- Add a section for cover similar in format, text, and graphics as the existing behaviors (stay put, move, retire) in https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/behavior-for-extending-an-event.htm and the Roads and Highways version of the topic.

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
