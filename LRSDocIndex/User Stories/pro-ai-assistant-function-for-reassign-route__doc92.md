# Pro AI Assistant function for Reassign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AI Assistant Second Pane Reassign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Second%20Pane%20Reassign%20Route.pptx>) |
| **Edited** | 2025-12-16 02:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Pro AI Assistant function for Reassign Route"
source_file: "AI Assistant Second Pane Reassign Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Second%20Pane%20Reassign%20Route.pptx"
doc_id: 92
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-12-16T02:00:21Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign route", "ai assistant", "route editing", "merged routes", "transfer route", "realign route", "route attributes"]
tools: []
products: []
issues: []
related: [{"doc":91,"file":"pro-ai-assistant-realign-route-user-story__doc91.md","s":7.835},{"doc":100,"file":"pro-ai-assistant-reassign-route-user-story__doc100.md","s":7.803},{"doc":102,"file":"pro-ai-assistant-realign-route__doc102.md","s":6.162},{"doc":93,"file":"pro-ai-assistant-extend-route-user-story__doc93.md","s":6.008},{"doc":95,"file":"pro-ai-assistant-retire-route-user-story__doc95.md","s":5.925}]
```
-->

## Summary

User story describing enhancements to the Pro AI Assistant Reassign Route skill to support complex route edits including merging routes, forming new routes, and transferring to another line. The skill guides the user through multiple UI panes to input and confirm route attributes and measures. Testing includes various reassignment types and accessibility considerations. Documentation and automation test updates are planned.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-user-story__doc91.md>) — similar text 0.74 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:91 -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reassign-route-user-story__doc100.md>) — similar text 0.53 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:100 -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route__doc102.md>) — similar text 0.46 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route-user-story__doc93.md>) — similar text 0.46 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route-user-story__doc95.md>) — similar text 0.49 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Merge to adjacent route method](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/merge-to-adjacent-route-method.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Slide 1 — Pro AI Assistant function for Reassign Route

User Story

## Slide 2 — User Story

As an LRS Editor, I need a way to use AI to support me reassigning a route for complex edits when creating merged routes, forming new routes, or transferring to another line, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to enhance the existing Reassign Route skill to support moving the user through not just the first UI pane in the tool, but the subsequent panes as well.

## Slide 3 — Pro AI Assistant Reassign Route skill

Enhance the existing Realign Route skill to support the subsequent steps in the realign process when merging to adjacent routes, forming a new route, or transferring to another line are selected as inputs in the first pane of the UI
Use the inputs to the initial skill as a guide to determine which additional steps need to be asked for in the skill
If a user chooses to merge to an adjacent route or form a new route, allow the user to provide the updates to the additional attributes for the merged route (the second pane). If this was included in the initial or subsequent prompt, have the assistant confirm the attributes.
If a user chooses to transfer to another line, allow the user to provide the route name, from measure, to measure, and additional attributes for the route. If this was included in the initial or subsequent prompt, have the assistant confirm these inputs.
Once these are populated, and the user confirms all the inputs, continue to transition to the first pane of the populated Realign Route UI, but when the user clicks next and walks through the subsequent steps, have those steps populated with the inputs provided by the assistant

## Slide 4 — Testing

Test with the three different types of reassignments on a mix of line and non line networks
Test with a variety of inputs to prompt the various subsequent steps in the UI
I18n/l10n
Accessibility

## Slide 5 — Automation

Update CUIT and NVVM tests for test cases

## Slide 6 — Documentation

Update the documentation for this skill
Make sure to outline that the skill will continue to take the user to the first pane of the UI but will also populate all the additional panes and the user should walk through the steps

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
