# SLD Devices and Junctions Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Experience Builder |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29867](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/29867) |
| **Source** | [29867_SLD_Devices_Junctions_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/29867_SLD_Devices_Junctions_TestPlan.pptx>) |
| **Edited** | 2026-05-20 16:43 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "SLD Devices and Junctions Test Plan"
source_file: "29867_SLD_Devices_Junctions_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/29867_SLD_Devices_Junctions_TestPlan.pptx"
doc_id: 28
doc_kind: "Test Plan"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2026-05-20T16:43:01Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["devices", "junctions", "straight line diagram", "experience builder", "un apr dataset", "symbology", "accessibility"]
tools: []
products: ["Pipeline Referencing", "Utility Network"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29867"]
related: [{"doc":2,"file":"iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md","s":1000.997},{"doc":89,"file":"test-plan-registering__doc89.md","s":5.427},{"doc":38,"file":"sld-support-for-centerline-in-un-and-adm-lrs-datasets-test-plan__doc38.md","s":4.493},{"doc":63,"file":"sld-oi-widget-test-plan__doc63.md","s":4.142},{"doc":71,"file":"test-plan-include-intersections-in-sld__doc71.md","s":4.085}]
```
-->

## Summary

Test plan for verifying the behavior and functionality of devices and junctions layers in the Straight Line Diagram (SLD) within Experience Builder. Covers acceptance criteria including visibility conditions, symbology, layer ordering, editability, interaction behaviors, zoom level support, statistics display, accessibility compliance, and layer categorization.

## Related documents

<!-- related:begin -->
- [Iteration Planning and Issue Tracking for Location Referencing 3.8/12.2](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Schedules/iteration-planning-and-issue-tracking-for-location-referencing-3-8-12-2__doc2.md>) — shared issue Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29867 · similar text 0.08 <!-- rel:2 -->
- [Test Plan : Registering](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/test-plan-registering__doc89.md>) — similar text 0.41 · 2 filename words · same kind/folder <!-- rel:89 -->
- [SLD Support for Centerline in UN and ADM LRS Datasets Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/sld-support-for-centerline-in-un-and-adm-lrs-datasets-test-plan__doc38.md>) — similar text 0.16 · 1 title word · same kind/surface/folder <!-- rel:38 -->
- [SLD OI Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/sld-oi-widget-test-plan__doc63.md>) — similar text 0.14 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:63 -->
- [Test Plan: Include Intersections in SLD](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/test-plan-include-intersections-in-sld__doc71.md>) — similar text 0.25 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:71 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [experience builder](https://www.google.com/search?q=%22experience%20builder%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

![Interface screenshot redrawn as a standardized wireframe: 1 panel, 13 buttons, 10 colour blocks, 13 row separators, 29 icons, 90 text rows. 78 of 90 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc1003_slide1.svg)

## Slide 2

Acceptance Criteria Tests: Verify that

- Shows only for an UN-APR dataset
- Shows for SLD only, not for the DynSeg Table in ExB
- Symbology comes from the webmap for these layers to start with
- Allow turning these layers ON/OFF
- These layers show up as the top rows, even above any other point event layers
- The layers are un editable in the SLD
- Hover on a device or junction shows Event ID and <Display Field>
- Double click on a device or junction opens the attribute table
- Clicking on the measure ruler shows the drill-down attributes that includes the devices and junctions
- These two layers support the change in zoom level
- These two layers support showing the statistics when configured
- A11y and 508 (Run Allyhawk for Web tests against widget to ensure a11y issues are not introduced)
- The devices and junctions layers appear in the list of layers in a new category named “UN Layers”
- The devices and junctions layers layer’s Display field can be changed

[figure: Data Types · Functionality Tests · UN-APR only · Configuration Tests]
