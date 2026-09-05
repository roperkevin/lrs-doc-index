# Conflict Prevention: Acquire Locks in Create Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Conflict Prevention Acquire Lock in Create Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20in%20Create%20Route.pptx>) |
| **Edited** | 2020-03-20 00:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Conflict Prevention: Acquire Locks in Create Route"
source_file: "Conflict Prevention Acquire Lock in Create Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Acquire%20Lock%20in%20Create%20Route.pptx"
doc_id: 830
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-03-20T00:34:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["conflict prevention", "lock acquisition", "create route", "line network", "non line network", "route locking"]
tools: ["Create Route"]
products: []
issues: []
related: [{"doc":826,"file":"conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md","s":10.146},{"doc":94,"file":"support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md","s":5.12},{"doc":683,"file":"conflict-prevention-for-event-editing-in-pro__doc683.md","s":4.824},{"doc":433,"file":"experience-builder-conflict-prevention-user-story__doc433.md","s":4.501},{"doc":45,"file":"acquire-and-release-locks-tool-user-story__doc45.md","s":4.456}]
```
-->

## Summary

Describes the user story for enabling lock acquisition in the Create Route tool to prevent conflicts when creating new routes or lines in line and non-line networks. Details the locking behavior for different network types and UI changes required. Includes testing scenarios for positive and negative cases and plans for automation and documentation updates.

## Related documents

<!-- related:begin -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes-in-create-extend__doc826.md>) — similar text 0.88 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:826 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md>) — similar text 0.25 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:94 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro__doc683.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:683 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-conflict-prevention-user-story__doc433.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/folder <!-- rel:433 -->
- [Acquire and Release Locks tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/acquire-and-release-locks-tool-user-story__doc45.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:45 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1 — Conflict Prevention: Acquire Locks in Create Route

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to lock newly create routes in the Create Route tool, so that new and existing lines don’t have conflicts introduced.

## Slide 3 — Locking in Create Route for line networks

In the Create Route tool, support locking if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
For line networks (postmile also), when a user selects an existing line using the picker tool or types a new/existing line into the textbox and changes focus, check for an existing lock on that line.

  - If a lock is available, acquire it and let the user move forward.
  - If the line is already locked, give a similar message like we do in other editing tools, letting the user know the line/route is already locked in another version/by another user.
Note this will require changing the existing UI design a bit.  Don’t allow the user to populate the Route Name textbox until the lock is acquired on the line.

## Slide 4 — Locking in Create Route for non-line networks

In the Create Route tool, support locking if Conflict Prevention is enabled on the LRS Network selected in the tool UI.
For non-line networks with a user generated route ID configured, when a user types a route ID into the textbox and changes focus, check for an existing lock on that route ID.

  - If a lock is available, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.
For non-line networks with an autogenerated route ID configured, when a user types a route name into the textbox and changes focus, check for that existing route name in the network and get the route ID.

  - If the lock is available for that route ID, acquire it and let the user move forward.
  - If the route is already locked, give a similar message like we do in other editing tools, letting the user know the route is already locked in another version/by another user.
Note this will require changing the existing UI design a bit.  Don’t allow the user to populate the measure textboxes until the lock is acquired on the route.

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
