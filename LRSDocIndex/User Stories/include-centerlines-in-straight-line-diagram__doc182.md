# Include Centerlines in Straight Line Diagram

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [IncludeCenterlineSLD_2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IncludeCenterlineSLD_2.pptx>) |
| **Edited** | 2025-04-23 15:39 by Claire Wang |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Include Centerlines in Straight Line Diagram"
source_file: "IncludeCenterlineSLD_2.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/IncludeCenterlineSLD_2.pptx"
doc_id: 182
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Claire Wang"
last_edited: "2025-04-23T15:39:08Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "event editor", "un integrated lrs", "adm integrated lrs", "straight line diagram", "visualization", "display field"]
tools: ["Straight Line Diagram", "Dynamic Segmentation"]
products: ["Utility Network"]
issues: []
related: [{"doc":181,"file":"include-site-addresses-layer-in-straight-line-diagram__doc181.md","s":7.85},{"doc":183,"file":"include-intersections-in-straight-line-diagram-sld-user-story__doc183.md","s":6.976},{"doc":71,"file":"test-plan-include-intersections-in-straight-line-diagram__doc71.md","s":5.036},{"doc":349,"file":"experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md","s":4.746},{"doc":13,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md","s":4.532}]
```
-->

## Summary

This user story describes the need for Event Editors and GIS analysts to visualize centerlines in the Straight Line Diagram (SLD) for UN or ADM integrated LRS data. It covers configuration options, display behavior, and testing requirements to support centerline visualization without editing capabilities.

## Related documents

<!-- related:begin -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-straight-line-diagram__doc181.md>) — similar text 0.65 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:181 -->
- [Include Intersections in Straight Line Diagram (SLD) User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/include-intersections-in-straight-line-diagram-sld-user-story__doc183.md>) — similar text 0.57 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:183 -->
- [Test Plan: Include Intersections in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-include-intersections-in-straight-line-diagram__doc71.md>) — similar text 0.27 · 4 title words · 2 filename words · same surface <!-- rel:71 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md>) — similar text 0.19 · 3 title words · same kind/surface/folder <!-- rel:349 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Measure Range Filtering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-measure__doc13.md>) — similar text 0.11 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:13 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Include centerlines in SLD

User Story

## Slide 2 — User Story

As an Event Editor, I need the ability to visualize centerline for my UN or ADM integrated LRS in SLD so that I can retrieve relationships of the centerline with my asset data and properly location and orient myself for event editing and analysis. I don’t need to edit the centerline.
Persona
These users have UN or ADM integrated LRS data. Typically located in different business units/departments than the LRS route editors, the following users have varied GIS experience, but a high level of knowledge about the characteristics they maintain/analyze (pipeline pressure, pipe asset, E911, address block, and etc.)
Event Editor: These users are responsible for making edits to route characteristics and assets. They need to be able to visualize and retrieve centerline information on the route shown in SLD in preparation for event editing. They don’t edit centerline data.
GIS analyst: These users are responsible for exporting SLD to further retrieve information for route characteristics and assets analysis. They need centerline direction, location and attribute information in their analysis. They don’t edit centerline data.
Sample workflow:
A GIS analyst wants to create a report of the pipeline line information with pipe material and pressure data.
An event editor needs to check and supplement missing Directionality event information along centerlines.

## Slide 3 — Configuration

![Diagram drawn from the slide's own shapes: 3 nodes, 1 connector.](../media/doc819_slide3.svg)

- If the LRS is APRUN or ADM data and centerline is present in the webmap, add a toggle called “Show centerline” under Intersections in SLD settings
  - Default state is on
  - To hide centerline in SLD, turn it off
- Never show this option if LRS is not APRUN or ADM, or centerline is not in webmap
- Users can choose any non-editor tracking or system fields (e.g. they can choose Municipality on Left in ADM)
- If the UN/ADM centerline is unchecked in the Select layers pane (or removed in traditional mode), but Show centerline toggle is on, do not show in SLD. This is the same behavior as an event in the chosen attribute set is removed from Loaded layers.

Note:
This user story will be implemented after having Express Mode in DynSeg widget, so the majority of designs will be shown in Express Mode, but they work the same in “traditional mode” aka Select layers.

![image2.png](../media/doc819_image2.png)

## Slide 4 — SLD

![Diagram drawn from the slide's own shapes: 6 nodes (Pipeline Line, Pipeline Line ID: {A9537-GS392-5B…), 3 connectors.](../media/doc819_slide4_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 4 buttons, 1 colour block, 3 row separators, 5 icons, 31 text rows. 25 of 31 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc819_slide4_fig2.svg)

- No change in Dynseg table. Do not show centerline layer in table nor create new segmentation
- Place centerline on top of all the lines, below all the points
- Use an arrow symbology to show centerline direction
- Show display field on centerlines. Hovering over a centerline shows Display field + Centerline ID, or Centerline ID itself if it is Display Field (like what we do today)
- After double clicking a centerline record, pop-up window shows 1 section called “Fields” that shows all non-editor tracking fields. All fields are non-editable.
- Still show Statistics section if the centerline contains numeric business fields

Pipeline Line

Pipeline Line ID: {A9537-GS392-5B…

![image3.png](../media/doc819_image3.png)

## Slide 5 — Testing

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc819_slide5.svg)

- Verify UI aligns with Experience Builder style
- Test SLD and sanity check Dynseg table does not show centerline layer
- Test with ADM and UN, with line and/or point event attribute sets
- Sanity check a non-ADM/UN dataset and verify centerline doesn’t show at all
- Verify when the Show centerline toggle is off, centerline doesn’t show in SLD
- Test with route with single and multiple centerlines, and with all same/all flipped/mixed directions
- Test different display fields
- Verify centerline fields are not editable
- 508/i18n testing
- Test with different themes
- Test in Chrome and Firefox
- Test in different sizes (web, tab and mobile)

## Slide 6 — Automation Documentation

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc819_slide6.svg)

If existing automation fails, fix it
Add cases for showing various centerline results
Add to existing Dynseg/SLD topics

## Slide 7 — Assignment

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc819_slide7.svg)

Story Points:
Dev:
PE:
