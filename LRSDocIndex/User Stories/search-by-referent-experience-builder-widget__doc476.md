# Search by Referent Experience Builder widget

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExpBld SearchbyReferent.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20SearchbyReferent.pptx>) |
| **Edited** | 2023-10-27 00:19 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search by Referent Experience Builder widget"
source_file: "ExpBld SearchbyReferent.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20SearchbyReferent.pptx"
doc_id: 476
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2023-10-27T00:19:06Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["referent", "route search", "offset", "event editor", "experience builder widget", "lrs editing"]
tools: ["Route Search"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":487,"file":"search-by-coordinate-experience-builder-widget__doc487.md","s":7.138},{"doc":490,"file":"search-by-station-experience-builder-widget-user-story__doc490.md","s":7.017},{"doc":464,"file":"search-by-line-experience-builder-widget__doc464.md","s":6.937},{"doc":529,"file":"search-by-route-and-measure-experience-builder-widget__doc529.md","s":6.41},{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":5.003}]
```
-->

## Summary

This document describes a user story for an Experience Builder widget that enables Event Editors to search for routes using referent and offset values. It outlines the widget's functionality, configuration options, testing requirements, automation integration, and documentation updates. The widget supports multiple networks, referent layers, and handles valid and invalid input scenarios.

## Related documents

<!-- related:begin -->
- [Search by Coordinate Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-coordinate-experience-builder-widget__doc487.md>) — similar text 0.70 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:487 -->
- [Search by Station Experience Builder widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-station-experience-builder-widget-user-story__doc490.md>) — similar text 0.63 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:490 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-experience-builder-widget__doc464.md>) — similar text 0.63 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:464 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-experience-builder-widget__doc529.md>) — similar text 0.46 · 4 title words · 3 filename words · same kind/surface/folder <!-- rel:529 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.26 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:362 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [Route Search](https://www.google.com/search?q=%22Route%20Search%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Search by Referent Experience Builder widget

User Story

## Slide 2 — User Story

As an Event Editor, I need the ability to search for a route via referent and offset, so that I can properly locate and orient myself for LRS editing and analysis.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to search for a route via referent and offset to orient themselves on the map in preparation for event editing.

## Slide 3 — Search by Referent

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 1 button, 15 text rows. 10 of 15 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc472_slide3.svg)

Create another method in the Route Search widget called “Referents”
Network should be whatever network was configured in the backstage configuration
User can change the network in the UI to any valid LRS networks in the map
The referent layer should include any point layer in the map
The user can configure the Referent display field (see slide 5)
The offset is optional; if it’s left empty treat it as 0
(Should we include the map selection button for the referent?)
All mockups can be found at https://www.figma.com/file/dIN1OfZDxhT7i9pbefdoTj/LRS?type=design&node-id=506-130104&mode=design&t=gS2mLbqfZq6Pwoqa-0

![image1.png](../media/doc472_image1.png)

## Slide 4 — Search by Referent

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc472_slide4.svg)

If the referent and/or offset value are invalid, provide a message that the coordinates provided aren’t valid

When the user clicks search do the following:

  - Find all the routes/measures that are present at that referent/offset and return them in the results
  - Transition the widget to a results pane that shows the route(s)/measure(s) that are returned by the search
  - If no route/measure is present at the referent/offset, let the user know that no route/measure was found

![image2.png](../media/doc472_image2.png)

## Slide 5 — Search by Coordinates

![Interface screenshot redrawn as a standardized wireframe: 3 panels, 1 button, 15 text rows. 10 of 15 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc472_slide5.svg)

Experience Builder widgets provide a backstage to configure options on a given widget
Since this is an existing widget, additional options need to be exposed in the widget

  - Add referent as one the methods (default is route and measure)
  - Allow the user choose the default network
  - Allow the user to choose the default referent layer
  - Allow the user to choose the display field for the referent layer
  - Allow the user to choose the unit of measure for the offset

![image1.png](../media/doc472_image1.png)

## Slide 6 — Testing

Test with APR and RH data
Test on a variety of route shapes
Test on projected and unprojected data
Test with referent layers that are and are not LRS events
Test with positive and negative offset values
Test where a single result will be returned as well as multiple results
Verify the tool aligns with any other Experience Builder specifications/requirements
508/l18n testing
Test with different themes

## Slide 7 — Automation

Add automation to the existing Route and Measure automation for this tool

## Slide 8 — Documentation

Add to the existing Route and Measure widget documentation that covers this new method

## Slide 9 — Assignment

Story Points:
Dev:
PE:
