# LR Data Products: Support multiple summary fields

| Field | Value |
| --- | --- |
| **Doc** | 356 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Report_Canvas5_SummaryFields_Multiple_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Report_Canvas5_SummaryFields_Multiple_V1.pptx>) · rev V1 |
| **People** | author Rahul Rakshit · PE GIS Analyst · dev — |
| **Edited** | 2024-07-02 22:05 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data product · summary field · template · lrs data template · gis analyst |
| **Tools** | Generate LRS Data Product |

## Summary

This user story describes the need for GIS Analysts to create reusable LRS data product templates that support multiple summary fields. It outlines the workflow for adding and deleting summary levels in the template configuration pane and includes testing considerations for theme and compliance.

## Related documents

<!-- related:begin -->
- [User Story: Support Multiple Summary Fields in Generate LRS Data Product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-multiple-summary-fields-in-generate-lrs-data-product.md>) — similar text 0.39 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:353 s=6.394 -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/for-lrs-data-product-template-with-multiple-length-fields.md>) — similar text 0.48 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:342 s=6.021 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length.md>) — similar text 0.32 · 2 title words · 1 filename word · same kind/surface/pe/folder <!-- rel:357 s=5.646 -->
- [User Story for LRS Data Product Template with Length Range Values](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/for-lrs-data-product-template-with-length-range-values.md>) — similar text 0.53 · 2 filename words · same kind/surface/folder <!-- rel:343 s=4.959 -->
- [Support multiple summary fields in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5770-support-multiple-summary-fields-in-lrs-data-template-wizard.md>) — similar text 0.23 · 4 title words · 3 filename words · same surface <!-- rel:323 s=4.771 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — LR Data Products: Support multiple summary fields

User Story
As a GIS Analyst, I need the ability to create a reusable LRS data product template that can be used by the Generate LRS Data Product geoprocessing tool. It’d be very helpful if I can add more than one level of summary to the template.
Persona
GIS Analyst: These users know how to work with ArcGIS Pro. They will design a reusable data template based on an existing paper or digital report. Their duty will be to ensure that the Data Product’s constituents closely mirror those of its predecessors.
They may also create a new templates as needed by their agency.
Workflow

- The user opens the LRS Data Template wizard
- The LRS Data Template pane opens in the right
- The type of data product is selected
- The name, network and description are provided
- A  summary field is chosen
- Another summary field is chosen
- A length field is chosen

style.visibilitystyle.visibility

## Slide 2 — User Story: Details

- Add the text “Add another summary level” at the bottom of the Configure summary fields table
- Clicking on this text adds a new summary level (n+1) where n was the previous level
- Place the cursor to the summary name cell
- Clear the contents of the rest of the parameters of the pane
- No restriction on the number of summary fields

Note: These symbols        are only for explaining the workflow.
Do not create them in the UI.

![Figure 1 — User Story: Details](../media/lr-data-products-support-multiple-summary-fields/fig-01-slide-02-user-story-details.png)
![Figure 2 — User Story: Details](../media/lr-data-products-support-multiple-summary-fields/fig-02-slide-02-user-story-details.png)
![Figure 3 — User Story: Details](../media/lr-data-products-support-multiple-summary-fields/fig-03-slide-02-user-story-details.png)

## Slide 3 — User Story: Details

2nd summary field added
3rd summary field added

- Update the canvas accordingly
- Provide the ability to delete a row from the Configure summary fields list
x
x

![Figure 4 — User Story: Details](../media/lr-data-products-support-multiple-summary-fields/fig-04-slide-03-user-story-details.png)
![Figure 5 — User Story: Details](../media/lr-data-products-support-multiple-summary-fields/fig-05-slide-03-user-story-details.png)

## Slide 4 — User Story

Template Canvas
CSV from GP Tool
This output is not part of this user story

![Figure 6 — User Story](../media/lr-data-products-support-multiple-summary-fields/fig-06-slide-04-user-story.png)
![Figure 7 — User Story](../media/lr-data-products-support-multiple-summary-fields/fig-07-slide-04-user-story.png)

## Slide 5 — User Story:

Template Canvas
CSV from GP Tool
This output is not part of this user story

![Figure 8 — User Story:](../media/lr-data-products-support-multiple-summary-fields/fig-08-slide-05-user-story.png)
![Figure 9 — User Story:](../media/lr-data-products-support-multiple-summary-fields/fig-09-slide-05-user-story.png)

## Slide 6

Testing

- Test with dark and light theme
- 508 and i18n compliance
- Test with different type of summary layers such as polygon, network and line event

## Slide 7

Documentation

## Slide 8

Automation

## Slide 9

Estimate
