# Add Spanning Line Events to Dominant Routes in Experience Builder – Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 170 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24793](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24793) |
| **Source** | [AddSpanningLinesDominant_ExB_testplan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/AddSpanningLinesDominant_ExB_testplan.pptx>) |
| **People** | author Lakshmi Ananthanarayanan · PE — · dev 1 |
| **Edited** | 2025-05-22 21:25 by Claire Wang |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | spanning line event · dominant route · concurrency · route direction · event merging · automation · configuration |
| **Tools** | Add Point · Add Line |

## Summary

Test plan for adding spanning line events to dominant routes in Experience Builder. Covers configuration options for concurrency toggles, various test scenarios including spatial and temporal concurrencies, route directions, and conflict prevention. Includes automation updates and documentation revisions related to these features.

## Related documents

<!-- related:begin -->
- [Add Point and non-Spanning Line Event to Dominant Route in Experience Builder – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24792-add-point-and-non-spanning-line-event-to-dominant-route.md>) — similar text 0.59 · 6 title words · 4 filename words · same kind/surface/dev/folder <!-- rel:169 s=9.696 -->
- [Experience Builder: Add Multiple Line Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/16343-exb-add-multiple-line-events-widget.md>) — similar text 0.13 · 5 title words · 1 filename word · same kind/surface/folder <!-- rel:457 s=5.122 -->
- [Add Point Event to Dominant Route in ArcGIS Pro – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3916-add-point-event-to-dominant-route-in-pro.md>) — similar text 0.26 · 2 title words · 3 filename words · same kind/folder <!-- rel:360 s=4.713 -->
- [View-only (non editable) DynSeg / SLD in Experience Builder – test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/20071-view-only-non-editable-dynseg-sld-in-exb.md>) — similar text 0.21 · 2 title words · 1 filename word · same kind/surface/dev/folder <!-- rel:161 s=4.649 -->
- [Experience Builder: Add Single Line Event Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/16340-exb-add-single-line-event-widget.md>) — similar text 0.16 · 4 title words · 1 filename word · same surface/folder <!-- rel:455 s=4.462 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Add calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/add-calibration-points.html)

_No page matched:_ [Add Line](https://www.google.com/search?q=%22Add%20Line%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Add Spanning Line Events to Dominant Routes in ExB – test plan <!-- slide 1 -->

https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24793

PE:
Dev:

## Test Cases

### TC-U01 — When concurrency exists <!-- src: S5 · slide 2 · label When concurrency exists -->

**Steps:**
1. Disabled & visible & Don’t override off: checkbox shows up as unchecked in UI, and users have control. If users choose to check the option, they see dominancy pane.
2. Disabled & visible & Don’t override on: checkbox shows up as unchecked in UI, and users have control. If users choose to check the option, they don’t see dominancy pane.
3. Enabled & visible & Don’t override off: checkbox shows up as checked in UI, and users have control. If users choose to keep the option checked, they see dominancy pane.
4. Enabled & visible & Don’t override on: checkbox shows up as checked in UI, and users have control. If users choose to keep the option checked, they don’t see dominancy pane.
5. If Hide Add to Dominant Route Option is on (checkbox does not show in UI) – Only add to selected route(s) in the first pane no matter what the other two toggles say.

## Other content

### Slide 2 <!-- slide 2 -->

Notes – Configuration – as no new development is needed
The new section for concurrencies in Add Point and Add Line’s configuration with the 3 toggles should already be implemented from the previous user story.

### Slide 3 <!-- slide 3 -->

New conditions for spanning events
Order the sections by measure and route. The first record should be the From Route, From Measure going across that From Route to the next Route on the line and ending with the To Route, To Measure as the last record

(0 to 0.138) RouteA
Toboso Transit Line 1400
(0.138 to 0.3) RouteA
(0 to 1) RouteB

(0 to 0.138) RouteA
	RouteA
	0 – 0.138
(0.138 to 0.3) RouteA
	Dominant1
	8 – 10
(0 to 1) RouteB
	Dominant1
	10 – 14
(2 to 2.2) RouteC
	Dominant1
	14 – 15
(2.2 to 2.5) RouteC
	Dominant2
	100 – 100.3
(2.5 to 3) RouteC
	RouteC
	2.5 - 3

[figure: Time Range · Selected Route Name · RouteA · RouteB · RouteC · Dominant1 · Dominant2 · …]

![Figure 1 — 3](../media/24793-add-spanning-line-events-to-dominant-routes-in-exb/fig-01-slide-03-3.png)
![Figure 2 — 3](../media/24793-add-spanning-line-events-to-dominant-routes-in-exb/fig-02-slide-03-3.png)

![Figure 3 — 3](../media/24793-add-spanning-line-events-to-dominant-routes-in-exb/fig-03-slide-03-3.svg)

### Slide 4 <!-- slide 4 -->

Test

- Test Add Line widgets with different combinations of the 3 toggles in express and non-express modes
- Test with adding single and multiple spanning line events in a line network. Test few cases for adding spanning and non-spanning line events together
- Test normal and gapped routes
- Test a few cases where selected route and concurrent route are in opposite directions
- Test a few cases where routes in lines have different directions
- Test with spatial (routes fully/partially/not overlap) and temporal (time slices) concurrencies
  - Sanity test a few where there is no concurrency
  - Test scenarios where there are concurrencies across multiple time slices and the primary/dominant route changes over time
- Test with and without conflict prevention (“cannot acquire locks” is the only error case for this user story)
- Consider utilizing the data and test cases from the Pro version of Add Line, and Append Events to Dominant Route user stories (attached in devtopia issue)
  - Required: Add Line – 6 7; Append Events –spanning line: 3 4 5
  - Optional: other test cases
- Test expanding, selecting, and highlighting the segment
- Verify spatially coincident events should merge if Merge coincident events is checked. Verify temporally coincident events should merge automatically (see 5890 for point; 6279 for append; 6779 for line – still in progress – should be fixed when this user story is worked on)
- Verify the tool aligns with any other Experience Builder specifications/requirements
- 508/i18n (check with Mac and Chandan. 508 should be automatically done by Chandan’s team.)
- Test with various themes for the text color showing in the pane
- Test in different browsers (chrome and firefox) and layouts

### Slide 5 <!-- slide 5 -->

Automation
Add new automation cases for this scenario in Add Point and Add Line widgets
Note the existing automation may break and need to be updated

Documentation
Update existing documentation to mention:

    - These new configuration options and what they do
    - The updates the workflow and UX when this option is selected in the widget
