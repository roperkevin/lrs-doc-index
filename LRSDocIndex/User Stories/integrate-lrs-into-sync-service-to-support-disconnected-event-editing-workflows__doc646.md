# Integrate LRS into Sync Service to support disconnected event editing workflows

|   |   |
| --- | --- |
| **Kind** | User Story · Enterprise |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4039](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4039) |
| **Source** | [Integrate LRS with Sync Service.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Integrate%20LRS%20with%20Sync%20Service.pptx>) |
| **Edited** | 2022-08-10 23:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Integrate LRS into Sync Service to support disconnected event editing workflows"
source_file: "Integrate LRS with Sync Service.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Integrate%20LRS%20with%20Sync%20Service.pptx"
doc_id: 646
doc_kind: "User Story"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2022-08-10T23:42:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["disconnected event editing", "sync service", "field data collection", "lrs event", "route edits", "event behavior", "offline sync"]
tools: ["Sync Service", "Field Maps"]
products: []
issues: ["ArcGISPro/ps-location-referencing#4039"]
related: [{"doc":645,"file":"support-conflict-prevention-in-sync-service__doc645.md","s":7.068},{"doc":616,"file":"field-maps-and-sync-service-issues-and-workflow-notes__doc616.md","s":6.219},{"doc":642,"file":"spike-sync-service-automation-pattern__doc642.md","s":3.642},{"doc":738,"file":"support-lrs-partial-posting__doc738.md","s":2.579},{"doc":737,"file":"support-honoring-referents-event-behavior-for-cartographic-realignment__doc737.md","s":2.414}]
```
-->

## Summary

This document describes a user story for enabling field workers to collect and update linear referenced data offline and sync it back to the LRS geodatabase efficiently. It outlines the sync service logic to handle LRS event features and route edits, testing scenarios for offline data collection and syncing, and documentation needs for supporting disconnected LRS data workflows.

## Related documents

<!-- related:begin -->
- [Support Conflict Prevention in Sync Service](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-in-sync-service__doc645.md>) — similar text 0.70 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:645 -->
- [Field Maps and Sync Service Issues and Workflow Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/field-maps-and-sync-service-issues-and-workflow-notes__doc616.md>) — similar text 0.21 · 2 title words · 2 filename words · same surface/folder <!-- rel:616 -->
- [Spike: Sync Service Automation Pattern](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-sync-service-automation-pattern__doc642.md>) — similar text 0.23 · 2 title words · 2 filename words · same folder <!-- rel:642 -->
- [Support LRS Partial Posting](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-lrs-partial-posting__doc738.md>) — similar text 0.11 · 1 title word · same kind/surface/folder <!-- rel:738 -->
- [Support honoring referents event behavior for cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-honoring-referents-event-behavior-for-cartographic-realignment__doc737.md>) — similar text 0.15 · 2 title words · same kind/folder <!-- rel:737 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-event-properties.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html)

_No page matched:_ [Sync Service](https://www.google.com/search?q=%22Sync%20Service%22+site%3Adoc.esri.com) · [Field Maps](https://www.google.com/search?q=%22Field%20Maps%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Integrate LRS into Sync Service to support disconnected event editing workflows

## Slide 2 — User Story

As a Field Worker, I want to be able to collect/update information in the field and be able to easily sync that information back to the geodatabase, so that I don’t have to spend significant amounts of time syncing data changes made on my device in the field.
As a GIS Manager, I want to sync LRS data changes in the field to the system of record in a single operation, so that Field Workers can sync their changes without needing GIS staff involvement.

Persona
Field Worker – This user is collecting/updating data outside of the office in the field.  Typically, they’re using Field Maps, Survey 123, or another application.  These users have been tasked with collecting linear referenced information for the characteristics/assets they’re collecting in the field.  What they need is an easy way to sync this data back to the LRS gdb when the collection/updates are done in a disconnected manner.
GIS Manager – This user wants to ingest the linear referenced data that is collected by the Field Worker.  Today this is accomplished by a series of post processing scripts or tools.  Ideally, they’d like to easily have Field Workers sync this data back to the LRS gdb without post processing.

## Slide 3 — Sync Service

When the sync service is called on a map powered by a service that includes the linear referencing and version management capabilities, intercept the sync and apply the following LRS logic:

  - Access the LRS information to determine what layers are part of the LRS
  - Determine which LRS Event features were newly created or updated in the version
  - For each of the new/updated events, determine if the route(s) they’re associated with have had LRS route edits applied since the date the event was collected
  - For any events that are impacted by route changes, apply the appropriate event behavior to each event (stay put, move, retire, snap, cover)
Basic requirements to support this workflow are found in the results to the spike on offline data collection (https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4039)  Note that support for Auto Reconcile was added at 3.0.  We should enable this, but if Field Maps doesn’t support the option, reconcile will need to be a part of the process to ensure the sync works as expected
Use the spike results to determine the best pattern for this intercept process (need to consider both short time offline collection like a day or two as well as longer time offline collection of a month or two)
Support being able to apply this when the sync is against the default or child version

## Slide 4 — Testing

Test as part of an end-to-end workflow (Developer to provide the requirements/steps to support the workflow)

  - Create Replica of LRS gdb for use in Field Maps
  - Take offline into Field Maps and create new events/update existing events (verify the LRS event fields are populated)
  - While events are collected offline, make LRS route edits to routes where events in step 2 were added/updated that would invoke event behaviors
  - Using Field Maps, sync the offline data back to the LRS gdb and ensure events are up to date (have behaviors played forward)
Test syncing to both default and child versions, also test the various scenarios of reconcile/post before the sync to understand which will work/don’t work
Test with a variety of event types (point, line, spanning) with all the event behaviors
Test cases where the newly added events don’t have the required fields populated (Route ID, Measure(s), Dates(s))
Test without Conflict Prevention (it will be covered in a second story)

## Slide 5 — Automation

How can we automated this process?

## Slide 6 — Documentation

Create a new topic (can we put it in both Enterprise and Pro?) that outlines support for syncing LRS data that is collected in a disconnected manner via Field Maps
Provide context for what the capability does and how it will keep events created in an offline manner current when synced with the LRS
Be detailed and clear about the requirements to take advantage of this capability
Provide a workflow that explains each step in detail (provide this in an example use case that is pertinent to the user); ensure specific requirements are outlined in each step
We’ll need a Roads and Pipeline version of the topic with screenshots and text specific to their events, etc.

## Slide 7 — Assignment

Story Points:
Dev:
