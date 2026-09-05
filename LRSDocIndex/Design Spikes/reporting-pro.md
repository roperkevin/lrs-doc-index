# Spike: Reporting ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 615 · Design Spike · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Reporting ArcGIS Pro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Reporting%20ArcGIS%20Pro.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2023-02-09 18:39 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | reporting · arcgis pro · segment report · data import · roadway reporter |
| **Tools** | — |

## Summary

Investigation of ArcGIS Pro reporting capabilities to assess data import feasibility for report creation. Evaluation includes formatting considerations, compatibility with existing report types, and identification of missing configuration settings needed by users. Testing involves importing output from an existing python tool to create segment reports in Pro.

## Related documents

<!-- related:begin -->
- [Spike: Reporting PowerBI](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/reporting-powerbi.md>) — similar text 0.81 · 1 title word · 1 filename word · same kind/folder <!-- rel:516 s=6.895 -->
- [Migrate Location Referencing Pro Icons to XAML](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lr-pro-icons-to-xaml.md>) — similar text 0.03 · 1 title word · 1 filename word · same surface/folder <!-- rel:835 s=2.15 -->
- [Split Centerlines in Local Scenes in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-centerlines-in-local-scenes-in-pro.md>) — similar text 0.06 · 1 title word · same surface/folder <!-- rel:766 s=1.761 -->
- [Generate LRS Data Product and Linear Referenced Length Summary Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-lrs-data-product-and-linear-referenced-length.md>) — similar text 0.06 · same surface/folder <!-- rel:107 s=1.693 -->
- [Spike: Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/exb.md>) — similar text 0.17 · same kind/folder <!-- rel:824 s=1.507 -->
<!-- related:end -->

---

## Slide 1 — Spike: Reporting ArcGIS Pro

Spike

## Slide 2 — Reporting ArcGIS Pro

- Investigate the Pro reporting capabilities to determine what type of data can be imported to create a report
  - Take note of any specific formatting or other considerations that might impact the data formatting for the tool(s) we’d like to build to support transformation of data
  - Consider the three existing report types we support and if they could be formatted/created in Pro
- Determine if there are any missing report configuration settings that current Roadway Reporter (and other DoTs) users need (pdfs, specific data views in the mileage report, etc.)
- Test if the output from our existing python tool used in Roadway Reporter to create a Segment Report could be imported into the Pro to create a similar Segment Report
- Report back with the following:
  - Feasibility of importing LRS data into the Pro reporting application
  - Any limitations uncovered in the Pro reporting application
  - If possible, show being able to import LRS data into the Pro reporting application

## Slide 3 — Assignment

Story Points:
Dev:
