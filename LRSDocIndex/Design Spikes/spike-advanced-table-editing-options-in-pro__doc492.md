# Spike: Advanced Table Editing options in Pro

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike AdvancedTableEditingPro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20AdvancedTableEditingPro.pptx>) |
| **Edited** | 2023-09-25 20:26 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Advanced Table Editing options in Pro"
source_file: "Spike AdvancedTableEditingPro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20AdvancedTableEditingPro.pptx"
doc_id: 492
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-09-25T20:26:35Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["attribute table", "event editor", "arcgis pro", "location referencing ribbon", "table editing"]
tools: []
products: []
issues: []
related: [{"doc":369,"file":"advanced-table-editing-options-in-arcgis-pro__doc369.md","s":5.958},{"doc":336,"file":"advanced-editing-options-test-plan__doc336.md","s":4.804},{"doc":683,"file":"conflict-prevention-for-event-editing-in-pro__doc683.md","s":3.673},{"doc":727,"file":"spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md","s":3.224},{"doc":670,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md","s":2.785}]
```
-->

## Summary

This spike investigates the feasibility of intercepting edits within the attribute table in ArcGIS Pro, similar to the prompt functionality in Event Editor. It explores whether this can be supported via Pro project options or options on the Location Referencing ribbon. The deliverable is a write-up answering these questions for the team.

## Related documents

<!-- related:begin -->
- [Advanced Table Editing Options in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/advanced-table-editing-options-in-arcgis-pro__doc369.md>) — similar text 0.20 · 5 title words · 4 filename words · same surface/folder <!-- rel:369 -->
- [Advanced Editing Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/advanced-editing-options-test-plan__doc336.md>) — similar text 0.08 · 3 title words · 3 filename words · same surface <!-- rel:336 -->
- [Conflict Prevention for Event Editing in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/conflict-prevention-for-event-editing-in-pro__doc683.md>) — similar text 0.12 · 2 title words · 2 filename words · same surface/folder <!-- rel:683 -->
- [Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:727 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md>) — similar text 0.05 · 2 title words · 2 filename words · same surface <!-- rel:670 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Release locks through the LRS Locks table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/lrs-locks-table.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Advanced Table Editing options in Pro

Spike

## Slide 2 — Advanced Table Editing options

Investigate the feasibility of being able to intercept edits within the attribute table in Pro
In Event Editor, we were able to make a prompt after each event edit in the attribute table via a popup

Can we do something similar in ArcGIS Pro when an event record is edited?
If not, can we support this via either:

  - Pro project options
  - Options on the Location Referencing ribbon
Deliverable is a write up answering these questions to be shared with the team

![image1.png](../media/doc455_image1.png)

## Slide 3 — Assignment

Story Points:
Dev:
