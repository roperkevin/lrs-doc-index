# Support Conflict Prevention in Route Editing skills in Pro AI Assistant

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Support Conflict Prevention for Route Editing in Pro AI Assistant.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Conflict%20Prevention%20for%20Route%20Editing%20in%20Pro%20AI%20Assistant.pptx>) |
| **Edited** | 2025-12-16 01:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Conflict Prevention in Route Editing skills in Pro AI Assistant"
source_file: "Support Conflict Prevention for Route Editing in Pro AI Assistant.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Conflict%20Prevention%20for%20Route%20Editing%20in%20Pro%20AI%20Assistant.pptx"
doc_id: 94
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-12-16T01:09:04Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["conflict prevention", "route editing", "locks", "pro ai assistant", "lrs editor", "route id", "route name"]
tools: []
products: []
issues: []
related: [{"doc":93,"file":"pro-ai-assistant-extend-route-user-story__doc93.md","s":6.481},{"doc":100,"file":"pro-ai-assistant-function-for-reassign-route__doc100.md","s":6.451},{"doc":102,"file":"pro-ai-assistant-realign-route-user-story__doc102.md","s":6.194},{"doc":683,"file":"conflict-prevention-for-event-editing-in-pro__doc683.md","s":6.187},{"doc":95,"file":"pro-ai-assistant-retire-route-user-story__doc95.md","s":6.141}]
```
-->

## Summary

Describes the need to add conflict prevention support to the Pro AI Assistant for LRS Route Editing skills to prevent conflicting edits by checking route locks before editing. Includes testing scenarios, automation plans, and documentation updates related to conflict prevention in route editing workflows.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route-user-story__doc93.md>) — similar text 0.36 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-function-for-reassign-route__doc100.md>) — similar text 0.36 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-user-story__doc102.md>) — similar text 0.33 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro__doc683.md>) — similar text 0.31 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:683 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route-user-story__doc95.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)
<!-- docs:end -->

---

## Slide 1 — Support Conflict Prevention in Route Editing skills in Pro AI Assistant

## Slide 2 — User Story

As an LRS Editor, I need edits made via the Pro AI Assistant to be protected from conflicting edits, so that I can complete the edit in a version and be able to successfully post it.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to add Conflict Prevention support to the AI Assistants for the LRS Route Editing skills.  This will ensure we let the user know if there are locking issues before we populate the route editing form, so they don’t lose work/effort due to locks.

## Slide 3 — Conflict Prevention in the Pro AIA Route Edits

When an LRS Route Edit skill is called through the Pro AI Assistant and the LRS Network being utilized has Conflict Prevention enabled, check for locks when the user provides the routeID/routename the same way we do in the Route Editing UIs in Pro
This can be a single route in Extend, Retire, Realign, Reverse or multiple routes (source and target) in Reassign
If a line network is used, check for the locks on the route(s) the same way we do in the Route Editing UI
If a route(s) is not able to be locked due to conflicting locks, let the user know in the Pro AI Assistant and don’t allow the process to continue
Provide the same information about locks that we would in the Route Editing tool UI
Do not acquire locks as that will be done when we populate the routeID/routename into the Pro tool UI at the end of the process

## Slide 4 — Testing

Test with each of the Route Edit skills in the Pro AI Assistant
Test a variety of conflict prevention scenarios from the initial test plans for the editing tools
Verify locks are acquired when the route editing tool UI is populated
Test a case where there are no locks when the Pro AI Assistant checks, but then there are locks acquired when the route editing tool UI is populated
I18n/l10n
Accessibility

## Slide 5 — Automation

Add to the CUIT and NVVM tests authored for these skills

## Slide 6 — Documentation

Add a note to the individual route edit skill topics about conflict prevention checks being made within the individual skills

## Slide 7 — Assignment

Story Points:
Dev:
PE:
