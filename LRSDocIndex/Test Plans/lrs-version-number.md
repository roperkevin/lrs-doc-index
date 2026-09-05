# LRS Version Number Test Plan

| Field | Value |
| --- | --- |
| **Doc** | 597 · Test Plan · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [TestPlan_LRSVersionNumber.xlsx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Test%20Plans/TestPlan_LRSVersionNumber.xlsx>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane workbookdump · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs dataset · modify lrs · upgrade · metadata · arcpy · pro version |
| **Tools** | — |

## Summary

Test plan for verifying the behavior of the Modify LRS operation and metadata properties in LRS datasets across different ArcGIS Pro versions and data sources. It includes tests for upgrade text display in the LRS hierarchy and metadata availability using arcpy.Describe().

## Related documents

<!-- related:begin -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/7300-view-the-lrs-hierarchy.md>) — similar text 0.13 · same surface <!-- rel:65 s=1.973 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Test%20Plans/regression-testing-task-list-v1.md>) — similar text 0.10 · same kind/surface <!-- rel:115 s=1.871 -->
- [LR Feature Classes Inside Feature Dataset Housing LRCD User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/lr-feature-classes-inside-feature-dataset-housing-lrcd.md>) — similar text 0.07 · same surface <!-- rel:870 s=1.844 -->
- [Retire Routes: Snap Event Behavior Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/3780-retire-routes-snap-eb.md>) — similar text 0.03 · same kind/folder <!-- rel:454 s=1.81 -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy-apr-un.md>) — similar text 0.13 · same surface <!-- rel:129 s=1.801 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Modify calibration points](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/modify-calibration-points.html) · [Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html)

_No page matched:_ [arcpy.describe](https://www.google.com/search?q=%22arcpy.describe%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Test Cases

### TC-U01 — Do Not Run Modify LRS from Pro version 3.2 and Verify the Upgrade is displayed <!-- src: S3 · table · 1 -->

- **ID:** 1
- **Case:** Do Not Run Modify LRS from Pro version 3.2 and Verify the Upgrade is displayed in the LRS Hierarchy
- **Expected Result:** Upgrade text should be displayed in the LRS Hierarchy
- **Data:** LRS layers in Dataset (Data from 2.4 Pro)

### TC-U02 — Run Modify LRS from Pro version 3.2 and Verify the Upgrade text in the LRS <!-- src: S3 · table · 2 -->

- **ID:** 2
- **Case:** Run Modify LRS from Pro version 3.2 and Verify the Upgrade text in the LRS Hierarchy
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** LRS layers in Dataset (Data from 2.4 Pro)

### TC-U03 — Do Not Run Modify LRS from Pro version 3.2 and Verify the metadata using <!-- src: S3 · table · 3 -->

- **ID:** 3
- **Case:** Do Not Run Modify LRS from Pro version 3.2 and Verify the metadata using arcpy.Describe()
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade,  info should not be available
- **Data:** LRS layers in Dataset (Data from 2.4 Pro)

### TC-U04 — Run Modify LRS from current Pro version 3.2 and Verify the metadata using <!-- src: S3 · table · 4 -->

- **ID:** 4
- **Case:** Run Modify LRS from current Pro version 3.2 and Verify the metadata using arcpy.Describe()
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available
- **Data:** LRS layers in Dataset (Data from 2.4 Pro)

### TC-U05 — Verify the Upgrade is displayed in the LRS Hierarchy (5) <!-- src: S3 · table · 5 -->

- **ID:** 5
- **Expected Result:** Upgrade text should be displayed in the LRS Hierarchy
- **Data:** Only basic schema in Dataset

### TC-U06 — Run Modify LRS after moving all layers into dataset from Pro version 3.2 (6) <!-- src: S3 · table · 6 -->

- **ID:** 6
- **Case:** Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the hierarchy
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** Only basic schema in Dataset

### TC-U07 — Verify the metadata using arcpy.Describe() <!-- src: S3 · table · 7 -->

- **ID:** 7
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available
- **Data:** Only basic schema in Dataset

### TC-U08 — Run Modify LRS after moving all layers into dataset from Pro version 3.2 (8) <!-- src: S3 · table · 8 -->

- **ID:** 8
- **Case:** Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the metadata using arcpy.Describe()
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available
- **Data:** Only basic schema in Dataset

### TC-U09 — Run Modify LRS after moving all layers into dataset from Pro version 3.2 (9) <!-- src: S3 · table · 9 -->

- **ID:** 9
- **Case:** Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the Upgrade text in the LRS Hierarchy
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** From ArcMap

### TC-U10 — Run Modify LRS after moving all layers into dataset from Pro version 3.2 (10) <!-- src: S3 · table · 10 -->

- **ID:** 10
- **Case:** Run Modify LRS after moving all layers into dataset from Pro version 3.2 and Verify the metadata using arcpy.Describe()
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should be available
- **Data:** From ArcMap

### TC-U11 — Verify the Upgrade is displayed in the LRS Hierarchy (11) <!-- src: S3 · table · 11 -->

- **ID:** 11
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** From Feature Service

### TC-U12 — Update ArcGIS Pro to a newer build from same 3.2 release <!-- src: S3 · table · 12 -->

- **ID:** 12
- **Case:** Update ArcGIS Pro to a newer build from same 3.2 release, run the modify lrs and Verify the metadata
- **Expected Result:** build number in ProVersion should be updated
- **Data:** LRS layers in Dataset

### TC-U13 — Update ArcGIS Pro to a newer build from same 3.2 release and without running <!-- src: S3 · table · 13 -->

- **ID:** 13
- **Case:** Update ArcGIS Pro to a newer build from same 3.2 release and without running the modify lrs Verify the metadata
- **Expected Result:** build number in ProVersion should not be updated
- **Data:** LRS layers in Dataset

### TC-U14 — Create LRS and Verify the Upgrade is displayed in the LRS Hierarchy <!-- src: S3 · table · 14 -->

- **ID:** 14
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** LRS layers in Dataset (Data from 3.2 Pro)

### TC-U15 — Create LRS and Verify the metadata using arcpy.Describe() <!-- src: S3 · table · 15 -->

- **ID:** 15
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available
- **Data:** LRS layers in Dataset (Data from 3.2 Pro)

### TC-U16 — Create LRS from existing dataset and Verify the Upgrade is displayed in the LRS <!-- src: S3 · table · 16 -->

- **ID:** 16
- **Case:** Create LRS from existing dataset and Verify the Upgrade is displayed in the LRS Hierarchy
- **Expected Result:** Upgrade text should not be displayed in the LRS Hierarchy
- **Data:** LRS layers in Dataset (Data from 3.2 Pro)

### TC-U17 — Create LRS from existing dataset and Verify the metadata using arcpy.Describe() <!-- src: S3 · table · 17 -->

- **ID:** 17
- **Expected Result:** ProVersion,LrsDatasetVersion,LrsDatasetRequires Upgrade info should not be available
- **Data:** LRS layers in Dataset (Data from 3.2 Pro)
