# Verify External Events fail in LRS GP tools

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Verify External Events fail in LRS GP tools.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Verify%20External%20Events%20fail%20in%20LRS%20GP%20tools.pptx>) |
| **Edited** | 2020-05-10 23:42 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Verify External Events fail in LRS GP tools"
source_file: "Verify External Events fail in LRS GP tools.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Verify%20External%20Events%20fail%20in%20LRS%20GP%20tools.pptx"
doc_id: 809
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-10T23:42:24Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["external event", "geoprocessing tools", "error handling", "event measures", "event behaviors", "location referencing"]
tools: ["Disable Derived Measure fields", "Disable Referent fields", "Enable Derived Measure fields", "Enabled Referent fields", "Modify LRS Events", "Append Events", "Apply Event Behaviors", "Delete Routes", "Derive Event Measures", "Generate Events", "Overlay Events", "Translate Event Measures", "Update Measures from LRS"]
products: []
issues: []
related: [{"doc":811,"file":"configure-external-events__doc811.md","s":4.106},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.899},{"doc":744,"file":"support-updating-external-event-configuration__doc744.md","s":3.492},{"doc":288,"file":"create-external-event-with-no-connection-file__doc288.md","s":3.471},{"doc":745,"file":"support-adding-external-event-to-pro-map-local-scene__doc745.md","s":3.287}]
```
-->

## Summary

User story describing the requirement that external event sources should not work with LRS geoprocessing tools, ensuring error messages and tool failure when external events are used as source or output. Lists specific tools affected and testing approaches including Pro UI, model builder, python, REST, and Client-Server.

## Related documents

<!-- related:begin -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events__doc811.md>) — similar text 0.20 · 2 title words · 2 filename words · same surface/folder <!-- rel:811 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.23 · same surface <!-- rel:115 -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration__doc744.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:744 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file__doc288.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:288 -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene__doc745.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:745 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-lrs-events.html) · [External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/external-event-registration.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-location-referencing-options.html)

_No page matched:_ [Disable Derived Measure fields](https://www.google.com/search?q=%22Disable%20Derived%20Measure%20fields%22+site%3Adoc.esri.com) · [Disable Referent fields](https://www.google.com/search?q=%22Disable%20Referent%20fields%22+site%3Adoc.esri.com) · [Enable Derived Measure fields](https://www.google.com/search?q=%22Enable%20Derived%20Measure%20fields%22+site%3Adoc.esri.com) · [Enabled Referent fields](https://www.google.com/search?q=%22Enabled%20Referent%20fields%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com) · [Update Measures from LRS](https://www.google.com/search?q=%22Update%20Measures%20from%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Verify External Events fail in LRS GP tools

User Story

## Slide 2 — User Story

As a Location Referencing user, I need external events sources to not work with LRS GP tools, so that I don’t try to update data that I don’t have create, update, or delete privileges.

## Slide 3 — External Events in LRS GP tools

External events shouldn’t work with LRS GP tools
If an external event is the source or output in the following tools, give an error message and have the tool fail on execution:

  - Disable Derived Measure fields
  - Disable Referent fields
  - Enable Derived Measure fields
  - Enabled Referent fields
  - Modify LRS Events
  - Append Events
  - Apply Event Behaviors (make sure External Events are skipped)
  - Delete Routes (if delete events option is checked, make sure External Events are skipped)
  - Derive Event Measures
  - Generate Events
  - Overlay Events
  - Translate Event Measures
  - Update Measures from LRS

## Slide 4 — Testing

Verify in Pro UI, model builder, python (inline and stand alone) for both REST and Client-Server

## Slide 5 — Assignment

Story Points:
Dev:
PE:
