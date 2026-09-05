# Migrate Location Referencing Pro Icons to XAML

| Field | Value |
| --- | --- |
| **Doc** | 835 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [MigrateProIconstoXAML.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MigrateProIconstoXAML.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2020-01-17 00:43 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | icons · xaml · dark mode · location referencing ribbon · arcgis pro |
| **Tools** | — |

## Summary

User story for converting Location Referencing icons in ArcGIS Pro from bitmap to XAML/vector graphics to support high quality display in both light and dark modes. Includes moving icons to a shared folder and updating code to utilize the new format. Testing involves verifying icon appearance and fit in both UI modes.

## Related documents

<!-- related:begin -->
- [Split Events in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/split-events-in-pro.md>) — similar text 0.07 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:677 s=2.955 -->
- [Spike: Advanced Table Editing options in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/advanced-table-editing-options-in-pro.md>) — similar text 0.04 · 1 title word · 1 filename word · same surface/folder <!-- rel:492 s=2.526 -->
- [Spike: Pro, Server, and Controller Dataset collaboration for Cartographic Realignment](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/pro-server-and-controller-dataset-collaboration.md>) — similar text 0.03 · 1 title word · 1 filename word · same surface/folder <!-- rel:727 s=2.505 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-pro.md>) — similar text 0.07 · 1 title word · same kind/surface/folder <!-- rel:688 s=2.455 -->
- [LR Reporting: Create a template tool User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lr-reporting-create-a-template-tool.md>) — similar text 0.06 · same kind/surface/folder <!-- rel:374 s=2.352 -->
<!-- related:end -->

---

## Story
### Migrate Location Referencing Pro Icons to XAML <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a Location Referencing user in Pro, I need to be able to view high quality icons in XAML format and in dark mode, so icons look sharp and high contrast within ArcGIS Pro.

![Figure 1 — User Story](../media/migrate-lr-pro-icons-to-xaml/fig-01-slide-02-user-story.svg)
[connections: (ellipse 19) — (ellipse 18)]

## Acceptance Criteria
### Icons <!-- slide 3 -->
- Convert our existing icons from bitmap to XAML/vector graphics
- Do this for all icons in both light and dark mode.  If a dark mode icon doesn’t exist, we should add one.
- Move our icons on the Location Referencing ribbon to the share icon folder (/SharedArcGIS/Images) and project (ArcGIS.Desktop.Resources)
- Make changes in our DAML/code to ensure the new icon format is utilized
- Reference the developer guide (https://devtopia.esri.com/ArcGISPro/protopia/wiki/Developer-Guide-(part-2)#images) and Michael Grossman’s email (attached to the devtopia item) for more information.

## Testing
<!-- slide 4 -->
- Verify all new icons in all locations they appear in Pro
- Ensure they fit correctly and aren’t distorted or infringing on other parts of the UI
- Verify in both Light and Dark mode

## Documentation
<!-- slide 5 -->
- None

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
