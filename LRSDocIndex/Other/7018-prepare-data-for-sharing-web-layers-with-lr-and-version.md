# Prepare Data for Sharing Web Layers with Linear Referencing and Version Management

| Field | Value |
| --- | --- |
| **Doc** | 116 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | [ArcGISPro/ps-location-referencing#7018](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/7018) |
| **Source** | [7018_Share as web layers.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/7018_Share%20as%20web%20layers.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-10-02 21:30 by Kyle Chin |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | branch versioning · geodatabase connection · lrs edit log · centerline sequence · versioned registration · feature dataset |
| **Tools** | — |

## Summary

Instructions for preparing data to share web layers with Linear Referencing and Version Management capabilities. Covers steps for data loading in ArcGIS Pro, setting geodatabase connection to branch versioning, and registering specific LRS tables and datasets as versioned.

## Related documents

<!-- related:begin -->
- [Share as web layers](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5747-share-as-web-layers.md>) — similar text 0.37 · 2 title words · 3 filename words · same kind/surface <!-- rel:330 s=6.041 -->
- [Manage Address and Roadway Characteristic Data Together with Roads and Highways and Address Data Management Solution](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5783-manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.18 · 1 title word · same kind/surface <!-- rel:276 s=2.382 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.14 · same kind/surface <!-- rel:39 s=2.251 -->
- [LRS Controller Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26748-lrs-controller-widget.md>) — similar text 0.16 · same kind/folder <!-- rel:64 s=2.181 -->
- [Esri Roads and Highways Tutorial](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/esri-rh-tutorial.md>) — similar text 0.20 · same kind/surface <!-- rel:875 s=2.176 -->
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

1. Right-click the item and click Manage to open the Table Properties or Feature Dataset Properties dialog box.

1. Check the Versioning check box and ensure that Branch is chosen.

1. Click OK to register the item as branch versioned.
Note:
The LRS Locks table must not be registered as versioned.
