# Test Plan: Include Intersections in Straight Line Diagram

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Source** | [TestPlan_Include Intersections in SLD.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_Include%20Intersections%20in%20SLD.pptx>) |
| **Edited** | 2026-02-18 23:24 by Karlie Murray |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Test Plan: Include Intersections in Straight Line Diagram"
source_file: "TestPlan_Include Intersections in SLD.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_Include%20Intersections%20in%20SLD.pptx"
doc_id: 71
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Karlie Murray"
last_edited_by: "Karlie Murray"
last_edited: "2026-02-18T23:24:00Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersection", "straight line diagram", "dynamic segmentation", "route", "event attribute set", "experience builder"]
tools: ["Straight Line Diagram", "Dynamic Segmentation", "Select by Route"]
products: []
issues: []
related: [{"doc":183,"file":"include-intersections-in-straight-line-diagram-sld-user-story__doc183.md","s":6.077},{"doc":346,"file":"dynamic-segmentation-straight-line-diagram-support-exb__doc346.md","s":5.461},{"doc":182,"file":"include-centerlines-in-straight-line-diagram__doc182.md","s":5.035},{"doc":181,"file":"include-site-addresses-layer-in-straight-line-diagram__doc181.md","s":4.448},{"doc":908,"file":"test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md","s":4.159}]
```
-->

## Summary

This test plan covers verifying the inclusion and display of intersections in the Straight Line Diagram (SLD) within Experience Builder. It includes configuration tests for intersection layer visibility, symbology, and labeling, UI tests for interaction and display behavior, and regression tests to ensure dynamic segmentation results match across different input methods. The plan tests with various LRS network types and intersection layer configurations.

## Related documents

<!-- related:begin -->
- [Include Intersections in Straight Line Diagram (SLD) User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-intersections-in-straight-line-diagram-sld-user-story__doc183.md>) — similar text 0.35 · 5 title words · 3 filename words · same surface <!-- rel:183 -->
- [Dynamic Segmentation – Straight Line Diagram Support - ExB](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/dynamic-segmentation-straight-line-diagram-support-exb__doc346.md>) — similar text 0.34 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:346 -->
- [Include Centerlines in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-centerlines-in-straight-line-diagram__doc182.md>) — similar text 0.27 · 4 title words · 2 filename words · same surface <!-- rel:182 -->
- [Include Site Addresses Layer in Straight Line Diagram](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/include-site-addresses-layer-in-straight-line-diagram__doc181.md>) — similar text 0.26 · 4 title words · 2 filename words · same surface <!-- rel:181 -->
- [Test Plan: Display Expanded LRS and Business Attributes in the SLD Hover Tooltip](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-display-expanded-lrs-and-business-attributes-in-the-sld-hover-tooltip__doc908.md>) — similar text 0.35 · 1 filename word · same kind/surface/folder <!-- rel:908 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html)

_No page matched:_ [Straight Line Diagram](https://www.google.com/search?q=%22Straight%20Line%20Diagram%22+site%3Adoc.esri.com) · [Select by Route](https://www.google.com/search?q=%22Select%20by%20Route%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Test PLAN: Include Intersections in SLD

## Slide 2 — NOTEs

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

## Slide 3 — Configuration Tests​

- Intersections are shown in SLD when intersection layers are enabled/turned on in "Select Layers" pane and in Layers UI
- Intersections in the SLD are labeled with description field
- Intersections in the SLD have the same symbology as the webmap
  - Changing the intersection layer's symbology in the webmap reflects in the SLD
4. No intersections are shown in SLD when:

  - The webmap doesn't contain any intersection layers
  - All intersection layers are turned off in "Select Layers" pane
  - All intersections are turned off in the Layers UI
5.Users can choose any non-editor tracking or system fields by selecting the intersection layer in the webmap layer list

  - Use “Layer Name” in layer configuration instead of the current “Event Name”
6. When “Line only” is chosen for showing events in Default Attribute Set Type field, we still show intersections in SLD
7. Selecting “Diagram” in Default Dynamic Segmentation Result field sets the default to show SLD
8. The display fields shown when hovering mouse over an intersection record in SLD can be configured

- If ID field is set to display field do not show ID field twice

## Slide 4 — SLD UI Tests​

- By default, intersection layers are displayed at the top of the SLD
  - If the webmap has multiple visible intersection layers, the intersections are in order of how they appear in Layers UI
- Intersection layers can be turned off, and the intersection row moves to the bottom
- Users can view the intersection attributes by double-clicking on an intersection record. The attribute fields are not editable.
  - No statistics section shown when viewing attributes
- Hovering mouse over an intersection record displays a tooltip showing the display fields
- Hovering mouse over measure row displays the correct measure of the intersection in a tooltip
- Intersections records are labeled in the intersection row
- If there are multiple intersection layers that point to the same source, then both layers will still be shown
- Ensure a definition query on the intersections layer via webmap is honored on the intersections layer in ExB and SLD
- Negative – Dynseg a route that does not have intersections – SLD will show an empty row for intersections.

## Slide 5 — SLD Regression Tests​

- Populate the SLD via the Select by Route widget: search for route > selecting Actions > Dynamic Segmentation
- Populate the SLD by identifying a route in map > selecting Actions > Dynamic Segmentation
- Populate the SLD by typing route into route field
- The dynamic segmentation results in the table and SLD match
- The non-intersection event layers are displayed in the correct order, amount, and symbology per the attribute set
- The Map Interact button opens the identify window after selecting a map feature
- The zoom in/out and navigation buttons work as designed – zooming with the Sync to map button
- The SLD window can be set as a floating window
- The SLD window can be docked
- The layers in the SLD can be turned on/off – layers move to bottom when turned off
- Test with timeline widget and date filter widget

## Slide 6 — Datasets to Tests

Run SLD UI tests with

- Line LRS networks
- Non-line LRS networks
- Route-route intersection layers
- Route-polygon intersection layers
- Route-polyline intersection layers
- Multiple intersection layers in the same network
- Networks with line and point events

### Notes

Negative – dynseg a route that does not have intersections. It will show the empty row for intersections.
