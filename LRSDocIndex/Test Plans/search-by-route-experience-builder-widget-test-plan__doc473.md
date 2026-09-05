# Search by Route Experience Builder Widget Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Source** | [ExB_Searchbyroute_Testplan.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_Searchbyroute_Testplan.docx>) |
| **Edited** | 2023-10-27 21:41 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search by Route Experience Builder Widget Test Plan"
source_file: "ExB_Searchbyroute_Testplan.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_Searchbyroute_Testplan.docx"
doc_id: 473
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Praveen Kumar"
last_edited_by: "Praveen Kumar"
last_edited: "2023-10-27T21:41:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["search by route", "experience builder widget", "network layers", "layer configuration", "route id", "route name", "measure", "data actions", "widget style"]
tools: ["Search by Route"]
products: []
issues: []
related: [{"doc":423,"file":"search-by-route-and-station-test-plan__doc423.md","s":7.28},{"doc":462,"file":"search-route-exb-widget-search-by-station-method-test-plan__doc462.md","s":5.937},{"doc":363,"file":"search-by-line-test-plan__doc363.md","s":4.52},{"doc":529,"file":"search-by-route-and-measure-experience-builder-widget__doc529.md","s":4.269},{"doc":463,"file":"experience-builder-add-single-point-event-widget__doc463.md","s":3.624}]
```
-->

## Summary

Test plan for the Search by Route widget in Experience Builder covering configuration, style, layer setup, and search functionality. Includes verification of map and network layer imports, data actions, style options, layer configuration, and search behavior with positive and negative test cases. Cross-browser and device size compatibility are also tested.

## Related documents

<!-- related:begin -->
- [Search by Route and Station Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-route-and-station-test-plan__doc423.md>) — similar text 0.75 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:423 -->
- [Search Route ExB Widget - Search by Station Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-route-exb-widget-search-by-station-method-test-plan__doc462.md>) — similar text 0.31 · 3 title words · same kind/surface/folder <!-- rel:462 -->
- [Search by Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-line-test-plan__doc363.md>) — similar text 0.34 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:363 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-experience-builder-widget__doc529.md>) — similar text 0.15 · 5 title words · same surface <!-- rel:529 -->
- [Experience Builder: Add Single Point Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/experience-builder-add-single-point-event-widget__doc463.md>) — similar text 0.21 · 3 title words · same kind/surface/folder <!-- rel:463 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

00Configuration
Content page:

- Verify the map dropdown lists all the maps from all the pages.
- Verify any map can be selected from the list.
- Click import all and verify all the Network layers from the selected map are imported.
- Verify the reordering of the imported layers.
- Verify the layer is removable using ‘x’ of the respective layer.
- Changing map and importing again should clear present list of layers and import the Network layers from the new map.
- Verify the default selection highlight color is cyan.
- Change the color and verify the set color is reflected when we select a record in the results pane.
- Change the width for the selected features and verify it is reflected when we select a record in the results pane.
- Set the page size for the results pane and verify the results are displayed as per the settings.
- Test Importing Nonline, line and postmile networks.
Negative:

- Click on Import all button without selecting a map and verify an error message is displayed.
- Choose a map which does not have any layers and verify an error message is displayed.
- Choose a map which does not have any LRS Network layers and verify an error message is displayed.
- Enter 0 and negative values for the width and verify that it does not accept.
- Enter less than 5 for the page size and ensure that the values are not accepted.

00Action

- Test all the Data actions
- Verify that only the selected data actions are visible in the results pane when a record is selected.
- Disable data action and verify that the actions are not shown when a record is selected from results pane.

00
Style page

- Test all the align options.
- Test all the arrange options.
- Test changing the width and height of the widget.
- Test with different rotation angles (positive and negative).
- Test all the animation options.
- Test all borders.
- Test all box shadows.
- Test the margin settings.

Negative :

- Negative values should not be accepted for width and height.
- Test that the values more than 360 deg is not accepted for rotation.

Layer Configuration:

001.Verify that the layer configuration is displayed when a layer is selected.

- Change the label for the layer and verify if in the widget.
- Verify ‘Route and Measure’ is default for the search methods.
- Verify that the Search methods is disabled (until other methods are supported)
- Test with different identifier (RouteID/ RouteName).
- Test different result sorting fields (RouteID/ RouteName).
- Test ascending and descending sorting.
- RouteID should be default identifier for nonline network.
- RouteName should be default identifier for line network.
- Multifield should be default identifier for multifield routeid network.

Search

00Verify that the Method is disabled (until other methods are supported)

- Verify the values in the Network drop down is as per the layer order in the configuration
- Verify the RouteName / RouteId or multi fields are shown as per the configuration for the respective network
- Verify that the measure units are as per the network m unit.
- Verify that the search button is disabled until a valid RouteName or RouteID is provided.
- Search only using the RouteName / RouteID value.
- Search only using the RouteName / RouteID and From Measure value.
- Search only using the RouteName / RouteID and To Measure value.
- Verify that the search fields for multi filed route id network is as per the configuration.
- Provide measures in stationing format and search.
- Verify that the intellisense experience is shown for RouteName / RouteID  field after 3 characters are entered.
- Switch to a version and verify that the search results are honoring the version.
- Set time and verify that the search results are honoring the time frame.
- Test in Chrome, Edge, Firefox.
- Test in different sizes (web, tab and mobile).
- Verify that the search results show only the measure range when searched with from and to measures.
- When a record is selected from search result, verify that the selected record can be viewed in table (through actions).
- Ensure that the field alias is used in the widget.
Negative:

- Provide invalid route id / routename and verify the error message.
- Provide invalid from measure and verify the error message (like text, special characters).
- Provide invalid to measure and verify the error message (like text, special characters).
- For multi filed search provide invalid data type and verify the error message for each field.
Note:

- Integration with Add point event and Add line event will be tested after the add events are implemented.
- Look out for errors in Console of developer tools.
- Max selection width is limited to 15.

![image1.png](../media/doc475_image1.png) ![image10.png](../media/doc475_image10.png) ![image2.png](../media/doc475_image2.png) ![image20.png](../media/doc475_image20.png) ![image3.png](../media/doc475_image3.png) ![image30.png](../media/doc475_image30.png) ![image4.png](../media/doc475_image4.png) ![image40.png](../media/doc475_image40.png) ![image5.png](../media/doc475_image5.png) ![image50.png](../media/doc475_image50.png)
