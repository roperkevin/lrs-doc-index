# Data Action Support for Merge Event widget– Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 414 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#17678](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17678) |
| **Source** | [DataActionMergeEvents_testplan2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/DataActionMergeEvents_testplan2.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE Claire · dev Sharon |
| **Edited** | 2024-02-29 22:06 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | merge events · data action · line event · event table · experience builder · validation |
| **Tools** | Merge Events |

## Summary

Test plan for adding a data action to LRS Line Event tables that opens the Merge Events widget and populates fields. Covers verification of data action behavior with different event types, widget interactions, and UI validation. Includes positive test cases and conditions where the data action should not appear.

## Related documents

<!-- related:begin -->
- [Data Action Support for Add Line Event Widget – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17675-data-action-support-for-add-line-event-widget.md>) — similar text 0.53 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:431 s=6.52 -->
- [Data Action Support for LRS Identify widget– Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17939-data-action-support-for-lrs-identify-widget.md>) — similar text 0.49 · 3 title words · 2 filename words · same kind/surface/folder <!-- rel:375 s=5.626 -->
- [Merge Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16934-merge-events-widget.md>) — similar text 0.16 · 2 title words · 1 filename word · same kind/surface/folder <!-- rel:437 s=4.166 -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/16340-exb-add-single-line-event-widget.md>) — similar text 0.26 · 2 title words · same surface/pe/folder <!-- rel:455 s=4.067 -->
- [Support Overlapping Events in Experience Builder Dynamic Segmentation Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-overlapping-events-in-exb-dynseg-table.md>) — similar text 0.10 · 1 title word · 1 filename word · same surface <!-- rel:291 s=3.602 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Overview

### Slide 1 — Data Action Support for Merge Event widget– Test Plan <!-- slide 1 -->

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17678

PE: Claire
Dev: Sharon

### Slide 2 <!-- slide 2 -->

Data:

- Add data action into LRS Line Event tables that opens Merge Events Widget and populate desired fields
- Test with RH, APR, and APRUN
- Test with different events (spanning/non-spanning)
- Test with APR events with Route Name configured and not configured
- Test with other widgets (e.g. a point event table) that don’t have this data action and make sure this action doesn’t appear
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508 (tabbing only)/i18n
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
1. Data action should automatically be in the line event tables without needing to manually configure
2. If only 1 event is selected, data action does not show. Selecting 2 or more events will enable data action
   - Any validation on measure/spatial adjacency and date will be done in the widget. Data action to launch Merge Events does not validate these
3. Data action should populate the available fields in Merge Events
   - the event layer should be the table’s event layer
   - List selected events in Events to Merge table. Merge Events widget preserves the event that has the lowest calibration of the route/line, just like what Merge Events widget does
   - Not sure yet how Change Event Selection button interacts with table and data action – need to confirm when Merge Event is done
   - From measure = From measure of the first event in the increasing order of calibration of the route/line
   - To measure = To measure of the last event in the increasing order of calibration of the route/line
   - From Date is populated today’s date; To Date is null

### TC-U02 — Verification (2) <!-- src: S5 · slide 4 · label Verification -->

**Steps:**
1. Copy the preserved event’s attributes to attribute table
2. If Merge Events widget is already open, overwrite whatever is populated
   - This includes all the existing Event layer/selected events/Measures/Date/Event attributes
   - Re-selecting events from table and launching data action again will also overwrite Merge Events pane
3. After Merge Events is launched and populated via data action, changing anything in the tool pane that will reset the pane still does what it is supposed to do (e.g. changing event layer)
4. Verify values can still be changed in the editable fields

### TC-P01 — Select 2 events that can also pass Merge Events validation. Change some event <!-- src: S4 · slide 5 · Positive cases · 1 -->

- **Case:** Select 2 events that can also pass Merge Events validation. Change some event values in attribute table in Merge Events widget. Merge events
- Select 3 events and 1 event is retired. Verify data action is enabled, and Merge Events widget returns an error on the date.
- Line - Manually populate some fields in Merge Events. Then, select 2 spanning events in line network and launch data action. Verify existing fields are overwritten.

## Other content

### Slide 4 <!-- slide 4 -->

![Figure 1 — 4](../media/17678-data-action-support-for-merge-event-widget/fig-01-slide-04-4.png)

### Slide 5 — Positive cases <!-- slide 5 -->

Cases where Data action is not shown

  - Table is not line event
  - Only 1 line event is selected in a line event table
  - If event layer selected in table is not configured in the target widget, data action is not shown
