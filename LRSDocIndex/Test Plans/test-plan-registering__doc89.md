# Test Plan : Registering

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Source** | [Register_Devices_Junctions_TestPlan.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Register_Devices_Junctions_TestPlan.pptx>) |
| **Edited** | 2025-12-26 13:55 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Test Plan : Registering"
source_file: "Register_Devices_Junctions_TestPlan.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/Register_Devices_Junctions_TestPlan.pptx"
doc_id: 89
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2025-12-26T13:55:58Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["utility network", "devices", "junctions", "route id", "measure field", "error handling", "configuration", "test plan"]
tools: ["Remove LRS Entity"]
products: ["Utility Network"]
issues: []
related: [{"doc":28,"file":"sld-devices-and-junctions-test-plan__doc28.md","s":4.793},{"doc":256,"file":"route-log-data-product-template-test-plan__doc256.md","s":2.725},{"doc":424,"file":"configure-addressing-feature-classes-gp-tool-test-plan__doc424.md","s":2.68},{"doc":878,"file":"modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md","s":2.602},{"doc":347,"file":"support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md","s":2.593}]
```
-->

## Summary

Test plan for registering utility network devices and junctions in the linear referencing system. Covers acceptance criteria for display name changes, parameter additions, field characteristics, and error cases including mismatched fields and invalid layer inputs. Includes tests for tool availability, configuration modification, schema upgrade absence, and REST layer verification.

## Related documents

<!-- related:begin -->
- [SLD Devices and Junctions Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/sld-devices-and-junctions-test-plan__doc28.md>) — similar text 0.41 · 2 filename words · same kind/folder <!-- rel:28 -->
- [Route Log data product template – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/route-log-data-product-template-test-plan__doc256.md>) — similar text 0.13 · same kind/surface/folder <!-- rel:256 -->
- [Configure Addressing Feature Classes GP Tool Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/configure-addressing-feature-classes-gp-tool-test-plan__doc424.md>) — similar text 0.19 · same kind/surface/folder <!-- rel:424 -->
- [Modify LRS Intersection Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md>) — similar text 0.23 · same kind/surface <!-- rel:878 -->
- [Support a single summary field in LRS Data Template wizard – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/support-a-single-summary-field-in-lrs-data-template-wizard-test-plan__doc347.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:347 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Remove LRS Entity](https://www.google.com/search?q=%22Remove%20LRS%20Entity%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1

Test Plan : Registering

## Slide 2

![Interface screenshot redrawn as a standardized wireframe: 2 panels, 3 buttons, 11 icons, 39 text rows. 27 of 39 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc937_slide2.svg)

Acceptance Criteria Tests: Verify that

  - The display name of Utility Network Feature Layer is changed to Utility Network Line Layer
  - The display name of Route ID is changed to Line Route ID
  - The display name of From Measure is changed to Line From Measure
  - The display name of To Measure is changed to Line To Measure
  - A parameter for Utility Network Devices Layer is added
  - A parameter for Devices Route ID is added
  - A parameter for Devices Measure is added
  - A parameter for Utility Network Junctions Layer is added
  - A parameter for Junctions Route ID is added
  - A parameter for Junctions Measure is added
  - All parameters are required

Other tests

- Test in inline and stand-alone PY
- Test in Model Builder
- Test the availability of these features in the Remove LRS Entity GP tool
- Test the tool for modifying the existing configuration of these features
- Verify that the LRS Schema Upgrade does not show up
Devices

- Route ID field characteristics match to that of the Network
- Measure field is double
Junctions

- Route ID field characteristics match to that of the Network
- Measure field is double

![image2.png](../media/doc937_image2.png)

## Slide 3

Error cases

- Route ID field characteristics do not match to that of the Network for junctions and devices
- Measure field is not double
- Same layer is provided for junctions and devices
- Already registered point event layer is provided
- Line layer is provided for junctions and devices
- PY: Point layer provided does not exists
- PY: RID and measure fields do not exist
- PY: Only 1 or 2 or the Line/Device/Junctions is provided
- PY: Layer, RID or measure is not provided
More cases

- Check the metadata using arcpy.describe
- Run the Modify LRS GP tool to check if things still work as designed
- Check the UN REST Layer to verify if the devices and junctions are added
