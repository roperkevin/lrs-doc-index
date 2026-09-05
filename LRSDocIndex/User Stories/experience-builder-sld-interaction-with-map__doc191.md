# Experience Builder SLD Interaction with Map

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExB - SLD Interaction with Map.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Interaction%20with%20Map.pptx>) |
| **Edited** | 2025-04-16 16:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder SLD Interaction with Map"
source_file: "ExB - SLD Interaction with Map.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Interaction%20with%20Map.pptx"
doc_id: 191
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2025-04-16T16:09:03Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["straight line diagram", "dynamic segmentation", "map interaction", "event editor", "route navigation", "arcgis enterprise"]
tools: ["Dynamic Segmentation", "Straight Line Diagram", "Map Widget"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":187,"file":"experience-builder-flatten-sld-results-and-make-ruler-10-tick-marks__doc187.md","s":4.836},{"doc":178,"file":"experience-builder-support-multiple-lrs-services-in-web-map__doc178.md","s":4.554},{"doc":175,"file":"dynamic-segmentation-sld-interaction-with-map-test-plan__doc175.md","s":4.317},{"doc":193,"file":"create-single-lrs-picker-for-experience-builder-widgets__doc193.md","s":4.001},{"doc":167,"file":"experience-builder-time-and-versioning-widget__doc167.md","s":3.895}]
```
-->

## Summary

Describes a user story for event editors to interact with the map while using the Straight Line Diagram (SLD) in ArcGIS Enterprise. Details the dynamic segmentation widget's interaction with the map, including panning, zooming, and scrolling behaviors to keep the SLD aligned with the map. Includes testing, automation, and documentation considerations for this functionality.

## Related documents

<!-- related:begin -->
- [Experience Builder Flatten SLD Results and Make Ruler 10 tick marks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-flatten-sld-results-and-make-ruler-10-tick-marks__doc187.md>) — similar text 0.33 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:187 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-support-multiple-lrs-services-in-web-map__doc178.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:178 -->
- [Dynamic Segmentation: SLD Interaction with Map Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/dynamic-segmentation-sld-interaction-with-map-test-plan__doc175.md>) — similar text 0.35 · 3 title words · 1 filename word · same surface <!-- rel:175 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-experience-builder-widgets__doc193.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:193 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/experience-builder-time-and-versioning-widget__doc167.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:167 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Map Widget](https://www.google.com/search?q=%22Map%20Widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder SLD interaction with the map

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to utilize the map to navigate along SLD results for a route, so I can easily use other map layers to guide the locations of SLD results I want to see.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). When using the SLD, the users want to interact with the map.  This will allow them to use other layers in the map, like reference layers, to easily navigate to locations along the route and see the SLD results for the area.

## Slide 3 — Dynamic Segmentation widget map interaction

Link the dynamic segmentation widget with the map widget (the map widget will always be present so no need to make any configuration option)
In the SLD,

  - If the user double clicks the ruler, pan the map to that location
  - If the user changes the scale level, have the map zoom in/out to match it
  - If the user uses the horizontal scroll bar to move upstream/downstream on the route, have the map move to stay in alignment (wait for 1 second until the scrolling is complete to update)
In the map, if an SLD is open with results,

  - If the user pans the map, have the SLD move to stay in alignment
  - If the user zooms the map, have the SLD zoom to a scale to align with the measure range of the route in the map
  - If the pan/zoom results in the route no longer being in the map, have the SLD move to nearest measure range (beginning/end of the route)
  - If the zoom is to a scale larger than the max zoom of the SLD, take the SLD to the max scale as allowed

## Slide 4 — Testing

Test with a mix of APR, RH data, and Postmile data (sanity only)
Test all the supported operations for map interaction (using the buttons that come with the map widget along with mouse and keyboard actions to pan/zoom/move the map)
Test with an SLD with dozens of layers to ensure performance is good when interacting

## Slide 5 — Automation

Add a few automation cases to the existing automation for the widget

## Slide 6 — Documentation

In the Dynamic Segmentation widget documentation, mention interaction with the map and consider adding a list/table of operations that are supported

## Slide 7 — Story Points

Story Points:
Dev:
PE:
