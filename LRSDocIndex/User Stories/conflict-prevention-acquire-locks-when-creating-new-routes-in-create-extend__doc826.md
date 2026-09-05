# Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Conflict Prevention Acquire Lock when creating new route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20when%20creating%20new%20route.pptx>) |
| **Edited** | 2020-04-01 19:14 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route"
source_file: "Conflict Prevention Acquire Lock when creating new route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20when%20creating%20new%20route.pptx"
doc_id: 826
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-04-01T19:14:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["conflict prevention", "lock acquisition", "route creation", "line network", "non line network", "route editing", "route lock"]
tools: ["Create Route", "Extend Route", "Realign Route", "Reassign Route"]
products: []
issues: []
related: [{"doc":830,"file":"conflict-prevention-acquire-locks-in-create-route__doc830.md","s":10.146},{"doc":94,"file":"support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md","s":5.293},{"doc":683,"file":"conflict-prevention-for-event-editing-in-pro__doc683.md","s":4.842},{"doc":433,"file":"experience-builder-conflict-prevention-user-story__doc433.md","s":4.467},{"doc":815,"file":"support-conflict-prevention-on-lrs-explode-operation__doc815.md","s":4.335}]
```
-->

## Summary

Describes the user story for locking newly created routes in route editing tools to prevent conflicts. Covers locking behavior for line and non-line networks during route creation, extension, realignment, and reassignment. Includes testing scenarios and automation plans for verifying lock acquisition and conflict prevention.

## Related documents

<!-- related:begin -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route__doc830.md>) — similar text 0.88 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:830 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md>) — similar text 0.26 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:94 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro__doc683.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:683 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-conflict-prevention-user-story__doc433.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/folder <!-- rel:433 -->
- [Support Conflict Prevention on LRS Explode Operation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-on-lrs-explode-operation__doc815.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:815 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1 — Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to lock newly created routes in the route editing tools, so that new and existing lines don’t have conflicts introduced.

## Slide 3 — Locking when creating new routes in line networks

In the Create, Extend, Realign, and Reassign Route tools, support locking a new route if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
For line networks (postmile also), attempt to lock a line/route at the following steps:

  - In Create, when the user chooses the line or types the line name in and changes focus
  - In Extend, when the user populates the new route name in the Create Route UI and changes focus
  - In Realign, when the user populated the new route name in the Create Route UI and changes focus
  - In Reassign, when the user populates the route name for the Target Route and changes focus
If a lock is available, acquire it and let the user move forward.
If the line is already locked, give a similar message like we do in other editing tools, letting the user know the line/route is already locked in another version/by another user.

## Slide 4 — Locking when creating new routes in non-line networks

In the Create and Reassign Route tools, support locking a new route if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
For non-line networks with a user generated route ID configured, when a user types a route ID into the textbox and changes focus, check for an existing lock on that route ID.

  - If a lock is available, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.
For non-line networks with an autogenerated route ID configured, when a user types a route name into the textbox and changes focus, check for that existing route name in the network and get the route ID.

  - If the lock is available for that route ID, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.

## Slide 5 — Testing

Verify in REST and Pro
Negative

  - Attempt to acquire when the route/line is locked by another user
  - Attempt to acquire when the route/line is locked in another version
  - Lock is acquired then removed before hitting run in Create Route tool
Positive

  - A new route is created on an existing line in a line network with no existing lock.
  - A new route is created on a new line in a line network.
  - A new route is created in a non line network.
  - A new route is created that has an existing time slice in a non overlapping time period (either line or non line network).

## Slide 6 — Automation

Automate in Pro using TestComplete by adding to a new set of conflict prevention tests for Create Route

## Slide 7 — Doc

Update existing conflict prevention topics to mention that Conflict Prevention works with Create Route in the same way it does in Extend, Retire, etc.
Add a note to Create Route topic about Conflict Prevention in the same way we have notes for other editing tools

## Slide 8 — Assignment

Story Points:
Dev:
PE:
