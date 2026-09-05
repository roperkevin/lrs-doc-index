# Spike: Combined APR-UN Pro Ribbon

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [SpikeCombined APR-UN ribbon.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeCombined%20APR-UN%20ribbon.pptx>) |
| **Edited** | 2022-09-21 02:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Combined APR-UN Pro Ribbon"
source_file: "SpikeCombined APR-UN ribbon.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SpikeCombined%20APR-UN%20ribbon.pptx"
doc_id: 633
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2022-09-21T02:37:47Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["custom ribbon", "pipeline referencing", "utility network", "editing tools", "arcgis pro"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":606,"file":"combined-apr-un-ribbon-user-story__doc606.md","s":4.961},{"doc":596,"file":"create-combined-apr-un-pro-ribbon-add-in-test-plan__doc596.md","s":3.749},{"doc":492,"file":"spike-advanced-table-editing-options-in-pro__doc492.md","s":2.712},{"doc":656,"file":"set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md","s":2.506},{"doc":816,"file":"spike-subtype-group-layers-in-lrs__doc816.md","s":2.36}]
```
-->

## Summary

Investigation of options for creating a custom ArcGIS Pro ribbon that combines Pipeline Referencing, Utility Network, and Editing ribbon tools. The goal is to determine how to build, release, and maintain this ribbon without permanent integration into Pro. Potential release methods include Solutions templates in UPDM or user-importable custom ribbons.

## Related documents

<!-- related:begin -->
- [Combined APR-UN Ribbon User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/combined-apr-un-ribbon-user-story__doc606.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface/folder <!-- rel:606 -->
- [Create combined APR-UN Pro ribbon add-in – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/create-combined-apr-un-pro-ribbon-add-in-test-plan__doc596.md>) — similar text 0.14 · 4 title words · 1 filename word · same surface <!-- rel:596 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-advanced-table-editing-options-in-pro__doc492.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:492 -->
- [Set Time Filter Button LR Pro Ribbon: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/set-time-filter-button-lr-pro-ribbon-test-plan__doc656.md>) — similar text 0.07 · 2 title words · same surface <!-- rel:656 -->
- [Spike: Subtype Group Layers in LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-subtype-group-layers-in-lrs__doc816.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:816 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## Slide 1 — Spike: Combined APR-UN Pro ribbon

Spike

## Slide 2 — Combined APR-UN Pro ribbon

Investigate options for creating a custom Pro ribbon that incorporates Pipeline Referencing ribbon tools, Utility Network ribbon tools, and Editing ribbon tools
We don’t want to integrate this permanently into Pro like we do with product/capability ribbons, we want to determine how we can create a custom ribbon and release it through other means
Potential release options to investigate include:

  - Creating a ribbon that can be released via the Solutions templates in UPDM
  - Our team creating a customized ribbon that users can import into Pro when installed on a machine
  - Other options?
You may want to contact Jason Schroeder on the Solutions team as well as members of the Pro team to discuss potential options

Deliverable from this spike is to present to the team the best option for how to support this combined ribbon (how should we build it, release it, and maintain it)

## Slide 3 — Assignment

Story Points:
Dev:
