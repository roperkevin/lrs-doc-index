# Pro AI Assistant Realign Route

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AI Assistant Realign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Realign%20Route.pptx>) |
| **Edited** | 2025-12-09 00:40 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Pro AI Assistant Realign Route"
source_file: "AI Assistant Realign Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Realign%20Route.pptx"
doc_id: 102
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-12-09T00:40:20Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["realign route", "ai assistant", "route editing", "centerlines", "network", "effective date", "route abandonment", "recalibrate downstream"]
tools: []
products: []
issues: []
related: [{"doc":100,"file":"pro-ai-assistant-reassign-route-user-story__doc100.md","s":9.657},{"doc":93,"file":"pro-ai-assistant-extend-route-user-story__doc93.md","s":9.035},{"doc":95,"file":"pro-ai-assistant-retire-route-user-story__doc95.md","s":8.938},{"doc":91,"file":"pro-ai-assistant-realign-route-user-story__doc91.md","s":8.126},{"doc":109,"file":"pro-ai-assistant-reverse-route-user-story__doc109.md","s":7.974}]
```
-->

## Summary

This document describes a user story for a Pro AI Assistant skill to support LRS Editors in realigning or abandoning routes efficiently and accurately. It outlines the prompts and interactions required for the assistant to guide users through selecting centerlines, networks, dates, routes, measures, and options like abandonment and recalibration. Testing, automation, and documentation plans for the skill are also included.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reassign-route-user-story__doc100.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route-user-story__doc93.md>) — similar text 0.87 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route-user-story__doc95.md>) — similar text 0.85 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-user-story__doc91.md>) — similar text 0.55 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:91 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reverse-route-user-story__doc109.md>) — similar text 0.65 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:109 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)
<!-- docs:end -->

---

## Slide 1 — Pro AI Assistant function for Realign Route

User Story

## Slide 2 — User Story

As an LRS Editor, I need a way to use AI to support me realigning/abandoning a route, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to create an AI Assistant that will help them complete creation of a route.  The goal with this story is to create a release ready function in the Pro AI Assistant framework that will assist the user in identifying realign as the function to use and walk them through any steps in the process to complete the edit.

## Slide 3 — Pro AI Assistant Realign Route skill

Support a Pro AI Assistant skill (both documentation and action) to support realigning/abandoning a route when prompted by the user

  - The prompt should be flexible (i.e. “I want to realign a route”, “Perform a reroute”, or “Realign a pipeline in my LRS Network”)
  - Include a prompt to verify the user wants to Realign a route
  - Review the prompt design with the team to ensure we have full coverage
Make sure the skill checks for Location Referencing licensing.  If no licensing is enabled, have the assistant inform the user and link to licensing documentation.
If no LRS Network/centerline is in the map, have the assistant inform the user an LRS Network and centerline is needed in the map to complete the Create Route operation.
If the skill can’t be completed for any other reason, have the assistant inform the user with a message that clearly explains why it couldn’t be completed.
This should work in Pro maps and local scenes.
Make this work with feature services only for now.

## Slide 4 — Pro AI Assistant Realign Route skill

Once the user confirms they want to realign a route in the assistant:

  - Prompt the user to select the centerline(s) to be used in the create operation.  The user can provide any identifying attribute of the centerline(s) (i.e. OID, CLID, etc.) to the assistant to make the selection.  If the user has selected the centerline(s) on the map, support this via prompt as well.  Once the centerline(s) are selected, the assistant will confirm with the user the selected centerlines and how they will be ordered from first to last.  Follow the approach used for this in the create route skill.
  - Prompt the user to select the network.  If the user already included the network in the initial request or subsequent prompt, have the assistant confirm the network that will be used to create.  If there is only one network in the map, confirm the network being used.
  - Prompt the user to select the effective date.  If the user already included this in the initial request or subsequent prompt, have the assistant confirm the date that will be used.
  - Prompt the user to share a routeID/routename (if configurated for the network selected) for the source route(s) being realigned.  Use the centerlines selected in the previous step to provide a suggested route if possible.  If this was included in the initial or subsequent prompt, have the assistant confirm the route.  If a line network is selected, do the same for the To routeID/routename.
  - Prompt the user to share the From and To Measures for the source route.  Give them the suggested From and To Measures based on the centerline(s) selected in the previous prompt if they touch the route(s). If this was included in the initial or subsequent prompt, have the assistant confirm the route.
  - Prompt the user for share the From and To Measures for the target route.  If the centerlines touch the existing route, give them suggested From Measure equal to the existing source route From Measure and To Measure based on the length of the selected centerline(s).
  - If using a line network, prompt the user whether they want to reassign to abandoned routes
  - Prompt the user if they want to recalibrate the route downstream.
  - Confirm with the user the inputs to the tool (Centerline, Network, Date, Route(s), Measure(s), Abandonment, Recalibrate Downstream) and transition to the populated Realign Route UI so the user can click run.
  - Out of Scope for Now: For any of the prompts above, if the user asks questions, have the user provide context from the product documentation to assist them with deciding.  Document these types of prompts for future skills.
  - Also outside of scope is any of the subsequent steps in the UI like confirming retired/abandoned routes, and creating new routes due to equation points as those happen after the user clicks run on the tool UI in Pro

## Slide 5 — Testing

Need to test a variety of prompts as well as interactions in each step of the Realign Route process to confirm the assistant handles the prompt correctly.
Test with a variety of network types and routeID/name compositions
Test with and without abandonment and recalibrate downstream options
Split testing between documentation prompts and action prompts (90% on actions)
I18n/l10n
Accessibility

## Slide 6 — Automation

Author CUIT and NVVM tests for test cases

## Slide 7 — Documentation

Document this skill in the same manner other Pro AI Assistant skills are being documented
Include a note in the Realign Route topic that there is a Pro AI Assistant skill available to guide the user through completing the operation
Add context giving the user an idea of what type of prompt terminology will result in the Realign Route skill being selected in the Pro AI Assistant

## Slide 8 — Assignment

Story Points:
Dev:  days
PE:  days
