# Pro AI Assistant Reassign Route User Story

| Field | Value |
| --- | --- |
| **Doc** | 100 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI Assistant Reassign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Reassign%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-09 00:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reassign route · ai assistant · route editing · network selection · effective date · route id · measures · calibration points · recalibration · merge routes · form new route · transfer to another line |
| **Tools** | Reassign Route |

## Summary

User story for creating a Pro AI Assistant skill to support LRS Editors in reassigning routes efficiently and correctly. The skill guides users through prompts to select network, dates, routes, measures, and reassignment methods, ensuring licensing checks and user confirmations. Testing, automation, and documentation plans are included to support the skill's development and release.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-2025-12-2.md>) — similar text 0.83 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 s=9.657 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route.md>) — similar text 0.90 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 s=8.968 -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route.md>) — similar text 0.81 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 s=8.884 -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-function-for-reassign-route.md>) — similar text 0.52 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:92 s=8.212 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.67 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:109 s=8.028 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Merge to adjacent route method](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/merge-to-adjacent-route-method.html)
<!-- docs:end -->

---

## Story
### Pro AI Assistant function for Reassign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a way to use AI to support me reassigning a route, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to create an AI Assistant that will help them complete creation of a route.  The goal with this story is to create a release ready function in the Pro AI Assistant framework that will assist the user in identifying reassign as the function to use and walk them through any steps in the process to complete the edit.

## Acceptance Criteria
### Pro AI Assistant Reassign Route skill <!-- slide 3 -->
- Support a Pro AI Assistant skill (both documentation and action) to support reassigning a route when prompted by the user
  - The prompt should be flexible (i.e. “I want to reassign a route”, “Split a road”, or “Merge pipelines in my LRS”)
  - Include a prompt to verify the user wants to Reassign a route
  - Review the prompt design with the team to ensure we have full coverage.  Ensure the terms reassign, merge, and split are covered.
- Make sure the skill checks for Location Referencing licensing.  If no licensing is enabled, have the assistant inform the user and link to licensing documentation.
- If the skill can’t be completed for any other reason, have the assistant inform the user with a message that clearly explains why it couldn’t be completed.
- This should work in Pro maps and local scenes.
- Make this work with feature services only for now.

### Pro AI Assistant Reassign Route skill <!-- slide 4 -->
- Once the user confirms they want to reassign a route in the assistant:
  - Prompt the user to select the network.  If the user already included the network in the initial request or subsequent prompt, have the assistant confirm the network that will be used to reassign.  If there is only one network in the map, confirm the network being used.
  - Prompt the user to select the effective date.  If the user already included this in the initial request or subsequent prompt, have the assistant confirm the date that will be used.
  - Prompt the user to share a routeID/routename (if configurated for the network selected) for the source route(s) being realigned. If this was included in the initial or subsequent prompt, have the assistant confirm the route.  If a line network is selected, do the same for the To routeID/routename.
  - Prompt the user to share the From and To Measures for the source route.  If this was included in the initial or subsequent prompt, have the assistant confirm the route.
  - Prompt the user if they want to transfer calibration points.
  - Prompt the user if they want to recalibrate the route downstream on the source route.
  - Prompt the user on which type of reassignment they want to complete.  Options include: Merge to Adjacent Route, Form a New Route, or Transfer to Another Line
  - Prompt the user to share the Line Name if Transfer to Another Line is selected.
  - Prompt the user to share the routeID/routename (if configured) for the target route is Form a New Route or Merge To Adjacent Route is selected.  If the routeID is multifield, prompt the user to provide the values for each field if Form a New Route is selected.  If one of the other options is selected, allow the user to provide the individual fields or the composite routeID.
  - Prompt the user to share the From and To Measures for the target route if Form a New Route or Merge To Adjacent Route is selected.  If this was included in the initial or subsequent prompt, have the assistant confirm the route.
  - Prompt the user if they want to recalibrate the route downstream on the target route if the method is Merge to Adjacent Route.
  - Confirm with the user the inputs to the tool (Network, Date, Route(s), Measure(s), Methods, Recalibrate Downstream, Transfer Calibration Points, Line Name) and transition to the populated Reassign Route UI so the user can click run.
  - Out of Scope for Now: For any of the prompts above, if the user asks questions, have the user provide context from the product documentation to assist them with deciding.  Document these types of prompts for future skills.
  - Also outside of scope is any of the subsequent steps in the UI like confirming retired routes as those happen after the user clicks run on the tool UI in Pro.

## Testing
<!-- slide 5 -->
- Need to test a variety of prompts as well as interactions in each step of the Reassign Route process to confirm the assistant handles the prompt correctly.
- Test with a variety of network types and routeID/name compositions
- Test the three methods to ensure the subsequent prompts are correct
- Split testing between documentation prompts and action prompts (90% on actions)
- I18n/l10n
- Accessibility

## Automation
<!-- slide 6 -->
- Author CUIT and NVVM tests for test cases

## Documentation
<!-- slide 7 -->
- Document this skill in the same manner other Pro AI Assistant skills are being documented
- Include a note in the Reassign Route topic that there is a Pro AI Assistant skill available to guide the user through completing the operation
- Add context giving the user an idea of what type of prompt terminology will result in the Reassign Route skill being selected in the Pro AI Assistant

## Assignment
<!-- slide 8 -->
Story Points:
Dev:  days
PE:  days
