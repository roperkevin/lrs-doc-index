# Spike: Subtype Group Layers in LRS

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [Spike Subtype Layers in LRS.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Subtype%20Layers%20in%20LRS.pptx>) |
| **Edited** | 2020-04-28 23:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Subtype Group Layers in LRS"
source_file: "Spike Subtype Layers in LRS.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Subtype%20Layers%20in%20LRS.pptx"
doc_id: 816
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-04-28T23:29:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["subtype group layers", "lrs editing", "updm geodatabase", "pipeline line", "pipeline device", "pipeline junction", "rest endpoints", "event editor"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":814,"file":"spike-attribute-rules-in-lrs__doc814.md","s":3.075},{"doc":633,"file":"spike-combined-apr-un-pro-ribbon__doc633.md","s":2.36},{"doc":84,"file":"configure-utility-network-feature-class-location-referencing__doc84.md","s":1.555},{"doc":67,"file":"view-utility-network-feature-class-properties__doc67.md","s":1.394},{"doc":74,"file":"manage-pipeline-referencing-and-a-utility-network-together__doc74.md","s":1.337}]
```
-->

## Summary

Investigation of subtype group layers and their interaction with LRS editing operations and tools. Includes deployment within a UPDM geodatabase, publishing services with subtype group layers, and verification of LRS tools functionality across editing tools in ArcGIS Pro, geoprocessing tools, REST endpoints, and the Event Editor using web maps. Issues are to be logged for resolution.

## Related documents

<!-- related:begin -->
- [Spike: Attribute Rules in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-attribute-rules-in-lrs__doc814.md>) — similar text 0.43 · same kind/surface/folder <!-- rel:814 -->
- [Spike: Combined APR-UN Pro Ribbon](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-combined-apr-un-pro-ribbon__doc633.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:633 -->
- [Configure Utility Network Feature Class (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-utility-network-feature-class-location-referencing__doc84.md>) — similar text 0.10 · same surface <!-- rel:84 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-utility-network-feature-class-properties__doc67.md>) — similar text 0.12 · same surface <!-- rel:67 -->
- [Manage Pipeline Referencing and a Utility Network Together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-pipeline-referencing-and-a-utility-network-together__doc74.md>) — similar text 0.15 · same surface <!-- rel:74 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Subtype Group Layers in LRS

Spike

## Slide 2 — Subtype Group Layers in LRS

Investigate Subtype Group layers and how they work with LRS editing operations/tools

  - Utilize a combined APR/UN deployment within a UPDM geodatabase
  - Publish a service with subtype group layers (make sure to include Pipeline Line and Pipeline Device/Junction feature classes since they’re LRS centerline and LRS events)
  - Verify that LRS tools in the following areas work correctly on subtype group layers from the service:
    - Editing tools in Pro
    - GP tools where data is created/updated/deleted with a service layer as an input
    - REST endpoints where data is created/updated/deleted with a service layer as an input
    - Event Editor that utilizes a web map coming from a service with subtype group layers
Log any issues found in the correct repo (Pro, WebGIS) as bugs so they can be addressed

## Slide 3 — Assignment

Story Points:
Dev:
