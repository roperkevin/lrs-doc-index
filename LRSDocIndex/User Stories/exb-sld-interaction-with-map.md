# Experience Builder SLD Interaction with Map

| Field | Value |
| --- | --- |
| **Doc** | 191 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB - SLD Interaction with Map.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB%20-%20SLD%20Interaction%20with%20Map.pptx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-04-16 16:09 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | straight line diagram · dynamic segmentation · map interaction · event editor · route navigation · arcgis enterprise |
| **Tools** | Dynamic Segmentation · Straight Line Diagram · Map Widget |

## Summary

Describes a user story for event editors to interact with the map while using the Straight Line Diagram (SLD) in ArcGIS Enterprise. Details the dynamic segmentation widget's interaction with the map, including panning, zooming, and scrolling behaviors to keep the SLD aligned with the map. Includes testing, automation, and documentation considerations for this functionality.

## Related documents

<!-- related:begin -->
- [Experience Builder Flatten SLD Results and Make Ruler 10 tick marks](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-flatten-sld-results-and-make-ruler-10-tick-marks.md>) — similar text 0.33 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:187 s=4.836 -->
- [Experience Builder Support Multiple LRS Services in Web Map](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/exb-support-multiple-lrs-services-in-web-map.md>) — similar text 0.23 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:178 s=4.554 -->
- [Dynamic Segmentation: SLD Interaction with Map Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/24788-dynseg-sld-interaction-with-map.md>) — similar text 0.35 · 3 title words · 1 filename word · same surface <!-- rel:175 s=4.317 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-exb-widgets.md>) — similar text 0.27 · 2 title words · same kind/surface/folder <!-- rel:193 s=4.001 -->
- [Experience Builder Time and Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/exb-time-and-versioning-widget.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:167 s=3.895 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Map Widget](https://www.google.com/search?q=%22Map%20Widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Experience Builder SLD interaction with the map <!-- slide 1 -->
User Story
ArcGIS Enterprise

### User Story <!-- slide 2 -->
As an event editor, I need the ability to utilize the map to navigate along SLD results for a route, so I can easily use other map layers to guide the locations of SLD results I want to see.
Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.). When using the SLD, the users want to interact with the map.  This will allow them to use other layers in the map, like reference layers, to easily navigate to locations along the route and see the SLD results for the area.

## Acceptance Criteria
### Dynamic Segmentation widget map interaction <!-- slide 3 -->
- Link the dynamic segmentation widget with the map widget (the map widget will always be present so no need to make any configuration option)
- In the SLD,
  - If the user double clicks the ruler, pan the map to that location
  - If the user changes the scale level, have the map zoom in/out to match it
  - If the user uses the horizontal scroll bar to move upstream/downstream on the route, have the map move to stay in alignment (wait for 1 second until the scrolling is complete to update)
- In the map, if an SLD is open with results,
  - If the user pans the map, have the SLD move to stay in alignment
  - If the user zooms the map, have the SLD zoom to a scale to align with the measure range of the route in the map
  - If the pan/zoom results in the route no longer being in the map, have the SLD move to nearest measure range (beginning/end of the route)
  - If the zoom is to a scale larger than the max zoom of the SLD, take the SLD to the max scale as allowed

## Testing
<!-- slide 4 -->
- Test with a mix of APR, RH data, and Postmile data (sanity only)
- Test all the supported operations for map interaction (using the buttons that come with the map widget along with mouse and keyboard actions to pan/zoom/move the map)
- Test with an SLD with dozens of layers to ensure performance is good when interacting

## Automation
<!-- slide 5 -->
- Add a few automation cases to the existing automation for the widget

## Documentation
<!-- slide 6 -->
- In the Dynamic Segmentation widget documentation, mention interaction with the map and consider adding a list/table of operations that are supported

## Assignment
### Story Points <!-- slide 7 -->
Story Points:
Dev:
PE:
