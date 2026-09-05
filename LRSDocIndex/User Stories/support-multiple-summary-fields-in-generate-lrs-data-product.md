# User Story: Support Multiple Summary Fields in Generate LRS Data Product

| Field | Value |
| --- | --- |
| **Doc** | 353 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [GenerateLRDP_GP5_Support_MultipleSummary_V1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/GenerateLRDP_GP5_Support_MultipleSummary_V1.pptx>) · rev V1 |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2024-07-10 16:23 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data product · summary fields · length product · geoprocessing · template · route · event |
| **Tools** | Generate LRS Data Products |

## Summary

This document describes a user story for GIS Analysts to use multiple summary fields in the Generate LRS Data Products geoprocessing tool. It includes examples of nested summary fields for length data products and outlines testing and automation considerations.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length.md>) — similar text 0.36 · 4 title words · 4 filename words · same kind/surface/folder <!-- rel:357 s=8.879 -->
- [LR Data Products: Support multiple summary fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-data-products-support-multiple-summary-fields.md>) — similar text 0.39 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:356 s=6.394 -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length.md>) — similar text 0.16 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:107 s=4.667 -->
- [User Story for LRS Data Product Template with Multiple Length Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/for-lrs-data-product-template-with-multiple-length-fields.md>) — similar text 0.34 · 3 title words · same kind/surface/folder <!-- rel:342 s=4.294 -->
- [Support table output with the length product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6458-support-table-output-with-the-length-product-template.md>) — similar text 0.18 · 2 title words · same surface/folder <!-- rel:232 s=3.515 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [Generate LRS Data Products](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Products%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

User Story
As a GIS Analyst, I need the ability to use the LRS Data Product template that can be used by the Generate LRS Data Products geoprocessing tool. It’d be very helpful if I can use multiple the summary fields from the template to produce the data product.
Persona
GIS Analyst: These users know how to work with ArcGIS Pro. They will design a reusable data template based on an existing paper or digital report. Their duty will be to ensure that the Data Product’s constituents closely mirror those of its predecessors.
Generate LR Data Product:
Support multiple summary fields from the template
style.visibility

## Slide 2 — User Story

  - Support using multiple summary fields to create a length data product using the Generate LRS product geoprocessing tool.
  - The summary fields are nested based on level. In the example here, the base level is Route type (Level3) which are summarized by City (Level 2) which are summarized by County (Level1).
  - Length is calculated as a ∑ of (To measure – From Measure) for each event (Functional Class Type) segment present for the selected routes.
Template
CSV from GP Tool
Data

![Figure 1 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-01-slide-02-user-story.png)
![Figure 2 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-02-slide-02-user-story.png)
![Figure 3 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-03-slide-02-user-story.png)
![Figure 4 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-04-slide-02-user-story.png)
![Figure 5 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-05-slide-02-user-story.png)

![Figure 6 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-06-slide-02-user-story.svg)

## Slide 3 — Another Example

Multiple Summary and length fields in the Length Product

![Figure 2 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-02-slide-02-user-story.png)
![Figure 7 — Another Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-07-slide-03-another-example.png)
![Figure 8 — Another Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-08-slide-03-another-example.png)
![Figure 4 — User Story](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-04-slide-02-user-story.png)

## Slide 4

Example

![Figure 9 — Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-09-slide-04-example.png)

## Slide 5

Example

![Figure 10 — Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-10-slide-05-example.png)

## Slide 6

Example

![Figure 11 — Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-11-slide-06-example.png)

## Slide 7

Example

![Figure 12 — Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-12-slide-07-example.png)

## Slide 8

Example

![Figure 13 — Example](../media/support-multiple-summary-fields-in-generate-lrs-data-product/fig-13-slide-08-example.png)

## Slide 9

Testing

- Recreate the provided examples in CSV format (when possible)
- Ask Rahul for more examples
- Test with and without route selection
- Use a template with no event data required
- Polygons, Events and Networks as summary layers
- Line and non-line networks
- Test the PY version

## Slide 10

Documentation

## Slide 11

Automation
