# Relocate Events support for Reassign to a New Line

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [RelocateEventsReassigntoNewLine.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelocateEventsReassigntoNewLine.pptx>) |
| **Edited** | 2023-07-17 22:34 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Relocate Events support for Reassign to a New Line"
source_file: "RelocateEventsReassigntoNewLine.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/RelocateEventsReassigntoNewLine.pptx"
doc_id: 537
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-07-17T22:34:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign to new line", "relocate events", "external system data", "route reassignment", "event data", "apr dataset", "apr-un dataset"]
tools: ["Relocate Events", "Apply Event Behaviors"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":812,"file":"relocate-events-in-pro__doc812.md","s":4.141},{"doc":805,"file":"support-line-networks-and-json-in-export-network__doc805.md","s":3.457},{"doc":287,"file":"relocate-event-support-for-external-event-with-no-connection-file__doc287.md","s":3.344},{"doc":758,"file":"support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md","s":3.169},{"doc":744,"file":"support-updating-external-event-configuration__doc744.md","s":3.04}]
```
-->

## Summary

Describes the need for the Relocate Events tool to support reassignment of routes to a new line for external system data owners. It outlines the expected output format enhancements, testing approach using APR and APR-UN datasets, and automation updates via ReadyAPI. No documentation changes are required.

## Related documents

<!-- related:begin -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro__doc812.md>) — similar text 0.27 · 2 title words · 2 filename words · same surface/folder <!-- rel:812 -->
- [Support line networks and JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-line-networks-and-json-in-export-network__doc805.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:805 -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection-file__doc287.md>) — similar text 0.29 · 2 title words · 1 filename word · same surface/folder <!-- rel:287 -->
- [Support Event Behaviors on Vertical Route Shapes in Reassign Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-reassign-route__doc758.md>) — similar text 0.18 · 2 title words · same kind/surface/folder <!-- rel:758 -->
- [Support updating External Event configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-external-event-configuration__doc744.md>) — similar text 0.33 · 1 title word · same kind/surface/folder <!-- rel:744 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/reassign-routes.html) · [Events data model](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/events-data-model.html)

_No page matched:_ [Relocate Events](https://www.google.com/search?q=%22Relocate%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Relocate Events support for Reassign to a New Line

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to include reassignment to a new line as part of the updates to my event data stored outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Persona
LRS external system data owner: This user is the owner of the external system data, such as pavement, bridges, assets, etc.  With support for reassigning a route to a new line, we need to make sure these changes are shared to these external systems when they call the Relocate Events tool.

## Slide 3 — Relocate Events Reassign to a New Line

Enhance the output of Relocate Events to report the new Reassign Route scenarios supported when reassigning to a new line  (This appears to be already supported and might just be test only)
Follow the existing format of the tool to show the before and after for the edits including the RouteID, Route Name, Dates, and Measures (Line Name isn’t included in the output of the tool currently)
Results should continue to match those as if the event was an internal event that was processed by the Apply Event Behaviors tool

## Slide 4 — Testing

Test on a mix of APR and APR-UN dataset
Use the same event data that was used to test the Reassign to a New Line event behavior user stories as the same results should appear when it’s an external event with the same route edits

## Slide 5 — Automation

Add cases to the existing automation for the tool (via ReadyAPI)

## Slide 6 — Documentation

No updates needed to documentation

## Slide 7 — Assignment

Story Points:
Dev:
PE:
