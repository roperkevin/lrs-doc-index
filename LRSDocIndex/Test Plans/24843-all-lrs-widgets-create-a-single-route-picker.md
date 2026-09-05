# All LRS Widgets: Create a Single Route Picker

| Field | Value |
| --- | --- |
| **Doc** | 180 · Test Plan · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24843](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24843) |
| **Source** | [24843-SingleRoutePicker_TestPlanV1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/LR%20Product%20Engineers/24843-SingleRoutePicker_TestPlanV1.pptx>) · rev V1 |
| **People** | author Mac Christmas · PE — · dev Devtopia Issue |
| **Edited** | 2025-05-07 14:33 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | route picker · experience builder widget · route selection · measure selection · self intersecting location · route id · route name |
| **Tools** | Add Point Event · Add Line Event · Split Event · LRS Identify |

## Summary

Test plan for creating a single route picker to be used across all LRS widgets in Experience Builder. Covers positive tests for route picker behavior including icon consistency, route selection pop-ups, and measure selection pop-ups across multiple widgets and data configurations. Ensures consistency, edit sanity, and compliance with internationalization and accessibility standards.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/3040-iteration-planning-and-issue-tracking-for-lr-3-8-12-2.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24843 · similar text 0.05 <!-- rel:2 s=1000.558 -->
- [Create single LRS picker for Experience Builder widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-single-lrs-picker-for-exb-widgets.md>) — similar text 0.30 · 4 title words · 2 filename words · same surface <!-- rel:193 s=4.427 -->
- [Experience Builder Express Mode support for LRS widgets – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24773-exb-express-mode-support-for-lrs-widgets.md>) — similar text 0.17 · 1 title word · same kind/surface/folder <!-- rel:174 s=3.423 -->
- [Location Offset Method in Add Point and Add Line Widgets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/24790-location-offset-method-in-add-point-and-add-line-widgets.md>) — similar text 0.11 · 1 title word · same kind/surface <!-- rel:48 s=2.723 -->
- [Test Plan: Conflict Prevention for LRS Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/17309-conflict-prevention-for-lrs-widgets.md>) — similar text 0.05 · 1 title word · same kind/surface <!-- rel:415 s=2.384 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [LRS Identify](https://www.google.com/search?q=%22LRS%20Identify%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-P01 — Picker button icon is visually same across all widgets (except for LRS Identify) <!-- src: S4 · slide 1 · Positive Tests: All Widgets · 1 -->

- **Group:** All Widgets

### TC-P02 — Picker button icon updates appropriately with all out-of-the-box themes <!-- src: S4 · slide 1 · Positive Tests: All Widgets · 2 -->

- **Group:** All Widgets

### TC-P03 — When active vs. non-active <!-- src: S4 · slide 1 · Positive Tests: All Widgets · 3 -->

- **Group:** All Widgets
- **Case:** When active vs. non-active, the picker button icon will visually reflect the state

### TC-P04 — Clicking a location with no routes will not populate any RouteID/RouteName <!-- src: S4 · slide 1 · Positive Tests: All Widgets · 4 -->

- **Group:** All Widgets
- **Case:** Clicking a location with no routes will not populate any RouteID/RouteName or measure

### TC-P05 — Picker behavior is consistent between widgets <!-- src: S4 · slide 1 · Positive Tests: All Widgets · 5 -->

- **Group:** All Widgets

### TC-P06 — When clicking on a location with one route, the RouteID/RouteName populates <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line/Split Event Widgets · 1 -->

- **Group:** Add Point / Add Line / Split Event Widgets

### TC-P07 — When clicking on a location with more than one route <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line/Split Event Widgets · 2 -->

- **Group:** Add Point / Add Line / Split Event Widgets
- **Case:** When clicking on a location with more than one route, a route selection pop-up appears

### TC-P08 — When clicking on a self-intersecting location <!-- src: S4 · slide 1 · Positive Tests: Add Point/Add Line/Split Event Widgets · 3 -->

- **Group:** Add Point / Add Line / Split Event Widgets
- **Case:** When clicking on a self-intersecting location, a measure selection pop-up appears (except for Split Event, only routes can be picked

### TC-P09 — When clicking on a location with one route (1) <!-- src: S4 · slide 1 · Positive Tests: LRS Identify Widget · 1 -->

- **Group:** LRS Identify Widget
- **Case:** When clicking on a location with one route, the pop-up appears with the route info

### TC-P10 — When clicking on a location with one route (2) <!-- src: S4 · slide 1 · Positive Tests: LRS Identify Widget · 2 -->

- **Group:** LRS Identify Widget
- **Case:** When clicking on a location with one route, the pop-up appears with the route info and event info, when configured

### TC-P11 — When clicking a location with more than one route <!-- src: S4 · slide 1 · Positive Tests: LRS Identify Widget · 3 -->

- **Group:** LRS Identify Widget
- **Case:** When clicking a location with more than one route, all routes appear in the pop-up

### TC-P12 — When clicking a self-intersecting location <!-- src: S4 · slide 1 · Positive Tests: LRS Identify Widget · 4 -->

- **Group:** LRS Identify Widget
- **Case:** When clicking a self-intersecting location, both measures are displayed in the pop-up

## Other content

### Slide 1 — Devtopia Issue <!-- slide 1 -->

All LRS Widgets: Create a single route picker

**Notes**
- Need to create a single route picker for all widgets in ExB to maintain consistency between widgets
- Test with all widgets that include a route picker. Widgets to test:
- Add Point Event
- Add Line Event
- LRS Identify
- Split Event
- Test with mix of APR, UNAPR, RH, ADMRH and PoM data
- Test with data in PCS vs. GCS
- Test with LRS networks configured with RouteID vs. RouteName
- Ensure consistency between the picker in each widget
- Sanity test edits can still be performed
- I18n and 508 compliance
