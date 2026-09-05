# Support Snap Event Behavior in Realign Route

| Field | Value |
| --- | --- |
| **Doc** | 730 · User Story · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Snap Event Behavior in Realign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Snap%20Event%20Behavior%20in%20Realign%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-03-04 23:47 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | snap event behavior · realign route · concurrent routes · event spanning · stay put · route realignment · lrs editor |
| **Tools** | — |

## Summary

Describes a user story for configuring snap behavior for LRS events during route realignment to maintain correct event locations on active routes. Details the snap behavior logic for concurrent routes and event spanning scenarios, testing requirements, automation plans, and documentation updates.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route-with-concurrencies.md>) — similar text 0.34 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:715 s=6.926 -->
- [Cover Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-eb-in-realign-route.md>) — similar text 0.36 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:725 s=6.535 -->
- [Support Event Behaviors on Complex Route Shapes in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-eb-on-complex-route-shapes-in-realign-route.md>) — similar text 0.25 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:836 s=6.034 -->
- [Support Snap Event Behavior in Retire Routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/3780-support-snap-eb-in-retire-routes-rh-apr-v4.md>) — similar text 0.13 · 4 title words · 3 filename words · same kind/folder <!-- rel:479 s=5.655 -->
- [Support Reverse Route Event Behaviors](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-reverse-route-eb-rh-apr-un-2020-12.md>) — similar text 0.24 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:739 s=5.318 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html)
<!-- docs:end -->

---

## Story
### Support Snap event behavior in Realign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS editor, I want to be able to configure “snap” behavior for my LRS event when a route is realigned, so I can have events that don’t change location continue to be correctly located on an active route when their original route is retired at that location as part of the realignment.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  These editors have a need for a snap event behavior when they realign a route.  When there are concurrent routes at a location and a realignment results in the route with an event on it being removed from that location, the users want the event to stay at that location, so we snap it to the most dominant route remaining at that location.  In ArcMap, snap was supported in Realign Overlaps.  In Pro, we’re not going to differentiate between Realign and Realign Overlaps, so snap needs to be applied for Realign Route edits.

## Acceptance Criteria
### Snap behavior configuration <!-- slide 3 -->
- When snap behavior is configured for Realign Route and a route is realigned, we should apply snap behavior if there are concurrent routes remaining at the location of the event
  - Concurrent routes share a common centerline
  - Use the existing snap event behavior from Realign Overlaps in ArcMap for point and non spanning line events (the existing Snap behavior for Reassign Route in Pro will also be a good starting point to build on)
  - Note that when realign with abandonment occurs, reassign route behavior is applied to the abandoned portion
- For events that span routes, we should apply the same principles
  - If the entire event is in the realigned portion and has concurrent routes to snap to, then snap
  - If the event is not completely in the realigned portion, split and apply snap where we can (apply Stay Put for the rest)
  - If the event only has part of the routes with concurrencies, split the event and snap where we can (apply Stay Put for the rest)
- If there are not any concurrent routes remaining at the event location after the realignment, then we should apply Stay Put behavior in the same way we do today in ArcMap
- See next slide for examples

<!-- slide 4 -->
![Figure 1](../media/support-snap-eb-in-realign-route/fig-01-slide-04.png)
![Figure 2](../media/support-snap-eb-in-realign-route/fig-02-slide-04.png)
![Figure 3](../media/support-snap-eb-in-realign-route/fig-03-slide-04.png)

## Testing
<!-- slide 5 -->
- Test with two datasets: projected non line networks (RH) and unprojected line network (APR)
- Should work on the following route shapes: simple, gapped, complex (loop, lollipop, alpha, branch, barbell), vertical
- Test on all three event types (point, line, spanning)
- Make sure to include the scenarios on the previous slide
- Make sure to test with and without abandonment

## Automation
<!-- slide 6 -->
- Add new automated tests for snap for realign routes following the same pattern as other event behavior automation

## Documentation
<!-- slide 7 -->
- In https://pro.arcgis.com/en/pro-app/latest/help/production/roads-highways/event-behavior-for-route-realignment.htm (and the Pipeline Referencing topics as well), add graphics/descriptions for Snap in the similar way to Stay Put, Move, and Retire that are already in the topic

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
