# LRS Version Number Test Plan

|   |   |
| --- | --- |
| **Kind** | Test Plan · Pro |
| **Release** | — |
| **Source** | [TestPlan_LRSVersionNumber.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_LRSVersionNumber.xlsx>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `workbookdump` |

<!-- metadata
```yaml
title: "LRS Version Number Test Plan"
source_file: "TestPlan_LRSVersionNumber.xlsx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_LRSVersionNumber.xlsx"
doc_id: 597
doc_kind: "Test Plan"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: workbookdump
prompt_version: "v2.0.2"
keywords: ["lrs dataset", "modify lrs", "upgrade", "metadata", "arcpy", "pro version"]
tools: []
products: []
issues: []
related: [{"doc":65,"file":"view-the-lrs-hierarchy__doc65.md","s":1.973},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":1.871},{"doc":870,"file":"lr-feature-classes-inside-feature-dataset-housing-lrcd-user-story__doc870.md","s":1.844},{"doc":454,"file":"retire-routes-snap-event-behavior-test-plan__doc454.md","s":1.81},{"doc":129,"file":"view-the-lrs-hierarchy__doc129.md","s":1.801}]
```
-->

## Summary

Test plan for verifying the behavior of the Modify LRS operation and metadata properties in LRS datasets across different ArcGIS Pro versions and data sources. It includes tests for upgrade text display in the LRS hierarchy and metadata availability using arcpy.Describe().

## Related documents

<!-- related:begin -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc65.md>) — similar text 0.13 · same surface <!-- rel:65 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.10 · same kind/surface <!-- rel:115 -->
- [LR Feature Classes Inside Feature Dataset Housing LRCD User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lr-feature-classes-inside-feature-dataset-housing-lrcd-user-story__doc870.md>) — similar text 0.07 · same surface <!-- rel:870 -->
- [Retire Routes: Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/retire-routes-snap-event-behavior-test-plan__doc454.md>) — similar text 0.03 · same kind/folder <!-- rel:454 -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc129.md>) — similar text 0.13 · same surface <!-- rel:129 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Modify calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/modify-calibration-points.html) · [Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html)

_No page matched:_ [arcpy.describe](https://www.google.com/search?q=%22arcpy.describe%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Sheet: Sheet1
| No | Data | Test | Expected Result | Test Result |
| --- | --- | --- | --- | --- |
| 1 | LRS layers in Dataset (Data from 2.4 Pro) | Do Not Run Modify LRS from Pro version 3.2 and Verify the Upgrade is displayed in the LRS Hierarchy | Upgrade text should be displayed in the LRS Hierarchy |  |
| 2 | LRS layers in Dataset (Data from 2.4 Pro) | Run Modify LRS from Pro version 3.2 and Verify the Upgrade text in the LRS Hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 3 | LRS layers in Dataset (Data from 2.4 Pro) | Do Not Run Modify LRS from Pro version 3.2 and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade,  info should not be available |  |
| 4 | LRS layers in Dataset (Data from 2.4 Pro) | Run Modify LRS from current Pro version 3.2 and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available |  |
| 5 | Only basic schema in Dataset | Verify the Upgrade is displayed in the LRS Hierarchy | Upgrade text should be displayed in the LRS Hierarchy |  |
| 6 | Only basic schema in Dataset | Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 7 | Only basic schema in Dataset | Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available |  |
| 8 | Only basic schema in Dataset | Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available |  |
| 9 | From ArcMap | Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the Upgrade text in the LRS Hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 10 | From ArcMap | Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available |  |
| 11 | From Feature Service | Verify the Upgrade is displayed in the LRS Hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 12 | LRS layers in Dataset | Update ArcGIS Pro to a newer build from same 3.2 release, run the modify lrs and Verify the metadata  | build number in ProVersion should be updated |  |
| 13 | LRS layers in Dataset | Update ArcGIS Pro to a newer build from same 3.2 release and without running the modify lrs Verify the metadata | build number in ProVersion should not be updated |  |
| 14 | LRS layers in Dataset (Data from 3.2 Pro) | Create LRS and Verify the Upgrade is displayed in the LRS Hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 15 | LRS layers in Dataset (Data from 3.2 Pro) | Create LRS and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available |  |
| 16 | LRS layers in Dataset (Data from 3.2 Pro) | Create LRS from existing dataset and Verify the Upgrade is displayed in the LRS Hierarchy | Upgrade text should not be displayed in the LRS Hierarchy |  |
| 17 | LRS layers in Dataset (Data from 3.2 Pro) | Create LRS from existing dataset and Verify the metadata using arcpy.Describe() | ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available |  |
