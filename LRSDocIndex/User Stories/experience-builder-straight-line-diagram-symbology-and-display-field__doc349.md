# Experience Builder Straight Line Diagram Symbology and Display Field

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExpBld StraightLineDiagramSymbologyVisibility.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramSymbologyVisibility.pptx>) |
| **Edited** | 2024-07-23 15:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Experience Builder Straight Line Diagram Symbology and Display Field"
source_file: "ExpBld StraightLineDiagramSymbologyVisibility.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramSymbologyVisibility.pptx"
doc_id: 349
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Nathan Easley"
last_edited: "2024-07-23T15:21:15Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event editor", "straight line diagram", "symbology", "display field", "event attributes", "experience builder"]
tools: ["Straight Line Diagram"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":348,"file":"experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md","s":8.922},{"doc":345,"file":"experience-builder-straight-line-diagram-event-attributes-editing-on-click__doc345.md","s":8.318},{"doc":464,"file":"search-by-line-experience-builder-widget__doc464.md","s":5.121},{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":4.988},{"doc":292,"file":"support-overlapping-events-in-experience-builder-straight-line-diagram__doc292.md","s":4.89}]
```
-->

## Summary

This document describes a user story for an Experience Builder widget that allows event editors to view and edit multiple LRS event attributes visualized in a straight line diagram based on route measures. It covers symbology sourced from the web map, configurable display fields for event layers, and testing scenarios involving various event types and symbology complexities.

## Related documents

<!-- related:begin -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-on-hover-click__doc348.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:348 -->
- [Experience Builder Straight Line Diagram Event Attributes/Editing on Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-straight-line-diagram-event-attributes-editing-on-click__doc345.md>) — similar text 0.52 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:345 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-experience-builder-widget__doc464.md>) — similar text 0.23 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:464 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.40 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 -->
- [Support Overlapping Events in Experience Builder Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-experience-builder-straight-line-diagram__doc292.md>) — similar text 0.21 · 5 title words · same kind/surface/folder <!-- rel:292 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Experience Builder Straight Line Diagram Symbology /Display Field

User Story
ArcGIS Enterprise

## Slide 2 — User Story

As an event editor, I need the ability to view and edit multiple LRS event attributes visualized in a diagram based on measures along the route, so I can view the relationships between different data layers attributes while editing.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to view event data in a straight-line diagram view where the layers are visualized, and gaps and overlaps can easily be identified.  In addition to being used for editing, this diagram will be utilized by many users throughout the organization as it will provide a visualization of event layers and how they align spatially along a route with each other.

## Slide 3 — Straight Line Diagram

![image1.png](../media/doc621_image1.png)

## Slide 4 — Straight Line Diagram

The symbology/colors for the layers will come from the webmap and won’t be able to be changed in the widget for now
The display field (i.e., the speed limit, number of lanes, or pavement PCI) will come from the display field for the layer from the web map (but can be changed in configuration options)
Include a label on each record, showing the value from the display field (for example, on the Speed Limit layer, we would show 25, 30, 35, etc.)
If the display field for the layer isn’t part of the fields for that layer in the attribute set being used, default to the first field in the attribute set and alert the user in the configuration about the display field not being present
To see the designs as reference, see https://www.figma.com/design/dIN1OfZDxhT7i9pbefdoTj/LRS?node-id=506-130104&t=wxNbCEfAcfChEXKx-0

## Slide 5 — Configuration

In the configuration for the tool, support the following:

  - For the event layers, allow the user to configure the display field (default is whatever comes from the web map)

## Slide 6 — Testing

Test with a mix of APR, RH data (INDOT cracking layer as one of the layers in the dynseg)
Test with a mix or point, line, and spanning events
Test with a variety of fields as the display field (defaults, contingent, subtypes, domains, ranges, etc.)
Test with single layer symbology, unique value symbology, and complex symbology
Test changing the symbology in the webmap (compared to the service)
Test with results that produce lots of for a layer, so we can see how the labeling performs with limited space

## Slide 7 — Automation

Don’t automate the widget yet as this is the first of multiple user stories for this widget.

## Slide 8 — Documentation

Add to the existing topic created in the previous user story
Focus specifically how the symbology and display field are taken from the web map.  Also make sure to mention how the display field can be configured.

## Slide 9 — Story Points

Story Points:
Dev:
PE:
