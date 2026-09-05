# Experience Builder Conflict Prevention User Story

| Field | Value |
| --- | --- |
| **Doc** | 433 · User Story · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld ConflictPrevention.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20ConflictPrevention.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2024-02-02 14:27 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | conflict prevention · event editing · event lock · route lock · experience builder · event editor · lock acquisition |
| **Tools** | Add Point Event · Add Line Event · Split Event · Merge Events · Table · Create Feature |

## Summary

This document describes the user story for enabling conflict prevention in Experience Builder event editing widgets to prevent conflicts when multiple users edit the same route or event. It details the required widgets for conflict prevention, lock acquisition logic, conflict scenarios, testing guidelines, and documentation updates. The focus is on ensuring event locks are properly managed during edits to avoid conflicts.

## Related documents

<!-- related:begin -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.48 · 2 title words · 2 filename words · same kind/folder <!-- rel:683 s=5.296 -->
- [Experience Builder Data Actions User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-data-actions.md>) — similar text 0.24 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:430 s=4.691 -->
- [Conflict Prevention Reassign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-reassign-route.md>) — similar text 0.44 · 2 title words · 2 filename words · same kind/folder <!-- rel:559 s=4.688 -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/folder <!-- rel:830 s=4.501 -->
- [Conflict Prevention: Acquire Locks when creating new routes in Create, Extend, Realign, and Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-when-creating-new-routes.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/folder <!-- rel:826 s=4.467 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/lrs-locks-table.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Conflict Prevention <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I need conflict prevention enabled when creating/editing events in Experience Builder, so no conflicts can be introduced if other users edit the same route or event.

Personas
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). These users want Conflict Prevention enabled when they make event edits in Experience Builder the same way we support conflict prevention when they make event edits in the Event Editor.

## Acceptance Criteria
### Conflict Prevention in Experience Builder <!-- slide 3 -->
- Add Conflict Prevention to the following LRS event editing widgets in Experience Builder
  - Add Point Event
  - Add Line Event
  - Split Event
  - Merge Events
- In addition, Conflict Prevention needs to be added to the following other widgets
  - Table
  - Create Feature
- In each of these tools, we should be checking for/acquiring Event Locks for any events that are being edited
- Follow a similar pattern for lock acquisition in the single event tools (the pattern, not the lock type) as we do for single events in Event Editor and ArcGIS Pro (check if a lock already exists, then try to acquire a lock if needed; if a conflicting lock already exists then have the tool/operation fail, if a lock already exists for that user/version/route/layer or no lock exists, then acquire and let the operation succeed)
- For the multiple event tools, we’ll need to attempt to acquire the lock once the attribute set and routeID(s) are selected
- If a route lock already exists for a route with events being added/edited, there is no need to create an event lock
- In the tools being maintained by our team (Add Point, Add Line, Split Event, Merge Events) check for the lock when the routeID is selected and then again when run clicked at the end of the workflow.  Provide an error message in the tool is there is a conflict (use the event editing  tools in Pro and Event Editor as a guide)

### Conflict Prevention Scenarios <!-- slide 4 -->
| Event on Route | Event Layer | User | Version | Existing Lock? | Result |
| --- | --- | --- | --- | --- | --- |
| Route1 | Event1 | User1 | User1.Version1 | No | Acquire event lock and allow edit to proceed |
| Route1 | Event1 | User1 | User1.Version1 | Yes, route lock on Route1 by User1 in version User1.Version1 | Route lock supersedes event lock so no action and allow edit to proceed |
| Route1 | Event1 | User1 | User1.Version1 | Yes, Event1 locked by User1 on User1.Version2 | Do not acquire lock, provide error message about event being locked in another version |
| Route1 | Event1 | User1 | User1.Version1 | Yes, Event1 locked by User2 on User2.Version1 | Do not acquire lock, provide error message about event being locked by another user |
| Route1 | Event1 | User1 | User1.Version1 | Yes, Event2 locked by User1 on User1.Version1 | Acquire event lock on Event1 and allow edit to procced |

## Testing
<!-- slide 5 -->
- Verify the tools work as they do today with no conflict prevention enabled
- Verify in Experience Builder using all 6 widgets (mix and match cases, no need to run every test case on all 4 tools, make sure each test case is completed on at least one widget)
- Verify the new messages in all the widgets
- Verify the existing confirmation and error messages in the widgets
- Test on lock transfers as well
- 508/i18n
- Test with various themes

## Automation
<!-- slide 6 -->
- No automation

## Documentation
<!-- slide 7 -->
- In each of the widget documentation topics, add a note mentioning Conflict Prevention being supported.  Use the event editing topics for Event Editor and ArcGIS Pro as a guide.

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
