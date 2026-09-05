# Search by Route and Station Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 423 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB_Searchbyroute_station_Testplan.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_Searchbyroute_station_Testplan.docx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-02-20 21:38 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | search by route · station · experience builder · widget testing · layer configuration · route identification · measure validation |
| **Tools** | Search by Route |

## Summary

This document outlines test cases for the Search by Route and Station widget in Experience Builder. It covers configuration, style, layer setup, search functionality, and negative test scenarios to verify correct behavior and error handling. The tests ensure proper UI behavior, data actions, search methods, and measure handling across different network types and data formats.

## Related documents

<!-- related:begin -->
- [Search by Route Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-route-exb-widget.md>) — similar text 0.75 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:473 s=7.28 -->
- [Search Route ExB Widget - Search by Station Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/15947-search-route-exb-widget-search-by-station-method.md>) — similar text 0.35 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:462 s=6.082 -->
- [Search by Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-line.md>) — similar text 0.49 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:363 s=4.425 -->
- [Search by Coordinate Method in Route Search Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16322-search-by-coordinate-method-in-route-search-widget.md>) — similar text 0.13 · 2 title words · same kind/surface/folder <!-- rel:458 s=3.835 -->
- [Search by Route](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route__doc438.md>) — similar text 0.36 · 2 title words · 1 filename word · same surface <!-- rel:438 s=3.628 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview
00Configuration

### Content page:

1. Verify the map dropdown lists all the maps from all the pages.

1. Verify any map can be selected from the list.

1. Click Load Layers and verify all the layers from the selected map are imported.

1. Verify the reordering of the imported layers.

1. Verify the layer is removable using ‘x’ of the respective layer.

1. Changing map and loading again should clear present list of layers and import the layers from the new map.

1. Verify the default selection highlight color is cyan.

1. Change the highlight color and verify the set color is reflected when we select a record in the results pane.

1. Change the width for the selected features and verify it is reflected when we select a record in the results pane.

1. Change the label color and verify the set color is reflected when we select a record in the results pane.

1. Change the label size for the selected features and verify it is reflected when we select a record in the results pane.

1. Set the page size for the results pane and verify the results are displayed as per the settings.

1. Set the default network and verify it is honored while launching the widget (if only one network available verify that it is chosen by default).

1. Hide method and verify that the method is not visible in the widget.

1. Hide network and verify that the network is not visible in the widget.

1. Test Importing Nonline, line and postmile networks.

## Test Cases

### TC-N01 — Click on Import All Button Without Selecting a Map and Verify an Error Message <!-- src: S6 · case 1 -->

- **Case:** Click on Import all button without selecting a map and verify an error message is displayed.

### TC-N02 — Choose a Map Which Does Not Have Any Layers and Verify an Error Message <!-- src: S6 · case 1 -->

- **Case:** Choose a map which does not have any layers and verify an error message is displayed.

### TC-N03 — Choose a Map Which Does Not Have Any LRS Network Layers and Verify an Error <!-- src: S6 · case 1 -->

- **Case:** Choose a map which does not have any LRS Network layers and verify an error message is displayed.

### TC-N04 — Choose a Map Which Has Multiple Services and Verify an Error Message <!-- src: S6 · case 1 -->

- **Case:** Choose a map which has multiple services and verify an error message is displayed.

### TC-N05 — Enter 0 and Negative Values for the Width and Verify That It Does Not Accept. <!-- src: S6 · case 1 -->

### TC-N06 — Enter Negative Values for the Label Size and Verify That It Does Not Accept. <!-- src: S6 · case 1 -->

00Action

1. Test all the Data Actions

1. Verify that only the selected data actions are visible in the results pane when a record is selected.

### TC-N07 — Disable Data Action and Verify That the Actions Are Not Shown When a Record <!-- src: S6 · case 1 -->

- **Case:** Disable data action and verify that the actions are not shown when a record is selected from results pane.

00
Style page

1. Test all the align options.

1. Test all the arrange options.

1. Test changing the width and height of the widget.

1. Test with different rotation angles (positive and negative).

1. Test all the animation options.

1. Test all borders.

1. Test all box shadows.

1. Test the margin settings.

### TC-N08 — 1. For Range measures, verify that when a record is selected from the results <!-- src: S5 · label 1. For Range measures, verify that when a record is selected from the results -->

**Steps:**
1. Zoom to that route and measure range on the map.
2. Highlight the route and the measure range.
3. Display route and measure label.
4. Display an arrow at the end to denote the direction.

### TC-N09 — Provide Invalid Route Id / Routename and Verify the Error Message. <!-- src: S6 · case 1 -->

### TC-N10 — Provide Invalid From Measure and Verify the Error Message (like Text <!-- src: S6 · case 1 -->

- **Case:** Provide invalid from measure and verify the error message (like text, special characters).

### TC-N11 — Provide Invalid To Measure and Verify the Error Message (like Text <!-- src: S6 · case 1 -->

- **Case:** Provide invalid to measure and verify the error message (like text, special characters).

### TC-N12 — For Multi Filed Search Provide Invalid Data Type and Verify the Error Message <!-- src: S6 · case 1 -->

- **Case:** For multi filed search provide invalid data type and verify the error message for each field.

### TC-N13 — Max Selection Width Is Limited To 15. <!-- src: S6 · case 1 -->

### TC-N14 — Labels Won’t Be Visible If the Label Size Is Set To 0. <!-- src: S6 · case 1 -->

### TC-N15 — Page Size Cannot Be Less Than 5. <!-- src: S6 · case 1 -->

1.

![Figure 1 — Note:](../media/search-by-route-and-station/fig-01-note.png)
![Figure 2 — Note:](../media/search-by-route-and-station/fig-02-note.png)
![Figure 3 — Note:](../media/search-by-route-and-station/fig-03-note.png)
![Figure 4 — Note:](../media/search-by-route-and-station/fig-04-note.png)
![Figure 5 — Note:](../media/search-by-route-and-station/fig-05-note.png)
![Figure 6 — Note:](../media/search-by-route-and-station/fig-06-note.png)
![Figure 7 — Note:](../media/search-by-route-and-station/fig-07-note.png)
![Figure 8 — Note:](../media/search-by-route-and-station/fig-08-note.png)
![Figure 9 — Note:](../media/search-by-route-and-station/fig-09-note.png)
![Figure 10 — Note:](../media/search-by-route-and-station/fig-10-note.png)
![Figure 11 — Note:](../media/search-by-route-and-station/fig-11-note.png)
![Figure 12 — Note:](../media/search-by-route-and-station/fig-12-note.png)

## Other content

### Negative :

1. Negative values should not be accepted for width and height.

1. Test that the values more than 360 deg is not accepted for rotation.

00Layer Configuration:

1. Verify that the layer configuration is displayed when a Network layer is selected.

1. Change the label for the layer and verify if in the widget.

1. Verify ‘Route and Measure’ is default for the search methods.

1. Verify that the Search methods can be enabled / disabled.

1. Verify all the options for search measures are enabled by default.

1. Verify that the Search measures can be enabled / disabled.

1. Enable only one search measure type and verify that the UI is changed accordingly.

1. Test with different identifier (RouteID/ RouteName).

1. Test different result sorting fields (RouteID/ RouteName).

1. Verify that the results can be sorted using multiple fields.

1. Test ascending and descending sorting.

1. RouteID should be default identifier for nonline network.

1. RouteName should be default identifier for line network.

1.
00Verify that the ‘Expand by default’ is enabled and the results are shown in expanded format.

1. Disable the ‘Expand by default’ and verify that the results are not shown in expanded format.

1. Multifield should be default identifier for multifield routeid network.

1. Verify that the identifier fields can be reordered.

1. Verify that the identifier fields can be selected / deselected to show in the UI.

1. Verify that the field alias is used in the configuration.

1. Verify that the search measures are not shown if the Route and Measure is disabled in the methods.

Search

1.
00Verify that the Method is as per the settings in the configuration.

1. Verify the values in the Network drop down is as per the layer order in the configuration.

1. Verify the RouteName / RouteId or multi fields are shown as per the configuration for the respective network.

1. Verify that the measure units are as per the network m unit.

1. Verify that the search button is disabled until a valid RouteName or RouteID is provided.

1. Search only using the RouteName / RouteID value for all the search measure types.

1.
00Choose Single and search using the RouteName / RouteID and Measure value.

1. Choose Multiple and search using the RouteName / RouteID and multiple measure values.

1.
00Choose Range and search using the RouteName / RouteID and From and To Measure values.

1. Choose Range and search only using the RouteName / RouteID and From Measure value.

1. Choose Range and search only using the RouteName / RouteID and To Measure value.

1. Verify that the search fields for multi filed route id network is as per the configuration.

1. Provide measures in stationing format and search.

1.
00Verify that the intellisense experience is shown for RouteName / RouteID field after 3 characters are entered.

1. Switch to a version and verify that the search results are honoring the version.

1. Set time and verify that the search results are honoring the time frame.

1. Test in Chrome, Firefox.

1. Test in varied sizes (web, tab and mobile).

1. Verify that the search results show only the measure range when searched with from and to measures.

1. When a record is selected from search result, verify that the selected record can be viewed in table (through actions).

1. Ensure that the field alias is used in the widget.

1. Perform search using some wild cards like (_,%).

1. Verify that the all the required parameters are marked with *.

1. If there are multiple networks, verify that the network can be changed using the pencil button.

1. If there are multiple methods, verify that the method can be changed using the pencil button.

1. Verify that the field alias is used in the widget.

1. If the Method is configured to hide, verify it is not shown in the UI and it is using the default method set for the Network.

1. If the Network is configured to hide, verify it is not shown in the UI and it is using the default Network for search.

1. If the Method and Network are configured to hide, verify it is not shown in the UI and using the default method set for the Network and default network.

1. Verify the results are displayed as per the page size settings.

1. For single and multiple measures, verify that when a record is selected from the results:

- Zoom to that route and measure on the map.
- Highlight the route and the measure location.
- Display route and measure label.

1. Verify that the results Include from and to dates along with routeid and measures.

1. Test with Postmile, APR and RH data.

1. Test on projected and unprojected data.

1. Test with different themes.

1. Test on a variety of route shapes to ensure the stations are found at the correct location.

1. Verify that measures can be provided in US (0+00.00) stationing format.

1. Verify that measures can be provided in Metric (0+000.00) stationing format.
