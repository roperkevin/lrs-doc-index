# Spike: Reporting PowerBI

| Field | Value |
| --- | --- |
| **Doc** | 516 · Design Spike · Other |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Reporting PowerBI.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20PowerBI.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-05-18 17:02 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reporting · powerbi · segment report · data import · data formatting · roadway reporter |
| **Tools** | PowerBI |

## Summary

Investigation of PowerBI reporting capabilities for importing LRS data and creating reports. Evaluation of data formatting considerations, compatibility with existing report types, and potential limitations. Assessment of alignment between ArcGIS Pro and PowerBI reporting for data export tools.

## Related documents

<!-- related:begin -->
- [Spike: Reporting ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/reporting-pro.md>) — similar text 0.81 · 1 title word · 1 filename word · same kind/folder <!-- rel:615 s=6.895 -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length.md>) — similar text 0.05 · same folder <!-- rel:107 s=2.167 -->
- [Esri Roads and Highways and AgileAssets Integration Technical Specification](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-and-agileassets-integration-technical-specification.md>) — similar text 0.07 · same folder <!-- rel:810 s=1.344 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/lr-for-transportation-across-the-arcgis-platform-rh-2020-07-2.md>) — similar text 0.09 <!-- rel:788 s=0.761 -->
- [LRS Data Products](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-data-products-apr.md>) — similar text 0.07 <!-- rel:202 s=0.652 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [PowerBI](https://www.google.com/search?q=%22PowerBI%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Reporting PowerBI

Spike

## Slide 2 — Reporting PowerBI

- Investigate the PowerBI reporting capabilities to determine what type of data can be imported to create a report
  - Take note of any specific formatting or other considerations that might impact the data formatting for the tool(s) we’d like to build to support transformation of data
  - Consider the three existing report types we support and if they could be formatted/created in PowerBI
- Determine if there are any missing report configuration settings that current Roadway Reporter (and other DoTs) users need (pdfs, specific data views in the mileage report, etc.)
- Test if the output from our existing python tool used in Roadway Reporter to create a Segment Report could be imported into the PowerBI to create a similar Segment Report
- Report back with the following:
  - Feasibility of importing LRS data into the PowerBI reporting application
  - Any limitations uncovered in the PowerBI reporting application
  - Potential alignment in data formatting between the Pro and PowerBI reporting applications for a potential tool to export data
  - If possible, show being able to import LRS data into the PowerBI reporting application

## Slide 3 — Assignment

Story Points:
Dev:
