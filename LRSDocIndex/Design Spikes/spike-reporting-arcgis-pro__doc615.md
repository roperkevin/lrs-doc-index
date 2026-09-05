# Spike: Reporting ArcGIS Pro

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike Reporting ArcGIS Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20ArcGIS%20Pro.pptx>) |
| **Edited** | 2023-02-09 18:39 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Reporting ArcGIS Pro"
source_file: "Spike Reporting ArcGIS Pro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20ArcGIS%20Pro.pptx"
doc_id: 615
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-02-09T18:39:30Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reporting", "arcgis pro", "segment report", "data import", "roadway reporter"]
tools: []
products: []
issues: []
related: [{"doc":516,"file":"spike-reporting-powerbi__doc516.md","s":6.895},{"doc":835,"file":"migrate-location-referencing-pro-icons-to-xaml__doc835.md","s":2.15},{"doc":766,"file":"split-centerlines-in-local-scenes-in-pro__doc766.md","s":1.761},{"doc":107,"file":"generate-lrs-data-product-and-linear-referenced-length-summary-enhancement__doc107.md","s":1.693},{"doc":824,"file":"spike-experience-builder__doc824.md","s":1.507}]
```
-->

## Summary

Investigation of ArcGIS Pro reporting capabilities to assess data import feasibility for report creation. Evaluation includes formatting considerations, compatibility with existing report types, and identification of missing configuration settings needed by users. Testing involves importing output from an existing python tool to create segment reports in Pro.

## Related documents

<!-- related:begin -->
- [Spike: Reporting PowerBI](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-reporting-powerbi__doc516.md>) — similar text 0.81 · 1 title word · 1 filename word · same kind/folder <!-- rel:516 -->
- [Migrate Location Referencing Pro Icons to XAML](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-location-referencing-pro-icons-to-xaml__doc835.md>) — similar text 0.03 · 1 title word · 1 filename word · same surface/folder <!-- rel:835 -->
- [Split Centerlines in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-centerlines-in-local-scenes-in-pro__doc766.md>) — similar text 0.06 · 1 title word · same surface/folder <!-- rel:766 -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length-summary-enhancement__doc107.md>) — similar text 0.06 · same surface/folder <!-- rel:107 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-experience-builder__doc824.md>) — similar text 0.17 · same kind/folder <!-- rel:824 -->
<!-- related:end -->

---

## Slide 1 — Spike: Reporting ArcGIS Pro

Spike

## Slide 2 — Reporting ArcGIS Pro

Investigate the Pro reporting capabilities to determine what type of data can be imported to create a report

  - Take note of any specific formatting or other considerations that might impact the data formatting for the tool(s) we’d like to build to support transformation of data
  - Consider the three existing report types we support and if they could be formatted/created in Pro
Determine if there are any missing report configuration settings that current Roadway Reporter (and other DoTs) users need (pdfs, specific data views in the mileage report, etc.)
Test if the output from our existing python tool used in Roadway Reporter to create a Segment Report could be imported into the Pro to create a similar Segment Report
Report back with the following:

  - Feasibility of importing LRS data into the Pro reporting application
  - Any limitations uncovered in the Pro reporting application
  - If possible, show being able to import LRS data into the Pro reporting application

## Slide 3 — Assignment

Story Points:
Dev:
