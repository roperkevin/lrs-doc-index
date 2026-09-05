# Cover Event Behavior in Realign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Cover Event Behavior in Realign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Cover%20Event%20Behavior%20in%20Realign%20Route.pptx>) |
| **Edited** | 2021-03-25 22:05 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Cover Event Behavior in Realign Route"
source_file: "Cover Event Behavior in Realign Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Cover%20Event%20Behavior%20in%20Realign%20Route.pptx"
doc_id: 725
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-03-25T22:05:15Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event behavior", "realign route", "cover event", "functional class", "route realignment", "event snapping", "spanning event", "route extension"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":715,"file":"cover-event-behavior-in-realign-route-with-concurrencies__doc715.md","s":9.389},{"doc":731,"file":"cover-event-behavior-in-extend-route__doc731.md","s":8.414},{"doc":726,"file":"cover-event-behavior-in-extend-route-with-concurrencies__doc726.md","s":7.399},{"doc":732,"file":"support-configuration-of-cover-event-behavior__doc732.md","s":6.957},{"doc":730,"file":"support-snap-event-behavior-in-realign-route__doc730.md","s":6.535}]
```
-->

## Summary

Describes a user story for implementing a cover event behavior in route realignment within the Linear Referencing System. The behavior ensures events like Functional Class cover the entire route after realignment, avoiding manual edits. It includes conditions for event adjustment based on their relation to the realigned portion and specifies testing and automation plans.

## Related documents

<!-- related:begin -->
- [Cover Event Behavior in Realign Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-realign-route-with-concurrencies__doc715.md>) — similar text 0.59 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:715 -->
- [Cover Event Behavior in Extend Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-extend-route__doc731.md>) — similar text 0.68 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:731 -->
- [Cover Event Behavior in Extend Route with Concurrencies](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/cover-event-behavior-in-extend-route-with-concurrencies__doc726.md>) — similar text 0.59 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:726 -->
- [Support configuration of Cover event behavior](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-configuration-of-cover-event-behavior__doc732.md>) — similar text 0.43 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:732 -->
- [Support Snap Event Behavior in Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-event-behavior-in-realign-route__doc730.md>) — similar text 0.36 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:730 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Event behavior for route extension](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-extension.html)
<!-- docs:end -->

---

## Slide 1 — Cover Event Behavior in Realign Route

User Story

## Slide 2 — User Story

As an LRS Editor, I would like an event behavior that will always cover the entire route for events like Functional Class when I perform an realign since there is usually one event record for these events that goes across the entire route, so that I don't have to go to Event Editor to add/merge events after performing one of these edits.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route edits based on these documents.  Many DoTs have events that should be “full coverage” for each route in the network.  An example is functional class.  Typically, the functional class for each route doesn’t change over time across the entire route (i.e. if the functional class for a route is state road, it’s going to be state road across the entire route and only have one event record for the entire route).  Cover event behavior provides a way for users to have these events continue to provide full coverage on a route even when it’s extended or realigned.

## Slide 3 — Cover Event Behavior in Realign Route

When a route is realigned and the event behavior configured is Cover, do the following:

  - Determine where the even is in relation to the realigned portion (within it, partially within it, eclipses the realigned portion, touches the beginning/end of the realigned portion only)
  - For an event that eclipses the realigned portion, the new event should cover the entirety of the realigned portion
  - For an event within or partially within the realigned portion, the new event should be proportionally snapped to the route shape after realignment.  For example, if an event had measures 4-6 and the realigned portion of the route was from 3-7 and is now 3-11 after the realignment, the event would have new measures 5-9.
  - If an event touches the beginning/end of the route, we should apply cover to completely cover the realigned portion only if there is no other event located in the realigned portion of the route (otherwise overlapping events would be created)
We should apply the same approach for events that span routes.
Follow the ArcMap cover behavior as there shouldn’t be any changes from that experience (just additional support for events spanning routes).
Don’t worry about concurrencies, they’ll be handled in a different user story.
Note this is only for realign where there are no concurrencies (concurrent routes will be a different user story)

## Slide 4 — Testing

It shouldn’t matter whether the data is Roads and Highways or Pipeline Referencing
Test on spanning and non spanning event types
Should work on simple, gapped, complex (loop, lollipop, alpha, branch), and vertical routes
Cover is automated in the ArcMap experience, use the test plan and test data from that story (we should be able to take the ArcMap data, make the same edits in Pro then compare it with the expected results)
Look at the bugs reported for cover extend since the capability was released in ArcMap and include those scenarios as test cases

## Slide 5 — Automation

Create a new python automated test that follows the same pattern as other automated tests for event behaviors.

## Slide 6 — Documentation

Add a section for cover similar in format, text, and graphics as the existing behaviors (stay put, move, retire) in https://pro.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/event-behavior-for-route-realignment.htm and the Roads and Highways version of the topic.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
