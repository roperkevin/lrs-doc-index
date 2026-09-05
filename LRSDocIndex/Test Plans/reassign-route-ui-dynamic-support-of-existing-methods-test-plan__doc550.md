# Reassign Route UI: Dynamic Support of Existing Methods Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#5152](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5152) |
| **Source** | [5152-ReassignRouteUIDynamicSupportofExistingMethods_TestPlan_V5.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5152-ReassignRouteUIDynamicSupportofExistingMethods_TestPlan_V5.pptx>) |
| **Edited** | 2023-06-07 19:49 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Reassign Route UI: Dynamic Support of Existing Methods Test Plan"
source_file: "5152-ReassignRouteUIDynamicSupportofExistingMethods_TestPlan_V5.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5152-ReassignRouteUIDynamicSupportofExistingMethods_TestPlan_V5.pptx"
doc_id: 550
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: "V5"
target_release: ""
pe: ""
dev: ""
author: "Mac Christmas"
last_edited_by: "Mac Christmas"
last_edited: "2023-06-07T19:49:23Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["reassign route", "merge to adjacent route", "form a new route", "dynamic segmentation", "calibration points", "recalibration", "line network", "nonline network", "route attributes", "user interface", "test plan"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#5152"]
related: [{"doc":586,"file":"reassign-ui-change-to-dynamically-support-existing-reassign-methods-pro__doc586.md","s":4.981},{"doc":34,"file":"reassign-route-ai-assistant-test-plan__doc34.md","s":4.963},{"doc":11,"file":"reassign-route-subsequent-pane-ai-assistant-test-plan__doc11.md","s":4.703},{"doc":533,"file":"reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md","s":4.358},{"doc":535,"file":"reassign-ui-existing-line-test-plan__doc535.md","s":4.155}]
```
-->

## Summary

Test plan for the Reassign Route user interface focusing on dynamic support of existing methods including Merge to adjacent route and Form a new route. Covers positive and negative test cases for APR, RH, and PoM data across file geodatabase, enterprise geodatabase, and feature service environments. Tests include UI behavior, parameter validation, recalibration, transfer of calibration points, and handling of line and non-line networks.

## Related documents

<!-- related:begin -->
- [Reassign UI Change to Dynamically Support Existing Reassign Methods - Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/reassign-ui-change-to-dynamically-support-existing-reassign-methods-pro__doc586.md>) — similar text 0.49 · 4 title words · 1 filename word <!-- rel:586 -->
- [Reassign Route AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-ai-assistant-test-plan__doc34.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/folder <!-- rel:34 -->
- [Reassign Route Subsequent Pane AI Assistant Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/reassign-route-subsequent-pane-ai-assistant-test-plan__doc11.md>) — similar text 0.14 · 2 title words · 2 filename words · same kind/folder <!-- rel:11 -->
- [Reassign Route Transfer to Another Line Method: Support Move Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-route-transfer-to-another-line-method-support-move-event-behavior-test__doc533.md>) — similar text 0.30 · 3 title words · 1 filename word · same kind/folder <!-- rel:533 -->
- [Reassign UI Existing Line Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reassign-ui-existing-line-test-plan__doc535.md>) — similar text 0.29 · 2 title words · 2 filename words · same kind/folder <!-- rel:535 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Route reassignment](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/reassign-routes.html) · [Merge to adjacent route method](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-to-adjacent-route-method.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Slide 1

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 8 fields, 4 buttons, 2 row separators, 8 icons, 25 text rows. 14 of 25 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide1_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 fields, 1 row separator, 2 icons, 32 text rows. 17 of 32 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide1_fig2.svg)

Reassign Route UI: Dynamic Support of Existing Methods

| Notes |
| --- |
| Test only with existing reassign methods. These methods are Merge to adjacent route and Form a new route Test with APR, RH, and PoM data Test mostly in FS, test a couple cases in FGDB and EGDB DC Sample test with normal and complex routes with partial, whole, and entire route(s) selected to reassign. Also test combinations of multiple routes, partial, whole route(s), partial of one route and whole of another route, etc. Test in Light and Dark mode Sample test each existing method’s UI changes and check reassignment results are correct with associated parameters (transfer calibration points, recalibrate downstream, etc.) used Test on projected/unprojected data Hover text for methods will be part of a different user story 508 and i18n Doc needs update to reflect UI changes Automation covered in separate user story |

Devtopia Issue

![image1.png](../media/doc390_image1.png) ![image2.png](../media/doc390_image2.png) ![image3.png](../media/doc390_image3.png) ![image4.png](../media/doc390_image4.png)

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 fields, 1 row separator, 2 icons, 32 text rows. 17 of 32 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide2_fig1.svg)

| Positive Tests: General |
| --- |
| Ensure that when no network is chosen, the Method section defaults to Merge to adjacent route (grayed out) and the Target section Route Name is grayed out Ensure that when no network is chosen the source section defaults to the line network layout Ensure that once a network is chosen, target section becomes available based on the network type chosen as the input network Ensure that if the input network is changed, clear all input info and reset the method dropdown to the default value based on whether an input nonline or line network is chosen. Also ensure the target section updates to reflect the chosen network Ensure that if the method is changed, clear all input info in the Target section and replace with the relevant target section info for the newly chosen method Ensure “Source Route” and “Target Route” sections have been renamed to “Source” and “Target,” respectively Ensure all measure/route/line pickers work as intended Ensure calendar date picker works as intended Ensure all calculation buttons work as intended Ensure all check boxes work as intended Ensure that when a network is configured with RouteName vs. RouteID the tool reflects this Ensure a scroll bar appears if the contents are too long to fit within the pane. Ensure switching between panes maintains inputs Ensure that scrolling works correctly when a dropdown is active If method is set to Form a new route, ensure that recalibrate target route checkbox does not show |

| Positive Tests: Non-Line Network First Pane (Input Parameters) |
| --- |
| Ensure the methods dropdown only has “Merge to adjacent route” and “Form a new route” methods Ensure method “Merge to adjacent route” is chosen by default Ensure the tool runs without a second pane only if the input LRS network has no nonLRS attributes Ensure once a nonline network is the input, change the source, method, and target sections are the nonline network template |

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 4 fields, 5 icons, 22 text rows. 13 of 22 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide2_fig2.svg)

| Positive Tests: Non-Line Network Second Pane (New Route Attributes) |
| --- |
| Ensure the second pane appears only when the input LRS Network has nonLRS attributes Test domains, attribute rules, contingent values, and subtypes work correctly in the attribute grid Ensure the field aliases show and not the actual field name Ensure a scroll bar appears if there are too many attribute fields to fit within the pane Ensure a scroll bar appears if a field has too many values to fit within the pane Ensure the eyedropper tool works as intended, sanity test |

![image5.png](../media/doc390_image5.png) ![image2.png](../media/doc390_image2.png)

## Slide 3

| Positive Tests: Line Network Second Pane (Routes to Retire) |
| --- |
| Ensure the routes that will be retired as a result of the reassignment are shown with the measures where the routes will be retired For Merge to adjacent route method, ensure that a note is added detailing how the routes on the source line will be retired and merged into the target route For Form a new route method, ensure that a note is added detailing how the routes on the source line will be retired and form a single target route |

| Positive Tests: Line Network Third Pane (New Route Attributes) |
| --- |
| Ensure the third pane appears only when the input LRS Network has nonLRS attributes Test domains, attribute rules, contingent values, and subtypes work correctly in the attribute grid Ensure the field aliases show and not the actual field name Ensure a scroll bar appears if there are too many attribute fields to fit within the pane Ensure a scroll bar appears if a field has too many values to fit within the pane Ensure the eyedropper tool works as intended, sanity test |

| Negative Tests: Line Network |
| --- |
| Ensure that when Merge to adjacent route method is chosen, the route name cannot be a non-adjacent route or a new route Ensure that when Form a new route method is chosen, the new Route Name or RouteID cannot be the same as an existing route Ensure that validation for incorrect input parameters occurs when Next is clicked. Sample test invalid route creation scenarios |

| Negative Tests: Non-Line Network |
| --- |
| Ensure that when Merge to adjacent route method is chosen, the route name cannot be a non-adjacent route or a new route Ensure that when Form a new route method is chosen, the route name cannot be the same as an existing route Ensure that validation for incorrect input parameters occurs when Next is clicked. Sample test invalid route creation scenarios |

| Positive Tests: Line Network First Pane (Input Parameters) |
| --- |
| Ensure the methods dropdown only has “Merge to adjacent route” and “Form a new route” methods Ensure method “Merge to adjacent route” is chosen by default Ensure the tool runs without the third pane only if the input LRS network has no nonLRS attributes Ensure that once a line network is chosen, the source, method, and target sections change to the line network template |

## Slide 4

Nonline, Merge to Adjacent Route, Recalibrate Target and Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide4_fig1.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

![Diagram drawn from the slide's own shapes: 8 nodes, 3 connectors.](../media/doc390_slide4_fig2.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | 11-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | 15.5-20 |
| 1/1/2005 | Null | R2 | R2 | 11-12 |
| 1/1/2005 | Null | R3 | R3 | 12-20 |

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 9 fields, 1 row separator, 2 icons, 32 text rows. 17 of 32 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide4_fig3.svg)

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Merge to adjacent route | R3 | 12 | 15 | Yes | Yes |

![image2.png](../media/doc390_image2.png)

## Slide 5

Nonline, Merge to Adjacent Route, Recalibrate Target and do not Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide5_fig1.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

![Diagram drawn from the slide's own shapes: 6 nodes, 3 connectors.](../media/doc390_slide5_fig2.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | 11-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | 15.5-20 |
| 1/1/2005 | Null | R2 | R2 | 11-12 |
| 1/1/2005 | Null | R3 | R3 | 12-20 |

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Merge to adjacent route | R3 | 12 | 15 | Yes | No |

## Slide 6

Nonline, Merge to Adjacent Route, do not Recalibrate Target and do not Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide6.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Merge to adjacent route | R3 | 15 | 18 | No | No |

Error, result is non-monotonic

## Slide 7

Nonline, Merge to Adjacent Route, do not Recalibrate Target and Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide7.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Merge to adjacent route | R3 | 15 | 18 | No | Yes |

Error, result is non-monotonic

## Slide 8

Nonline, Form a new route, Transfer CPs

![Diagram drawn from the slide's own shapes: 10 nodes (Nonline, Form a new route, Transfer CPs), 3 connectors.](../media/doc390_slide8_fig1.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide8_fig2.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | 11-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | 15.5-20 |
| 1/1/2005 | Null | R2 | R2 | 10-12 |
| 1/1/2005 | Null | Rnew | Rnew | 0-5 |
| 1/1/2005 | Null | R3 | R3 | 15.5-20 |

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Form a new route | Rnew | 0 | 5 | N/A | Yes |

## Slide 9

Nonline, Form a new route, do not Transfer CPs

![Diagram drawn from the slide's own shapes: 10 nodes (Nonline, Form a new route, do not Transfer CPs), 3 connectors.](../media/doc390_slide9_fig1.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | 15.5-20 |

![Diagram drawn from the slide's own shapes: 7 nodes, 4 connectors.](../media/doc390_slide9_fig2.svg)

| From Date | To Date | RouteID | Route Name | Measures |
| --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | 11-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | 15.5-20 |
| 1/1/2005 | Null | R2 | R2 | 11-12 |
| 1/1/2005 | Null | Rnew | Rnew | 0-5 |
| 1/1/2005 | Null | R3 | R3 | 15.5-20 |

| Network | Effective Date | Source From RouteID | Source From Measure | Source To Measure | Method | Target RouteID | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Continuous | 1/1/2005 | R2 | 12 | 15 | Form a new route | Rnew | 0 | 5 | N/A | No |

## Slide 10

Line, Merge to adjacent route (on the same line), Recalibrate Target and Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 3 connectors.](../media/doc390_slide10_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 11-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15.5-20 |

![Diagram drawn from the slide's own shapes: 8 nodes, 2 connectors.](../media/doc390_slide10_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 11-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | Line1 | Line1 | 300 | 15.5-20 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-6 |
| 1/1/2005 | Null | R3 | R3 | Line1 | Line1 | 200 | 7-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Merge to adjacent route | R3 | 7 | 15 | Yes | Yes |

## Slide 11

Line, Merge to adjacent route (on the same line), Recalibrate Target and do not Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide11_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15-20 |

![Diagram drawn from the slide's own shapes: 4 nodes, 2 connectors.](../media/doc390_slide11_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | Line1 | Line1 | 300 | 15-20 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-6 |
| 1/1/2005 | Null | R3 | R3 | Line1 | Line1 | 200 | 7-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Merge to adjacent route | R3 | 7 | 15 | Yes | No |

## Slide 12

Line, Merge to adjacent route (on the same line), do not Recalibrate Target and do not Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide12.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Merge to adjacent route | R3 | 15 | 24 | No | No |

Error, result is non-monotonic

## Slide 13

Line, Merge to adjacent route (on the same line), do not Recalibrate Target and Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 4 connectors.](../media/doc390_slide13.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Merge to adjacent route | R3 | 15 | 24 | No | Yes |

Error, result is non-monotonic

## Slide 14

Line, Form a new route (on the same line), do not Transfer CPs

![Diagram drawn from the slide's own shapes: 9 nodes, 3 connectors.](../media/doc390_slide14_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15-20 |

![Diagram drawn from the slide's own shapes: 6 nodes, 3 connectors.](../media/doc390_slide14_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | Line1 | Line1 | 300 | 15-20 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-6 |
| 1/1/2005 | Null | Rnew | Rnew | Line1 | Line1 | 200 | 7-15 |
| 1/1/2005 | Null | R3 | R3 | Line1 | Line1 | 300 | 7-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Form a new route | R3 | 7 | 15 | N/A | Yes |

## Slide 15

Line, Form a new route (on the same line), Transfer CPs

![Diagram drawn from the slide's own shapes: 10 nodes (Line, Form a new route (on the same line), Transfer CPs), 3 connectors.](../media/doc390_slide15_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | Null | R3 | R3 | Line1 | Line1 | 300 | 15-20 |

![Diagram drawn from the slide's own shapes: 9 nodes, 3 connectors.](../media/doc390_slide15_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 0-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 10-15 |
| 1/1/2000 | 1/1/2005 | R3 | R3 | Line1 | Line1 | 300 | 15-20 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 0-6 |
| 1/1/2005 | Null | Rnew | Rnew | Line1 | Line1 | 200 | 7-15 |
| 1/1/2005 | Null | R3 | R3 | Line1 | Line1 | 300 | 7-20 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 6 | R2 | 15 | Form a new route | R3 | 7 | 15 | N/A | Yes |

## Slide 16

Line, Merge to adjacent route (on adjacent line), Transfer CPs

![Measured route diagram drawn from the slide's own shapes, measures 7 to 15.](../media/doc390_slide16_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 7-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 0-70 |
| 1/1/2000 | Null | RA | RA | Line2 | Line2 | 100 | 0-15 |

![Measured route diagram drawn from the slide's own shapes, measures 7 to 95.](../media/doc390_slide16_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 7-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 0-70 |
| 1/1/2000 | 1/1/2005 | RA | RA | Line2 | Line2 | 100 | 0-15 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 7-9 |
| 1/1/2005 | Null | RA | RA | Line2 | Line2 | 200 | 9.1-80 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 9.1 | R2 | 70 | Merge to adjacent route | R3 | 9.1 | 80 | N/A | Yes |

## Slide 17

Line, Merge to adjacent route (on adjacent line), do not Transfer CPs

![Measured route diagram drawn from the slide's own shapes, measures 7 to 15.](../media/doc390_slide17_fig1.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | Null | R1 | R1 | Line1 | Line1 | 100 | 7-10 |
| 1/1/2000 | Null | R2 | R2 | Line1 | Line1 | 200 | 0-70 |
| 1/1/2000 | Null | RA | RA | Line2 | Line2 | 100 | 0-15 |

![Measured route diagram drawn from the slide's own shapes, measures 7 to 95.](../media/doc390_slide17_fig2.svg)

| From Date | To Date | RouteID | Route Name | LineID | Line Name | LineOrder | Measures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/1/2000 | 1/1/2005 | R1 | R1 | Line1 | Line1 | 100 | 7-10 |
| 1/1/2000 | 1/1/2005 | R2 | R2 | Line1 | Line1 | 200 | 0-70 |
| 1/1/2000 | 1/1/2005 | RA | RA | Line2 | Line2 | 100 | 0-15 |
| 1/1/2005 | Null | R1 | R1 | Line1 | Line1 | 100 | 7-9 |
| 1/1/2005 | Null | RA | RA | Line2 | Line2 | 200 | 9.1-80 |

| Network | Effective Date | Source From Route Name | Source From Measure | Source To Route Name | Source To Measure | Method | Target Route Name | Target From Measure | Target To Measure | Recalibrate route downstream | Transfer CPs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Engineering | 1/1/2005 | R1 | 9.1 | R2 | 70 | Merge to adjacent route | R3 | 9.1 | 80 | N/A | No |

## Sample test cases <!-- slide 18 -->

![Interface screenshot redrawn as a standardized wireframe: 3 fields, 1 icon, 12 text rows. 4 of 12 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide18_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 4 fields, 11 text rows. 3 of 11 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide18_fig3.svg)

![Diagram drawn from the slide's own shapes: 82 nodes, 36 connectors.](../media/doc390_slide18_fig1.svg)

| Non-line inputs | Recal Target | Trans CP | Input Target From/To Measures | Result | Before | After |
| --- | --- | --- | --- | --- | --- | --- |
| Merge to adjacent route | Yes | Yes | 12/15 | Merge source and target –proportion kept |  |  |
|  | No | Yes | 15/18 (default calc measures) | Error, result is non-monotonic |  |  |
|  | No | No | 15/18 (default calc measures) | Error, result is non-monotonic |  |  |
|  | Yes | No | 12/15 | Merge source and target –proportion not kept |  |  |
| Form a new route | N/A (no such option) | Yes | 0/5 | Merge – proportion kept |  |  |
|  | N/A (no such option) | No | 0/5 | Merge – proportion not kept |  |  |

Sample Test Cases from User Story

![image6.png](../media/doc390_image6.png) ![image7.png](../media/doc390_image7.png) ![image8.png](../media/doc390_image8.png) ![image3.png](../media/doc390_image3.png)

## Slide 19

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 3 icons, 7 text rows. 5 of 7 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide19_fig2.svg)
![Interface screenshot redrawn as a standardized wireframe: 1 panel, 3 fields, 3 icons, 8 text rows. 2 of 8 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide19_fig3.svg)

![Diagram drawn from the slide's own shapes: 82 nodes, 32 connectors.](../media/doc390_slide19_fig1.svg)

| Line inputs | Recalibrate Target | Trans CP | Input From/To Measures for Target | Result | Before | After |
| --- | --- | --- | --- | --- | --- | --- |
| Merge to adjacent route (on the same line) | Yes | Yes | 7/15 | Merge source and target –proportion kept |  |  |
|  | No | Yes | 15/24 (default calc measures) | Error, result is non-monotonic |  |  |
|  | No | No | 15/24 (default calc measures) | Error, result is non-monotonic |  |  |
|  | Yes | No | 7/15 | Merge source and target –proportion not kept |  |  |
| Form a new route | N/A (no such option) | Yes | 7/15 | Merge – proportion kept |  |  |
|  | N/A (no such option) | No | 7/15 | Merge – proportion not kept |  |  |

![image9.png](../media/doc390_image9.png) ![image10.png](../media/doc390_image10.png) ![image11.png](../media/doc390_image11.png) ![image3.png](../media/doc390_image3.png) ![image8.png](../media/doc390_image8.png)

## Slide 20

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 2 fields, 3 icons, 8 text rows. 6 of 8 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc390_slide20_fig2.svg)

![Diagram drawn from the slide's own shapes: 49 nodes, 20 connectors.](../media/doc390_slide20_fig1.svg)

| Line inputs | Recal Target | Trans CP | Input From/ To Measures | Result | Before | After |
| --- | --- | --- | --- | --- | --- | --- |
| Merge to adjacent route (on adjacent line) it is the same method “merge to adjacent route” | Yes | Yes | 9.1/80 | Merge source and target –proportion kept |  |  |
|  | No | Yes | 0/70 (default calc values) | Non-monotonic error |  |  |
|  | No | No | 0/70 (default calc values) | Non-monotonic error |  |  |
|  | Yes | No | 9.1/80 | Merge source and target –proportion not kept |  |  |

![image12.png](../media/doc390_image12.png) ![image3.png](../media/doc390_image3.png)
