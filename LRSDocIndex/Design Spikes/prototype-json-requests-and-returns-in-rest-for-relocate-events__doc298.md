# Prototype: JSON requests and returns in REST for Relocate Events

|   |   |
| --- | --- |
| **Kind** | Design Spike · Server |
| **Release** | — |
| **Source** | [PrototypeRelocateEventsviaJSON.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/PrototypeRelocateEventsviaJSON.pptx>) |
| **Edited** | 2024-10-23 21:53 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Prototype: JSON requests and returns in REST for Relocate Events"
source_file: "PrototypeRelocateEventsviaJSON.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/PrototypeRelocateEventsviaJSON.pptx"
doc_id: 298
doc_kind: "Design Spike"
surface: "Server"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2024-10-23T21:53:06Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["relocate events", "json", "rest", "prototype", "feature limits", "batching"]
tools: []
products: []
issues: []
related: [{"doc":287,"file":"relocate-event-support-for-external-event-with-no-connection-file__doc287.md","s":4.126},{"doc":812,"file":"relocate-events-in-pro__doc812.md","s":3.015},{"doc":537,"file":"relocate-events-support-for-reassign-to-a-new-line__doc537.md","s":2.545},{"doc":264,"file":"relocate-events-support-for-external-event-with-no-connection-file-test-plan__doc264.md","s":2.375},{"doc":639,"file":"test-plan-for-supporting-json-in-export-network__doc639.md","s":2.168}]
```
-->

## Summary

This document describes a prototype for the Relocate Events operation using JSON input and output in REST. It aims to test the limits on the number of features handled in requests and responses to evaluate the viability of this approach versus batching. The prototype results will be shared with the team for further decision making.

## Related documents

<!-- related:begin -->
- [Relocate Event Support for External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-event-support-for-external-event-with-no-connection-file__doc287.md>) — similar text 0.18 · 1 title word · 3 filename words · same kind/folder <!-- rel:287 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro__doc812.md>) — similar text 0.08 · 2 title words · 1 filename word · same kind/folder <!-- rel:812 -->
- [Relocate Events support for Reassign to a New Line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/relocate-events-support-for-reassign-to-a-new-line__doc537.md>) — similar text 0.09 · 2 title words · 1 filename word · same folder <!-- rel:537 -->
- [Relocate Events Support for External Event with No Connection File - Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/relocate-events-support-for-external-event-with-no-connection-file-test-plan__doc264.md>) — similar text 0.05 · 2 title words · 1 filename word <!-- rel:264 -->
- [Test Plan for Supporting JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-for-supporting-json-in-export-network__doc639.md>) — similar text 0.07 · 1 title word · 1 filename word · same surface <!-- rel:639 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [relocate event operation](https://www.google.com/search?q=%22relocate%20event%20operation%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Prototype: JSON requests and returns in REST

Spike

## Slide 2 — Prototype

Build a prototype of the Relocate Events operation that takes JSON as the input and returns JSON in the response (not a zipped JSON file like we do today)
Test the prototype to determine the upper limits on the number of features that could be included in a request and the number of features that could be returned in the response
The goal of this prototype is to determine whether this will be a viable pattern for the updated Relocate Events operation or if we need to look at a batching approach
Once this is complete, setup a meeting to showcase the prototype with the team and share the results of the limits to the number of records

## Slide 3 — Assignment

Story Points:
Dev:
