# Spike: Using the Calculate Field Control with the LRS Data Product Designer

|   |   |
| --- | --- |
| **Kind** | Design Spike · Pro |
| **Release** | — |
| **Source** | [Spike_CalculateField.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike_CalculateField.pptx>) |
| **Edited** | 2025-02-05 21:14 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Spike: Using the Calculate Field Control with the LRS Data Product Designer"
source_file: "Spike_CalculateField.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike_CalculateField.pptx"
doc_id: 237
doc_kind: "Design Spike"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2025-02-05T21:14:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["calculate field", "data product designer", "proxy field", "length", "attribute table"]
tools: ["Calculate field control"]
products: []
issues: []
related: [{"doc":162,"file":"date-comparison-data-product-user-story-and-design__doc162.md","s":2.242},{"doc":357,"file":"generate-lrs-data-product-support-summary-and-length__doc357.md","s":2.213},{"doc":670,"file":"conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md","s":1.843},{"doc":736,"file":"support-updating-measures-option-in-cartographic-realignment__doc736.md","s":1.436},{"doc":282,"file":"generate-length-summary-geoprocessing-tool__doc282.md","s":1.432}]
```
-->

## Summary

Investigation of using the Calculate field control from the attribute table in ArcGIS Pro within the LRS Data Product Designer. Evaluation includes the possibility of adding a proxy field called 'Length' to the field list and proposing solutions to support user story development.

## Related documents

<!-- related:begin -->
- [Date Comparison Data Product User Story and Design](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/date-comparison-data-product-user-story-and-design__doc162.md>) — similar text 0.09 · 1 title word · same surface/folder <!-- rel:162 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length__doc357.md>) — similar text 0.10 · 1 title word · same surface/folder <!-- rel:357 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools__doc670.md>) — similar text 0.03 · same surface <!-- rel:670 -->
- [Support updating measures option in cartographic realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-updating-measures-option-in-cartographic-realignment__doc736.md>) — similar text 0.06 · same surface/folder <!-- rel:736 -->
- [Generate Length Summary Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/generate-length-summary-geoprocessing-tool__doc282.md>) — similar text 0.03 · same surface/folder <!-- rel:282 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Calculate field control](https://www.google.com/search?q=%22Calculate%20field%20control%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Spike: Using the calculate field control with the LRS Data Product Designer
With reference to the design provided here, investigate:

- Can we use the Calculate field control used by the attribute table in Pro.
- Can we add a proxy field called “Length” in the field list.
Report the findings and propose solutions (if needed) to help us write the user story.

![image1.png](../media/doc758_image1.png)

## Slide 2 — Estimate
