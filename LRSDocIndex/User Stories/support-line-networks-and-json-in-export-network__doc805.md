# Support line networks and JSON in Export Network

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [Support line networks and JSON in Export Network.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20line%20networks%20and%20JSON%20in%20Export%20Network.pptx>) |
| **Edited** | 2020-05-12 22:32 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support line networks and JSON in Export Network"
source_file: "Support line networks and JSON in Export Network.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20line%20networks%20and%20JSON%20in%20Export%20Network.pptx"
doc_id: 805
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2020-05-12T22:32:34Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line network", "export network", "json output", "concurrency", "translations", "pipeline referencing"]
tools: ["Export Network"]
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":639,"file":"test-plan-for-supporting-json-in-export-network__doc639.md","s":5.52},{"doc":806,"file":"export-network-in-pro__doc806.md","s":4.702},{"doc":537,"file":"relocate-events-support-for-reassign-to-a-new-line__doc537.md","s":3.454},{"doc":338,"file":"generate-lrs-data-product-create-mileage-report-for-line-networks__doc338.md","s":3.013},{"doc":745,"file":"support-adding-external-event-to-pro-map-local-scene__doc745.md","s":2.922}]
```
-->

## Summary

This document describes the user story and requirements for adding support for line networks and JSON output format in the Export Network asynchronous tool. It includes details on handling line IDs, line order, gaps, concurrencies, and translations, as well as testing and automation plans. The goal is to enable exporting LRS network data to external business systems and support scripting through REST and Python.

## Related documents

<!-- related:begin -->
- [Test Plan for Supporting JSON in Export Network](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-for-supporting-json-in-export-network__doc639.md>) — similar text 0.27 · 3 title words · 3 filename words <!-- rel:639 -->
- [Export Network in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/export-network-in-pro__doc806.md>) — similar text 0.38 · 2 title words · 2 filename words · same surface/folder <!-- rel:806 -->
- [Relocate Events support for Reassign to a New Line](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/relocate-events-support-for-reassign-to-a-new-line__doc537.md>) — similar text 0.22 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:537 -->
- [Generate LRS Data Product: Create Mileage Report for Line Networks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/generate-lrs-data-product-create-mileage-report-for-line-networks__doc338.md>) — similar text 0.02 · 2 title words · 1 filename word · same surface <!-- rel:338 -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene__doc745.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:745 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html)

_No page matched:_ [Export Network](https://www.google.com/search?q=%22Export%20Network%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support line networks in Export Network

Spike

## Slide 2 — User Story

As a LRS external system data owner, I need the ability to export my LRS Network and associated information like concurrencies and translations to external business systems outside the LRS gdb, so that I can keep my external system data up to date with the authoritative LRS.

Cases
External System integration

## Slide 3 — Line Networks in Export Network

Add support to the Export Network async tool for Line Networks

  - In the Routes feature class, add the Line ID and Line Order fields
  - In the Gaps table, only consider gaps within a route at this time (gaps between routes on a line can be addressed in the future if asked for)
  - In the Concurrency table, only consider concurrencies on a route by route basis (not for a line)
  - In the Translations table, add a Line ID column to the output
  - In the Translations table, only consider translations from route to route (ignore any merging between routes on the same line, we can address in the future if asked for)

## Slide 4 — JSON as an output format

Add support for JSON as an output format for the tool
Do we want to return a raw JSON response or zip it up like we do for FGDB?

## Slide 5 — Testing

Verify non line networks still work (a single run of the tool would be sufficient)
Test on line networks
Test using Pipeline Referencing data
Test through REST and whatever scriptable language is supported (python, javascript, etc.)
Users should also be able to execute through python for cases where calling the tool is scripted or written into a partner/external application

## Slide 6 — Automation

Automate the tool (FS only).
Automate in python.  Use that python script as a sample we can provide our end user/business partners.

## Slide 7 — Documentation

Add to the existing REST and GP documentation

## Slide 8 — Assignment

Story Points:
Dev:
PE:
