# Pro AI Assistant Realign Route User Story

| Field | Value |
| --- | --- |
| **Doc** | 91 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI Assistant Second Pane Realign Route.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/AI%20Assistant%20Second%20Pane%20Realign%20Route.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2025-12-16 01:44 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | realign route · ai assistant · equation points · abandonment · route editing · user story |
| **Tools** | — |

## Summary

User story for enhancing the Pro AI Assistant Realign Route skill to support subsequent UI panes for complex edits involving equation points and abandonment. The skill guides the user through additional input prompts and populates the Realign Route UI accordingly. Testing includes line networks with and without abandonment and equation points, with considerations for internationalization and accessibility.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-function-for-reassign-route.md>) — similar text 0.73 · 3 title words · 4 filename words · same kind/surface/folder <!-- rel:92 s=8.148 -->
- [Pro AI Assistant Realign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-2025-12-2.md>) — similar text 0.55 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:102 s=8.126 -->
- [ArcGIS Pro AI Assistant: Realign Route Subsequent Panes Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/pro-ai-assistant-realign-route-subsequent-panes.md>) — similar text 0.27 · 4 title words · 2 filename words · same surface <!-- rel:50 s=6.458 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route.md>) — similar text 0.47 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 s=6.261 -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-function-for-reassign-route__doc100.md>) — similar text 0.47 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 s=6.021 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html)
<!-- docs:end -->

---

## Story
### Pro AI Assistant subsequent panes for Realign Route <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an LRS Editor, I need a way to use AI to support me realigning a route for complex edits with equation points and abandonment, so that I can complete the edit quickly and correctly.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to enhance the existing Realign Route skill to support moving the user through not just the first UI pane in the tool, but the subsequent panes as well.

## Acceptance Criteria
### Pro AI Assistant Realign Route skill <!-- slide 3 -->
- Enhance the existing Realign Route skill to support the subsequent steps in the realign process when abandonment and equation points are present in the inputs to the first pane of the UI
- Use the inputs to the initial skill as a guide to determine which additional steps need to be asked for in the skill
- If the From Measure of the Source and Target Routes are different or the To Measures are different and recalibrate downstream isn’t selected (creating only one equation point), prompt the user to populate the New Realigned RouteID/Name and any additional attributes. If this was included in the initial or subsequent prompt, have the assistant confirm the route.
- If the From and To Measures of the Source and Target Routes are different and recalibrate downstream isn’t selected (creating two equation points), prompt the user to populate both the New Realigned RouteID/Name and any additional attributes along with the New Downstream Route/Name and any additional attributes. If this was included in the initial or subsequent prompt, have the assistant confirm the route.
- If Abandonment is selected, prompt the user for the Abandoned Route Name(s) based on how many routes will be abandoned
- Once these are populated, and the user confirms all the inputs, continue to transition to the first pane of the populated Realign Route UI, but when the user clicks next and walks through the subsequent steps, have those steps populated with the inputs provided by the assistant

## Testing
<!-- slide 4 -->
- Test with line networks with\without abandonment and with\without equation points
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
