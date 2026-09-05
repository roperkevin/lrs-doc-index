# Merge Centerlines

| Field | Value |
| --- | --- |
| **Doc** | 97 · Other · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [APR_MergeCenterlines.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/363_MergeCenterlines/APR_MergeCenterlines.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2025-12-12 19:06 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | centerlines · merge centerlines · feature service · route · segmentation |
| **Tools** | Merge Centerlines |

## Summary

Describes the Merge Centerlines tool in ArcGIS Pipeline Referencing used to merge centerline features belonging to a common route, reducing segmentation and updating centerline sequence records. Details the requirements for merging centerlines and outlines the workflow steps in ArcGIS Pro.

## Related documents

<!-- related:begin -->
- [Merge Centerlines](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/merge-centerlines-rh.md>) — similar text 0.54 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:87 s=6.602 -->
- [Merge Centerlines Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/363-merge-centerlines.md>) — similar text 0.20 · 2 title words · 2 filename words · same surface <!-- rel:103 s=4.224 -->
- [Manage address and roadway characteristic data together](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/manage-address-and-roadway-characteristic-data-together.md>) — similar text 0.18 · same kind/surface/folder <!-- rel:96 s=2.946 -->
- [Pipeline Referencing and Roads and Highways Enhancements in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/apr-and-rh-enhancements-in-lr.md>) — similar text 0.28 · same kind/surface <!-- rel:58 s=2.742 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.15 · same kind/surface <!-- rel:39 s=2.618 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Merge centerlines
The Merge Centerlines tool   is a centerline feature class editing tool available in ArcGIS Pipeline Referencing. This tool reduces segmentation by merging centerlines that belong to a common route. Once centerlines are merged, the records in the centerline sequence table are updated accordingly.
Note:
This tool is not supported if the centerline feature class is part of an ArcGIS Utility Network configuration.

The following requirements must be met for the centerlines to be merged:

- The centerline layer is part of a feature service that is published with the Linear Referencing and Version Management capabilities.
- All attributes must be identical across individual centerlines, except for those of the centerline ID, system, and editor tracking fields.
- The centerline IDs must either all be null or all be populated.
- The centerlines must be associated with the same route across all time slices.
- The centerlines must be single part line features.

The following graphics and table show the centerlines before and after merging:

### Merge centerlines workflow

### To merge centerlines, complete the following steps:

1. Add the centerline feature class and network feature class to a map in ArcGIS Pro.
You can also open a map in which the centerline and network layers are already present.
Note:
The centerline feature classmust be edited through a feature service.

1. Zoom to the centerlines that you want to merge.

1. On the map, select two or more centerlines to be merged.

Note:
Overlapping centerlines can be merged only if they are not associated with a route.

1. On the Location Referencing tab, in the Tools group, click the Merge Centerlines tool  .
The selected centerlines are merged.

Note:
If conflict prevention is enabled, the route associated with the centerlines is locked.
