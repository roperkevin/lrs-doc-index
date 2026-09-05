# Data Action Support for Add Line Event Widget – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 431 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#17675](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17675) |
| **Source** | [DataActionAddLine_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/DataActionAddLine_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Dan |
| **Edited** | 2024-02-15 22:21 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | add line event · data action · experience builder · route · measure · event attribute set · spanning event · non spanning event · network table · validation |
| **Tools** | Add Line Event widget · LRS Search · LRS Identify · network Table |

## Summary

Test plan for the Add Line Event widget's data action support in Experience Builder. Covers verification of data action behavior in Search, Identify, and network Table widgets, including positive and negative test cases for route and event population, measure handling, and validation logic. Includes automation and documentation update notes.

## Related documents

<!-- related:begin -->
- [Data Action Support for LRS Identify widget– Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17939-data-action-support-for-lrs-identify-widget.md>) — similar text 0.55 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:375 s=6.845 -->
- [Data Action Support for Merge Event widget– Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17678-data-action-support-for-merge-event-widget.md>) — similar text 0.53 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:414 s=6.52 -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/16340-exb-add-single-line-event-widget.md>) — similar text 0.25 · 4 title words · 2 filename words · same surface/dev/folder <!-- rel:455 s=6.087 -->
- [Add Line Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24791-add-line-event-widget.md>) — similar text 0.25 · 4 title words · 2 filename words · same surface <!-- rel:138 s=4.817 -->
- [User Story Add Line Event (Multiple)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-multiple.md>) — similar text 0.24 · 3 title words · 2 filename words · same surface <!-- rel:480 s=3.972 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/split-a-centerline-by-measure.html)

_No page matched:_ [Add Line Event widget](https://www.google.com/search?q=%22Add%20Line%20Event%20widget%22+site%3Adoc.esri.com) · [LRS Search](https://www.google.com/search?q=%22LRS%20Search%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com) · [network Table](https://www.google.com/search?q=%22network%20Table%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Data Action Support for Add Line Event widget– Test Plan <!-- slide 1 -->

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17675

PE: Claire Wang
Dev: Dan

### Notes

When Add Line is launched, does it add the default event/attribute set? ----- what if default event is registered to network1 and the route chosen is network2?
	choose the first for the selected network
Populate date is today’s date? If the route is retired, it will error out in validation
After Add Line is launched and populated via data action, is changing the event or hitting reset still able to clear populated values? – spanning/nonspanning chance is low – if they want to switch they know the pane is cleared

### Slide 2 <!-- slide 2 -->

Data:

- Add data action into LRS Search, LRS Identify and network Table that opens Add Line Widget and populate desired fields
- Test with RH, APR, and APRUN
- Test with different types (single/multiple) and events (spanning/non-spanning for single) being default in Add Line
- Test with other widgets that don’t have our data actions and make sure our actions don’t appear
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/i18n
- Test with various themes
- Test in different browsers (chrome and firefox) and layouts
Automation
Follow the same way we automate other widgets
Documentation

- Update documentation for the LRS widgets to mention these available data actions and how they will copy data into the new widget being launched
- Update screenshots as needed

## Test Cases

### TC-U01 — Verification (1) <!-- src: S5 · slide 3 · label Verification -->

**Steps:**
1. Data action should automatically be there in the widgets (Search; Identify; Table) without needing to manually configure
2. Upon launching Add Line, the event/attribute set to add is the default configured for Add Line or the last event/attribute set added via the pane, if selected network is the default network in Add Line
   - If the selected network is not the default network in Add Line, the Add Line widget should honor the selected network and show the first available event for the network
   - Type (Single/Multiple) will remain the last type they choose in the pane. The default type is not honored
3. For Search, data action populates the route, measure, and date fields
   - If selected result has only one measure, provide options in data action pane to let users choose whether it will be the From or To Measure
   - If selected result has 2 measures, populate as From and To
   - If Add Line has a spanning event in the pane, both From and To Route boxes are enabled and populated with the selected route. For non line network or non-spanning event, To Route is grey and shows From Route
4. For Identify, data action populates the route, measure, and date fields from the displayed location
   - As Identify only returns 1 measure, always provide an option to let users choose whether it will be the From or To Measure
   - If Add Line has a spanning event as default, use the selected route for both From and To Routes

### TC-U02 — Verification (2) <!-- src: S5 · slide 5 · label Verification -->

**Steps:**
1. Dates are populated under the following logic, and validation is done in Add Line
   - From Search, the start and end dates of the searched route are populated.
   - From Identify, the start and end dates of the identified route are populated.
   - From Table, use the start and end date of the route (or the route with a lower line order if 2 routes in the same line are selected)
2. If selected routes’ network does not have event or its events are not in map, data action is disabled
3. If Add Line widget is already open, overwrite whatever is populated
   - This includes all the existing Route/Measure/Date fields, as well as the event and network when 2 in the previous page applies
4. After Add Line is launched and populated via data action, changing anything in the tool pane that will reset the pane still does what it is supposed to do (e.g. changing spanning event to a non spanning event; hitting reset button). Whether resetting to the default event/network or not does not matter when 2 in the previous page applies
   - Normally, all events are spanning in a line network, so users won’t worry about changing to a non spanning event will reset the fields
5. Verify the measure populated in the Add Line pane is the same precision. This is in Eric’s queue

### TC-P01 — LRS Search <!-- src: S4 · slide 6 · Positive cases (for Line network, mix Single-spanning, Single-non spanning, and Multiple being the default in Add Line) · 1 -->

- **Group:** For Line Network, Mix Single-spanning, Single-non Spanning, and Multiple Being the Default in Add Line
- Search returns 1 route with 1 measure. Choose it to be the To M
- Search returns 2 routes and each with 1 measure. Before selecting a result, Data Action is disabled. Select one result to add line events, choose the measure to be From M, and add the event
- Search returns 1 route with 2 measures. Verify they become From and To measures
- Line - Search returns 1 route with 1 measure. Choose it to be the From M
- Line with spanning event being the default in Add Line - Search returns 1 route with 2 measures. Verify the route serves for both From and To routes, and the measures become the From and To measures. Add the event
- Searched network is not the default network in Add Line, so Add Line widget shows the first available event for the searched network and populate corresponding fields
- LRS Identify
- Identify a location. Choose it to be the To M and add the event
- Line - Identify a location. Choose it to be the From M
- Line with spanning event being the default in Add Line - Identify a location. Choose it to be the From M. Verify the route serves for both From and To routes, and only From Measure is populated. Change the To Route, type in a To Measure and add the event
- Line with spanning event being the default in Add Line - Identify a location. Change event to a non spanning event in Add Line and verify the pane is reset

### TC-P02 — Table <!-- src: S4 · slide 7 · Positive cases · 1 -->

- Non-line – Select 1 route
- Line – Select 1 route. Verify the route serves for both From and To Routes. No measure information is populated.
- Line – Select 2 routes that are in the same line and have the same date range. Verify the route with the lower line order has become the From Route, and the other route has become the To Route. No measure information is populated. Add event
- Selected line network is not the default network (nonline) in Add Line, so Add Line widget shows the first available event for line network and populate corresponding fields
  - If 1 route is selected, use the first available event as it being a spanning or non spanning event does not matter, and corresponding fields can be populated based on this 1 route
  - If 2 valid routes are selected, use the event layer staying in the pane or the default event if Add Line is opened for the first time. The event being a spanning or non spanning event does not matter

### TC-N01 — In table, select 2 routes in a line with non overlapping dates. Add Line widget <!-- src: S4 · slide 8 · Negative cases (cannot add event) · 1 -->

- **Group:** Cannot Add Event
- **Case:** In table, select 2 routes in a line with non overlapping dates. Add Line widget will open but validation cannot pass on the dates. User do not want to use such routes.

## Other content

### Slide 3 <!-- slide 3 -->

![Figure 1 — 3](../media/17675-data-action-support-for-add-line-event-widget/fig-01-slide-03-3.png)

### Slide 4 <!-- slide 4 -->

Verification:

- For network table, data action populates the route and date fields. Do not populate measure fields
  - If network is non-line and multiple routes are selected, data action is disabled
  - If network is line and multiple routes are selected, check the number of route selected and if they are on the same line
    - If only 2 routes are selected and they are on the same line with the same date range, when Add Line is opened with a spanning event, populate the two route IDs/names as the From and To (lowest line order would be the from)
      - If Add Line already has a non-spanning event in the pane, selecting 2 routes and launching data action will use the route with the lower line order to populate From and To Route boxes
      - If network only has non-spanning events, users can still select 2 routes and launch Add Line, but the route with the lower line order will populate both From and To Route boxes
    - If more than 2 routes are selected, data action is disabled
    - If 2 routes are records of the same route but they have different dates, data action is disabled
    - If 2 routes are in the same line with different dates, data action is always enabled. Add Line tool will then validate the dates
Check if data action is configurable/will be enhancement for returned tables------------
In table returned from other widgets, records can have a measure or 2 measures:

  - 1 measure – provide From/To options
  - 2 measures – populate from and to measures
  - If 2 routes in the same line are selected, use the lower line order’s route’s from measure and then the second route’s to measure

![Figure 2 — 4](../media/17675-data-action-support-for-add-line-event-widget/fig-02-slide-04-4.png)

### Slide 8 — Negative cases (Data action not shown) <!-- slide 8 -->

  - If Add Line widget is not configured
  - Search a Derived route
  - Search a route that does not have event registered to it
  - Search a route that does not have any of its registered event in the map
  - Identify a Derived route
  - Identify a route that does not have any of its registered event in the map
  - In the table of a non-line network, select multiple routes
  - In the table of a line network, select 3 routes on the same line
  - In the table of a line network, select 2 routes on different lines
  - In the table of a line network, select 2 time slices of the same route
  - In the point event table, select a point event and data action does not appear
