# Spike: Profile Generate LRS Data Products GP tool

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike Profile Generate LRS Data Products GP tool.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Profile%20Generate%20LRS%20Data%20Products%20GP%20tool.pptx>) |
| **Edited** | 2025-11-06 16:11 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Profile Generate LRS Data Products GP tool"
source_file: "Spike Profile Generate LRS Data Products GP tool.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Profile%20Generate%20LRS%20Data%20Products%20GP%20tool.pptx"
doc_id: 108
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2025-11-06T16:11:08Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["generate lrs data product", "geoprocessing tool", "performance profiling", "bottlenecks", "data product", "routes", "events", "boundary layers"]
tools: ["Generate LRS Data Product"]
products: []
issues: []
related: [{"doc":110,"file":"spike-profile-overlay-events-gp-tool__doc110.md","s":7.346},{"doc":353,"file":"user-story-support-multiple-summary-fields-in-generate-lrs-data-product__doc353.md","s":3.183},{"doc":357,"file":"generate-lrs-data-product-support-summary-and-length__doc357.md","s":3.17},{"doc":260,"file":"generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md","s":2.876},{"doc":227,"file":"spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md","s":2.814}]
```
-->

## Summary

This spike document profiles the Generate LRS Data Product geoprocessing tool to analyze execution time distribution and identify performance bottlenecks using INDOT data. It aims to document findings and rank potential performance improvements for the tool.

## Related documents

<!-- related:begin -->
- [Spike: Profile Overlay Events GP tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-profile-overlay-events-gp-tool__doc110.md>) — similar text 0.92 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:110 -->
- [User Story: Support Multiple Summary Fields in Generate LRS Data Product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/user-story-support-multiple-summary-fields-in-generate-lrs-data-product__doc353.md>) — similar text 0.09 · 1 title word · 1 filename word · same surface/folder <!-- rel:353 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length__doc357.md>) — similar text 0.08 · 1 title word · 1 filename word · same surface/folder <!-- rel:357 -->
- [Generate a Route Log using the GLRSDP GP Tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-a-route-log-using-the-glrsdp-gp-tool-test-plan__doc260.md>) — similar text 0.02 · 2 title words · 1 filename word · same surface <!-- rel:260 -->
- [Spike: Performance improvement to Overlay Events/Query Attribute Set](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-performance-improvement-to-overlay-events-query-attribute-set__doc227.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:227 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html)

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Profile Generate LRS Data Products GP tool

Spike

## Slide 2 — Generate LRS Data Product

As a GIS Analyst, I want data product creation using my linear referenced data to be performant for any size dataset, so that I can run the operation against my entire dataset which has many routes, events, and boundary layers.
Profile the Generate LRS Data Product geoprocessing tool to identify how much of the tool execution time is devoted to various parts of the process
Do this profiling using INDOT data
Utilize that profile to analyze where there are bottlenecks that could be removed and opportunities to improve performance

Deliverables
Document findings from the profiling
Provide a list of all changes that could provide performance improvements
Rank this list from most impactful to least impactful on performance of the tool

## Slide 3 — Assignment

Story Points:
