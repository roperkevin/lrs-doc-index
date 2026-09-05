# Experience Builder Straight Line Diagram Event Attributes on Hover/Click

| Field | Value |
| --- | --- |
| **Doc** | 348 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld StraightLineDiagramShowAttributesHover.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramShowAttributesHover.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-07-23 15:56 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | straight line diagram · event attributes · event editor · dynamic segmentation · experience builder · route measures · event visualization |
| **Tools** | — |

## Summary

User story for an Experience Builder widget that allows event editors to view and edit multiple LRS event attributes visualized in a straight line diagram based on measures along a route. The diagram supports hover and click interactions to display event attributes and relationships between data layers, facilitating identification of gaps and overlaps in event data.

## Related documents

<!-- related:begin -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-symbology-and-display-field.md>) — similar text 0.63 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:349 s=8.922 -->
- [Experience Builder Straight Line Diagram Event Attributes/Editing on Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-editing-on-click.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:345 s=8.755 -->
- [Support Overlapping Events in Experience Builder Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-exb-sld.md>) — similar text 0.22 · 5 title words · same kind/surface/folder <!-- rel:292 s=5.227 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.26 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:464 s=5.223 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget.md>) — similar text 0.35 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 s=4.832 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Straight Line Diagram Event Attributes on hover/click <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to view and edit multiple LRS event attributes visualized in a diagram based on measures along the route, so I can view the relationships between different data layers attributes while editing.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to view event data in a straight-line diagram view where the layers are visualized, and gaps and overlaps can easily be identified.  In addition to being used for editing, this diagram will be utilized by many users throughout the organization as it will provide a visualization of event layers and how they align spatially along a route with each other.

## Acceptance Criteria
### Straight Line Diagram <!-- slide 3 -->
![Figure 1 — Straight Line Diagram](../media/exb-sld-event-attributes-on-hover-click/fig-01-slide-03-straight-line-diagram.png)

### Straight Line Diagram <!-- slide 4 -->
- In the SLD, when a user hovers over one of the records (for what amount of time?), show a pop up that shows the Layer Name, EventID, and Display Field attribute for that record
- When a user clicks the measures on the measure bar at the top of the SLD, show a pop up that shows the Measure and all the Display Field attributes for that cross section (both point and line events)
- Show a dotted line that runs vertically from the measure bar down through all the events that intersect that measure
- If the location being hovered over/clicked is at the beginning/end of two events, choose the upstream event and show its attribute(s)
- Note that in the mobile experience, the click option will work, but the hover will not
- To see the designs as reference, see https://www.figma.com/design/dIN1OfZDxhT7i9pbefdoTj/LRS?node-id=506-130104&t=wxNbCEfAcfChEXKx-0

![Figure 2 — Straight Line Diagram](../media/exb-sld-event-attributes-on-hover-click/fig-02-slide-04-straight-line-diagram.png)
![Figure 3 — Straight Line Diagram](../media/exb-sld-event-attributes-on-hover-click/fig-03-slide-04-straight-line-diagram.png)

### Configuration <!-- slide 5 -->
- No additions to the configuration with this story

## Testing
<!-- slide 6 -->
- Test with a mix of APR, RH data (INDOT cracking layer as one of the layers in the dynseg)
- Test with a mix or point, line, and spanning events
- Test with a variety of fields as the display field (defaults, contingent, subtypes, domains, ranges, etc.)
- Test with results that produce lots of results for a layer, so we can see how the labeling performs with limited space
- Test changing the measure scale to large/small values to validate snapping and the measures provided

## Automation
<!-- slide 7 -->
- Don’t automate the widget yet as this is the first of multiple user stories for this widget.

## Documentation
<!-- slide 8 -->
- Add to the existing topic created in the previous user story
- Focus specifically on these hover/click options and how they will show one events attributes or all the event attributes at a single measure

## Assignment
### Story Points <!-- slide 9 -->
Story Points:
Dev:
PE:
