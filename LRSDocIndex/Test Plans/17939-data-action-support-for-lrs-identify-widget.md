# Data Action Support for LRS Identify widget– Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 375 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#17939](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17939) |
| **Source** | [DataActionIdentify_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/DataActionIdentify_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire Wang · dev Prutha |
| **Edited** | 2024-05-07 20:49 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | data action · identify widget · add point · add line · non lrs data action · spanning event · event addition |
| **Tools** | Add Point · Add Line |

## Summary

Test plan for adding data actions into the LRS Identify widget including nonLRS and LRS data actions. Covers verification of data action presence, configuration, functionality, and behavior with different event types and networks. Includes positive test cases and scenarios where LRS data actions should not appear.

## Related documents

<!-- related:begin -->
- [Data Action Support for Add Line Event Widget – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17675-data-action-support-for-add-line-event-widget.md>) — similar text 0.55 · 3 title words · 2 filename words · same kind/surface/pe/folder <!-- rel:431 s=6.845 -->
- [Data Action Support for Merge Event widget– Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17678-data-action-support-for-merge-event-widget.md>) — similar text 0.49 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:414 s=5.626 -->
- [LRS Identify: Show Coordinates in Results Experience Builder Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/26618-lrs-identify-show-coordinates-in-results-exb-widget.md>) — similar text 0.23 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:859 s=3.984 -->
- [ExB Search By Referent – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16462-exb-search-by-referent.md>) — similar text 0.22 · 1 filename word · same kind/surface/pe/folder <!-- rel:456 s=3.84 -->
- [Add Spanning Line Events to Dominant Routes in Experience Builder – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24793-add-spanning-line-events-to-dominant-routes-in-exb.md>) — similar text 0.19 · 1 filename word · same kind/surface/folder <!-- rel:170 s=3.211 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/add-calibration-points.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Data Action Support for LRS Identify widget– Test Plan <!-- slide 1 -->

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17939

PE: Claire Wang
Dev: Prutha

### Slide 2 <!-- slide 2 -->

Data:

- Add data action into LRS Identify
  - 4 nonLRS data actions: view in table/export/pan to/zoom to
  - 3 LRS data actions: Add Point/Add Line (From)/Add Line (To)
- Test with RH, APR, and PoM (nonLRS only)
- Test adding different types (single/multiple) of events
- Test adding spanning and non-spanning for Add Line
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/i18n
- Test with various themes
- Test in different browsers (chrome and firefox) and layouts
Automation
Follow the same way we automate other widgets
Documentation

- Update documentation for Add Point and Add Line widgets
- Update screenshots as needed

## Test Cases

### TC-U01 — Verification <!-- src: S5 · slide 3 · label Verification -->

**Steps:**
1. Verify the 7 data actions exist in Identify dropdown
2. Verify the 7 data actions can show/hide in configuration
3. Briefly test the 4 nonLRS data actions and make sure they work as expected
4. For LRS data actions
   - Upon launching data action, the event/attribute set to add is the default configured for target widget or the last event/attribute set added via the target widget
   - If the selected network is not the default network in target widget, the target widget should honor the selected network and show the first available event for the network
   - Type (Single/Multiple) will remain the last type they choose in the pane. The default type is not honored
   - Date action populates the route, measure (from or to, chosen by user), and date fields from the displayed location
   - If Add Line has a spanning event in the pane, use the selected route for both From and To Routes
   - Use selected route’s start and end dates to populate the target widget
   - If Add Line widget is already open, overwrite whatever is populated
   - After Add Line is launched and populated via data action, changing anything in the tool pane that will reset the pane still does what it is supposed to do (e.g. changing spanning event to a non spanning event; hitting reset button).

### TC-P01 — nonLRS data actions <!-- src: S4 · slide 4 · Positive cases · 1 -->

- Identify a route and view in table
- Identify a route and export
- Pan to identified location
- Zoom to identified location
- LRS data actions
- Identify a location. Launch Add Point widget
  - Network changes when current network in Add Point is not identified network
- Identify a location on a route with time slices. Choose it to be Add Line (To)
- Add spanning line event - Identify a location. Choose it to be the From M. Verify the route serves for both From and To routes, and only From Measure is populated. Change the To Route, type in a To Measure and add the event
- With Add Point already populated, identify a location and launch data action. Verify the pane is overwritten

## Other content

### Slide 3 <!-- slide 3 -->

![Figure 1 — 3](../media/17939-data-action-support-for-lrs-identify-widget/fig-01-slide-03-3.png)

### Slide 5 — LRS Data actions not shown <!-- slide 5 -->

  - Identify a Derived route
  - Identify a route that does not have any of its registered event in the map
  - Disable Add Point data action in Identify widget and verify it no longer shows up
