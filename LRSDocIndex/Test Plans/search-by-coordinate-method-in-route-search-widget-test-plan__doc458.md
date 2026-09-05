# Search by Coordinate Method in Route Search Widget Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16322](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16322) |
| **Source** | [16322-SearchbyCoordinate_TestPlanV3.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/16322-SearchbyCoordinate_TestPlanV3.pptx>) |
| **Edited** | 2023-11-27 22:31 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search by Coordinate Method in Route Search Widget Test Plan"
source_file: "16322-SearchbyCoordinate_TestPlanV3.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/16322-SearchbyCoordinate_TestPlanV3.pptx"
doc_id: 458
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: "V3"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-11-27T22:31:38Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route search", "coordinate input", "search method", "results pane", "spatial reference", "route concurrency", "time filter"]
tools: ["Route Search widget"]
products: []
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#16322"]
related: [{"doc":487,"file":"search-by-coordinate-experience-builder-widget__doc487.md","s":4.828},{"doc":456,"file":"exb-search-by-referent-test-plan__doc456.md","s":3.896},{"doc":49,"file":"coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md","s":3.353},{"doc":490,"file":"search-by-station-experience-builder-widget-user-story__doc490.md","s":3.142},{"doc":859,"file":"lrs-identify-show-coordinates-in-results-experience-builder-widget-test-plan__doc859.md","s":3.061}]
```
-->

## Summary

Test plan for the Search by Coordinate method added to the Route Search widget. It covers configuration, UI behavior, input validation, and results handling for coordinate-based route searches across various network types, spatial references, and route complexities. The plan includes positive and negative test cases verifying correct route and measure returns based on coordinate inputs and time filters.

## Related documents

<!-- related:begin -->
- [Search by Coordinate Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-coordinate-experience-builder-widget__doc487.md>) — similar text 0.29 · 3 title words · 2 filename words · same surface <!-- rel:487 -->
- [ExB Search By Referent – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/exb-search-by-referent-test-plan__doc456.md>) — similar text 0.20 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:456 -->
- [Coordinates Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/coordinates-method-in-add-point-and-add-line-widgets-test-plan__doc49.md>) — similar text 0.18 · 1 title word · same kind/surface/folder <!-- rel:49 -->
- [Search by Station Experience Builder widget User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-station-experience-builder-widget-user-story__doc490.md>) — similar text 0.17 · 2 title words · 1 filename word · same surface <!-- rel:490 -->
- [LRS Identify: Show Coordinates in Results Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/lrs-identify-show-coordinates-in-results-experience-builder-widget-test-plan__doc859.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:859 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set a time filter](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/set-a-time-filter.html)

_No page matched:_ [Route Search widget](https://www.google.com/search?q=%22Route%20Search%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 button, 12 text rows. 8 of 12 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc490_slide1.svg)

Search by Coordinate Method in Route Search Widget

| Notes |
| --- |
| Add Coordinates method to Route Search widget Test with line and non-line networks, including PoM Test with auto-generated, single-field, and multi-field RouteID configurations Test with RouteName vs. RouteID configured Test on simple and complex route shapes Test with projected and unprojected data Test on a variety of spatial references Test coordinate inputs both on a route and close to a route Test input coordinates on intersections and concurrencies of routes in the same network Test with different themes Test with custom coordinate system Configuration of widget should be similar to Route and Measure search method X and Y must be provided, Z is optional Test in Chrome and Edge (other browsers will be covered in automation) Test I18n and accessibility Test with Web, Tablet, and Mobile configurations |

Devtopia Issue

![image1.png](../media/doc490_image1.png)

## Slide 2

| Positive Tests: Configuration |
| --- |
| Coordinates appears in the Search Method parameter and can be chosen Route and Measure is still the default Search Method Spatial Reference defaults to Web Map’s spatial reference. Spatial reference of actual LRS Network feature class in the EGDB can be chosen for the Spatial Reference configuration parameter User can choose between only the LRS spatial reference and the Web Map spatial reference |

| Positive Tests: UI |
| --- |
| User can change Search Method to Coordinates Upon opening the Route Search widget, Coordinates is chosen as the Search Method when it is chosen as the default Search Method User can change the network to other valid LRS networks imported from the Web Map Specified network is chosen by default when configured to be chosen as the default network |

| Negative Tests: UI |
| --- |
| Coordinates Search Method is not enabled/configured and is unavailable Invalid X Coordinate input (must be a number) Input X Coordinate is out of the range of the spatial reference (example: input is ) Invalid Y Coordinate input (must be a number) Input Y Coordinate is out of the range of the spatial reference (example: input is ) Invalid Z coordinate input (must be a number) Input Z Coordinate is out of the range of the spatial reference (example: input is ) No coordinates provided (X and Y Coordinate must be input before tool can be ran) LRS Network feature class has no features |

| Positive Tests: Results Pane |
| --- |
| Transition the widget to a results pane after clicking Search If multiple results are returned, a scroll bar will appear in the results pane The configured number of results returned per page is the same as the configuration setting Return a list of all the route(s) and measure(s) found at the input coordinate location in the Results pane If no routes or measures are found at the exact location of the input coordinates, return the closest route(s) and measure(s) and the distance from the input coordinate location |

## Slide 3

| Positive Tests |
| --- |
| Input coordinate location on route returns one route Input coordinate location offset from route returns nearest route Input coordinate location returns multiple locations on the same complex route (route intersects itself and this self-intersection is the location or closest location to the input coordinate location) Input coordinate location returns one route on a vertical route Input coordinate location returns multiple locations on concurrent routes Input coordinate location returns multiple locations on intersecting routes Input coordinate location includes a z coordinate, but route is not 3D. Returned route is found with distance from route accurate to the 3D distance from the route Input coordinate location has equidistant routes found. Both equidistant routes will be returned in the search Input coordinate location is 500+ miles away from the nearest route. The nearest route will be returned in the search Input coordinate location returns different results based on the time filter |

## Slide 4

1. Input coordinate location on route returns one route

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 5 | 0 |

2. Input coordinate location offset from route returns nearest route

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 5 | 20 |

[figure: Input: · 0 · 10 · Output: · Route 1]

## Slide 5

3. Input coordinate location returns multiple locations on the same complex route (route intersects itself and this self-intersection is the location or closest location to the input coordinate location)

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | Plastic | Low pressure | 2.5 | 0 |
| Route 1 | 1/1/2000 | <Null> | Plastic | Low pressure | 7.5 | 0 |

4. Input coordinate location returns one route on a vertical route

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | Plastic | Low pressure | 5 | 0 |

[figure: Input: · 0 · 10 · Output: · Route 1]

## Slide 6

5. Input coordinate location returns multiple locations on concurrent routes

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 7 | 0 |
| Route 2 | 1/1/1990 | <Null> | County | Major | 3 | 0 |
| Route 3 | 1/1/2020 | <Null> | Local | Minor | 25 | 0 |

6. Input coordinate location returns multiple locations on intersecting routes

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 5 | 0 |
| Route 2 | 1/1/1990 | <Null> | County | Major | 11 | 0 |

[figure: Input (routes overlap): · 0 · 10 · Output: · Route 1 · Route 2 · Route 3 · 30 · 15]

## Slide 7

7. Input coordinate location includes a z coordinate, but route is not 3D. Returned route is found with distance from route accurate to the 3D distance from the route

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 5 | 15 |

8. Input coordinate location has equidistant routes found. Both equidistant routes will be returned in the search

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 8 | 10 |
| Route 2 | 1/1/1990 | <Null> | County | Major | 2 | 10 |

[figure: Input: · 0 · 10 · Output: · Route 1 · Route 2]

## Slide 8

9. Input coordinate location is 500+ miles away from the nearest route. The nearest route will be returned in the search

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | <Null> | State | Highway | 8 | 2640000 |

10. Input coordinate location returns different results based on the time filter

Route 1 (2005-<Null>)
Output (Time Filter is set to 1/1/2002):

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2000 | 1/1/2005 | State | Highway | 5 | 0 |

Output (Time Filter is set to 1/1/2020):

| Route Name | From Date | To Date | Attribute1 | Attribute2 | Measure | Distance (ft) |
| --- | --- | --- | --- | --- | --- | --- |
| Route 1 | 1/1/2005 | <Null> | Federal | Interstate | 25 | 0 |

[figure: Input: · 0 · 10 · Output: · Route 1 · 500 mi · Route 1 (2000-2005) · 20 · 30]
