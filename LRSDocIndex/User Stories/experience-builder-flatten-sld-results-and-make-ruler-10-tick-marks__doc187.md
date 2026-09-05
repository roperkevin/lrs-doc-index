# Experience Builder Flatten SLD Results and Make Ruler 10 tick marks

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExB - Flatten SLD Results and Make Ruler 10 tick marks.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Flatten%20SLD%20Results%20and%20Make%20Ruler%2010%20tick%20marks.pptx>) |
| **Edited** | 2025-04-17 19:29 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Flatten SLD Results and Make Ruler 10 tick marks"
source_file: "ExB - Flatten SLD Results and Make Ruler 10 tick marks.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20Flatten%20SLD%20Results%20and%20Make%20Ruler%2010%20tick%20marks.pptx"
doc_id: 187
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-04-17T19:29:30Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "straight line diagram", "ruler", "tick marks", "event editor", "flatten layers", "experience builder"]
tools: ["Dynamic Segmentation"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":171,"file":"flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler-test-plan__doc171.md","s":7.897},{"doc":191,"file":"experience-builder-sld-interaction-with-map__doc191.md","s":4.836},{"doc":12,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md","s":4.304},{"doc":27,"file":"experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md","s":4.222},{"doc":349,"file":"experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md","s":3.591}]
```
-->

## Summary

User story for improving the Dynamic Segmentation widget in the Straight Line Diagram (SLD) view by flattening the number of pixels per layer to reduce vertical scrolling and changing the ruler to have 10 tick marks with major ticks centered. Includes testing with various data types and scales, updating automation, and documentation changes.

## Related documents

<!-- related:begin -->
- [Flatten SLD results in rows and use 10 tick marks in ruler– test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/flatten-sld-results-in-rows-and-use-10-tick-marks-in-ruler-test-plan__doc171.md>) — similar text 0.47 · 6 title words · 2 filename words · same surface/folder <!-- rel:171 -->
- [Experience Builder SLD Interaction with Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-sld-interaction-with-map__doc191.md>) — similar text 0.33 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:191 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc12.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:12 -->
- [Experience Builder – Dynamic Segmentation Widget Straight Line Diagram – Dual Network Measure Support](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget-straight-line-diagram-dual__doc27.md>) — similar text 0.14 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:27 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-symbology-and-display-field__doc349.md>) — similar text 0.19 · 2 title words · same kind/surface/folder <!-- rel:349 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Flatten SLD Results and Make Ruler 10 tick marks

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to see more layers in the SLD, so I can see the relationships between more events without needing to vertically scroll.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). In the SLD, we want to flatten the layers to use fewer pixels so they can see more event layers without needing to vertically scroll.

## Slide 3 — Dynamic Segmentation widget

In the SLD view of the Dynamic Segmentation widget, make the following changes:

  - Flatten the number of pixels used for each layer so that there is less need for vertical scrolling (software engineer and designer have researched and have a number of pixels to use)
  - Change the ruler from having 8 tick marks to 10 tick marks. Show the major tick marks at the middle of the value like on a metric ruler

## Slide 4 — Testing

Test with a mix of APR, RH data, Addressing, and Postmile data (sanity only)
Test with many point and line layers
Test with various scales
Test changing the scale using the experience in the SLD

## Slide 5 — Automation

Update automation since it will break with this change.

## Slide 6 — Documentation

If there are any screenshots in the Dynamic Segmentation widget documentation, update them with these changes

## Slide 7 — Story Points

Story Points:
Dev:
PE:
