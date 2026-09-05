# Search by Line and Measure User Story

| Field | Value |
| --- | --- |
| **Doc** | 380 · User Story · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ExB_SearchbyLineandMeasure 1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ExB_SearchbyLineandMeasure%201.pptx>) |
| **People** | author Praveen Kumar · PE — · dev — |
| **Edited** | 2024-05-01 19:46 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editor · line network · route · measure · search · intellisense · pane transitions · time filter · version filter |
| **Tools** | Search by Route · Search by Line and Measure |

## Summary

This document describes a user story for an Event Editor to search by line and optionally by route and measures within a linear referencing system. It covers configuration, user interface behavior, search result handling, testing scenarios, and automation documentation for the Search by Line and Measure functionality in Experience Builder. The document also outlines testing requirements including UI, configuration, and browser compatibility.

## Related documents

<!-- related:begin -->
- [Search by Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/search-by-line.md>) — similar text 0.35 · 2 title words · 1 filename word · same surface <!-- rel:363 s=5.789 -->
- [Search by Route and Measure Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-measure-exb-widget.md>) — similar text 0.28 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:529 s=5.333 -->
- [Search by Line Experience Builder widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-line-exb-widget.md>) — similar text 0.29 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:464 s=5.111 -->
- [Search by Route User Story and Configuration](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-and-configuration.md>) — similar text 0.46 · 1 title word · same kind/surface/folder <!-- rel:438 s=4.924 -->
- [Search by Route widget – configure network attribute fields](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/search-by-route-widget-configure-network-attribute-fields.md>) — similar text 0.42 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:379 s=4.851 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html) · [Set a time filter](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-a-time-filter.html)

_No page matched:_ [Search by Route](https://www.google.com/search?q=%22Search%20by%20Route%22+site%3Adoc.esri.com) · [Search by Line and Measure](https://www.google.com/search?q=%22Search%20by%20Line%20and%20Measure%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Search by Line and Measure <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an Event Editor, I need the ability to search for a specific line and optionally, route and measures, so that I can properly location and orient myself for LRS editing and analysis.

Persona
Event Editor: These users are responsible for making edits to route characteristics and assets.  Typically located in different business units/departments than the LRS route editors, these users have varied GIS experience, but a high level of knowledge about the characteristics they maintain (safety, pavement, crashes, etc.)  These users need to be able to search for line and sometimes route/measure on the line to orient themselves on the map in preparation for event editing.
Target user: PoM, APR, and RH (who plans to adopt line concept) editor

## Acceptance Criteria
### Configuration <!-- slide 3 -->
If Sort Field is set to LineID/Name/Order, make sure results are ranked by this line field.

- Verify if the network is line network, “Line and Measure” is added to Search methods; and Line Default dropdown is added to Identifier. If the network is non-Line network, these options are not added
  - Verify the Line and Measure toggle works as expected
  - Verify Line Default shows Line ID and Line Name as options (if network is PoM, there is only Line ID)
- Verify when using Line and Measure to search, result table has line information (Line ID/Name/ID)
  - When Sort Field is set to LineID/Name/ID, verify results are ranked by these fields.
New
New
If network is a line network, add “Line and Measure” and a toggle button
If network is a line network, add another set (title: Line Default; dropdown: Line ID/Line Name; tooltip)

- In published view, when method is search by line and measure, use this Line Default (and/or Default as Route is optional).
- Provide option to turn off Route search, so Route box is hidden
- If method is not line, use Default as it does today.
Currently, LineID/LineName can be added as a Sort Field. But searched result does not contain Line information.

![Figure 1 — Configuration](../media/search-by-line-and-measure/fig-01-slide-03-configuration.png)
![Figure 2 — Configuration](../media/search-by-line-and-measure/fig-02-slide-03-configuration.png)

![Figure 3 — Configuration](../media/search-by-line-and-measure/fig-03-slide-03-configuration.svg)

### Search by Line <!-- slide 4 -->
- If no line network exists or line network has Line and Measure turned off in configuration, Line and Measure does not appear in Method
- If there is only 1 line network configured with Line and Measure option, after choosing Line and Measure for the method, pencil button does not show for Network
- Line Identifier is required. Route Identifier and Measure are optional.
  - Verify when Hide route search is turned on, there is no Route Name/ID box in UI
  - If nothing is populated, search returns all routes – just like what Search by Route does
  - If only Line Identifier field is populated, return all routes on the line
- Implement intellisense and wildcard options in Line Identifier field
- Verify the hidden elements (e.g. hide method; hide network) and alias are honored
- Searched result should contain line information (Line ID; Line Name; Line Order)

Option to turn off route search is checked, so Route box is hidden

![Figure 4 — Search by Line](../media/search-by-line-and-measure/fig-04-slide-04-search-by-line.png)
![Figure 5 — Search by Line](../media/search-by-line-and-measure/fig-05-slide-04-search-by-line.png)

![Figure 6 — Search by Line](../media/search-by-line-and-measure/fig-06-slide-04-search-by-line.svg)

### Search by Line <!-- slide 5 -->
- If Route is searched along with Line, use Route identifier to refine searched results.
- Implement intellisense and wildcard options in Route Identifier field
- Do pane transitions and results labeling and honor time and version as what we do today
    - When the user clicks search, do the following:
      - Find the route(s)
      - Transition the widget to a results pane that shows the route(s) that are returned by the search.
      - Show results in expanded form if the option is set in the configuration.
    - When a record is selected from the results:
      - Zoom to that route on the map
      - Highlight the route
      - Display route label (as per cartographic standards, for example do not place overlapping labels)
    - Search results should honor the time filter
    - Search results should honor the version

![Figure 7 — Search by Line](../media/search-by-line-and-measure/fig-07-slide-05-search-by-line.png)

![Figure 8 — Search by Line](../media/search-by-line-and-measure/fig-08-slide-05-search-by-line.svg)

### Search by Line and Single Measure <!-- slide 6 -->
- Return all the routes on the line(s) that have this measure
- If Route is searched along with Line, use Route identifier to refine searched results
- Do pane transitions and results labeling and honor time and version as what we do today

![Figure 9 — Search by Line and Single Measure](../media/search-by-line-and-measure/fig-09-slide-06-search-by-line-and-single-measure.png)

![Figure 10 — Search by Line and Single Measure](../media/search-by-line-and-measure/fig-10-slide-06-search-by-line-and-single-measure.svg)

### Search by Line and Multiple Measure <!-- slide 7 -->
- Return all the Route-Measure combos on the line
- If Route is searched along with Line, use Route identifier to refine searched results
- Do pane transitions and results labeling and honor time and version as what we do today

![Figure 11 — Search by Line and Multiple Measure](../media/search-by-line-and-measure/fig-11-slide-07-search-by-line-and-multiple-measure.png)

![Figure 12 — Search by Line and Multiple Measure](../media/search-by-line-and-measure/fig-12-slide-07-search-by-line-and-multiple-measure.svg)

### Search by Line and Measure Range <!-- slide 8 -->
- Return all the possible combination of routes that have either/both these measures (example next slide)
  - For a single route that has the range, return everything like in Search by Route plus Line information. The title is the route
  - For a range that involves 2 routes, return From Route, To Route, and Line information. The title is “FromR – ToR”
- If only From or To is populated, treat as searching a single measure
- If Route is searched along with Line, use Route identifier to refine searched results
- Do pane transitions and results labeling and honor time and version as what we do today. When there are too many results, labels can overlap.
- Do we want to filter out results involving 2 routes but routes have non-overlapping time?

Row Names can be flexible

![Figure 13 — Search by Line and Measure Range](../media/search-by-line-and-measure/fig-13-slide-08-search-by-line-and-measure-range.png)

![Figure 14 — Search by Line and Measure Range](../media/search-by-line-and-measure/fig-14-slide-08-search-by-line-and-measure-range.svg)

### Search by Line and Measure Range - Example <!-- slide 9 -->
Search Range: 10000 to 20000
Return all routes that have 10000 to their end measure or 20000, and to later routes (higher line order) that have 20000

Search Results:
From A 10000 To A 15000
From A 10000 To B 20000
From A 10000 To D 20000
From B 10000 To B 20000
From B 10000 To D 20000
From C 10000 To C 12000
From C 10000 To D 20000
Search Range: 10000 to null
Treat as searching a single measure 10000 (what we do today)

Search Results:
A 10000
B 10000
C 10000
Search Range: null to 20000
Treat as searching a single measure 20000 (what we do today)

Search Results:
B 20000
D 20000

[figure: A · 0 · 15000 · B · 10000 · 40000 · C · 12000 · D · 20000 · 25000 · Line1]

![Figure 15 — Search by Line and Measure Range - Example](../media/search-by-line-and-measure/fig-15-slide-09-search-by-line-and-measure-range-example.svg)

### Search by Line Testing <!-- slide 10 -->
- Focus testing with Line network. Sanity test non-line network that Line options do not appear in configuration or widget UI
- Test on projected (may use PoM) and unprojected data (may use APRGCS)
  - All functionalities should be able to apply to PoM with no issue
- Verify the tool aligns with any other Experience Builder specifications/requirements
- Test both configuration and UI
  - Focus testing the new method and associated parameters. But also make sure that existing parameters that can be used in the new method, such as Set Default Method/Hide Network/Hide Method/etc, still work fine
- Test searching with various Line/Route/Measure(s) combinations
- Test on a variety of route shapes. Focus with simple route and gapped/multi-gapped route
- Test time slices
- Test both with Numeric and Station measure values
- 508/l18n testing
- Test with different themes
- Test in Chrome and Firefox
- Test in different sizes (web, tab and mobile)

![Figure 16 — Search by Line Testing](../media/search-by-line-and-measure/fig-16-slide-10-search-by-line-testing.svg)

### Search by Line Automation Documentation <!-- slide 11 -->
Automate the tool following the process outlined by Lakshmi in her spike earlier this year
Add the method to existing Search by Route widget topic

Include graphic examples in the doc.

![Figure 17 — Search by Line Automation Documentation](../media/search-by-line-and-measure/fig-17-slide-11-search-by-line-automation-documentation.svg)

### Search by Line Assignment <!-- slide 12 -->
Story Points:
Dev:
PE:

![Figure 18 — Search by Line Assignment](../media/search-by-line-and-measure/fig-18-slide-12-search-by-line-assignment.svg)
