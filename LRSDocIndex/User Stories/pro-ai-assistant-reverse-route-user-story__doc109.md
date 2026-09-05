# Pro AI Assistant Reverse Route User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [AI Assistant Reverse Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Reverse%20Route.pptx>) |
| **Edited** | 2025-11-06 17:25 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Pro AI Assistant Reverse Route User Story"
source_file: "AI Assistant Reverse Route.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Reverse%20Route.pptx"
doc_id: 109
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2025-11-06T17:25:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reverse route", "ai assistant", "lrs editor", "route editing", "location referencing", "feature service"]
tools: ["Pro AI Assistant"]
products: []
issues: []
related: [{"doc":93,"file":"pro-ai-assistant-extend-route-user-story__doc93.md","s":8.443},{"doc":100,"file":"pro-ai-assistant-reassign-route-user-story__doc100.md","s":8.028},{"doc":95,"file":"pro-ai-assistant-retire-route-user-story__doc95.md","s":7.988},{"doc":102,"file":"pro-ai-assistant-realign-route__doc102.md","s":7.974},{"doc":94,"file":"support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md","s":6.125}]
```
-->

## Summary

User story for developing a Pro AI Assistant skill to support LRS Editors in reversing a route efficiently and correctly. The skill includes flexible prompts, licensing checks, network and route selection, effective date confirmation, and error handling within ArcGIS Pro maps and local scenes using feature services. It also covers documentation and testing plans for the skill.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route-user-story__doc93.md>) — similar text 0.69 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reassign-route-user-story__doc100.md>) — similar text 0.67 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route-user-story__doc95.md>) — similar text 0.72 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route__doc102.md>) — similar text 0.65 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 -->
- [Support Conflict Prevention in Route Editing skills in Pro AI Assistant](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-in-route-editing-skills-in-pro-ai-assistant__doc94.md>) — similar text 0.32 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:94 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Reverse routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reverse-routes.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [Pro AI Assistant](https://www.google.com/search?q=%22Pro%20AI%20Assistant%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Pro AI Assistant function for Reverse Route

User Story

## Slide 2 — User Story

As an LRS Editor, I need a way to use AI to support me reversing a route, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to create an AI Assistant that will help them complete reversal of a route.  The goal with this story is to create a release ready function in the Pro AI Assistant framework that will assist the user in identifying reverse as the function to use and walk them through any steps in the process to complete the edit.

## Slide 3 — Pro AI Assistant Reverse Route skill

Support a Pro AI Assistant skill to support reversing a route when prompted by the user

  - The prompt should be flexible (i.e. “I want to reverse a route”, “Change the calibration direction on a road”, or “Change the flow direction on my pipe”)
  - Include a prompt to verify the user wants to Reverse a route.
  - Review the prompt design with the team to ensure we have full coverage.
Make sure the skill checks for Location Referencing licensing.  If no licensing is enabled, have the assistant inform the user and link to licensing documentation.
If no LRS Network is in the map, have the assistant inform the user an LRS Network is needed in the map to complete the Reverse Route operation.
If the skill can’t be completed for any other reason, have the assistant inform the user with a message that clearly explains why it couldn’t be completed.
This should work in Pro maps and local scenes.
Make this work with feature services only for now.
Once the user confirms they want to reverse a route in the assistant:

  - Prompt the user to select the network.  If the user already included the network in the initial request or subsequent prompt, have the assistant confirm the network that will be used to reserve.  If there is only one network in the map, confirm the network being used.
  - Prompt the user to select the effective date.  If the user already included this in the initial request or subsequent prompt, have the assistant confirm the date that will be used.
  - Prompt the user to select the route.  This could be the RouteID or RouteName (if configured).  If this was included in the initial or subsequent prompt, have the assistant confirm the route.  If the user has selected the route on the map, support this via prompt as well.
  - For any of the prompts above, if the user asks questions, have the user provide context from the product documentation to assist them with deciding.  Document these types of prompts for future skills.
  - Confirm with the user the inputs to the tool (Network, Date, Route) and prompt them to confirm they want the reverse route completed.  When they confirm, execute the reverse route operation and have the assistant confirm with the user the Reverse Route was completed successfully.  If the operation can’t be completed, have the assistant let the user know and provide an error message that will allow them to understand why the operation failed.
Consult with Amit to get background knowledge around how to implement a new skill in the Pro AI Assistant framework.  Can also look at the Pro AI Assistant confluence page (https://confluencewikidev.esri.com/display/APAI/Overview) and wiki (https://devtopia.esri.com/ArcGISPro/AI-Assistants/wiki).
Document new knowledge/skills/requirements around using the Pro AI Assistant framework, so the other SEs on the team can consult for future skill development.

## Slide 4 — Testing

Need to test a variety of prompts as well as interactions in each step of the Reverse Route process to confirm the assistant handles the prompt correctly.
Make sure to prompt the assistant to provide help or context for steps in the process.
Would recommend utilizing Esri ChatGPT to generate a test plan for this user story to get a range of prompts to test with.
Document the test plan creation process with fellow PEs for future skill testing.

## Slide 5 — Automation

How do we automate?

## Slide 6 — Documentation

Document this skill in the same manner other Pro AI Assistant skills are being documented
Include a note in the Reverse Route topic that there is a Pro AI Assistant skill available to guide the user through completing the operation

## Slide 7 — Assignment

Story Points:
Dev:  days
PE:  days
