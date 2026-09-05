# Spike: Complete DMZ machine setup

| Field | Value |
| --- | --- |
| **Doc** | 632 · Design Spike · Enterprise |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [Spike Complete DMZ machine setup.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Spike%20Complete%20DMZ%20machine%20setup.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2022-09-21 02:52 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dmz machine · database setup · roads and highways · postmile · apr data · apr un data · event editor · service publishing |
| **Tools** | ArcGIS Enterprise · Enterprise Builder · ArcGIS Pro · SQL Server Express · Event Editor |

## Summary

Details the complete setup process for a DMZ machine intended for public demos, including installation of ArcGIS Enterprise 11.0, ArcGIS Pro 3.0, SQL Server Express, creation and loading of four specific databases, deployment of Event Editor, and publishing services for use in ArcGIS Pro/Event Editor. The deliverable includes providing links and a demo of the configured machine.

## Related documents

<!-- related:begin -->
- [SQL Server Setup Notes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/sql-server-setup-notes.md>) — similar text 0.09 · 1 title word · 1 filename word · same folder <!-- rel:228 s=3.046 -->
- [Developer Server Setup](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/developer-server-setup.md>) — similar text 0.10 · 1 title word · 1 filename word · same surface <!-- rel:735 s=2.312 -->
- [Spike: Location Referencing support in Linux](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/lr-support-in-linux.md>) — similar text 0.15 · same kind/surface/folder <!-- rel:519 s=2.042 -->
- [Generate Events Skip Records with Null LRS Fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/generate-events-skip-records-with-null-lrs-fields.md>) — similar text 0.03 · same folder <!-- rel:104 s=1.804 -->
- [Remove Overlapping Centerline Supporting Attributes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/remove-overlapping-centerline-supporting-attributes.md>) — similar text 0.03 · same kind/folder <!-- rel:808 s=1.724 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [ArcGIS Enterprise](https://www.google.com/search?q=%22ArcGIS%20Enterprise%22+site%3Adoc.esri.com) · [Enterprise Builder](https://www.google.com/search?q=%22Enterprise%20Builder%22+site%3Adoc.esri.com) · [ArcGIS Pro](https://www.google.com/search?q=%22ArcGIS%20Pro%22+site%3Adoc.esri.com) · [SQL Server Express](https://www.google.com/search?q=%22SQL%20Server%20Express%22+site%3Adoc.esri.com) · [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Spike: Complete DMZ machine setup

Spike

## Slide 2 — Complete DMZ machine setup

- Complete setup of the DMZ machine that the team will use for future public demo opportunities (such as conferences like the UC)
- Whichever PE is assigned will need to request access to the DMZ machine (if they haven’t already)
- The following setup items need to be completed
  - Install ArcGIS Enterprise 11.0 (feel free to use Enterprise Builder to complete)
  - Install ArcGIS Pro 3.0
  - Install SQL Server Express (should already be completed)
  - Create 4 databases (1 Roads and Highways, 1 Postmile, 1 APR only, 1 APR-UN)
  - Load data into each of the databases
    - Modified INDOT for Roads and Highways
    - A modified version of Caltrans data for Postmile (will need to take the existing postmile data and trim some of it out)
    - APR sample data (can use the APR sample data we’ve used in central Texas)
    - APR-UN sample data (use a copy of the sample data created by Jeff Allen’s team)
  - Deploy Event Editor
  - Publish a service from each database for use in ArcGIS Pro/Event Editor (for the APR and APR-UN data, use the sample maps in the Pipeline Referencing Foundation solution template for APR only that has symbology already configured https://www.arcgis.com/apps/solutions/index.html?gallery=true&industry=Pipeline&sortField=relevance&sortOrder=desc#home)
- Deliverable for the spike is to provide links and a quick demo of the machine to the team

## Slide 3 — Assignment

Story Points:
Dev:
