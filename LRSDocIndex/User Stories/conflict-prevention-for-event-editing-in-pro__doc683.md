# Conflict Prevention for Event Editing in Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Conflict Prevention Event Editing in Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Event%20Editing%20in%20Pro.pptx>) |
| **Edited** | 2022-02-01 01:05 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Conflict Prevention for Event Editing in Pro"
source_file: "Conflict Prevention Event Editing in Pro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Conflict%20Prevention%20Event%20Editing%20in%20Pro.pptx"
doc_id: 683
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-02-01T01:05:12Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["conflict prevention", "event editing", "event locks", "route locks", "core editing tools", "attribute table", "lock acquisition"]
tools: ["Add Point Event", "Add Line Event", "Add Multiple Point Event", "Add Multiple Line Event"]
products: []
issues: []
related: [{"doc":671,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc671.md","s":6.973},{"doc":670,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md","s":6.946},{"doc":666,"file":"conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md","s":6.674},{"doc":94,"file":"support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md","s":6.19},{"doc":433,"file":"experience-builder-conflict-prevention-user-story__doc433.md","s":5.296}]
```
-->

## Summary

This document describes the need to enable conflict prevention when creating or editing events in ArcGIS Pro to avoid conflicts from concurrent edits. It specifies the event editing tools affected and the lock acquisition process to prevent conflicts. Testing and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc671.md>) — similar text 0.23 · 5 title words · 5 filename words · same surface <!-- rel:671 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md>) — similar text 0.22 · 5 title words · 5 filename words · same surface <!-- rel:670 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md>) — similar text 0.21 · 5 title words · 5 filename words · same surface <!-- rel:666 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md>) — similar text 0.31 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:94 -->
- [Experience Builder Conflict Prevention User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-conflict-prevention-user-story__doc433.md>) — similar text 0.48 · 2 title words · 2 filename words · same kind/folder <!-- rel:433 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Add Multiple Point Event](https://www.google.com/search?q=%22Add%20Multiple%20Point%20Event%22+site%3Adoc.esri.com) · [Add Multiple Line Event](https://www.google.com/search?q=%22Add%20Multiple%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Conflict Prevention for Event Editing in Pro

User Story

## Slide 2 — User Story

As an LRS Editor, I need conflict prevention enabled when creating/editing events in ArcGIS Pro, so no conflicts can be introduced if other users edit the same route or event.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. These users want Conflict Prevention enabled when they make event edits in ArcGIS Pro the same way we support conflict prevention when they make event edits in the Event Editor.

## Slide 3 — Conflict Prevention Event Editing in Pro

Add Conflict Prevention to the following event editing tools in ArcGIS Pro

  - Creating new event via core editing tools
  - Creating new event via Pro Attribute table
  - Editing event via core editing tools
  - Editing event via Pro Attribute table
  - Add Point Event tool
  - Add Line Event tool
  - Add Multiple Point Event tool
  - Add Multiple Line Event tool
In each of these tools, we should be checking for/acquiring Event Locks for any events that are being edited
Follow a similar pattern for lock acquisition as we do in Route Editing tools and for Cartographic Realignment (check if a lock already exists, then try to acquire a lock if needed; if a conflicting lock already exists then have the tool/operation fail, if a lock already exists for that user/version/route/layer or no lock exists, then acquire and let the operation succeed)
If a route lock already exists for a route with events being added/edited, there is no need to create an event lock
In the tools being maintained by our team (Add Point, Line, Multiple Point Multiple Line) check for the lock when the routeID is selected and then again when run clicked at the end of the workflow.  Provide an error message in the tool is there is a conflict (use the Route Editing tools as a guide)
In the tools being maintained by core, we can’t make the check for the lock until our controller dataset is alerted.  If there are conflicting locks/the lock can’t be acquired, roll back the edit and provide the user a message somehow about there being conflicts.
Use Event Editor as a guide as we should follow a similar process within Pro for event editing as we do in the app

## Slide 4 — Testing

Verify in REST and Pro
Verify the tools work as they do today with no conflict prevention enabled
Make a request via lrsApplyEdits REST when no lock is in place (operation should fail)
Verify in Pro using all 8 tools (mix and match cases, no need to run every test case on all 8 tools)
Verify on a variety of route shapes (mix and match with cases above, no need to run every test case on each route type)

## Slide 5 — Automation

Does it make sense to add a few UI automation cases?

## Slide 6 — Documentation

In the various event editing in Pro topics, add a note that mentions Conflict Prevention being supported.  Feel free to use the route editing topics as a guide for how to mention Conflict Prevention.

## Slide 7 — Assignment

Story Points:
Dev:
PE:
