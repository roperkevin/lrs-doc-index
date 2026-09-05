# Pro AI Assistant Extend Route User Story

| Field | Value |
| --- | --- |
| **Doc** | 93 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI Assistant Extend Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Extend%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-12 23:12 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | extend route · ai assistant · pro · lrs editor · centerline · network · effective date · route id |
| **Tools** | Retire Route |

## Summary

This document describes a user story for a Pro AI Assistant skill to support LRS Editors in extending routes efficiently and correctly. It outlines the interaction flow, prompts, and conditions for the assistant to guide users through the extend route operation in ArcGIS Pro. Testing, automation, and documentation plans for the skill are also included.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-2025-12-2.md>) — similar text 0.87 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 s=8.416 -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reassign-route.md>) — similar text 0.82 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 s=8.261 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.69 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:109 s=8.021 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route.md>) — similar text 0.89 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 s=7.94 -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-function-for-reassign-route.md>) — similar text 0.46 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:92 s=6.008 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/retire-routes.html) · [Extend a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/extend-a-route.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)
<!-- docs:end -->

---

## Story
### Pro AI Assistant function for Extend Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a way to use AI to support me extending a route, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to create an AI Assistant that will help them complete creation of a route.  The goal with this story is to create a release ready function in the Pro AI Assistant framework that will assist the user in identifying extend as the function to use and walk them through any steps in the process to complete the edit.

## Acceptance Criteria
### Pro AI Assistant Extend Route skill <!-- slide 3 -->
- Support a Pro AI Assistant skill (only actions for now) to support extending a route when prompted by the user
  - The prompt should be flexible (i.e., “I want to extend a route”, “Extend my roadway”, or “Extend a pipeline in my LRS”)
  - Include a prompt to verify the user wants to extend a route
  - Review the prompt design with the team to ensure we have full coverage
- Make sure the skill checks for Location Referencing licensing.  If no licensing is enabled, have the assistant inform the user and link to licensing documentation.
- If no LRS Network/centerline is in the map, have the assistant inform the user an LRS Network and centerline is needed in the map to complete the Create Route operation.
- If the skill can’t be completed for any other reason, have the assistant inform the user with a message that clearly explains why it couldn’t be completed.
- This should work in Pro maps and local scenes.
- Make this work with feature services only for now.

### Pro AI Assistant Extend Route skill <!-- slide 4 -->
- Once the user confirms they want to realign a route in the assistant:
  - Prompt the user to select the centerline(s) to be used in the extend operation.  The user can provide any identifying attribute of the centerline(s) (i.e. OID, CLID, etc.) to the assistant to make the selection.  If the user has selected the centerline(s) on the map, support this via prompt as well.  Once the centerline(s) are selected, the assistant will confirm with the user the selected centerlines and how they will be ordered from first to last.  Follow the approach used for this in the create route skill.
  - Prompt the user to select the network.  If the user already included the network in the initial request or subsequent prompt, have the assistant confirm the network that will be used to create.  If there is only one network in the map, confirm the network being used.
  - Prompt the user to select the effective date.  If the user already included this in the initial request or subsequent prompt, have the assistant confirm the date that will be used.
  - Prompt the user to share a routeID/routename (if configurated for the network selected) for the route being extended.  Use the centerlines selected in the previous step to provide a suggested route if possible.  If this was included in the initial or subsequent prompt, have the assistant confirm the centerlines.
  - Prompt the user to share whether the extension is from the beginning or the end of the route if the centerline(s) selected don’t touch the route.  If this was included in the initial or subsequent prompt, have the assistant confirm.
  - Confirm with the user the inputs to the tool (Centerline, Network, Date, Route, Measures) and transition to the populated Retire Route UI so the user can click run.
  - Out of Scope for Now: For any of the prompts above, if the user asks questions, have the user provide context from the product documentation to assist them with deciding.  Document these types of prompts for future skills.

## Testing
<!-- slide 5 -->
- Need to test a variety of prompts as well as interactions in each step of the Extend Route process to confirm the assistant handles the prompt correctly.
- Test with a variety of network types and routeID/name compositions
- Test with extends at the beginning and end of the route
- Text with centerlines that don’t touch the route
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
