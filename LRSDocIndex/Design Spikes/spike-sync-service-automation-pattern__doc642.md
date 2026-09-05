# Spike: Sync Service Automation Pattern

|   |   |
| --- | --- |
| **Kind** | Design Spike · Server |
| **Release** | — |
| **Source** | [Spike Sync Service Automation Pattern.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Sync%20Service%20Automation%20Pattern.pptx>) |
| **Edited** | 2022-08-16 23:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Sync Service Automation Pattern"
source_file: "Spike Sync Service Automation Pattern.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Sync%20Service%20Automation%20Pattern.pptx"
doc_id: 642
doc_kind: "Design Spike"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2022-08-16T23:56:52Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["sync service", "automation", "replica", "geodatabase backup", "versioning", "rest api"]
tools: ["ReadyAPI"]
products: []
issues: []
related: [{"doc":646,"file":"integrate-lrs-into-sync-service-to-support-disconnected-event-editing-workflows__doc646.md","s":3.642},{"doc":645,"file":"support-conflict-prevention-in-sync-service__doc645.md","s":3.582},{"doc":616,"file":"field-maps-and-sync-service-issues-and-workflow-notes__doc616.md","s":3.306},{"doc":810,"file":"esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md","s":1.837},{"doc":593,"file":"fix-existing-automations-for-reassign-rest-signature-update__doc593.md","s":1.692}]
```
-->

## Summary

This spike investigates methods to automate the sync service for LRS support, focusing on maintaining test data copies for repeated automation calls. It explores options such as restoring a geodatabase backup or using a version restored as a child version for syncing.

## Related documents

<!-- related:begin -->
- [Integrate LRS into Sync Service to support disconnected event editing workflows](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/integrate-lrs-into-sync-service-to-support-disconnected-event-editing-workflows__doc646.md>) — similar text 0.23 · 2 title words · 2 filename words · same folder <!-- rel:646 -->
- [Support Conflict Prevention in Sync Service](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-conflict-prevention-in-sync-service__doc645.md>) — similar text 0.21 · 2 title words · 2 filename words · same folder <!-- rel:645 -->
- [Field Maps and Sync Service Issues and Workflow Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/field-maps-and-sync-service-issues-and-workflow-notes__doc616.md>) — similar text 0.12 · 2 title words · 2 filename words · same folder <!-- rel:616 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md>) — similar text 0.07 · same surface/folder <!-- rel:810 -->
- [Fix Existing Automations for Reassign REST Signature Update](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/fix-existing-automations-for-reassign-rest-signature-update__doc593.md>) — similar text 0.03 · same surface/folder <!-- rel:593 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [ReadyAPI](https://www.google.com/search?q=%22ReadyAPI%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Sync Service Automation Pattern

Spike

## Slide 2 — Sync Service Automation Pattern

Investigate the best way to automate the sync service now that LRS support is going to be added
The sync service can be called via REST so ReadyAPI would be a potential option.
Because a replica is destroyed when a sync completes, determine other approaches so we have a copy of the test data to be synced each time the automation is called

  - GDB backup that is restored each time?
  - Another version that can be restored back as the child version to sync each time?\
  - Other approaches?
Deliverable for the spike is to provide a method to complete this automation successfully

## Slide 3 — Assignment

Story Points:
Dev:
