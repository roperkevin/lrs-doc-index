# Cover Event Behavior in Realign Route with Concurrencies

| Field | Value |
| --- | --- |
| **Doc** | 715 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Cover Event Behavior in Realign Route with Concurrencies.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Cover%20Event%20Behavior%20in%20Realign%20Route%20with%20Concurrencies.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-04-30 00:55 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | cover event behavior · realign route · concurrency · route dominance · event spanning · event behavior · route editing |
| **Tools** | — |

## Summary

Describes the user story for implementing cover event behavior during route realignment with concurrencies in the LRS. It explains how event coverage should be managed based on route dominance rules, including handling of concurrent sections and spanning events. The document also outlines testing, automation, and documentation plans for this behavior.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route.md>) — similar text 0.59 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:725 s=9.389 -->
- [Cover Event Behavior in Extend Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-extend-route-with-concurrencies.md>) — similar text 0.76 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:726 s=8.842 -->
- [Cover Event Behavior in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-extend-route.md>) — similar text 0.46 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:731 s=7.979 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-eb-in-realign-route.md>) — similar text 0.34 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:730 s=6.926 -->
- [Support configuration of Cover event behavior](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-configuration-of-cover-eb.md>) — similar text 0.32 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:732 s=6.636 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)
<!-- docs:end -->

---

## Story
### Cover Event Behavior in Realign Route with Concurrencies <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I would like an event behavior that will always cover the entire route for events like Functional Class when I perform a realign since there is usually one event record for these events that goes across the entire route, so that I don't have to go to Event Editor to add/merge events after performing one of these edits.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  Many DoTs have events that should be “full coverage” for each route in the network.  An example is functional class.  Typically, the functional class for each route doesn’t change over time across the entire route (i.e. if the functional class for a route is state road, it’s going to be state road across the entire route and only have one event record for the entire route).  Cover event behavior provides a way for users to have these events continue to provide full coverage on a route even when it’s extended or realigned.

## Acceptance Criteria
### Realign Route Cover with Concurrencies <!-- slide 3 -->
- When route dominance rules are configured for the network with routes being edited AND cover behavior is configured for an event, cover event behavior should do the following:
  - For any newly created concurrent section(s) created by the realign, determine which route is dominant in each concurrent section
  - If the realigned route is realigned to a newly created concurrent section and it is the dominant route in that section, apply cover behavior for that section
  - If the realigned route is realigned to a newly created concurrent section and it is NOT the dominant route in that section, apply stay put behavior for that section
  - If the non dominant routes in the newly created concurrent section had events, they should be retired so only the dominant routes exists in the concurrent section
- If there are either no dominance rules configured or the current dominance rules configured can’t determine which route is dominant in a section, we should take whatever route the concurrency logic provides as dominant in that section and apply cover based on the criteria in previous slides.
- If there is an existing concurrency in the realigned portion and the route being realigned is not dominant in the concurrent section, do not change any events in the concurrent section (even if the current event is not associated with the dominant route; that is user error and should be corrected by the user)
- Note that the basic rules for cover still apply (i.e. in order to invoke cover behavior that event must be completely covering, touching the end, partially within, or completely within the realigned section, otherwise Stay Put is applied) to determine if cover is applied at all.

### Example Use Case <!-- slide 4 -->
- Route 1 is realigned and has 2 concurrent sections (1+3, 1+2).
- Concurrency 1 is between Route 1 and Route 3.
(Route 3 is dominant)

- Concurrency 2 is between Route 1 and Route 2.
(Route 1 is dominant)

- Event on Route 1 only extends to cover concurrency where it is dominant (or there is no concurrency).
Event on Rte 1
Event on Rte 2
Event on Rte 3
Event on Rte 1
Event on Rte 2
Event on Rte 3

[figure: Route 1 · Route 2 · Route 3 · After Realign · Before Realign]

![Figure 1 — Example Use Case](../media/cover-eb-in-realign-route-with-concurrencies/fig-01-slide-04-example-use-case.svg)

### Events spanning routes <!-- slide 5 -->
- If the event is configured to span routes, we can apply the same basic principles.
  - Determine any concurrencies created by the realign
  - Determine the dominant route in each section
  - Where the realigned route is dominant, apply cover, otherwise apply stay put
- Note that if there is an abandonment, that is a different edit operation/event behavior, so it’s not applicable to determining concurrencies and applying cover to the realigned section
- Note that for both spanning and non spanning routes, the event could end up being split if there are multiple unique concurrent sections in the realigned portion

### Example Use Case <!-- slide 6 -->
- Realignment from middle of R1 to middle of R2 results in 2 concurrent sections (R1A-R3 and R1A-R4).
- Concurrency 1 with R3 (R3 is dominant).
- Concurrency 2 with R4 (R1A is dominant).
- E1 only extends to cover concurrency where it is dominant (or there is no concurrency).

| Ev | FR | TR | FM | TM |
| --- | --- | --- | --- | --- |
| E1 | R1 | R2 | 0 | 21 |
| E3 | R3 | R3 | 0 | 10 |
| E4 | R4 | R4 | 30 | 40 |

| Ev | FR | TR | FM | TM |
| --- | --- | --- | --- | --- |
| E1 | R1 | R1A | 0 | 9 |
| E1 | R1A | R2 | 12 | 21 |
| E3 | R3 | R3 | 0 | 10 |
| E4 | R4 | R4 | 34 | 40 |

[figure: R1, L1 · R3, L3 · E1 · E3 · After Realign · Before Realign · R2, L1 · R4, L3 · E4 · 0 · 10 · 11 · 21 · 30 · 40 · 8 · 7 · 17 · 14 · 12 · 34 · R1A, L1 · 9]

![Figure 2 — Example Use Case](../media/cover-eb-in-realign-route-with-concurrencies/fig-02-slide-06-example-use-case.svg)

## Testing
<!-- slide 7 -->
- Test on both spanning and non spanning events
- It shouldn’t matter whether the data is Roads and Highways or Pipeline Referencing
- Should work on simple, gapped, complex, and vertical routes
- Make sure to test cases where there are existing concurrent sections before realigning, in addition, to cases where concurrent sections are created after making the edit.
- Cover is automated in the ArcMap experience, use the test plan and test data from that story (we should be able to take the ArcMap data, make the same edits in Pro then compare it with the expected results)
- Look at the bugs reported for cover realign since the capability was released in ArcMap and include those scenarios as test cases

## Automation
<!-- slide 8 -->
- Create a new python automated test that follows the same pattern as other automated tests for event behaviors.

## Documentation
<!-- slide 9 -->
- Add information about concurrent route scenario support for Cover in https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/event-behavior-for-route-realignment.htm and the Roads and Highways version of the topic.

## Assignment
<!-- slide 10 -->
Story Points:
Dev:
PE:
