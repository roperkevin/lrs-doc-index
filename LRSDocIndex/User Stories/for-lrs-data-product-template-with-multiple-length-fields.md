# User Story for LRS Data Product Template with Multiple Length Fields

| Field | Value |
| --- | --- |
| **Doc** | 342 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Report_Canvas6_Length_UniqueValues.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas6_Length_UniqueValues.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2024-08-01 20:21 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data product · length field · template · json · unique values · lrs data template · gis analyst |
| **Tools** | Generate LRS Data Product |

## Summary

This document describes a user story for GIS Analysts to create a reusable LRS data product template that supports adding multiple length fields using a single operation. It outlines the workflow for using the LRS Data Template wizard, including field selection and saving configuration in a JSON file with a limit on unique values. Testing considerations include theme compatibility and compliance, and the document also references documentation, automation, and estimation aspects.

## Related documents

<!-- related:begin -->
- [User Story for LRS Data Product Template with Length Range Values](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/for-lrs-data-product-template-with-length-range-values.md>) — similar text 0.60 · 2 title words · 4 filename words · same kind/surface/folder <!-- rel:343 s=8.219 -->
- [LR Data Products: Support multiple summary fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-data-products-support-multiple-summary-fields.md>) — similar text 0.48 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:356 s=6.356 -->
- [Generate LRS Data Product Support Summary and Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length-fields__doc357.md>) — similar text 0.30 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:357 s=4.969 -->
- [Support length fields using unique values in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5768-support-length-fields-using-unique-values-in-lrs-data.md>) — similar text 0.14 · 2 title words · 2 filename words · same surface <!-- rel:322 s=4.576 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool.md>) — similar text 0.31 · 1 filename word · same kind/surface/folder <!-- rel:374 s=4.521 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — LR Data Products: Support length fields using unique values

User Story
As a GIS Analyst, I need the ability to create a reusable LRS data product template that can be used by the Generate LRS Data Product geoprocessing tool. It’d be very helpful if I can add multiple length fields to the template using a single operation.
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

style.visibilitystyle.visibility

## Slide 2 — User Story: Details

Note: These symbols        are only for explaining the workflow. Do not create them in the UI.
Workflow

- Click on the add fields button

This is how the pane looks upon first run.

![Figure 1 — User Story: Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-01-slide-02-user-story-details.png)
![Figure 2 — User Story: Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-02-slide-02-user-story-details.png)

## Slide 3 — User Story: Workflow Details

![Figure 3 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-03-slide-03-user-story-workflow-details.png)
![Figure 4 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-04-slide-03-user-story-workflow-details.png)
![Figure 5 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-05-slide-03-user-story-workflow-details.png)
![Figure 6 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-06-slide-03-user-story-workflow-details.png)
![Figure 7 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-07-slide-03-user-story-workflow-details.png)
![Figure 8 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-08-slide-03-user-story-workflow-details.png)
![Figure 9 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-09-slide-03-user-story-workflow-details.png)
![Figure 1 — User Story: Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-01-slide-02-user-story-details.png)

## Slide 4 — User Story: Workflow Details

![Figure 10 — User Story: Workflow Details](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-10-slide-04-user-story-workflow-details.png)

## Slide 5 — User Story

- Save the info on each length field in the Json file upon clicking the Finish button.
- Do not allow more than 20 unique values in the list. In case more than 20 unique values exist, provide a message “This field exceeds the limit of 20 unique values. Only 20 unique values will be used.”

![Figure 11 — User Story](../media/for-lrs-data-product-template-with-multiple-length-fields/fig-11-slide-05-user-story.png)

## Slide 6

Testing

- Test with dark and light theme
- 508 and i18n compliance
- Test with different type of length layers such as line events and networks.

## Slide 7

Documentation

## Slide 8

Automation

## Slide 9

Estimate
