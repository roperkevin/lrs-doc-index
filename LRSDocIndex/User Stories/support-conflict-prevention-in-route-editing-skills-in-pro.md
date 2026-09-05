# Support Conflict Prevention in Route Editing skills in Pro AI Assistant

| Field | Value |
| --- | --- |
| **Doc** | 94 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Conflict Prevention for Route Editing in Pro AI Assistant.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Conflict%20Prevention%20for%20Route%20Editing%20in%20Pro%20AI%20Assistant.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2025-12-16 01:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict prevention · route editing · locks · pro ai assistant · lrs editor · route id · route name |
| **Tools** | — |

## Summary

Describes the need to add conflict prevention support to the Pro AI Assistant for LRS Route Editing skills to prevent conflicting edits by checking route locks before editing. Includes testing scenarios, automation plans, and documentation updates related to conflict prevention in route editing workflows.

## Related documents

<!-- related:begin -->
- [Pro AI Assistant Extend Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-extend-route.md>) — similar text 0.36 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:93 s=6.481 -->
- [Pro AI Assistant function for Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-function-for-reassign-route__doc100.md>) — similar text 0.36 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:100 s=6.451 -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-user-story__doc102.md>) — similar text 0.33 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:102 s=6.194 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.31 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:683 s=6.187 -->
- [Pro AI Assistant Retire Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-retire-route.md>) — similar text 0.37 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:95 s=6.141 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Release locks with the Release Locks tool](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/release-locks.html)
<!-- docs:end -->

---

## Story
### Support Conflict Prevention in Route Editing skills in Pro AI Assistant <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS Editor, I need edits made via the Pro AI Assistant to be protected from conflicting edits, so that I can complete the edit in a version and be able to successfully post it.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. With this story, we want to add Conflict Prevention support to the AI Assistants for the LRS Route Editing skills.  This will ensure we let the user know if there are locking issues before we populate the route editing form, so they don’t lose work/effort due to locks.

## Acceptance Criteria
### Conflict Prevention in the Pro AIA Route Edits <!-- slide 3 -->
- When an LRS Route Edit skill is called through the Pro AI Assistant and the LRS Network being utilized has Conflict Prevention enabled, check for locks when the user provides the routeID/routename the same way we do in the Route Editing UIs in Pro
- This can be a single route in Extend, Retire, Realign, Reverse or multiple routes (source and target) in Reassign
- If a line network is used, check for the locks on the route(s) the same way we do in the Route Editing UI
- If a route(s) is not able to be locked due to conflicting locks, let the user know in the Pro AI Assistant and don’t allow the process to continue
- Provide the same information about locks that we would in the Route Editing tool UI
- Do not acquire locks as that will be done when we populate the routeID/routename into the Pro tool UI at the end of the process

## Testing
<!-- slide 4 -->
- Test with each of the Route Edit skills in the Pro AI Assistant
- Test a variety of conflict prevention scenarios from the initial test plans for the editing tools
- Verify locks are acquired when the route editing tool UI is populated
- Test a case where there are no locks when the Pro AI Assistant checks, but then there are locks acquired when the route editing tool UI is populated
- I18n/l10n
- Accessibility

## Automation
<!-- slide 5 -->
- Add to the CUIT and NVVM tests authored for these skills

## Documentation
<!-- slide 6 -->
- Add a note to the individual route edit skill topics about conflict prevention checks being made within the individual skills

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
PE:
