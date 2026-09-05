# Experience Builder Straight Line Diagram Symbology and Display Field

| Field | Value |
| --- | --- |
| **Doc** | 349 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld StraightLineDiagramSymbologyVisibility.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramSymbologyVisibility.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-07-23 15:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editor · straight line diagram · symbology · display field · event attributes · experience builder |
| **Tools** | Straight Line Diagram |

## Summary

This document describes a user story for an Experience Builder widget that allows event editors to view and edit multiple LRS event attributes visualized in a straight line diagram based on route measures. It covers symbology sourced from the web map, configurable display fields for event layers, and testing scenarios involving various event types and symbology complexities.

## Related documents

<!-- related:begin -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-on-hover-click.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:348 s=8.922 -->
- [Experience Builder Straight Line Diagram Event Attributes/Editing on Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-editing-on-click.md>) — similar text 0.52 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:345 s=8.318 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.23 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:464 s=5.121 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget.md>) — similar text 0.40 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 s=4.988 -->
- [Support Overlapping Events in Experience Builder Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-exb-sld.md>) — similar text 0.21 · 5 title words · same kind/surface/folder <!-- rel:292 s=4.89 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Straight Line Diagram Symbology /Display Field <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to view and edit multiple LRS event attributes visualized in a diagram based on measures along the route, so I can view the relationships between different data layers attributes while editing.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to view event data in a straight-line diagram view where the layers are visualized, and gaps and overlaps can easily be identified.  In addition to being used for editing, this diagram will be utilized by many users throughout the organization as it will provide a visualization of event layers and how they align spatially along a route with each other.

## Acceptance Criteria
### Straight Line Diagram <!-- slide 3 -->
![Figure 1 — Straight Line Diagram](../media/exb-sld-symbology-and-display-field/fig-01-slide-03-straight-line-diagram.png)

### Straight Line Diagram <!-- slide 4 -->
- The symbology/colors for the layers will come from the webmap and won’t be able to be changed in the widget for now
- The display field (i.e., the speed limit, number of lanes, or pavement PCI) will come from the display field for the layer from the web map (but can be changed in configuration options)
- Include a label on each record, showing the value from the display field (for example, on the Speed Limit layer, we would show 25, 30, 35, etc.)
- If the display field for the layer isn’t part of the fields for that layer in the attribute set being used, default to the first field in the attribute set and alert the user in the configuration about the display field not being present
- To see the designs as reference, see https://www.figma.com/design/dIN1OfZDxhT7i9pbefdoTj/LRS?node-id=506-130104&t=wxNbCEfAcfChEXKx-0

### Configuration <!-- slide 5 -->
- In the configuration for the tool, support the following:
  - For the event layers, allow the user to configure the display field (default is whatever comes from the web map)

## Testing
<!-- slide 6 -->
- Test with a mix of APR, RH data (INDOT cracking layer as one of the layers in the dynseg)
- Test with a mix or point, line, and spanning events
- Test with a variety of fields as the display field (defaults, contingent, subtypes, domains, ranges, etc.)
- Test with single layer symbology, unique value symbology, and complex symbology
- Test changing the symbology in the webmap (compared to the service)
- Test with results that produce lots of for a layer, so we can see how the labeling performs with limited space

## Automation
<!-- slide 7 -->
- Don’t automate the widget yet as this is the first of multiple user stories for this widget.

## Documentation
<!-- slide 8 -->
- Add to the existing topic created in the previous user story
- Focus specifically how the symbology and display field are taken from the web map.  Also make sure to mention how the display field can be configured.

## Assignment
### Story Points <!-- slide 9 -->
Story Points:
Dev:
PE:
