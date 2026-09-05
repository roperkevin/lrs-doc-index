# Experience Builder Straight Line Diagram Event Attributes/Editing on Click

| Field | Value |
| --- | --- |
| **Doc** | 345 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExpBld StraightLineDiagramPopupAttributesforEditingClick.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExpBld%20StraightLineDiagramPopupAttributesforEditingClick.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2024-07-30 17:37 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | straight line diagram · event attributes · editing · derived fields · export · event layers · experience builder |
| **Tools** | — |

## Summary

This user story describes the need for event editors to view and edit multiple LRS event attributes visualized in a straight line diagram based on measures along a route. It includes requirements for editable and non-editable fields, derived field calculations, UI behavior, export functionality, and configuration options for event layers. Testing scenarios and documentation updates are also outlined.

## Related documents

<!-- related:begin -->
- [Experience Builder Straight Line Diagram Event Attributes on Hover/Click](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-event-attributes-on-hover-click.md>) — similar text 0.58 · 6 title words · 5 filename words · same kind/surface/folder <!-- rel:348 s=8.755 -->
- [Experience Builder Straight Line Diagram Symbology and Display Field](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-sld-symbology-and-display-field.md>) — similar text 0.52 · 5 title words · 5 filename words · same kind/surface/folder <!-- rel:349 s=8.318 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.29 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:464 s=5.178 -->
- [Experience Builder Dynamic Segmentation Widget Additional Options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget-additional-options.md>) — similar text 0.35 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:361 s=5.066 -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-dynseg-widget.md>) — similar text 0.32 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:362 s=4.972 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder Straight Line Diagram Event Attributes/Editing on click <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to view and edit multiple LRS event attributes visualized in a diagram based on measures along the route, so I can view the relationships between different data layers attributes while editing.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). One workflow editors will utilize is to view event data in a straight-line diagram view where the layers are visualized, and gaps and overlaps can easily be identified.  In addition to being used for editing, this diagram will be utilized by many users throughout the organization as it will provide a visualization of event layers and how they align spatially along a route with each other.

## Acceptance Criteria
### Straight Line Diagram <!-- slide 3 -->
![Figure 1 — Straight Line Diagram](../media/exb-sld-event-attributes-editing-on-click/fig-01-slide-03-straight-line-diagram.png)

### Straight Line Diagram <!-- slide 4 -->
- In the SLD, when a user clicks a record (rectangle), show a pop up that shows the editable fields, the non editable fields, and calculated fields (if configured for the layer)
- The editable fields will include the non LRS attributes (speed limit, etc.) and some LRS attributes (From Date, To Date, Measure(s)) that users can change for the selected event
- The non editable fields will include the other LRS and system fields (RouteID, EventID, OID, etc.)
- The derived fields (first, last, min, max, average, median, mean) will need to be calculated when the user clicks on the record.  These calculations need to occur for this measure range across all time (note that the EventID may be different at this location across time)
- Users will need to click apply for these changes to be applied and for the UI to close
- They can also close the UI by clicking an X button.  If they close and there are unsaved changes, prompt the user whether they want to apply the changes or not.
- Support being able to export all this information using an export button (export the results as a CSV)

![Figure 2 — Straight Line Diagram](../media/exb-sld-event-attributes-editing-on-click/fig-02-slide-04-straight-line-diagram.png)

### Straight Line Diagram <!-- slide 5 -->
- Fit the pop up at up to 50% of the vertical space.  If it exceeds this number, provide a scrolling experience.
- If the location being clicked is at the beginning/end of two events, choose the upstream event and show its attribute(s)
- Highlight the event on the map when clicked; also highlight the record in the SLD so the user can see it selected
- Note that the click experience should work in both desktop and mobile
- To see the designs as reference, see https://www.figma.com/design/dIN1OfZDxhT7i9pbefdoTj/LRS?node-id=506-130104&t=wxNbCEfAcfChEXKx-0

![Figure 2 — Straight Line Diagram](../media/exb-sld-event-attributes-editing-on-click/fig-02-slide-04-straight-line-diagram.png)

### Configuration <!-- slide 6 -->
- Add the following configuration options to this story
  - For each event layer that is included in the SLD, provide an option to configure whether derived fields will be included (default is disabled for all fields)

## Testing
<!-- slide 7 -->
- Test with a mix of APR, RH data (INDOT cracking layer as one of the layers in the dynseg)
- Test with a mix or point, line, and spanning events
- Test a variety of non LRS attributes types configured (domains, ranges, contingent values, etc.)
- Test with derived fields for both point and line events
- Test with a number of different records over time in the same measure range to ensure derived fields are calculated correctly

## Automation
<!-- slide 8 -->
- Don’t automate the widget yet as this is the first of multiple user stories for this widget.

## Documentation
<!-- slide 9 -->
- Add to the existing topic created in the previous user story
- Focus specifically on this click option and what capabilities will be available to users (editing, export, derived fields)

## Assignment
### Story Points <!-- slide 10 -->
Story Points:
Dev:
PE:
