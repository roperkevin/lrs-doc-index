# Support updating External Event configuration

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [Support updating External Event configuration.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20External%20Event%20configuration.pptx>) |
| **Edited** | 2020-12-16 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support updating External Event configuration"
source_file: "Support updating External Event configuration.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20External%20Event%20configuration.pptx"
doc_id: 744
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-12-16T00:03:50Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["external event", "event configuration", "relocate events", "geoprocessing tool", "event behaviors", "oracle", "sql server"]
tools: ["Configure External Event"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":745,"file":"support-adding-external-event-to-pro-map-local-scene__doc745.md","s":6.905},{"doc":288,"file":"create-external-event-with-no-connection-file__doc288.md","s":4.725},{"doc":811,"file":"configure-external-events__doc811.md","s":4.178},{"doc":242,"file":"external-system-integration-with-arcgis-pipeline-referencing__doc242.md","s":3.991},{"doc":275,"file":"support-external-event-configuration-without-connection-file-test-plan__doc275.md","s":3.85}]
```
-->

## Summary

Describes the need for LRS external system data owners to configure and update event data stored outside the LRS geodatabase. Covers the ability to update existing External Event configurations using the Configure External Event geoprocessing tool, including handling events registered with ArcMap and branch versioning. Includes testing scenarios for positive and negative cases and documentation updates.

## Related documents

<!-- related:begin -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene__doc745.md>) — similar text 0.64 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:745 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file__doc288.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:288 -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events__doc811.md>) — similar text 0.37 · 1 title word · 1 filename word · same surface/folder <!-- rel:811 -->
- [External system integration with ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/external-system-integration-with-arcgis-pipeline-referencing__doc242.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface <!-- rel:242 -->
- [Support External Event Configuration Without Connection File – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-external-event-configuration-without-connection-file-test-plan__doc275.md>) — similar text 0.20 · 4 title words · 1 filename word · same surface <!-- rel:275 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)

_No page matched:_ [Configure External Event](https://www.google.com/search?q=%22Configure%20External%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support updating External Event configuration

User Story

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to configure my event data stored outside the LRS gdb with the LRS, so that the LRS can access my data when providing updates based on LRS edits.

Persona
LRS external system data owners are typically IT or other managers that work in different departments within a DOT (and pipeline operator) than the LRS editors/group.  These may be members of groups such as safety, road inventory, planning, bridge, or pavement that manage data that needs to be linear referenced but can’t be moved into the same geodatabase as the LRS.  Instead, they store/manage their event attribute data (either spatial or non spatial) in databases that are outside of the LRS geodatabase.  In order to keep their LRS attributes (route and measure) up to date with the authoritative LRS for the organization (Roads and Highways gdb), they need to be able to periodically request updates based on the LRS edits that have taken place.  This sync process is completed via the Relocate Events tool.

## Slide 3 — Configure External Event with LRS

Support being able to update the configuration for an existing External Event via the Configure External Event gp tool
When a user chooses the existing event feature class/table (in the external database) and the network in the tool, we should check to see if the event has already been created
If the event does not exist in the LRS, follow the same pattern from the original Configure External Event user story
If the event already exists in the LRS, then populate all the other parameters for the tool with the existing mapped fields/configuration
This should also include any events that were registered with ArcMap and brought over when the LRS gdb is changed to branch versioning and has the LRS controller dataset added

## Slide 4 — Testing

Negative

  - No read access to the existing event
  - Event is not registered with the LRS
  - Event is registered with a different network in the LRS
Positive

  - Existing event that has fields changed
  - Existing event that has event behaviors changed
Verify existing external events from ArcMap can have the configuration updated
Test with Oracle and SQL Server for the input event

## Slide 5 — Documentation

Update the existing Configure External Event gp tool to mention the tool can be used to update the configuration for an existing External Event

## Slide 6 — Assignment

Story Points:
Dev:
PE:
