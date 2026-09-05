# Pro AI Assistant function for Reassign Route

| Field | Value |
| --- | --- |
| **Doc** | 92 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI Assistant Second Pane Reassign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Second%20Pane%20Reassign%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-16 02:00 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reassign route · ai assistant · route editing · merged routes · transfer route · realign route · route attributes |
| **Tools** | — |

## Summary

User story describing enhancements to the Pro AI Assistant Reassign Route skill to support complex route edits including merging routes, forming new routes, and transferring to another line. The skill guides the user through multiple UI panes to input and confirm route attributes and measures. Testing includes various reassignment types and accessibility considerations. Documentation and automation test updates are planned.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-2025-12.md>) — similar text 0.74 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:91 s=7.835 -->
- [Pro AI Assistant Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reassign-route.md>) — similar text 0.53 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:100 s=7.803 -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-realign-route-2025-12-2.md>) — similar text 0.46 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 s=6.162 -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route.md>) — similar text 0.46 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 s=6.008 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route.md>) — similar text 0.49 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 s=5.925 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Merge to adjacent route method](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/merge-to-adjacent-route-method.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Story
### Pro AI Assistant function for Reassign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a way to use AI to support me reassigning a route for complex edits when creating merged routes, forming new routes, or transferring to another line, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to enhance the existing Reassign Route skill to support moving the user through not just the first UI pane in the tool, but the subsequent panes as well.

## Acceptance Criteria
### Pro AI Assistant Reassign Route skill <!-- slide 3 -->
- Enhance the existing Realign Route skill to support the subsequent steps in the realign process when merging to adjacent routes, forming a new route, or transferring to another line are selected as inputs in the first pane of the UI
- Use the inputs to the initial skill as a guide to determine which additional steps need to be asked for in the skill
- If a user chooses to merge to an adjacent route or form a new route, allow the user to provide the updates to the additional attributes for the merged route (the second pane). If this was included in the initial or subsequent prompt, have the assistant confirm the attributes.
- If a user chooses to transfer to another line, allow the user to provide the route name, from measure, to measure, and additional attributes for the route. If this was included in the initial or subsequent prompt, have the assistant confirm these inputs.
- Once these are populated, and the user confirms all the inputs, continue to transition to the first pane of the populated Realign Route UI, but when the user clicks next and walks through the subsequent steps, have those steps populated with the inputs provided by the assistant

## Testing
<!-- slide 4 -->
- Test with the three different types of reassignments on a mix of line and non line networks
- Test with a variety of inputs to prompt the various subsequent steps in the UI
- I18n/l10n
- Accessibility

## Automation
<!-- slide 5 -->
- Update CUIT and NVVM tests for test cases

## Documentation
<!-- slide 6 -->
- Update the documentation for this skill
- Make sure to outline that the skill will continue to take the user to the first pane of the UI but will also populate all the additional panes and the user should walk through the steps

## Assignment
<!-- slide 7 -->
Story Points:
Dev:  days
PE:  days
