# Prepare Data for Sharing Web Layers with Linear Referencing and Version Management

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Issue** | [ArcGISPro/ps-location-referencing#7018](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/7018) |
| **Source** | [7018_Share as web layers.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/7018_Share%20as%20web%20layers.docx>) |
| **Edited** | 2025-10-02 21:30 by Kyle Chin |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Prepare Data for Sharing Web Layers with Linear Referencing and Version Management"
source_file: "7018_Share as web layers.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/7018_Share%20as%20web%20layers.docx"
doc_id: 116
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Kyle Chin"
last_edited_by: "Kyle Chin"
last_edited: "2025-10-02T21:30:23Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["branch versioning", "geodatabase connection", "lrs edit log", "centerline sequence", "versioned registration", "feature dataset"]
tools: []
products: []
issues: ["ArcGISPro/ps-location-referencing#7018"]
related: [{"doc":330,"file":"share-as-web-layers__doc330.md","s":6.041},{"doc":276,"file":"manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md","s":2.382},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":2.251},{"doc":64,"file":"lrs-controller-widget__doc64.md","s":2.181},{"doc":875,"file":"esri-roads-and-highways-tutorial__doc875.md","s":2.176}]
```
-->

## Summary

Instructions for preparing data to share web layers with Linear Referencing and Version Management capabilities. Covers steps for data loading in ArcGIS Pro, setting geodatabase connection to branch versioning, and registering specific LRS tables and datasets as versioned.

## Related documents

<!-- related:begin -->
- [Share as web layers](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/share-as-web-layers__doc330.md>) — similar text 0.37 · 2 title words · 3 filename words · same kind/surface <!-- rel:330 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together-with-roads-and-highways__doc276.md>) — similar text 0.18 · 1 title word · same kind/surface <!-- rel:276 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.14 · same kind/surface <!-- rel:39 -->
- [LRS Controller Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-controller-widget__doc64.md>) — similar text 0.16 · same kind/folder <!-- rel:64 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-roads-and-highways-tutorial__doc875.md>) — similar text 0.20 · same kind/surface <!-- rel:875 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View centerline sequence table properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-sequence-table-properties.html) · [Create a template for an LRS feature count data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-feature-count-data-product.html)
<!-- docs:end -->

---

### Prepare data
Sharing web layers with the Linear Referencing and Version Management capabilities requires data preparation.
1) Perform all data loading using ArcGIS Pro before changing the geodatabase connection type and registering as versioned.

2) Right-click the geodatabase in the Catalog pane and click Geodatabase Connection Properties.

The geodatabase connection must be explicitly set to the Branch versioning type.
Note:
Check other requirements before registering data as branch versioned.
3) Register the centerline sequence table, LRS Edit Log table, and feature dataset that contains the LRS as versioned. Repeat the steps below for each item.

- Right-click the item and click Manage to open the Table Properties or Feature Dataset Properties dialog box.
- Check the Versioning check box and ensure that Branch is chosen.
- Click OK to register the item as branch versioned.
Note:
The LRS Locks table must not be registered as versioned.
