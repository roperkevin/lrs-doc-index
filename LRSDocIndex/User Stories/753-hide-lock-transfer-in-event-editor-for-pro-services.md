# Hide Lock Transfer in Event Editor for Pro Services

| Field | Value |
| --- | --- |
| **Doc** | 714 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#753](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753) |
| **Source** | [Hide Lock Transfer in EE for Pro Services.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Hide%20Lock%20Transfer%20in%20EE%20for%20Pro%20Services.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2021-05-04 22:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lock transfer · event editor · version management · conflict prevention · route editing · event editing |
| **Tools** | — |

## Summary

Describes the need for Location Referencing users to transfer locks between users in Event Editor for services with Version Management capability. Specifies hiding the lock transfer button for VMS enabled services and automatic lock transfer attempts with error handling. Includes testing and documentation update requirements.

## Related documents

<!-- related:begin -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:827 s=3.977 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:683 s=3.882 -->
- [Allow Locks to Transfer between Users in Location Referencing GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-lr-gp.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:828 s=3.732 -->
- [Reorganize Location Referencing Pro options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reorganize-lr-pro-options.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:371 s=3.355 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools.md>) — similar text 0.19 · 2 title words · 1 filename word · same surface <!-- rel:666 s=3.006 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Story
### Hide Lock Transfer in EE for Pro Services <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user, I need to be able to transfer locks from one user to another, so that we can run post editing geoprocessing tasks before posting the edits.

Persona
Location Referencing users are making edits in both/either Pro and Event Editor.  Depending on the organization, there may be the need to transfer existing locks between different users in the organization to complete route editing, event editing, and QC.

## Acceptance Criteria
### Lock Transfer in Event Editor <!-- slide 3 -->
- For services published with the Version Management capability, lock transferring is different from traditionally versioned services.
- When an Event Editor instance is launched with a VMS enabled service with Conflict Prevention enabled, we should do the following:
  - Hide the lock transfer button on the locks table
  - In any widget/table where locks are acquired to proceed, automatically try to transfer a lock when the route/event is already acquired by another user (make sure the lock transfer requirements from https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753 are still met, otherwise show an error message about not being able to transfer the lock)

## Testing
<!-- slide 4 -->
- Test in all widgets/tables in EE that are impacted
- Verify the locks button is not there for VMS enabled services/web maps in EE, but remains for ArcMap published services/web maps
- Verify the lock transfer scenarios from https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753

## Documentation
<!-- slide 5 -->
Update the document about lock transfer capabilities.  Make sure to identify differences between Pro and ArcMap published services.

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
