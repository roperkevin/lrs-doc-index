# Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike Pro Server ControllerDataset collaboration CartographicRealignment.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Pro%20Server%20ControllerDataset%20collaboration%20CartographicRealignment.pptx>) |
| **Edited** | 2021-03-12 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment"
source_file: "Spike Pro Server ControllerDataset collaboration CartographicRealignment.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Pro%20Server%20ControllerDataset%20collaboration%20CartographicRealignment.pptx"
doc_id: 727
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2021-03-12T00:03:36Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["cartographic realignment", "calibration points", "controller dataset", "apply edits", "location referencing ribbon", "arcgis pro", "server"]
tools: []
products: []
issues: []
related: [{"doc":492,"file":"spike-advanced-table-editing-options-in-pro__doc492.md","s":3.224},{"doc":729,"file":"support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md","s":2.834},{"doc":611,"file":"support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md","s":2.723},{"doc":736,"file":"support-updating-measures-option-in-cartographic-realignment__doc736.md","s":2.633},{"doc":762,"file":"support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md","s":2.58}]
```
-->

## Summary

Explores approaches to handle user-selected methods for Calibration Points impacted by Cartographic Realignment. Focuses on persisting user options in ArcGIS Pro and integrating these selections with Server and Controller Dataset during applyEdits transactions.

## Related documents

<!-- related:begin -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-advanced-table-editing-options-in-pro__doc492.md>) — similar text 0.11 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:492 -->
- [Support Snap, Delete, and Ignore Options for Calibration Points in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-delete-and-ignore-options-for-calibration-points-in-cartographic__doc729.md>) — similar text 0.25 · 2 title words · same surface/folder <!-- rel:729 -->
- [Support Snap to Vertex Option for Calibration Points Impacted by Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-snap-to-vertex-option-for-calibration-points-impacted-by-cartographic__doc611.md>) — similar text 0.21 · 2 title words · same surface/folder <!-- rel:611 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment__doc736.md>) — similar text 0.18 · 2 title words · same surface/folder <!-- rel:736 -->
- [Support Event Behaviors on Vertical Route Shapes in Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-event-behaviors-on-vertical-route-shapes-in-cartographic-realignment__doc762.md>) — similar text 0.19 · 2 title words · same surface/folder <!-- rel:762 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply cartographic realignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-cartographic-realignment.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment

Spike

## Slide 2 — Pro, Server, and Controller Dataset in CartoRealign

In order to implement allowing users to choose how Calibration Points that are impacted by a Cartographic Realignment are handled by the software, two questions/approaches need to be answered.

- Determine how we can persist the selected method from the Location Referencing ribbon, so they don’t have to reset it each time they open Pro.  Can we store the option selected by the user in the Pro project? As a machine setting? Somewhere else?
- Determine how we can connect the selected option on the Location Referencing ribbon in Pro with Server/Controller Dataset.  Cartographic Realignments come server side as a core applyEdits call.  How do we make sure that when that transaction is executed that we apply the user selected option for calibration points?

## Slide 3 — Assignment

Story Points:
Dev:
