# Support Conflict Prevention in Sync Service

| Field | Value |
| --- | --- |
| **Doc** | 645 · User Story · Enterprise |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support Conflict Prevention in Sync Service.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20Conflict%20Prevention%20in%20Sync%20Service.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2022-08-11 00:05 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | sync service · conflict prevention · event locks · route locks · linear referencing · field data collection · version management |
| **Tools** | — |

## Summary

Describes user needs and workflow for syncing linear referencing system (LRS) data changes from field devices to the geodatabase with conflict prevention enabled. Details the sync service behavior when route or event locks exist, causing sync failure to prevent conflicts. Includes testing scenarios and documentation requirements.

## Related documents

<!-- related:begin -->
- [Integrate LRS into Sync Service to support disconnected event editing workflows](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/4039-integrate-lrs-into-sync-service-to-support-disconnected.md>) — similar text 0.70 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:646 s=7.068 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.15 · 2 title words · 2 filename words · same kind/folder <!-- rel:683 s=3.897 -->
- [Field Maps and Sync Service Issues and Workflow Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/field-maps-and-sync-service-issues-and-workflow-notes.md>) — similar text 0.15 · 2 title words · 2 filename words · same surface/folder <!-- rel:616 s=3.896 -->
- [Conflict Prevention: Acquire Locks in Create Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-acquire-locks-in-create-route.md>) — similar text 0.11 · 2 title words · 2 filename words · same kind/folder <!-- rel:830 s=3.766 -->
- [Spike: Sync Service Automation Pattern](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/sync-service-automation-pattern.md>) — similar text 0.21 · 2 title words · 2 filename words · same folder <!-- rel:642 s=3.582 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html) · [Multiple linear referencing methods](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/multiple-linear-referencing-methods.html)
<!-- docs:end -->

---

## Story
### Support Conflict Prevention in Sync Service <!-- slide 1 -->

### User Story <!-- slide 2 -->
- As a Field Worker, I want to be able to collect/update information in the field and be able to easily sync that information back to the geodatabase, so that I don’t have to spend significant amounts of time syncing data changes made on my device in the field.
- As a GIS Manager, I want to sync LRS data changes in the field to the system of record in a single operation, so that Field Workers can sync their changes without needing GIS staff involvement.

Persona
Field Worker – This user is collecting/updating data outside of the office in the field.  Typically, they’re using Field Maps, Survey 123, or another application.  These users have been tasked with collecting linear referenced information for the characteristics/assets they’re collecting in the field.  What they need is an easy way to sync this data back to the LRS gdb when the collection/updates are done in a disconnected manner.
GIS Manager – This user wants to ingest the linear referenced data that is collected by the Field Worker.  Today this is accomplished by a series of post processing scripts or tools.  Ideally, they’d like to easily have Field Workers sync this data back to the LRS gdb without post processing.

## Acceptance Criteria
### Conflict Prevention in the Sync Service <!-- slide 3 -->
- When the sync service is called on a map powered by a service that includes the linear referencing and version management (which means LRS logic is applied) and the LRS has conflict prevention enabled, do the following before beginning the LRS logic related to event behaviors:
  - Determine which events were added/updated since the last sync
  - Check for any route/event locks on the routes where those events were added/updated
  - If there are any route/event locks, have the entire sync operation fail and provide a human readable error message
  - If there are no locks that impact the added/update events, let the sync complete
- See the sync service user story to understand the implementation pattern and requirements to support this workflow

## Testing
<!-- slide 4 -->
- Verify the sync service operation still works as it does today if no Conflict Prevention is enabled
- Test with scenarios where there are event locks that prevent the sync
- Test with scenarios where there are route locks that prevent the sync
- Test a scenario where a route edit is made, and the changes are posted to default so there is no lock

## Automation
<!-- slide 5 -->
- How can we automated this process?

## Documentation
<!-- slide 6 -->
- Add to the topic created for the first sync service story that discussed how Conflict Prevention is considered if enabled in the LRS being synced
- Mention the scenarios that could cause the sync to fail

## Assignment
<!-- slide 7 -->
Story Points:
Dev:
