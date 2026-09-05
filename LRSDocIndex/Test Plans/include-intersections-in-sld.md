# Test Plan: Include Intersections in Straight Line Diagram

| Field | Value |
| --- | --- |
| **Doc** | 71 · Test Plan · Experience Builder |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [TestPlan_Include Intersections in SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_Include%20Intersections%20in%20SLD.pptx>) |
| **People** | author Karlie Murray · PE — · dev — |
| **Edited** | 2026-02-18 23:24 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | intersection · straight line diagram · dynamic segmentation · route · event attribute set · experience builder |
| **Tools** | Straight Line Diagram · Dynamic Segmentation · Select by Route |

## Summary

This test plan covers verifying the inclusion and display of intersections in the Straight Line Diagram (SLD) within Experience Builder. It includes configuration tests for intersection layer visibility, symbology, and labeling, UI tests for interaction and display behavior, and regression tests to ensure dynamic segmentation results match across different input methods. The plan tests with various LRS network types and intersection layer configurations.

## Related documents

<!-- related:begin -->
- [Include Intersections in Straight Line Diagram (SLD) User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-intersections-in-sld-sld.md>) — similar text 0.35 · 5 title words · 3 filename words · same surface <!-- rel:183 s=6.077 -->
- [Dynamic Segmentation – Straight Line Diagram Support - ExB](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/20594-dynseg-sld-support-exb.md>) — similar text 0.34 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:346 s=5.461 -->
- [Include Centerlines in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-centerlines-in-sld.md>) — similar text 0.27 · 4 title words · 2 filename words · same surface <!-- rel:182 s=5.035 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-sld.md>) — similar text 0.26 · 4 title words · 2 filename words · same surface <!-- rel:181 s=4.448 -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/24784-display-expanded-lrs-and-business-attributes-in-the-sld.md>) — similar text 0.35 · 1 filename word · same kind/surface/folder <!-- rel:908 s=4.159 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Select by Route](https://www.google.com/search?q=%22Select%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Test PLAN: Include Intersections in SLD <!-- slide 1 -->

### Slide 2 — NOTEs <!-- slide 2 -->

- Verify UI aligns with Experience Builder style
- SLD View shows intersections when intersections are present/turned on
- Sanity check Dynseg table does not show any intersection
- Test with nonline and line networks, with line and/or point event attribute sets
- Test route-route and route-polygon intersection layers
- Test different display fields
- Test different symbology for multiple intersection layers
- Verify intersection fields are not editable
- Test with different themes
- Test with different browsers

## Test Cases

### TC-U01 — Intersections shown in SLD when intersection layers are enabled <!-- src: LLM · slide 3 · Configuration Tests, bullet 1 -->
- **Group:** Configuration Tests
- **Case:** Intersections are shown in SLD when intersection layers are enabled/turned on in "Select Layers" pane and in Layers UI

### TC-U02 — Intersections in the SLD are labeled with description field <!-- src: LLM · slide 3 · Configuration Tests, bullet 2 -->
- **Group:** Configuration Tests

### TC-U03 — Intersections in the SLD have the same symbology as the webmap <!-- src: LLM · slide 3 · Configuration Tests, bullet 3 -->
- **Group:** Configuration Tests
- **Case:** Intersections in the SLD have the same symbology as the webmap
  - Changing the intersection layer's symbology in the webmap reflects in the SLD

### TC-U04 — No intersections are shown in SLD when: <!-- src: LLM · slide 3 · Configuration Tests, item 4 -->
- **Group:** Configuration Tests
- **Case:** No intersections are shown in SLD when:
- **Steps:**
  1. The webmap doesn't contain any intersection layers
  2. All intersection layers are turned off in "Select Layers" pane
  3. All intersections are turned off in the Layers UI

### TC-U05 — Users can choose any non-editor tracking or system fields <!-- src: LLM · slide 3 · Configuration Tests, item 5 -->
- **Group:** Configuration Tests
- **Case:** Users can choose any non-editor tracking or system fields by selecting the intersection layer in the webmap layer list
  - Use “Layer Name” in layer configuration instead of the current “Event Name”

### TC-U06 — “Line only” Default Attribute Set Type still shows intersections in SLD <!-- src: LLM · slide 3 · Configuration Tests, item 6 -->
- **Group:** Configuration Tests
- **Case:** When “Line only” is chosen for showing events in Default Attribute Set Type field, we still show intersections in SLD

### TC-U07 — “Diagram” in Default Dynamic Segmentation Result field defaults to SLD <!-- src: LLM · slide 3 · Configuration Tests, item 7 -->
- **Group:** Configuration Tests
- **Case:** Selecting “Diagram” in Default Dynamic Segmentation Result field sets the default to show SLD

### TC-U08 — Display fields shown on hover over an intersection record can be configured <!-- src: LLM · slide 3 · Configuration Tests, item 8 -->
- **Group:** Configuration Tests
- **Case:** The display fields shown when hovering mouse over an intersection record in SLD can be configured

### TC-U09 — If ID field is set to display field do not show ID field twice <!-- src: LLM · slide 3 · Configuration Tests, bullet under item 8 -->
- **Group:** Configuration Tests

### TC-U10 — By default, intersection layers are displayed at the top of the SLD <!-- src: LLM · slide 4 · SLD UI Tests, bullet 1 -->
- **Group:** SLD UI Tests
- **Case:** By default, intersection layers are displayed at the top of the SLD
  - If the webmap has multiple visible intersection layers, the intersections are in order of how they appear in Layers UI

### TC-U11 — Intersection layers can be turned off, intersection row moves to bottom <!-- src: LLM · slide 4 · SLD UI Tests, bullet 2 -->
- **Group:** SLD UI Tests
- **Case:** Intersection layers can be turned off, and the intersection row moves to the bottom

### TC-U12 — View intersection attributes by double-click; fields are not editable <!-- src: LLM · slide 4 · SLD UI Tests, bullet 3 -->
- **Group:** SLD UI Tests
- **Case:** Users can view the intersection attributes by double-clicking on an intersection record. The attribute fields are not editable.
  - No statistics section shown when viewing attributes

### TC-U13 — Hovering over an intersection record displays tooltip with display fields <!-- src: LLM · slide 4 · SLD UI Tests, bullet 4 -->
- **Group:** SLD UI Tests
- **Case:** Hovering mouse over an intersection record displays a tooltip showing the display fields

### TC-U14 — Hovering over measure row displays correct measure in a tooltip <!-- src: LLM · slide 4 · SLD UI Tests, bullet 5 -->
- **Group:** SLD UI Tests
- **Case:** Hovering mouse over measure row displays the correct measure of the intersection in a tooltip

### TC-U15 — Intersections records are labeled in the intersection row <!-- src: LLM · slide 4 · SLD UI Tests, bullet 6 -->
- **Group:** SLD UI Tests

### TC-U16 — Multiple intersection layers pointing to same source are both shown <!-- src: LLM · slide 4 · SLD UI Tests, bullet 7 -->
- **Group:** SLD UI Tests
- **Case:** If there are multiple intersection layers that point to the same source, then both layers will still be shown

### TC-U17 — Definition query on intersections layer honored in ExB and SLD <!-- src: LLM · slide 4 · SLD UI Tests, bullet 8 -->
- **Group:** SLD UI Tests
- **Case:** Ensure a definition query on the intersections layer via webmap is honored on the intersections layer in ExB and SLD

### TC-N01 — Dynseg a route that does not have intersections <!-- src: LLM · slide 4 · SLD UI Tests, bullet 9 (Negative) -->
- **Group:** SLD UI Tests
- **Case:** Negative – Dynseg a route that does not have intersections – SLD will show an empty row for intersections.

### TC-U18 — Populate the SLD via the Select by Route widget <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 1 -->
- **Group:** SLD Regression Tests
- **Case:** Populate the SLD via the Select by Route widget: search for route > selecting Actions > Dynamic Segmentation

### TC-U19 — Populate the SLD by identifying a route in map <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 2 -->
- **Group:** SLD Regression Tests
- **Case:** Populate the SLD by identifying a route in map > selecting Actions > Dynamic Segmentation

### TC-U20 — Populate the SLD by typing route into route field <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 3 -->
- **Group:** SLD Regression Tests

### TC-U21 — The dynamic segmentation results in the table and SLD match <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 4 -->
- **Group:** SLD Regression Tests

### TC-U22 — Non-intersection event layers displayed per the attribute set <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 5 -->
- **Group:** SLD Regression Tests
- **Case:** The non-intersection event layers are displayed in the correct order, amount, and symbology per the attribute set

### TC-U23 — Map Interact button opens identify window after selecting a map feature <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 6 -->
- **Group:** SLD Regression Tests
- **Case:** The Map Interact button opens the identify window after selecting a map feature

### TC-U24 — Zoom in/out and navigation buttons work as designed <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 7 -->
- **Group:** SLD Regression Tests
- **Case:** The zoom in/out and navigation buttons work as designed – zooming with the Sync to map button

### TC-U25 — The SLD window can be set as a floating window <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 8 -->
- **Group:** SLD Regression Tests

### TC-U26 — The SLD window can be docked <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 9 -->
- **Group:** SLD Regression Tests

### TC-U27 — The layers in the SLD can be turned on/off <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 10 -->
- **Group:** SLD Regression Tests
- **Case:** The layers in the SLD can be turned on/off – layers move to bottom when turned off

### TC-U28 — Test with timeline widget and date filter widget <!-- src: LLM · slide 5 · SLD Regression Tests, bullet 11 -->
- **Group:** SLD Regression Tests

### TC-U29 — Run SLD UI tests with <!-- src: LLM · slide 6 · Datasets to Tests -->
- **Group:** Datasets to Tests
- **Case:** Run SLD UI tests with
- **Steps:**
  1. Line LRS networks
  2. Non-line LRS networks
  3. Route-route intersection layers
  4. Route-polygon intersection layers
  5. Route-polyline intersection layers
  6. Multiple intersection layers in the same network
  7. Networks with line and point events

### TC-N02 — Dynseg a route that does not have intersections <!-- src: LLM · slide 6 · Datasets to Tests › Notes (Negative) -->
- **Group:** Datasets to Tests — Notes
- **Case:** Negative – dynseg a route that does not have intersections. It will show the empty row for intersections.
