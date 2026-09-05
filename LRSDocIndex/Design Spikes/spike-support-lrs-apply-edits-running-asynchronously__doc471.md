# Spike: Support LRS Apply Edits Running Asynchronously

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike AsyncLRSApplyEdits.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20AsyncLRSApplyEdits.pptx>) |
| **Edited** | 2023-11-01 00:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Support LRS Apply Edits Running Asynchronously"
source_file: "Spike AsyncLRSApplyEdits.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20AsyncLRSApplyEdits.pptx"
doc_id: 471
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-11-01T00:21:45Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["apply edits", "rest operation", "asynchronous processing", "timeout issues", "feature service", "arcgis pro"]
tools: []
products: []
issues: []
related: [{"doc":492,"file":"spike-advanced-table-editing-options-in-pro__doc492.md","s":2.276},{"doc":812,"file":"relocate-events-in-pro__doc812.md","s":2.129},{"doc":519,"file":"spike-location-referencing-support-in-linux__doc519.md","s":1.864},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":1.794},{"doc":520,"file":"spike-64-bit-oid-in-lrs-rest__doc520.md","s":1.542}]
```
-->

## Summary

This spike investigates the feasibility and effort required to support the LRS Apply Edits REST operation running asynchronously. It explores necessary changes in REST and ArcGIS Pro, potential limitations, and whether this approach resolves timeout issues in Pro and geoprocessing tools. The feature service team's prior work on core Apply Edits is referenced for implementation patterns.

## Related documents

<!-- related:begin -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-advanced-table-editing-options-in-pro__doc492.md>) — similar text 0.20 · same kind/surface/folder <!-- rel:492 -->
- [Relocate Events in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/relocate-events-in-pro__doc812.md>) — similar text 0.09 · same kind/surface/folder <!-- rel:812 -->
- [Spike: Location Referencing support in Linux](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-location-referencing-support-in-linux__doc519.md>) — similar text 0.15 · 1 title word · same kind/folder <!-- rel:519 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.03 · same surface/folder <!-- rel:885 -->
- [Spike: 64-bit OID in LRS REST](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-64-bit-oid-in-lrs-rest__doc520.md>) — similar text 0.18 · same kind/folder <!-- rel:520 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

_No page matched:_ [apply edits](https://www.google.com/search?q=%22apply%20edits%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Support LRS apply edits running asynchronously

Spike

## Slide 2 — Async LRS Apply Edits

Investigate the feasibility and effort involved to support the LRS Apply Edits REST operation running asynchronously
What effort would be required to make this change?
Where do we need to make this change in REST? in Pro?
Are there any limitations we should be aware of?
Will this fix the timeout issues we’ve been encountering in Pro and GP tools that leverage this endpoint?
The feature service team has already done the work to support this in core Apply Edits; reach out to them to understand the patterns and effort involved with these potential changes
Deliverable is a short write up that discusses the answers to the questions above with all the areas we’d need to address to implement this

## Slide 3 — Assignment

Story Points:
Dev:
