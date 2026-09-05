# Search by Route User Story and Configuration

|   |   |
| --- | --- |
| **Kind** | User Story · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [ExB_Searchbymeasure_station.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_Searchbymeasure_station.pptx>) |
| **Edited** | 2024-01-10 22:29 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search by Route User Story and Configuration"
source_file: "ExB_Searchbymeasure_station.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_Searchbymeasure_station.pptx"
doc_id: 438
doc_kind: "User Story"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Praveen Kumar"
last_edited: "2024-01-10T22:29:10Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["search by route", "route", "measure", "experience builder widget", "network configuration", "event editor"]
tools: ["Search by Route"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":380,"file":"search-by-line-and-measure-user-story__doc380.md","s":4.924},{"doc":529,"file":"search-by-route-and-measure-experience-builder-widget__doc529.md","s":4.771},{"doc":490,"file":"search-by-station-experience-builder-widget__doc490.md","s":4.751},{"doc":379,"file":"search-by-route-widget-configure-network-attribute-fields__doc379.md","s":4.121},{"doc":377,"file":"show-derived-network-information-in-search-by-route-widget__doc377.md","s":3.996}]
```
-->

## Summary

This document describes the user story and configuration details for the Search by Route Experience Builder widget. It covers the needs of event editors to search routes by route ID or name and measures, configuration options for networks and layers, UI behavior for single, multiple, and range measure searches, and testing and documentation plans.

## Related documents

<!-- related:begin -->
- [Search by Line and Measure User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-and-measure-user-story__doc380.md>) — similar text 0.46 · 1 title word · same kind/surface/folder <!-- rel:380 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-experience-builder-widget__doc529.md>) — similar text 0.38 · 2 title words · same kind/surface/folder <!-- rel:529 -->
- [Search by Station Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-station-experience-builder-widget__doc490.md>) — similar text 0.45 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:490 -->
- [Search by Route widget – configure network attribute fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-widget-configure-network-attribute-fields__doc379.md>) — similar text 0.36 · 2 title words · same kind/surface/folder <!-- rel:379 -->
- [Show Derived Network Information in Search by Route Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/show-derived-network-information-in-search-by-route-widget__doc377.md>) — similar text 0.28 · 2 title words · same kind/surface/folder <!-- rel:377 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Search by Route

User Story

## Slide 2 — User Story

As an Event Editor, I need the ability to search for a specific route and measure combination or station(s), so that I can properly location and orient myself for LRS editing and analysis.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to search for routes and measures or station(s) to orient themselves on the map in preparation for event editing.

## Slide 3 — Configuration

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide3_fig1.svg)
![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide3_fig2.svg)

Clicking on the import all button should load all networks from the map.
Initial state of the configuration tool
Choose the map from the 'Select a map' dropdown.
Should be able to change the Label
When a layer is selected show the Layer configuration
Should be able to enable or disable the methods to show in dropdown
Should be able to sort the results by the selected field
default is RouteId  and RouteName for the line network
Should be able to set the search identifier default is RouteId
and  RouteName for the line network
Should be able to set the default method
Should be able to set sort for ascending or descending
Should be able to set the highlight color and width for the feature
Should be able to set the number of records to display in the search results page
Should be able to control the display of method in the UI
Should be able to control the display of Netrwork parameter in the UI
Set the default network if there are more than one network in the map
New
New

![image2.png](../media/doc514_image2.png) ![image3.png](../media/doc514_image3.png) ![image4.png](../media/doc514_image4.png)

## Slide 4 — Configuration

Should be able to set the desired style settings
Should be able to enable or disable data actions
Should be able to set the symbols for the feature to display on map
Should be able select or deselect the data actions

![image5.png](../media/doc514_image5.png) ![image6.png](../media/doc514_image6.png) ![image7.png](../media/doc514_image7.png)

## Slide 5 — Configuration

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide5_fig1.svg)
![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide5_fig2.svg)

- Should be able to import all the Network layers from the map using the Import all button.
- Provide a message when user clicks on Import all without selecting the map.
- If there is no LRS enabled service in the webmap, provide a message that no LRS enabled service is present.
- Should be able to reorder the imported layers.
- Allow only importing from a single map (if another map is chosen then clear the present layers before importing layers from different map).
- Provide an error message if there are no Network layers in map.
- Provide a message if the map has layers from more than one service.
- If there are more than one web map, list all those in the ‘Select a map’ dropdown.
- Should be able to remove any layer using x button next to the layer.
- Should be able to set the Highlight color and width for the selected feature.
- Should be able to set the number of records to display in the results page (page size).
- Should be able to control the display of Method parameter.New
- Should be able to set the default Network (if only one network available choose it by default). New
- Should be able to control the display of Network parameter. New

![image8.png](../media/doc514_image8.png) ![image3.png](../media/doc514_image3.png)

## Slide 6 — Network Configuration

- Layer configuration should be displayed when a layer is selected.
- Should be able to change the label for the layer.
- ‘Route and Measure’ should be default for the search methods.
- Should be able to show / hide different Search methods.
- Should be able to set the search identifier for the Network (RouteID/ RouteName).
- RouteID should be default identifier for nonline network.
- RouteName should be default identifier for line network.
- Multifield  route ID should be default identifier for multifield routeid network.
- Should be able to set the sort field for the Network(RouteID/ RouteName).
- Should be able add the sort by single or multiple fields. New
- Multiple sort fields should be able to add using the ‘Add a sort field’ button. New
- Should be able to set the sort to ascending or descending for each sort field. New
- Allow the user to choose whether the routeID, route name, or the multi fields that make up the concatenated routeID appear when the widget it launched

![image4.png](../media/doc514_image4.png)

## Slide 7 — Network Configuration

- When the identifier is set for Multi field route ID, allow the fields to select / deselect to show in the UI.
- Allow reordering the identifier fields.
- Provide option to set the label color (route and measure) New

## Slide 8 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide8_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 1 button, 2 icons, 10 text rows. 10 of 10 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide8_fig2.svg)

- Create an Experience Builder widget called Search by Route that will allow the user to search for an entire route or a portion of a route.
- Allow the user to populate the RouteID or Route Name (either a single field or the composite fields depending on the configuration) as well as the From and To Measure in the UI.
- The RouteID/Route Name is required, the measures are optional.
- The user can search for a single measure, multiple measures on the route or a range. New
- Provide an intellisense experience for the RouteID/RouteName.
- Allow wild card search (please use pro standard wildcards) New
- Measures should be in whatever unit is configured for the LRS Network.
- Measures can be in stationing format (0+00).
- If the route is invalid, provide a message that the route could not be found.
- If the measure(s) are invalid, provide a message that the measures could not be found on the route.
- Mark the required parameters with an *. New
- If there are multiple networks allow the user to change the network using the pencil button.
- If there are multiple methods allow the user to change the method using the pencil button.

![image10.png](../media/doc514_image10.png)

## Slide 9 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide9_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 1 button, 8 text rows. 8 of 8 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide9_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 1 button, 1 icon, 8 text rows. 8 of 8 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide9_fig3.svg)

- If the Method is configured to hide, then do not show the method parameter in the UI and use the default method set for the Network.New
- If the Network is configured to hide, then do not show the Network parameter in the UI and use the default Network for search.New
- If there are multiple networks allow the user to change the network using the pencil button.
- If the Method and Network are configured to hide, then do not show the Method or Network parameter in the UI and use the default method set for the Network and default network.New
- Use field alias in the configuration and widget.New

![image13.png](../media/doc514_image13.png)

## Slide 10 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide10_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 field, 1 button, 3 icons, 25 text rows. 21 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide10_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 1 button, 6 text rows. 6 of 6 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide10_fig3.svg)

- Search button should be disabled until required parameters are provided.
- With Single option, When the user enter routeid and clicks search do the following:
  - Find the route(s)
  - Transition the widget to a results pane that shows the route(s) that are returned by the search.
- When a record is selected from the results:
  - Zoom to that route on the map
  - Highlight the route
  - Display route label (as per cartographic standards, for example do not place overlapping labels) New

549095

![image13.png](../media/doc514_image13.png)

## Slide 11 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide11_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 1 button, 4 icons, 18 text rows. 16 of 18 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide11_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 5 fields, 1 button, 2 icons, 14 text rows. 13 of 14 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide11_fig3.svg)

- If Multiple is chosen, then show two measure boxes.New
- If the user wants to locate more than two measures / stations on the route, they can use the ‘Add Another Measure’ button and another box will appear in the UI.New
- The additional measures can be removed using the x button which is visible on hover.New
- When the user enters routeid and measure(s), clicks search do the following:
  - Find the route and measure(s)
  - Transition the widget to a results pane that shows the route(s) that are returned by the search.
- When a record is selected from the results:
  - Zoom to that route and measure on the map
  - Highlight the route and the single measure location
  - Display route and measure label (as per cartographic standards, for example do not place overlapping labels) New
- Measures can be in either US (0+00.00) or Metric (0+000.00) stationing format

0.05

![image17.png](../media/doc514_image17.png)

## Slide 12 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide12_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 3 fields, 1 button, 2 icons, 11 text rows. 11 of 11 text rows carry text transcribed from the screenshot (OCR, approximate); positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide12_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 1 field, 1 button, 5 icons, 23 text rows. 22 of 23 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide12_fig3.svg)

- If Range is chosen, then show From measure and To Measure
- When the user provides route and range information and clicks search do the following:
  - Find the route and measure range
  - Transition the widget to a results pane that shows the route(s) that are returned by the search.
- When a record is selected from the results:
  - Zoom to that route and measure range on the map
  - Highlight the route and measure range
  - Display route and measures label (as per cartographic standards, for example do not place overlapping labels) New
  - Display an arrow at the end to denote the direction. New

0.05
0

![image18.png](../media/doc514_image18.png) ![image19.png](../media/doc514_image19.png)

## Slide 13 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide13_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 7 fields, 1 button, 15 text rows. 13 of 15 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc514_slide13_fig2.svg)

- If the network is configured for Multifield RouteId, show the fields (selected in the configuration) in the UI.
- If the user provides values in one or more fields and clicks search, then find the matching routes and display in the results pane.

## Slide 14 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide14.svg)

- Test with a mix of APR and RH data
- Test on projected and unprojected data
- Test with both networks with RouteID and RouteName configured
- Test with network with different units of measure configured
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/l18n testing
- Test with different themes
- Test on a variety of route shapes to ensure the stations are found at the correct location on the route
- Test in Chrome, Edge, Firefox.
- Test in different sizes (web, tab and mobile).
- Test the config and UI holistically (including existing and new functionalities)

Testing

## Slide 15 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide15.svg)

Automate the tool following the process outlined by Lakshmi in her spike earlier this year
Automation

## Slide 16 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide16.svg)

- Create a documentation topic for this widget that follows the same format used in https://doc.arcgis.com/en/experience-builder/11.1/configure-widgets/widgets-overview.htm
- Create a separate topic for search by route in the identified location
- Make sure to include graphic examples in the doc.
Documentation

## Slide 17 — Search by Route

![Diagram drawn from the slide's own shapes: 4 nodes, 1 connector.](../media/doc514_slide17.svg)

Story Points:
Dev:
PE:
Assignment
