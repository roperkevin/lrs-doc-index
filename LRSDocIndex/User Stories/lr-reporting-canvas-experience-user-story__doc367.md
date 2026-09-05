# LR Reporting Canvas Experience User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#5797](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5797) |
| **Source** | [Report_Canvas1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas1.pptx>) |
| **Edited** | 2024-05-22 15:20 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LR Reporting Canvas Experience User Story"
source_file: "Report_Canvas1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas1.pptx"
doc_id: 367
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2024-05-22T15:20:31Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["report template", "canvas", "create template wizard", "gis analyst", "mileage summary"]
tools: ["Generate Report"]
products: []
issues: ["ArcGISPro/ps-location-referencing#5797"]
related: [{"doc":356,"file":"lr-data-products-support-multiple-summary-fields__doc356.md","s":4.632},{"doc":374,"file":"lr-reporting-create-a-template-tool-user-story__doc374.md","s":4.56},{"doc":343,"file":"user-story-for-lrs-data-product-template-with-length-range-values__doc343.md","s":4.026},{"doc":342,"file":"user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md","s":3.969},{"doc":357,"file":"generate-lrs-data-product-support-summary-and-length__doc357.md","s":2.798}]
```
-->

## Summary

This document describes a user story for developing a reusable canvas experience in ArcGIS Pro to create report templates for the Generate Report geoprocessing tool. It details the workflow for GIS Analysts to open a blank canvas via the Create Template wizard, update canvas contents based on wizard inputs, and the canvas behavior including its connection to the active map and non-persistence to the project. Testing considerations include theme support and accessibility compliance.

## Related documents

<!-- related:begin -->
- [LR Data Products: Support multiple summary fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-data-products-support-multiple-summary-fields__doc356.md>) — similar text 0.46 · 2 filename words · same kind/surface/folder <!-- rel:356 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool-user-story__doc374.md>) — similar text 0.32 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:374 -->
- [User Story for LRS Data Product Template with Length Range Values](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/user-story-for-lrs-data-product-template-with-length-range-values__doc343.md>) — similar text 0.41 · 2 filename words · same kind/surface/folder <!-- rel:343 -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/user-story-for-lrs-data-product-template-with-multiple-length-fields__doc342.md>) — similar text 0.39 · 2 filename words · same kind/surface/folder <!-- rel:342 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-support-summary-and-length__doc357.md>) — similar text 0.27 · same kind/surface/folder <!-- rel:357 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate Report](https://www.google.com/search?q=%22Generate%20Report%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

LR Reporting: Develop a canvas experience
We have a design for a canvas to demonstrate how the report fields shape up when the template is built.

![image1.png](../media/doc600_image1.png)

## Slide 2

LR Reporting: Develop a canvas experience
User Story
As a GIS Analyst, I need the ability to create a reusable report template that can be used by the Generate Report geoprocessing tool. It’d be very helpful if I can view how the mileage and summary fields are shaping up when creating the report template.
Persona
GIS Analyst: These users know how to work with ArcGIS Pro. They will design a reusable report template based on an existing paper or digital report. Their duty will be to ensure that the report's constituents closely mirror those of its predecessors.
They may also create a new templates as needed by their agency.
Workflow

- The user opens the Create Template wizard
- A blank canvas opens in the main pane of ArcGIS Pro
style.visibilitystyle.visibility

## Case 1 <!-- slide 3 -->

### Open a Blank Canvas When the Create Template Wizard Is

User Story: Details
Reference: Spike: https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5797
**Open a blank canvas when the Create Template wizard is invoked. This is the initial state of the canvas.**

![image2.png](../media/doc600_image2.png)

## Case 2 <!-- slide 4 -->

### Update the Contents of the Canvas as per the Inputs Provided

User Story: Details
**Update the contents of the canvas as per the inputs provided in the wizard. Update applied when the focus is lost from a parameter.**
Limit to page 2 of the wizard for this user story.

![image3.png](../media/doc600_image3.png)

## Slide 5

- The canvas should be reusable.
- The canvas is connected to the active map and the wizard, if any one of them closes, so does the pane.
- The canvas is not saved to the project. If the user wants to open it later, they can open the Report. Template Json to open the canvas.
- The canvas does not persist to the CIM.
- Both canvas and dock pane Wizard can be displayed with a single button (Create Template).
- Reuse the LR Dock Pane for the wizard and the canvas.
- The contents of the canvas are non editable.

User Story: Details

## Slide 6

Testing

- Test with dark and light theme
- 508 and i18n compliance

## Slide 7

Documentation

## Slide 8

Automation
