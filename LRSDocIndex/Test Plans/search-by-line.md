# Search by Line Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 363 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB_SearchbyLine_Testplan.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_SearchbyLine_Testplan.docx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-05-23 21:10 by Praveen Kumar |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | search by line · line network · line identifier · measure range · route identifier · search measures · experience builder |
| **Tools** | Search by Route widget · Experience Builder widget |

## Summary

This test plan covers the verification of the Search by Line functionality in the Experience Builder widget. It includes tests for layer configuration, search methods, UI behavior, sorting, measure formats, and various search scenarios including single, multiple, and range measures. Negative test cases for invalid inputs and edge cases are also included.

## Related documents

<!-- related:begin -->
- [Search by Route and Station Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/search-by-route-and-station.md>) — similar text 0.50 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:423 s=4.679 -->
- [Search by Line and Measure User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/search-by-line-and-measure.md>) — similar text 0.35 · 2 title words · 1 filename word · same surface <!-- rel:380 s=4.625 -->
- [Search by Route Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/search-by-route-exb-widget.md>) — similar text 0.34 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:473 s=4.379 -->
- [Search Route ExB Widget - Search by Station Method Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/15947-search-route-exb-widget-search-by-station-method.md>) — similar text 0.34 · 1 title word · same kind/surface/folder <!-- rel:462 s=3.781 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.18 · 2 title words · 2 filename words · same surface <!-- rel:464 s=3.719 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Search by Route widget](https://www.google.com/search?q=%22Search%20by%20Route%20widget%22+site%3Adoc.esri.com) · [Experience Builder widget](https://www.google.com/search?q=%22Experience%20Builder%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview
00Layer Configuration:

1. Verify that the layer configuration is displayed when a Line Network layer is selected.

1. Verify that the Search method has ‘Line and Measure’.

1. Verify that the ‘Line and Measure’ option can be enabled / disabled.

1. Verify all the options for search measures are enabled by default.

1. Verify that the Search measures can be enabled / disabled.

1. Enable only one search measure type and verify that the UI is changed accordingly.

1. Verify that Identifier section is renamed as Default Identifier.

1. Verify that the ‘Line’ identifier is added for the line networks.

1. In the Line identifier, verify that both LineID and LineName are available.

1. In the Line identifier, verify that only LineID is available for Postmile networks.

1. Verify the tool tips for all the newly added items.

1. Test with different identifier (LineID/ LineName).

1. Test different result sorting fields (RouteID/ RouteName/LineID/LineName…..).

1. Verify that the results can be sorted using multiple fields.

1. Test ascending and descending sorting.

1. LineName should be default identifier for line identifier.

1. Verify that the field alias is used in the configuration.

1.

Configuration

## Test Cases

### TC-U01 — 1. For Range measures, verify that when a record is selected from the results <!-- src: S5 · label 1. For Range measures, verify that when a record is selected from the results -->

**Steps:**
1. Zoom to that route and measure range on the map.
2. Highlight the route and the measure range.
3. Display route and measure label.
4. Display an arrow at the end to denote the direction.

### TC-N01 — Provide Invalid Route Id / Routename / LineName / LineID and Verify the Error <!-- src: S6 · case 1 -->

- **Case:** Provide invalid route id / routename / LineName / LineID and verify the error message.

### TC-N02 — Provide Route Which Is Not in the Line and Verify the Results. <!-- src: S6 · case 1 -->

Test1 : Search by Line
Search with only Line name

Return all the routes in the line.

Test2 : Search by Line and single measure
Search with Line name and a single measure 2000

Return all the routes in the line which have measures 2000.

Test3 : Search by Line and multiple measures
Search with Line name and measures 20000 and 10000

Return all the route and measure combos.

Test4 : Search by Line and measure range
Search with Line name and measure range 10000 and 100000

Return all the possible combination of routes that have measures in the provided range.

### TC-N03 — For a Single Route That Has the Range <!-- src: S6 · case 1 -->

- **Case:** For a single route that has the range, return everything like in Search by Route plus Line information. The title is the route.

### TC-N04 — For a Range That Involves 2 Routes, Return From Route, To Route <!-- src: S6 · case 1 -->

- **Case:** For a range that involves 2 routes, return From Route, To Route, and Line information. The title is “FromR – ToR”.

### TC-N05 — If Only From or To Is Populated, Treat as Searching a Single Measure. <!-- src: S6 · case 1 -->

Test5 : Search by Line and measure range

Search Range: 10000 to 20000

[figure: Search Results: · From A 10000 To A 15000 · From A 10000 To B 20000 · From A 10000 To D 20000 · From A 10000 To C 12000 · From B 10000 To B 20000 · From B 10000 To D 20000 · From B 10000 To D 12000 · From C 10000 To C 12000 · From C 10000 To D 20000]

Note: Test with same measures in Range (eg 1000 and 1000)
Test with larger from measure.

Test6 : Search by Line and only from measure.

Search Range: 10000 to null

[figure: Search Results: · A 10000 · B 10000 · C 10000]

Test7 : Search by Line and only to measure.
Search Range: null to 20000

[figure: Search Results: · B 20000 · D 20000]

Test8 : Search by Line and refine by route. (Focus on Range measures )

Search : LineA and with route with Y_0%

Search Results : Return all the routes whose route name starts with ‘Y_0’ in LineA.

Test8 : Search by Line and range measures (with same from and to measure)

Search Range: 11000 to 11000

[figure: Search Results: · A 1 · 1 · 000 · From A 1 · 1 · 000 To B · 11 · 000 · From A 1 · 1 · 000 To C 1 · 1 · 000 · B 1 · 1 · 000 · From B 1 · 1 · 000 To · C · 1 · 1 · 000 · C 1 · 1 · 000]

Test9 : Search by Line and range measures (routes with opposite direction in a line)

Search Range: 10000 to 15000

[figure: Search Results: · From A 10000 To A 15000 · From A 10000 To B · 15 · 000 · From A 10000 To C 12000 · From B 10000 To B · 15 · 000 · From B 10000 To · C · 12000 · From C 10000 To C 12000]

![Figure 1 — Negative:](../media/search-by-line/fig-01-negative.png)
![Figure 2 — Negative:](../media/search-by-line/fig-02-negative.png)
![Figure 3 — Negative:](../media/search-by-line/fig-03-negative.png)
![Figure 4 — Negative:](../media/search-by-line/fig-04-negative.png)
![Figure 5 — Negative:](../media/search-by-line/fig-05-negative.png)
![Figure 6 — Negative:](../media/search-by-line/fig-06-negative.png)
![Figure 7 — Negative:](../media/search-by-line/fig-07-negative.png)
![Figure 8 — Negative:](../media/search-by-line/fig-08-negative.png)
![Figure 9 — Negative:](../media/search-by-line/fig-09-negative.png)
![Figure 10 — Negative:](../media/search-by-line/fig-10-negative.png)
![Figure 11 — Negative:](../media/search-by-line/fig-11-negative.png)
![Figure 12 — Negative:](../media/search-by-line/fig-12-negative.png)

## Other content

### Content page:

1. Hide Route in Search by Line is added in the Display settings.

1. Enable it and verify that the route identifier is not visible in the widget.

1. Verify the tooltip.

1. Verify that the route search is available for non line network, if the toggle is enabled for ‘Hide route in search by line’

Search

1.
00Verify that the Line and Measure Method is available in the dropdown.

1. Verify that the search button is disabled until a valid RouteName \ RouteID \LineID or LineName is provided.

1. Verify when Hide route search is turned on, there is no Route Name/ID box in UI

1. Verify if no line network exists or line network has Line and Measure turned off in configuration, Line and Measure does not appear in Method dropdown.

1. Verify that the hide route search will work only when the search line and measure method is enabled for line network.

1. Verify that the RouteName / RouteID is optional for line network, when route search is not hidden.

1. Choose Single and search using the LineName / LineID and Measure value.

1.
00Choose Multiple and search using the LineName / LineID and multiple measure values.

1. Choose Range and search using the LineName / LineID and From and To Measure values.

1. Choose Range and search only using the LineName / LineID and From Measure value.

1. Choose Range and search only using the LineName / LineID and To Measure value.

1. Verify that the route identifier is used to refine search results when route is searched along with line.

1. Provide measures in stationing format and search.

1. Verify that the intellisense experience is shown for LineName / LineID field after 3 characters are entered.

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

1. Verify that the results also Include Line ID; Line Name; Line Order.

1. Test with Postmile, APR and RH data.

1. Test on projected and unprojected data.

1. Test with different themes.

1. Test on a variety of route shapes to ensure the stations are found at the correct location.

1. Verify that measures can be provided in US (0+00.00) stationing format.

1. Verify that measures can be provided in Metric (0+000.00) stationing format.
