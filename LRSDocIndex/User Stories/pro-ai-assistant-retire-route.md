# Pro AI Assistant Retire Route User Story

| Field | Value |
| --- | --- |
| **Doc** | 95 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI Assistant Retire Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Retire%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-12 22:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | retire route · ai assistant · route editing · pro · user story · linear referencing |
| **Tools** | — |

## Summary

User story for a Pro AI Assistant skill to support retiring a route in the Linear Referencing System. The skill guides the user through selecting network, retire date, route identification, measures, and recalibration options, with licensing checks and user confirmations. It is designed to work with feature services in Pro maps and local scenes.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reassign-route.md>) — similar text 0.90 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 s=8.121 -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-2025-12-2.md>) — similar text 0.85 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 s=7.986 -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route.md>) — similar text 0.89 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 s=7.94 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.72 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:109 s=7.415 -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-2025-12.md>) — similar text 0.48 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:91 s=6.096 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)
<!-- docs:end -->

---

## Story
### Pro AI Assistant function for Reassign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a way to use AI to support me retiring a route, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to create an AI Assistant that will help them complete creation of a route.  The goal with this story is to create a release ready function in the Pro AI Assistant framework that will assist the user in identifying retire as the function to use and walk them through any steps in the process to complete the edit.

## Acceptance Criteria
### Pro AI Assistant Retire Route skill <!-- slide 3 -->
- Support a Pro AI Assistant skill (only an action for now) to support retire a route when prompted by the user
  - The prompt should be flexible (i.e., “I want to retire a route”, “Retire the beginning of a road”, or “Retire a pipeline segment”)
  - Include a prompt to verify the user wants to retire a route
  - Review the prompt design with the team to ensure we have full coverage.
- Make sure the skill checks for Location Referencing licensing.  If no licensing is enabled, have the assistant inform the user and link to licensing documentation.
- If the skill can’t be completed for any other reason, have the assistant inform the user with a message that clearly explains why it couldn’t be completed.
- This should work in Pro maps and local scenes.
- Make this work with feature services only for now.

### Pro AI Assistant Retire Route skill <!-- slide 4 -->
- Once the user confirms they want to reassign a route in the assistant:
  - Prompt the user to select the network.  If the user already included the network in the initial request or subsequent prompt, have the assistant confirm the network that will be used to reassign.  If there is only one network in the map, confirm the network being used.
  - Prompt the user to select the retire date.  If the user already included this in the initial request or subsequent prompt, have the assistant confirm the date that will be used.
  - Prompt the user to share a routeID/routename (if configurated for the network selected) for the route(s) being retired. If this was included in the initial or subsequent prompt, have the assistant confirm the route.  If a line network is selected, do the same for the To routeID/routename.
  - Prompt the user to share the From and To Measures for the retired route.  If this was included in the initial or subsequent prompt, have the assistant confirm the route. Also support the user using terminology like entire route or all.
  - Prompt the user if they want to recalibrate the route downstream on the source route.
  - Confirm with the user the inputs to the tool (Network, Date, Route(s), Measures, Recalibrate Downstream) and transition to the populated Retire Route UI so the user can click run.
  - Out of Scope for Now: For any of the prompts above, if the user asks questions, have the user provide context from the product documentation to assist them with deciding.  Document these types of prompts for future skills.

## Testing
<!-- slide 5 -->
- Need to test a variety of prompts as well as interactions in each step of the Retire Route process to confirm the assistant handles the prompt correctly.
- Test with a variety of network types and routeID/name compositions
- I18n/l10n
- Accessibility

## Automation
<!-- slide 6 -->
- Author CUIT and NVVM tests for test cases

## Documentation
<!-- slide 7 -->
- Document this skill in the same manner other Pro AI Assistant skills are being documented
- Include a note in the Retire Route topic that there is a Pro AI Assistant skill available to guide the user through completing the operation
- Add context giving the user an idea of what type of prompt terminology will result in the Retire Route skill being selected in the Pro AI Assistant

## Assignment
<!-- slide 8 -->
Story Points:
Dev:  days
PE:  days
