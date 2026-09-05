# Reporting Location Referencing Mileage for Line Network

| Field | Value |
| --- | --- |
| **Doc** | 368 · User Story · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Reporting_GP_NoSummaryLineSupport.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Reporting_GP_NoSummaryLineSupport.pptx>) |
| **People** | author Rahul Rakshit · PE — · dev — |
| **Edited** | 2024-05-22 15:39 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | line network · mileage report · route mileage · line mileage · transform lrs data · geoprocessing tool |
| **Tools** | Transform LRS Data |

## Summary

User story to enable the Transform LRS Data geoprocessing tool to calculate mileage for Line Networks. The tool will output mileage tables showing line and route mileage based on user inputs including routes, date filters, units, and decimal precision. Testing and automation plans are included for various data sources and route types.

## Related documents

<!-- related:begin -->
- [Generate LRS Data Product: Create Mileage Report for Line Networks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5813-generate-lrs-data-product-create-mileage-report-for-line.md>) — similar text 0.13 · 2 title words · 1 filename word · same surface <!-- rel:338 s=4.135 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool.md>) — similar text 0.23 · 1 title word · same kind/surface/folder <!-- rel:374 s=3.398 -->
- [Date Comparison Data Product User Story and Design](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/date-comparison-data-product-and-design.md>) — similar text 0.25 · 1 filename word · same kind/surface/folder <!-- rel:162 s=3.117 -->
- [Transform LRS Data GP tool – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5742-transform-lrs-data-gp.md>) — similar text 0.22 · 1 filename word · same surface <!-- rel:372 s=2.782 -->
- [Generate Intersections at Route Endpoints](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-intersections-at-route-endpoints.md>) — similar text 0.03 · same kind/surface/folder <!-- rel:267 s=2.63 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Transform LRS Data](https://www.google.com/search?q=%22Transform%20LRS%20Data%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

REPORTING
LOCATION REFERENCING
Create a mileage report for Line Network

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)

![Figure 3 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-03-slide-01-reporting.svg)

## Slide 2 — User Story

Enable the Transform LRS data geoprocessing tool to support calculating mileages for Line Networks.

- LRS Editor
- Web User/Manager

Persona
Workflow
The user provides the following:

- A list of routes
- Date for filtering the routes
- Units for mileage
- No. of decimals for mileage

The output is a table of mileage calculated for each line and each route in the line.

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)

## Slide 3

| Route Attributes |  |  |  |
| --- | --- | --- | --- |
| Route Name | Line<br>Name | From Date | To<br>Date |
| R1 | L1 | 1/1/2000 | Null |
| R2 | L1 | 1/1/2000 | Null |
| R3 | L1 | 1/1/2000 | Null |
| R4 | L1 | 1/1/2000 | Null |

| Input |  |
| --- | --- |
| Network | LineNetwork |
| Routes |  |
| Date | 12/31/2023 |
| Units | Miles |
| Decimals | 3 |

| Output |  |  |  |
| --- | --- | --- | --- |
| Line<br>Name | Line Mileage | Route<br>Name | Route Mileage |
| L1 | 42.000 | R1 | 6.000 |
|  |  | R2 | 12.000 |
|  |  | R3 | 6.000 |
|  |  | R4 | 18.000 |

style.visibilitystyle.visibility
[figure: Workflow · R1 · R2 · R3 · R4]

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 4 — style.visibilitystyle.visibility](../media/reporting-lr-mileage-for-line-network/fig-04-slide-03-style-visibilitystyle-visibility.png)

## Slide 4 — Mileage Report supporting line networks

- Add support for calculating mileages for Line Networks in the existing Transform LRS Data GP tool.
- The route mileage is calculated as (To Measure – From Measure)
- The line mileage is calculated as the Σ of mileages of all the routes in that line.
- Do this only when the Network type is a line Network
- The route identifier field will be ‘Route Name’
- Add two more fields in the output: Line Name and Line Mileage
- Change the name of the original Mileage field to Route Mileage
- Calculate the mileage for all the routes in a line even when a single route in that line is selected.
- No support for route concurrency in this user story.

| Output |  |  |  |
| --- | --- | --- | --- |
| Line<br>Name | Line<br>Mileage | Route<br>Name | Route Mileage |
| L1 | 42.000 | R1 | 6.000 |
|  |  | R2 | 12.000 |
|  |  | R3 | 6.000 |
|  |  | R4 | 18.000 |

style.visibility
![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)
![Figure 5 — Mileage Report supporting line networks](../media/reporting-lr-mileage-for-line-network/fig-05-slide-04-mileage-report-supporting-line-networks.png)

## Slide 5

Testing

- Test with Line Network
- Test will all supported route types
- Test with a large number (>2000) routes
- Test with time slices
- Test with different units (m, km, ft and mi) and number of decimals
- Test with data in FGDB, EGDB and FS
- Test with data in Oracle and SQL Server Databases
- Test with APR and UN APR Data

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)

## Slide 6

Automation

- Automate using PY.

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)

## Slide 7

Documentation

- GP doc by PE.

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)

## Slide 8

Estimation

![Figure 1 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-01-slide-01-reporting.png)
![Figure 2 — REPORTING](../media/reporting-lr-mileage-for-line-network/fig-02-slide-01-reporting.png)
![Figure 6 — Estimation](../media/reporting-lr-mileage-for-line-network/fig-06-slide-08-estimation.png)
