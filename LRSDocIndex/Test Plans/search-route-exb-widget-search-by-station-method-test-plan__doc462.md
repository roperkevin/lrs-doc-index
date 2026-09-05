# Search Route ExB Widget - Search by Station Method Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#15947](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/15947) |
| **Source** | [ExB_Search.by.Station_TestPlan.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_Search.by.Station_TestPlan.docx>) |
| **Edited** | 2023-11-13 22:52 by Lakshmi Ananthanarayanan |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Search Route ExB Widget - Search by Station Method Test Plan"
source_file: "ExB_Search.by.Station_TestPlan.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/ExB_Search.by.Station_TestPlan.docx"
doc_id: 462
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Lakshmi Ananthanarayanan"
last_edited_by: "Lakshmi Ananthanarayanan"
last_edited: "2023-11-13T22:52:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["search by station", "experience builder", "route identification", "stationing", "widget testing", "validation", "error handling"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#15947"]
related: [{"doc":423,"file":"search-by-route-and-station-test-plan__doc423.md","s":6.082},{"doc":473,"file":"search-by-route-experience-builder-widget-test-plan__doc473.md","s":5.937},{"doc":490,"file":"search-by-station-experience-builder-widget__doc490.md","s":5.307},{"doc":350,"file":"search-by-route-results-table-test-plan__doc350.md","s":4.12},{"doc":363,"file":"search-by-line-test-plan__doc363.md","s":4.073}]
```
-->

## Summary

Test plan for the Search Route Experience Builder widget using the Search by Station method. Covers configuration testing, functionality testing including UI behavior, validation, and search result verification across different browsers and devices. Includes negative testing for invalid inputs and error handling.

## Related documents

<!-- related:begin -->
- [Search by Route and Station Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-route-and-station-test-plan__doc423.md>) — similar text 0.35 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:423 -->
- [Search by Route Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-route-experience-builder-widget-test-plan__doc473.md>) — similar text 0.31 · 3 title words · same kind/surface/folder <!-- rel:473 -->
- [Search by Station Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-station-experience-builder-widget__doc490.md>) — similar text 0.35 · 3 title words · 1 filename word · same surface <!-- rel:490 -->
- [Search by Route Results Table Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-route-results-table-test-plan__doc350.md>) — similar text 0.20 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:350 -->
- [Search by Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-line-test-plan__doc363.md>) — similar text 0.34 · 1 title word · same kind/surface/folder <!-- rel:363 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com) · [lrs route search](https://www.google.com/search?q=%22lrs%20route%20search%22+site%3Adoc.esri.com) · [search route experience builder widget](https://www.google.com/search?q=%22search%20route%20experience%20builder%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Test plan for  https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/15947

Search Route ExB Widget - Search by Station Method

00Test data

- Test with APR data
- Test with data containing a variety of route shapes.
- Test with projected and unprojected data
- Test with networks with RouteID and Route Name configured.
- Test with networks with different units of measure configured.
- Test with more than one theme in ExB
- Do a sanity test with RH data and Postmile data.

Configuration testing: Layer configuration

- Verify Stationing method can be chosen as a search method.
- Test with different identifier (RouteID/ Route Name).
- Test different result sorting fields (RouteID/ Route Name).
- Configure by having only stationing as a search method. In the widget the method will be disabled as only stationing is the configured method
- Configure by having both route and measure and stationing as a search method. In the widget, a drop down will be available for the user to choose any one of search methods.

Functionality testing: Search by Station

- Verify stationing is shown as the search method.
- Verify the values in the Network drop down are shown as per the configuration.
- Verify routeID or route name is displayed based on the configuration.
- Allow the user to enter the value for RouteID /Route Name
- Verify there is an intellisense experience for the RouteID /Route Name
- Verify that the measure units are as per the network m unit. (shown next to station)
- Verify that measures can be provided in US (0+00.00) stationing format.
- Verify that measures can be provided in Metric (0+000.00) stationing format.
- Verify that add another station button is available for the user to add another station value.
- Verify that the user can delete the added station.
- Verify that the scroll bar appears if more stations are added by the user.
- Verify that the search button is disabled until a valid Route Name or RouteID and one station is provided.
- After entering the routeID and station information, change the network. Verify all the values are cleared when a different network is chosen.
- If the user enters a different route Id then all the stations chosen for the previous route ID will be cleared.
- Switch to a version and verify that the search results are honoring the version.
- Set time and verify that the search results are honoring the time frame.
- Test in Chrome, Edge, Firefox.
- Test in different sizes (web, tab and mobile).
- Verification of results – After finding the route and station or stations
  - Zoom to the route and stations on the map.
  - Highlight the stations on the map.
  - Transition to a results pane showing the route(s) that are returned by the search.
  - In the results, each search result should show the measure in station format, and as a measure value.
  - Allow the user to select any of the station values in the results and zoom to that station location on the map and show a popup with the route and station value.
  - When a route is selected from search result, verify that the table is filtered with the selected record. (optional and if it is configured, it is a data action)
- 508/l18n testing

Negative testing:

- Provide invalid route id / route name and verify the error message.
- Provide station value in wrong format and verify the error message.
- Provide only the station value and verify the error message.

![image1.png](../media/doc486_image1.png)
