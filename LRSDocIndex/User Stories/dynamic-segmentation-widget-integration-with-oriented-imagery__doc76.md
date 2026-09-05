# Dynamic Segmentation widget integration with Oriented Imagery

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Source** | [ExB OI widget integration with SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20OI%20widget%20integration%20with%20SLD.pptx>) |
| **Edited** | 2026-02-06 00:10 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Dynamic Segmentation widget integration with Oriented Imagery"
source_file: "ExB OI widget integration with SLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20OI%20widget%20integration%20with%20SLD.pptx"
doc_id: 76
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2026-02-06T00:10:40Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "oriented imagery", "experience builder", "lrs editor", "widget integration", "route imagery"]
tools: ["Dynamic Segmentation", "Oriented Imagery"]
products: []
issues: []
related: [{"doc":145,"file":"spike-oriented-imagery-widget-integration-with-dynamic-segmentation-sld__doc145.md","s":6.766},{"doc":146,"file":"spike-elevation-profile-widget-interaction-with-dynamic-segmentation-sld__doc146.md","s":4.813},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":4.458},{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":3.9},{"doc":60,"file":"dynamic-segmentation-widget__doc60.md","s":3.824}]
```
-->

## Summary

User story describing the integration of the Dynamic Segmentation widget with the Oriented Imagery widget in Experience Builder. It covers the need for LRS Editors to view linear referenced data alongside map and imagery views, configuration options for integration, synchronization of widgets, and testing considerations.

## Related documents

<!-- related:begin -->
- [Spike: Oriented Imagery widget integration with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-oriented-imagery-widget-integration-with-dynamic-segmentation-sld__doc145.md>) — similar text 0.26 · 6 title words · 2 filename words · same surface/folder <!-- rel:145 -->
- [Spike: Elevation Profile widget interaction with Dynamic Segmentation/SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Design Spikes/spike-elevation-profile-widget-interaction-with-dynamic-segmentation-sld__doc146.md>) — similar text 0.20 · 3 title words · 2 filename words · same surface/folder <!-- rel:146 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.34 · 3 title words · 1 filename word · same surface <!-- rel:57 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.17 · 3 title words · same kind/surface/folder <!-- rel:362 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc60.md>) — similar text 0.21 · 3 title words · 1 filename word · same surface <!-- rel:60 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Oriented Imagery](https://www.google.com/search?q=%22Oriented%20Imagery%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Dynamic Segmentation widget integration with Oriented Imagery

User Story

## Slide 2 — User Story

As an LRS Editor, I need the ability to view my linear referenced data in a dynamically segmented, map, and imagery view, so that I achieve a comprehensive look at my roads/pipes and their characteristics/assets in a single experience.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor is responsible for making the route and event edits based on these documents. For these users, being able to see this data in a dynamically segmented/straight line diagram view alongside a map and imagery view will allow them to toggle between seeing a characteristic on a road/pipe and then verifying or identifying it in available imagery taken at the location  This will be useful for data entry/QC as well as for non editors who want to get a comprehensive understanding of what is at a given location.

## Slide 3 — SLD Integration with Oriented Imagery widget

In the Experience Builder Dynamic Segmentation widget, support integration with the Oriented Imagery widget
Provide a configuration experience to enable/disable to integration.  Default would be disabled.
Provide a search tolerance of how far an image can be off a route and still be considered for return in the SLD.  Default is __ feet.
The OI widget supports multiple layers.  Honor whatever layer is selected in the OI widget in the SLD.
If more than one OI widget is present in the experience, prompt the user to select layers from just one.
When a route is selected in the SLD, show a layer at the top for Oriented Imagery
The layer should have icons for each image that falls within the tolerance of that route (continue to inherit the symbology of the layer)
Additionally, use shading or coloring (inherited from layer symbology footprint layer) to show the coverage along a route where an image appears (need to determine what range is considered to still be covering the route)
Align the Map, SLD, and OI widgets so they stay in alignment when:

  - Clicking a location on the map (pan/zoom the SLD to that location and show a marker on the OI layer where the image is and open an image in OI if it’s present)
  - Opening/advancing images on the OI widget (map should zoom/pan and SLD should as well with the marker moving for the current image)
  - Single clicking a location on the SLD (select the best image in the OI widget, pan the map)
  - Double clicking a location on the SLD (select the best image in the OI widget, zoom to map)
  - Note that we should continue to show the cut through at the clicked location or the pop up in the SLD depending on single vs double click.  The exception is double clicking the OI layer in the SLD, in this case don’t open any properties
Use the branch eri10661/sld-profile-spike as a guide

## Slide 4 — Sample

## Slide 5 — Testing

Test with and without OI to make sure the SLD still works without it
Verify images outside the tolerance of the route are ignored
Test with cases where a two routes intersect and verify that an image within the tolerance of each route would appear on the OI layer in the SLD when searched
Test with a scenario where there are multiple OI layers

## Slide 6 — Automation

Do we want to automate this?

## Slide 7 — Documentation

Update documentation for the topic to mention the ability to configure with the OI widget.  Make sure to mention the OI widget must be present and there are configuration options within the DynSeg widget to connect the two.

## Slide 8 — Assignment

Story Points:
Dev:  days
PE:  days
