# ArcGIS Roads and Highways Experience Builder Widgets

|   |   |
| --- | --- |
| **Kind** | Other · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways |
| **Issue** | [ArcGISPro/ps-location-referencing#667](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/667) |
| **Source** | [667-GettingStartedwithExB_RH.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/667_ExB_widgets/667-GettingStartedwithExB_RH.docx>) |
| **Edited** | 2024-03-22 14:19 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "ArcGIS Roads and Highways Experience Builder Widgets"
source_file: "667-GettingStartedwithExB_RH.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/667_ExB_widgets/667-GettingStartedwithExB_RH.docx"
doc_id: 398
doc_kind: "Other"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2024-03-22T14:19:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["roads and highways", "experience builder", "widgets", "route search", "event editing", "linear event", "point event"]
tools: ["Search by Route", "LRS Identify", "Add Point Event", "Add Line Event", "Split Event", "Merge Events"]
products: ["Roads & Highways"]
issues: ["ArcGISPro/ps-location-referencing#667"]
related: [{"doc":399,"file":"arcgis-pipeline-referencing-experience-builder-widgets__doc399.md","s":1008.493},{"doc":397,"file":"roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md","s":6.121},{"doc":305,"file":"roads-and-highways-and-pipeline-referencing-enhancements-in-experience-builder__doc305.md","s":4.439},{"doc":174,"file":"experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md","s":3.734},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":3.575}]
```
-->

## Summary

This document describes the ArcGIS Experience Builder widgets designed for ArcGIS Roads and Highways. It lists available widgets for route search, event editing, and event management, and provides setup and requirement information for using these widgets within Experience Builder.

## Related documents

<!-- related:begin -->
- [ArcGIS Pipeline Referencing Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-experience-builder-widgets__doc399.md>) — shared issue ArcGISPro/ps-location-referencing#667 · similar text 0.92 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:399 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/roads-and-highways-and-pipeline-referencing-11-x-experience-builder-widgets__doc397.md>) — similar text 0.49 · 5 title words · same kind/surface <!-- rel:397 -->
- [Roads and Highways and Pipeline Referencing Enhancements in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/roads-and-highways-and-pipeline-referencing-enhancements-in-experience-builder__doc305.md>) — similar text 0.17 · 4 title words · same kind/surface <!-- rel:305 -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-express-mode-support-for-lrs-widgets-test-plan__doc174.md>) — similar text 0.18 · 3 title words · same surface <!-- rel:174 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.22 · 2 title words · same surface <!-- rel:178 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## ArcGIS Roads and Highways Experience Builder wWidgets for ArcGIS Roads and Highways
ArcGIS Experience Builder widgets designed for ArcGIS Roads and Highways are now available. These widgets now appear in the list of available widgets when creating a new experience within Experience Builder in an ArcGIS Enterprise portal. These widgets can be deployed individually to create specific-use apps, such as a route search or crash entry app, or within multiple widgets in an app, such as an Event Editor replacement.

### Roads and Highways wWidgets
The following widgets are available to work with Roads and Highways data in ArcGIS Experience Builder:

- Search by Route-Search for specific locations on your routes by route and/or measure, coordinates or referent offset.
- LRS Identify-Get route, measure, and event attribute information at a location with one click.
- Add Point Event-Add one or more LRS point events at a location on a route.
- Add Line Event-Add one or more LRS linear events across a measure range of a route or routes, if the events span routes.
- Split Event-Split an event at a location into two events with new attributes.
- Merge Events-Merge two or more adjacent events into a single event with updated attributes.
There are also template apps available to assist with configuring common apps that use these widgets.

### Experience Builder sSetup
To use ArcGIS Roads and Highways widgets, follow this guide for creating your first web experience.

### Requirements
The Roads and Highways widgets must be connected to a Map widget. Within the Map widget, the chosen web map must have LRS layers published with the Llinear rReferencing capability.
https://prodev.arcgis.com/en/pro-app/latest/help/production/roads-highways/share-as-web-layers.htm Learn more about publishing a Roads and Highways dataset with the linear referencing capability enabled.
