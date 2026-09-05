# Hide Lock Transfer in Event Editor for Pro Services

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#753](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753) |
| **Source** | [Hide Lock Transfer in EE for Pro Services.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Hide%20Lock%20Transfer%20in%20EE%20for%20Pro%20Services.pptx>) |
| **Edited** | 2021-05-04 22:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Hide Lock Transfer in Event Editor for Pro Services"
source_file: "Hide Lock Transfer in EE for Pro Services.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Hide%20Lock%20Transfer%20in%20EE%20for%20Pro%20Services.pptx"
doc_id: 714
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2021-05-04T22:09:06Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lock transfer", "event editor", "version management", "conflict prevention", "route editing", "event editing"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#753"]
related: [{"doc":827,"file":"allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md","s":3.977},{"doc":683,"file":"conflict-prevention-for-event-editing-in-pro__doc683.md","s":3.882},{"doc":828,"file":"allow-locks-to-transfer-between-users-in-location-referencing-gp-tools__doc828.md","s":3.732},{"doc":371,"file":"reorganize-location-referencing-pro-options__doc371.md","s":3.355},{"doc":666,"file":"conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md","s":3.006}]
```
-->

## Summary

Describes the need for Location Referencing users to transfer locks between users in Event Editor for services with Version Management capability. Specifies hiding the lock transfer button for VMS enabled services and automatic lock transfer attempts with error handling. Includes testing and documentation update requirements.

## Related documents

<!-- related:begin -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing-tools__doc827.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:827 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro__doc683.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:683 -->
- [Allow Locks to Transfer between Users in Location Referencing GP tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-location-referencing-gp-tools__doc828.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:828 -->
- [Reorganize Location Referencing Pro options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/reorganize-location-referencing-pro-options__doc371.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:371 -->
- [Conflict Prevention for Event Editing in Pro – LR Event Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-lr-event-tools__doc666.md>) — similar text 0.19 · 2 title words · 1 filename word · same surface <!-- rel:666 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/conflict-prevention.html)
<!-- docs:end -->

---

## Slide 1 — Hide Lock Transfer in EE for Pro Services

User Story

## Slide 2 — User Story

As a Location Referencing user, I need to be able to transfer locks from one user to another, so that we can run post editing geoprocessing tasks before posting the edits.

Persona
Location Referencing users are making edits in both/either Pro and Event Editor.  Depending on the organization, there may be the need to transfer existing locks between different users in the organization to complete route editing, event editing, and QC.

## Slide 3 — Lock Transfer in Event Editor

For services published with the Version Management capability, lock transferring is different from traditionally versioned services.
When an Event Editor instance is launched with a VMS enabled service with Conflict Prevention enabled, we should do the following:

  - Hide the lock transfer button on the locks table
  - In any widget/table where locks are acquired to proceed, automatically try to transfer a lock when the route/event is already acquired by another user (make sure the lock transfer requirements from https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753 are still met, otherwise show an error message about not being able to transfer the lock)

## Slide 4 — Testing

Test in all widgets/tables in EE that are impacted
Verify the locks button is not there for VMS enabled services/web maps in EE, but remains for ArcMap published services/web maps
Verify the lock transfer scenarios from https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/753

## Slide 5 — Documentation

Update the document about lock transfer capabilities.  Make sure to identify differences between Pro and ArcMap published services.

## Slide 6 — Assignment

Story Points:
Dev:
PE:
