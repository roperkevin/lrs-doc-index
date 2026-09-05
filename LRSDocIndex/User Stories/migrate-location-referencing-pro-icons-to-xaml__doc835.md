# Migrate Location Referencing Pro Icons to XAML

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [MigrateProIconstoXAML.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MigrateProIconstoXAML.pptx>) |
| **Edited** | 2020-01-17 00:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Migrate Location Referencing Pro Icons to XAML"
source_file: "MigrateProIconstoXAML.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MigrateProIconstoXAML.pptx"
doc_id: 835
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2020-01-17T00:43:50Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["icons", "xaml", "dark mode", "location referencing ribbon", "arcgis pro"]
tools: []
products: []
issues: []
related: [{"doc":677,"file":"split-events-in-arcgis-pro__doc677.md","s":2.955},{"doc":492,"file":"spike-advanced-table-editing-options-in-pro__doc492.md","s":2.526},{"doc":727,"file":"spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md","s":2.505},{"doc":688,"file":"add-single-point-event-tool-in-arcgis-pro__doc688.md","s":2.455},{"doc":374,"file":"lr-reporting-create-a-template-tool-user-story__doc374.md","s":2.352}]
```
-->

## Summary

User story for converting Location Referencing icons in ArcGIS Pro from bitmap to XAML/vector graphics to support high quality display in both light and dark modes. Includes moving icons to a shared folder and updating code to utilize the new format. Testing involves verifying icon appearance and fit in both UI modes.

## Related documents

<!-- related:begin -->
- [Split Events in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-in-arcgis-pro__doc677.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:677 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-advanced-table-editing-options-in-pro__doc492.md>) — similar text 0.04 · 1 title word · 1 filename word · same surface/folder <!-- rel:492 -->
- [Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-pro-server-and-controller-dataset-collaboration-for-cartographic__doc727.md>) — similar text 0.03 · 1 title word · 1 filename word · same surface/folder <!-- rel:727 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-arcgis-pro__doc688.md>) — similar text 0.07 · 1 title word · same kind/surface/folder <!-- rel:688 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool-user-story__doc374.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:374 -->
<!-- related:end -->

---

## Slide 1 — Migrate Location Referencing Pro Icons to XAML

User Story

## Slide 2 — User Story

![Diagram drawn from the slide's own shapes: 2 nodes, 2 connectors.](../media/doc66_slide2.svg)

As a Location Referencing user in Pro, I need to be able to view high quality icons in XAML format and in dark mode, so icons look sharp and high contrast within ArcGIS Pro.

## Slide 3 — Icons

Convert our existing icons from bitmap to XAML/vector graphics
Do this for all icons in both light and dark mode.  If a dark mode icon doesn’t exist, we should add one.
Move our icons on the Location Referencing ribbon to the share icon folder (/SharedArcGIS/Images) and project (ArcGIS.Desktop.Resources)
Make changes in our DAML/code to ensure the new icon format is utilized
Reference the developer guide (https://devtopia.esri.com/ArcGISPro/protopia/wiki/Developer-Guide-(part-2)#images) and Michael Grossman’s email (attached to the devtopia item) for more information.

## Slide 4 — Testing

Verify all new icons in all locations they appear in Pro
Ensure they fit correctly and aren’t distorted or infringing on other parts of the UI
Verify in both Light and Dark mode

## Slide 5 — Documentation

None

## Slide 6 — Assignment

Story Points:
Dev:
