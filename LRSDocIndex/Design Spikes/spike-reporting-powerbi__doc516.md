# Spike: Reporting PowerBI

|   |   |
| --- | --- |
| **Kind** | Design Spike · Other |
| **Release** | — |
| **Source** | [Spike Reporting PowerBI.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20PowerBI.pptx>) |
| **Edited** | 2023-05-18 17:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Reporting PowerBI"
source_file: "Spike Reporting PowerBI.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20PowerBI.pptx"
doc_id: 516
doc_kind: "Design Spike"
surface: "Other"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Nathan Easley"
last_edited_by: "Nathan Easley"
last_edited: "2023-05-18T17:02:11Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reporting", "powerbi", "segment report", "data import", "data formatting", "roadway reporter"]
tools: ["PowerBI"]
products: []
issues: []
related: [{"doc":615,"file":"spike-reporting-arcgis-pro__doc615.md","s":6.895},{"doc":107,"file":"generate-lrs-data-product-and-linear-referenced-length-summary-enhancement__doc107.md","s":2.167},{"doc":810,"file":"esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md","s":1.344},{"doc":788,"file":"location-referencing-for-transportation-across-the-arcgis-platform__doc788.md","s":0.761},{"doc":202,"file":"lrs-data-products__doc202.md","s":0.652}]
```
-->

## Summary

Investigation of PowerBI reporting capabilities for importing LRS data and creating reports. Evaluation of data formatting considerations, compatibility with existing report types, and potential limitations. Assessment of alignment between ArcGIS Pro and PowerBI reporting for data export tools.

## Related documents

<!-- related:begin -->
- [Spike: Reporting ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-reporting-arcgis-pro__doc615.md>) — similar text 0.81 · 1 title word · 1 filename word · same kind/folder <!-- rel:615 -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length-summary-enhancement__doc107.md>) — similar text 0.05 · same folder <!-- rel:107 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-and-agileassets-integration-technical-specification__doc810.md>) — similar text 0.07 · same folder <!-- rel:810 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-for-transportation-across-the-arcgis-platform__doc788.md>) — similar text 0.09 <!-- rel:788 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products__doc202.md>) — similar text 0.07 <!-- rel:202 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [PowerBI](https://www.google.com/search?q=%22PowerBI%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Reporting PowerBI

Spike

## Slide 2 — Reporting PowerBI

Investigate the PowerBI reporting capabilities to determine what type of data can be imported to create a report

  - Take note of any specific formatting or other considerations that might impact the data formatting for the tool(s) we’d like to build to support transformation of data
  - Consider the three existing report types we support and if they could be formatted/created in PowerBI
Determine if there are any missing report configuration settings that current Roadway Reporter (and other DoTs) users need (pdfs, specific data views in the mileage report, etc.)
Test if the output from our existing python tool used in Roadway Reporter to create a Segment Report could be imported into the PowerBI to create a similar Segment Report
Report back with the following:

  - Feasibility of importing LRS data into the PowerBI reporting application
  - Any limitations uncovered in the PowerBI reporting application
  - Potential alignment in data formatting between the Pro and PowerBI reporting applications for a potential tool to export data
  - If possible, show being able to import LRS data into the PowerBI reporting application

## Slide 3 — Assignment

Story Points:
Dev:
