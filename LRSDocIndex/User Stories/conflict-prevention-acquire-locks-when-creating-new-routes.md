# Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route

| Field | Value |
| --- | --- |
| **Doc** | 826 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Conflict Prevention Acquire Lock when creating new route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20when%20creating%20new%20route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-04-01 19:14 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict prevention · lock acquisition · route creation · line network · non line network · route editing · route lock |
| **Tools** | Create Route · Extend Route · Realign Route · Reassign Route |

## Summary

Describes the user story for locking newly created routes in route editing tools to prevent conflicts. Covers locking behavior for line and non-line networks during route creation, extension, realignment, and reassignment. Includes testing scenarios and automation plans for verifying lock acquisition and conflict prevention.

## Related documents

<!-- related:begin -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route.md>) — similar text 0.88 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:830 s=10.146 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-conflict-prevention-in-route-editing-skills-in-pro.md>) — similar text 0.26 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:94 s=5.293 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:683 s=4.842 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-conflict-prevention.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/folder <!-- rel:433 s=4.467 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:815 s=4.335 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Story
### Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to lock newly created routes in the route editing tools, so that new and existing lines don’t have conflicts introduced.

## Acceptance Criteria
### Locking when creating new routes in line networks <!-- slide 3 -->
- In the Create, Extend, Realign, and Reassign Route tools, support locking a new route if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
- For line networks (postmile also), attempt to lock a line/route at the following steps:
  - In Create, when the user chooses the line or types the line name in and changes focus
  - In Extend, when the user populates the new route name in the Create Route UI and changes focus
  - In Realign, when the user populated the new route name in the Create Route UI and changes focus
  - In Reassign, when the user populates the route name for the Target Route and changes focus
- If a lock is available, acquire it and let the user move forward.
- If the line is already locked, give a similar message like we do in other editing tools, letting the user know the line/route is already locked in another version/by another user.

### Locking when creating new routes in non-line networks <!-- slide 4 -->
- In the Create and Reassign Route tools, support locking a new route if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
- For non-line networks with a user generated route ID configured, when a user types a route ID into the textbox and changes focus, check for an existing lock on that route ID.
  - If a lock is available, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.
- For non-line networks with an autogenerated route ID configured, when a user types a route name into the textbox and changes focus, check for that existing route name in the network and get the route ID.
  - If the lock is available for that route ID, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.

## Testing
<!-- slide 5 -->
- Verify in REST and Pro
- Negative
  - Attempt to acquire when the route/line is locked by another user
  - Attempt to acquire when the route/line is locked in another version
  - Lock is acquired then removed before hitting run in Create Route tool
- Positive
  - A new route is created on an existing line in a line network with no existing lock.
  - A new route is created on a new line in a line network.
  - A new route is created in a non line network.
  - A new route is created that has an existing time slice in a non overlapping time period (either line or non line network).

## Automation
<!-- slide 6 -->
- Automate in Pro using TestComplete by adding to a new set of conflict prevention tests for Create Route

## Documentation
### Doc <!-- slide 7 -->
- Update existing conflict prevention topics to mention that Conflict Prevention works with Create Route in the same way it does in Extend, Retire, etc.
- Add a note to Create Route topic about Conflict Prevention in the same way we have notes for other editing tools

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
