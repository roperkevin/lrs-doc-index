# View the LRS hierarchy

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [APR_ViewtheLRSHierarchy.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/APR_ViewtheLRSHierarchy.docx>) |
| **Edited** | 2025-08-26 23:55 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View the LRS hierarchy"
source_file: "APR_ViewtheLRSHierarchy.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/APR_ViewtheLRSHierarchy.docx"
doc_id: 129
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-08-26T23:55:59.0242980Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs hierarchy", "lrs dataset", "calibration point", "centerline", "event", "intersection", "network"]
tools: ["Modify LRS"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":127,"file":"view-the-lrs-hierarchy__doc127.md","s":7.97},{"doc":65,"file":"view-the-lrs-hierarchy__doc65.md","s":7.235},{"doc":136,"file":"view-centerline-properties__doc136.md","s":3.904},{"doc":135,"file":"view-centerline-properties__doc135.md","s":3.284},{"doc":134,"file":"view-lrs-event-properties__doc134.md","s":3.182}]
```
-->

## Summary

Describes how to review the hierarchy of a linear referencing system (LRS) dataset in ArcGIS Pro using the Contents pane and the Catalog pane. Explains the structure of the LRS hierarchy including schema and network nodes, and how to access properties or add entities to maps.

## Related documents

<!-- related:begin -->
- [View the LRS Hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc127.md>) — similar text 0.79 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:127 -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc65.md>) — similar text 0.82 · 2 title words · 1 filename word · same kind/surface <!-- rel:65 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc136.md>) — similar text 0.31 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:136 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc135.md>) — similar text 0.27 · 1 title word · same kind/surface/folder <!-- rel:135 -->
- [View LRS Event Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-lrs-event-properties__doc134.md>) — similar text 0.24 · 1 title word · same kind/surface/folder <!-- rel:134 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify an LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-and-modify-an-lrs.html) · [View the LRS hierarchy](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-the-lrs-hierarchy.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-lrs-intersection-properties.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html)
<!-- docs:end -->

---

## View the LRS hierarchy
A linear referencing system (LRS) dataset is a controller dataset in a feature dataset in the geodatabase along with all the feature classes that participate in the LRS.
You can review the hierarchy in an LRS dataset in ArcGIS Pro to decide which types of networks exist in the LRS and which events are associated with each network.

### Review the LRS hierarchy from the Contents pane
To review the LRS hierarchy from the Contents pane, complete the following steps:

- In the ArcGIS Pro project, choose the map that includes the LRS feature layer.
- The Contents pane appears with the layers listed.
- In the Contents pane, click to choose a feature layer from the LRS dataset.
- You can choose any of the feature layers that are members of the LRS dataset (calibration point, centerline, event, intersection, network, or redline).
- Click the Location Referencing tab on the ArcGIS Pro ribbon.
- Click LRS Hierarchy  in the Tools group.
- Tip:
- If LRS Hierarchy  is not active, the feature layer you chose is not a member of the LRS dataset. Choose a valid feature layer in the Contents pane to activate it.
- The LRS Hierarchy pane appears. The LRS (LRS_mod in this example) is the root of the hierarchy.
- The LRS Schema node  contains the minimum schema feature classes and the centerline sequence table, while the network nodes show the network, event, and intersection feature classes.
- Note:
- In a https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/manage-pipeline-referencing-and-a-utility-network-together.htm combined LRS and Utility Network dataset, the LRS Schema node will be denoted as LRS Schema (with Utility Network).
- Optionally, right-click an entity in the LRS hierarchy to review its properties or add it to a new or current map.
- You can access the properties for the calibration point, centerline, event, intersection, network, or redline feature classes, as well as properties for the centerline sequence table.

### Review the LRS hierarchy from the Catalog pane
The LRS dataset appears in the Catalog pane as the LRS folder in the geodatabase node. When expanded, all of the feature dataset members appear.

- In the ArcGIS Pro project, open the Catalog pane.
- In the Catalog pane, expand the geodatabase node and expand the feature dataset.
- The LRS hierarchy appears in the LRS dataset using the name of the LRS (LRS_mod in this example). If an LRS dataset is not present in the LRS, the LRS hierarchy does not appear. Run the Modify LRS tool to update the LRS.
- Right-click the LRS dataset and choose LRS Hierarchy.
- The LRS Hierarchy pane appears with the LRS name (LRS_mod in this example) as root.
- The LRS Schema node has the minimum schema feature classes and the centerline sequence table, while the network nodes show the network, event, and intersection feature classes.
- Note:
- In a https://prodev.arcgis.com/en/pro-app/latest/help/production/location-referencing-pipelines/manage-pipeline-referencing-and-a-utility-network-together.htm combined LRS and Utility Network dataset, the LRS Schema node will be denoted as LRS Schema (with Utility Network).
- Optionally, right-click an entity in the LRS hierarchy to review its properties or add it to a new or current map.
- You can access properties for the calibration point, centerline, event, intersection, network, or redline feature classes, as well as properties for the centerline sequence table.

![image1.png](../media/doc895_image1.png) ![image2.png](../media/doc895_image2.png) ![image3.png](../media/doc895_image3.png) ![image4.png](../media/doc895_image4.png)
