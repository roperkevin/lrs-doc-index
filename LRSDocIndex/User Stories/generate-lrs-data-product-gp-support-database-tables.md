# Generate LRS Data Product GP Tool: Support Database Tables

| Field | Value |
| --- | --- |
| **Doc** | 238 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [GLRSDP_GP_Support_DatabaseTables.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/GLRSDP_GP_Support_DatabaseTables.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2025-02-05 21:15 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | generate lrs data product · database table · geoprocessing · fgdb · egdb · oracle · sql server |
| **Tools** | Generate LRS Data Product |

## Summary

This document describes the user story for enhancing the Generate LRS Data Product geoprocessing tool to support output in the form of database tables in addition to CSV files. It includes personas, sample data requests, testing plans for various geodatabases, documentation, automation, and development estimates.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length.md>) — similar text 0.19 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:107 s=4.54 -->
- [Generate LRS Data Product Support Summary and Length](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/generate-lrs-data-product-support-summary-and-length.md>) — similar text 0.18 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:357 s=4.069 -->
- [User Story: Support Multiple Summary Fields in Generate LRS Data Product](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-multiple-summary-fields-in-generate-lrs-data-product.md>) — similar text 0.17 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:353 s=4.025 -->
- [LR Data Products: Support multiple summary fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-data-products-support-multiple-summary-fields.md>) — similar text 0.16 · 1 title word · same kind/surface/folder <!-- rel:356 s=2.976 -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-gp.md>) — similar text 0.08 · 1 title word · same kind/surface/folder <!-- rel:881 s=2.946 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Generate LRS Data Product](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Product%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Generate LRS Data Product GP tool: Support Database Tables

User Story
The Generate LRS Data Product GP tool outputs CSV files as of now. Add the capability to output in the form of a database table.
Persona
GIS Analyst: These users know how to work with ArcGIS Pro. They provide the data product outputs in form of a report or a table as asked by their stakeholders.
Sample asks:

- Provide me county wise VMT
- Provide me lane miles for county X
- How many signals are present on route X
style.visibility
![Figure 1 — Generate LRS Data Product GP tool: Support Database Tables](../media/generate-lrs-data-product-gp-support-database-tables/fig-01-slide-01-generate-lrs-data-product-gp-tool.png)

## Slide 2 — Existing GP tool supporting output as a database table

![Figure 2 — Existing GP tool supporting output as a database table](../media/generate-lrs-data-product-gp-support-database-tables/fig-02-slide-02-existing-gp-tool-supporting-output.png)

## Slide 3 — Test the output using FGDB, EGDB (Oracle and SQL Server)

Testing

## Slide 4

Documentation

## Slide 5

Automation

- Add to existing automation.

## Slide 6

Estimate

- D days dev
- D days testing
