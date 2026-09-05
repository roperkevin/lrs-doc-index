# Add Line Event Tools: Continue from Previous Measure Option Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#4414](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/4414) |
| **Source** | [4414-ContinueFromPreviuousMeasure_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4414-ContinueFromPreviuousMeasure_TestPlanV1.pptx>) |
| **Edited** | 2025-02-27 15:37 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Add Line Event Tools: Continue from Previous Measure Option Test Plan"
source_file: "4414-ContinueFromPreviuousMeasure_TestPlanV1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/4414-ContinueFromPreviuousMeasure_TestPlanV1.pptx"
doc_id: 214
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2025-02-27T15:37:44Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["line event", "measure", "route", "event editing", "from method", "to method", "data validation", "attribute persistence"]
tools: ["Add Line Event", "Add Multiple Line Event"]
products: []
issues: ["ArcGISPro/ps-location-referencing#4414"]
related: [{"doc":225,"file":"add-line-event-tools-continue-from-previous-measure-option-test-plan__doc225.md","s":1010.705},{"doc":270,"file":"add-line-event-go-to-next-measure-on-save-option__doc270.md","s":5.219},{"doc":200,"file":"go-to-next-measure-upon-run-option-in-lrs-editing__doc200.md","s":3.826},{"doc":269,"file":"add-line-event-length-method__doc269.md","s":3.602},{"doc":648,"file":"add-line-event-tools-coordinate-offset-method__doc648.md","s":3.331}]
```
-->

## Summary

Test plan for the Add Line Event Tools feature that introduces a checkbox option to continue edits from the previous measure. Covers positive UI tests before and after edits, including persistence of checkbox state, method selections, data validation options, and attribute information across edits.

## Related documents

<!-- related:begin -->
- [Add Line Event Tools: Continue from Previous Measure Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/add-line-event-tools-continue-from-previous-measure-option-test-plan__doc225.md>) — shared issue ArcGISPro/ps-location-referencing#4414 · similar text 0.94 · 6 title words · 3 filename words · same kind/surface <!-- rel:225 -->
- [Add Line Event Go To Next Measure on Save option](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-go-to-next-measure-on-save-option__doc270.md>) — similar text 0.28 · 5 title words · 2 filename words · same surface <!-- rel:270 -->
- [Go to Next Measure Upon Run Option in LRS Editing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/go-to-next-measure-upon-run-option-in-lrs-editing__doc200.md>) — similar text 0.31 · 2 title words · same surface <!-- rel:200 -->
- [Add Line Event Length Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-length-method__doc269.md>) — similar text 0.22 · 3 title words · same surface <!-- rel:269 -->
- [Add Line Event Tools: Coordinate Offset Method](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-tools-coordinate-offset-method__doc648.md>) — similar text 0.20 · 4 title words · same surface <!-- rel:648 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)

_No page matched:_ [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Add Multiple Line Event](https://www.google.com/search?q=%22Add%20Multiple%20Line%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Add Line Event Tools: Continue from Previous Measure Option

| Notes |
| --- |
| Add checkbox to Add Line Event Tools (single and multiple) to allow the user to continue their next edit from the previous measure Test in FS only with mix and match of spanning vs. non-spanning line events Mix and Match different From and To Methods Sanity test Add to Dominant Route option 508 and i18n testing |

Devtopia Issue

![image1.png](../media/doc785_image1.png)

## Slide 2

| Positive Tests: UI (Pre-Edit) |
| --- |
| Ensure new checkbox is only within the attributes pane of Add Line Event and Add Multiple Line Event tools Ensure checkbox can be checked and unchecked Ensure default checkbox state is unchecked Ensure checkbox state persists when navigating between panes In Pro project options, ensure new checkbox is within the Event Editing group Ensure checkbox in Pro project settings can be checked and unchecked Ensure default checkbox state is unchecked in Pro project options Ensure Pro option checkbox setting reflects in the Attributes pane If previous edit is at end of route on a line, ensure that the next edit does not go on to the next route If value is entered with max number of decimals, ensure that this carries to the next edit If previous edit is at a negative measure, ensure that next edit is still at a negative measure |

| Positive Tests: UI (Post-Edit) |
| --- |
| When unchecked, tool UI performs as it does today (Route and Measure will be default method in first pane when starting a new edit after performing an edit) If user does not change the From Method upon the new edit and clicks Next, the To Method and its populated info from the previous edit will populate in the From Method section for the new edit If user changes From Method and clicks Next, do not populate any information from the previous edit since the method has been changed Ensure whichever method was used for the To Method in the previous edits persists as the To Method for the new edit If user changes the To Method and clicks Next, continue to populate the From Section as expected If user enables any data validation options and checkbox is checked, these options will persist into the next edit If user enables any data validation options and checkbox is unchecked, these options will not persist into the next edit If user enters in specific dates for the From and To Date (including the date checkboxes) and the checkbox is checked, this info will persist into the next edit If user enters in specific dates for the From and To Date (including the date checkboxes) and the checkbox is unchecked, this info will not persist into the next edit If user enters in specific attributes for the line event(s) to add, ensure this attribute info persists into the next edit |

![image1.png](../media/doc785_image1.png)

## Slide 3

| Positive Tests |
| --- |
| Event added using To Method of Route and Measure with same units as default units, new edit will have Route and Measure and its populated info as the From Method Event added using To Method of Route and Measure with different units selected, new edit will have Route and Measure and its populated info as the From Method including the different unit selection Event added using To Method of Location Offset (Intersection), new edit will have Location Offset and its populated intersection info as the From Method Event added using To Method of Location Offset (Point Event), new edit will have Location Offset and its populated point event info as the From Method Event added using To Method of Location Offset (Non-LRS Point Feature), new edit will have Location Offset and its populated non-LRS point feature info as the From Method Event added using To Method of Coordinates (LRS Spatial Reference), new edit will have Coordinates and its populated LRS spatial reference coordinates as the From Method Event added using To Method of Coordinates (Web Map Spatial Reference), new edit will have Coordinates and its populated web map spatial reference coordinates as the From Method Event added using To Method of Coordinates (WGS 1984 Spatial Reference), new edit will have Coordinates and its populated WGS 1984 spatial reference coordinates as the From Method |
