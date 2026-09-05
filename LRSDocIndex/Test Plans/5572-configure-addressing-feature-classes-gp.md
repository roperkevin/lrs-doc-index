# Configure Addressing Feature Classes GP Tool Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 424 · Test Plan · Pro |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#5572](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5572) |
| **Source** | [5572-AddressingConfigGPTool_TestPlanV2.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/5572-AddressingConfigGPTool_TestPlanV2.pptx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2024-02-26 15:03 by Mac Christmas |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | addressing · feature classes · geoprocessing tool · configuration · address range · site address point · spatial reference · field types |
| **Tools** | Configure Addressing Feature Classes GP Tool · Modify LRS · Append Routes · Overlay Events · Remove LRS Entity |

## Summary

Test plan for the Configure Addressing Feature Classes geoprocessing tool in the Location Referencing toolbox. It includes positive and negative test cases to validate tool functionality, metadata exposure, compatibility with Model Builder and Python, and proper handling of addressing feature classes and fields.

## Related documents

<!-- related:begin -->
- [Configure Addressing Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5645-configure-addressing-feature-classes-lr.md>) — similar text 0.34 · 4 title words · 3 filename words · same surface <!-- rel:427 s=5.759 -->
- [Configure Addressing Feature Classes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-addressing-feature-classes.md>) — similar text 0.39 · 4 title words · 1 filename word · same surface <!-- rel:450 s=5.477 -->
- [Configure Address Feature Classes (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6267-configure-address-feature-classes-lr.md>) — similar text 0.26 · 3 title words · same surface <!-- rel:249 s=3.623 -->
- [Overview of the Configuration Toolset](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5645-overview-of-the-configuration-toolset.md>) — similar text 0.24 · 3 filename words · same surface <!-- rel:429 s=3.481 -->
- [LRS Addressing and Utility Network Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-addressing-and-un-properties.md>) — similar text 0.31 · 1 title word · 1 filename word · same surface <!-- rel:190 s=3.457 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)

_No page matched:_ [Configure Addressing Feature Classes GP Tool](https://www.google.com/search?q=%22Configure%20Addressing%20Feature%20Classes%20GP%20Tool%22+site%3Adoc.esri.com) · [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Remove LRS Entity](https://www.google.com/search?q=%22Remove%20LRS%20Entity%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overview

### Slide 1 — Devtopia Issue <!-- slide 1 -->

Configure Addressing Feature Classes GP Tool

**Notes**
- Add GP tool for configuring an LRS and Addressing datasets together in the Configuration toolset in the LR toolbox
- Test with FGDB and EGDB (Traditional and Branch Versioning)
- Test with RH-AM dataset only
- Ensure tool UI is i18n and 508 compliant

![Figure 1 — Devtopia Issue](../media/5572-configure-addressing-feature-classes-gp/fig-01-slide-01-devtopia-issue.png)

## Test Cases

### TC-P01 — Arcpy.Describe shows metadata configuration info for the addressing layers <!-- src: S4 · slide 2 · Positive Tests: Other · 1 -->

- **Group:** Other

### TC-P02 — LR Server REST endpoints expose metadata info for the addressing layers <!-- src: S4 · slide 2 · Positive Tests: Other · 2 -->

- **Group:** Other

### TC-P03 — Tool works correctly in Model Builder when chained with other tools <!-- src: S4 · slide 2 · Positive Tests: Other · 3 -->

- **Group:** Other
- **Case:** Tool works correctly in Model Builder when chained with other tools (will only work once code is checked in)

### TC-P04 — Tool works correctly in stand-alone Python <!-- src: S4 · slide 2 · Positive Tests: Other · 4 -->

- **Group:** Other
- **Case:** Tool works correctly in stand-alone Python (will only work once code is checked in)

### TC-P05 — Tool works correctly in ArcPy (will only work once code is checked in) <!-- src: S4 · slide 2 · Positive Tests: Other · 5 -->

- **Group:** Other

### TC-P06 — Copy LRS dataset with addressing configured to another database <!-- src: S4 · slide 2 · Positive Tests: Other · 6 -->

- **Group:** Other
- **Case:** Copy LRS dataset with addressing configured to another database, ensuring that all configurations are preserved

### TC-P07 — Run Modify LRS against an LRS configured with addressing with all addressing <!-- src: S4 · slide 2 · Positive Tests: Other · 7 -->

- **Group:** Other
- **Case:** Run Modify LRS against an LRS configured with addressing with all addressing layers present

### TC-P08 — Run Append Routes against an LRS Network within an LRS configured <!-- src: S4 · slide 2 · Positive Tests: Other · 8 -->

- **Group:** Other
- **Case:** Run Append Routes against an LRS Network within an LRS configured with addressing. Append Route will automatically check the Consider existing centerlines option, but it can be unchecked

### TC-P09 — Run Overlay Events/queryAttributeSet against an LRS Network within an LRS <!-- src: S4 · slide 2 · Positive Tests: Other · 9 -->

- **Group:** Other
- **Case:** Run Overlay Events/queryAttributeSet against an LRS Network within an LRS configured with addressing. When the Address Range feature class is the centerline, make sure it can be included as an input in Overlay Events/queryAttributeSet (this is similar to the check in a UNAPR dataset)

### TC-P10 — Run Remove LRS Entity against an LRS configured with addressing. When choosing <!-- src: S4 · slide 2 · Positive Tests: Other · 10 -->

- **Group:** Other
- **Case:** Run Remove LRS Entity against an LRS configured with addressing. When choosing an addressing feature class to remove, both will be removed from the LRS after execution

### TC-P11 — On the Location Referencing tab of the Properties for the Address Range feature <!-- src: S4 · slide 2 · Positive Tests: Other · 11 -->

- **Group:** Other
- **Case:** On the Location Referencing tab of the Properties for the Address Range feature layer, show addressing config fields

### TC-P12 — GP Tool is in the Configuration toolset with the Configure Utility Network <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 1 -->

- **Group:** GP Tool
- **Case:** GP Tool is in the Configuration toolset with the Configure Utility Network Feature Class GP Tool (will only appear here after code is checked in)

### TC-P13 — Address Range feature class/layer is the centerline or an LRS event <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 2 -->

- **Group:** GP Tool
- **Case:** Address Range feature class/layer is the centerline or an LRS event that includes addressing info fields

### TC-P14 — Left From, Left To, Right From (1) <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 3 -->

- **Group:** GP Tool
- **Case:** Left From, Left To, Right From, and Right To fields are Short or Long field types

### TC-P15 — Site Address Point layer must be a point feature class <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 4 -->

- **Group:** GP Tool

### TC-P16 — Address Number field are Short, Long, or Text field types <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 5 -->

- **Group:** GP Tool

### TC-P17 — Address Range and Site Address layers are in the same feature dataset as <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 6 -->

- **Group:** GP Tool
- **Case:** Address Range and Site Address layers are in the same feature dataset as the base LRS schema items

### TC-P18 — Address Range and Site Address layers have the same spatial reference <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 7 -->

- **Group:** GP Tool
- **Case:** Address Range and Site Address layers have the same spatial reference and tolerances as the base LRS schema items

### TC-P19 — After running the GP Tool, run it again modifying some parameters <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 8 -->

- **Group:** GP Tool

### TC-P20 — Address Range and Site Address layers are empty <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 9 -->

- **Group:** GP Tool

### TC-P21 — Address Range and Site Address layers are populated with records <!-- src: S4 · slide 2 · Positive Tests: GP Tool · 10 -->

- **Group:** GP Tool

### TC-N01 — Run tool with FS layers as input <!-- src: S4 · slide 3 · Negative Tests: Error · 1 -->

- **Group:** Error

### TC-N02 — Address Range feature class/layer is not the centerline or an LRS event <!-- src: S4 · slide 3 · Negative Tests: Error · 2 -->

- **Group:** Error
- **Case:** Address Range feature class/layer is not the centerline or an LRS event that includes addressing info

### TC-N03 — Address Range input is a table, point, or polygon layer <!-- src: S4 · slide 3 · Negative Tests: Error · 3 -->

- **Group:** Error

### TC-N04 — Left From, Left To, Right From (2) <!-- src: S4 · slide 3 · Negative Tests: Error · 4 -->

- **Group:** Error
- **Case:** Left From, Left To, Right From, and Right To fields are not are Short or Long field types (will only work once code is checked in, must be tested in Python)

### TC-N05 — Site Address Point layer input is a table, line, or polygon layer <!-- src: S4 · slide 3 · Negative Tests: Error · 5 -->

- **Group:** Error

### TC-N06 — Address Number field is not Short, Long, or Text field types <!-- src: S4 · slide 3 · Negative Tests: Error · 6 -->

- **Group:** Error
- **Case:** Address Number field is not Short, Long, or Text field types (will only work once code is checked in, must be tested in Python)

### TC-N07 — Address Range and Site Address layers are not in another feature dataset as <!-- src: S4 · slide 3 · Negative Tests: Error · 7 -->

- **Group:** Error
- **Case:** Address Range and Site Address layers are not in another feature dataset as the base LRS schema items

### TC-N08 — Address Range and Site Address layers are in different a different database from <!-- src: S4 · slide 3 · Negative Tests: Error · 8 -->

- **Group:** Error
- **Case:** Address Range and Site Address layers are in different a different database from the base LRS schema items

### TC-N09 — Address Range and Site Address layers are in the same database as the base LRS <!-- src: S4 · slide 3 · Negative Tests: Error · 9 -->

- **Group:** Error
- **Case:** Address Range and Site Address layers are in the same database as the base LRS schema items, but not in the feature dataset

### TC-N10 — Address Range and Site Address layers do not have the same spatial reference <!-- src: S4 · slide 3 · Negative Tests: Error · 10 -->

- **Group:** Error
- **Case:** Address Range and Site Address layers do not have the same spatial reference and tolerances as the base LRS schema items

### TC-N11 — Run Modify LRS against an LRS configured with addressing. The Address Range (1) <!-- src: S4 · slide 3 · Negative Tests: Error · 11 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. The Address Range feature class is missing from the database

### TC-N12 — Run Modify LRS against an LRS configured with addressing. The Site Address (1) <!-- src: S4 · slide 3 · Negative Tests: Error · 12 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. The Site Address feature class is missing from the database

### TC-N13 — Run Modify LRS against an LRS configured with addressing. Both the Address Range <!-- src: S4 · slide 3 · Negative Tests: Error · 13 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. Both the Address Range and Site Address feature classes are missing from the database

### TC-N14 — Run Modify LRS against an LRS configured with addressing. The Address Range (2) <!-- src: S4 · slide 3 · Negative Tests: Error · 14 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. The Address Range feature class is missing addressing fields

### TC-N15 — Run Modify LRS against an LRS configured with addressing. The Site Address (2) <!-- src: S4 · slide 3 · Negative Tests: Error · 15 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. The Site Address feature class is missing addressing fields

### TC-N16 — Run Modify LRS against an LRS configured with addressing. The Address Range (3) <!-- src: S4 · slide 3 · Negative Tests: Error · 16 -->

- **Group:** Error
- **Case:** Run Modify LRS against an LRS configured with addressing. The Address Range and Site Address feature classes are missing addressing fields
