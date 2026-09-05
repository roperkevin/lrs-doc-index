# User Story for LRS Data Product Template with Length Range Values

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Report_Canvas7_Length_RangeValues.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas7_Length_RangeValues.pptx>) |
| **Edited** | 2024-07-31 22:40 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "User Story for LRS Data Product Template with Length Range Values"
source_file: "Report_Canvas7_Length_RangeValues.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas7_Length_RangeValues.pptx"
doc_id: 343
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2024-07-31T22:40:08Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["length fields", "range values", "data template", "lrs data product", "json", "workflow"]
tools: ["Generate LRS Data Product"]
products: []
issues: []
related: [{"doc":342,"file":"user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md","s":7.584},{"doc":356,"file":"lr-data-products-support-multiple-summary-fields__doc356.md","s":4.959},{"doc":357,"file":"generate-lrs-data-product-support-summary-and-length__doc357.md","s":4.404},{"doc":367,"file":"lr-reporting-canvas-experience-user-story__doc367.md","s":4.007},{"doc":374,"file":"lr-reporting-create-a-template-tool-user-story__doc374.md","s":3.737}]
```
-->

## Summary

This document describes a user story for GIS Analysts to create a reusable LRS data product template that supports adding multiple length fields using range values. It outlines the workflow for using the LRS Data Template wizard, including UI interactions and constraints such as a maximum of 20 range values per field. The document also mentions testing for theme and accessibility compliance, documentation, and automation considerations.

## Related documents

<!-- related:begin -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md>) — similar text 0.60 · 2 title words · 4 filename words · same kind/surface/folder <!-- rel:342 -->
- [LR Data Products: Support multiple summary fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-data-products-support-multiple-summary-fields__doc356.md>) — similar text 0.53 · 2 filename words · same kind/surface/folder <!-- rel:356 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length__doc357.md>) — similar text 0.32 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:357 -->
- [LR Reporting Canvas Experience User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lr-reporting-canvas-experience-user-story__doc367.md>) — similar text 0.40 · 2 filename words · same kind/surface/folder <!-- rel:367 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool-user-story__doc374.md>) — similar text 0.46 · 1 filename word · same kind/surface/folder <!-- rel:374 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html) · [LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html)

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

User Story
As a GIS Analyst, I need the ability to create a reusable LRS data product template that can be used by the Generate LRS Data Product geoprocessing tool. It’d be very helpful if I can add multiple length fields (using range values) to the template using a single operation.
Persona
GIS Analyst: These users know how to work with ArcGIS Pro. They will design a reusable data template based on an existing paper or digital report. Their duty will be to ensure that the Data Product’s constituents closely mirror those of its predecessors.
They may also create a new templates as needed by their agency.
Workflow

- The user opens the LRS Data Template wizard
- The LRS Data Template pane opens in the right
- The type of data product is selected
- The name, network and description are provided
- A  summary field is chosen
- Length fields are chosen

LR Data Products: Support length fields using range values
style.visibilitystyle.visibility

## Slide 2

User Story: Details
Note: These symbols        are only for explaining the workflow. Do not create them in the UI.
Workflow

- Click on the add fields button

This is how the pane looks upon first run.

![image1.png](../media/doc627_image1.png) ![image3.png](../media/doc627_image3.png)

## Slide 3

User Story

![image4.png](../media/doc627_image4.png)

## Slide 4

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 colour block, 9 row separators, 15 icons, 25 text rows. 23 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc627_slide4.svg)

User Story

![image5.png](../media/doc627_image5.png) ![image6.png](../media/doc627_image6.png)

## Slide 5

User Story: Workflow Details

![image7.png](../media/doc627_image7.png)

## Slide 6

User Story

- Save the info on each length field in the Json file upon clicking the Finish button.
- Do not allow more than 20 range values in the list. In case more than 20 unique values exist, provide a message “This field exceeds the limit of 20 range values. Only 20 range values will be used.”

![image8.png](../media/doc627_image8.png)

## Slide 7

Testing

- Test with dark and light theme
- 508 and i18n compliance
- Test with different type of length layers such as line events and networks.

## Slide 8

Documentation

## Slide 9

Automation

## Slide 10

Estimate
