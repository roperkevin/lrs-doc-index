# View Centerline Properties

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_6383_ViewCenterlineProperties.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6383_ViewCenterlineProperties.docx>) |
| **Edited** | 2025-08-25 21:57 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View Centerline Properties"
source_file: "RH_6383_ViewCenterlineProperties.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6383_ViewCenterlineProperties.docx"
doc_id: 135
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-08-25T21:57:40.5092188Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["centerline", "feature class", "map layer", "location referencing tab", "address fields", "arcgis pro"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":136,"file":"view-centerline-properties__doc136.md","s":8.623},{"doc":133,"file":"view-site-address-point-properties__doc133.md","s":7.811},{"doc":134,"file":"view-lrs-event-properties__doc134.md","s":7.227},{"doc":67,"file":"view-utility-network-feature-class-properties__doc67.md","s":6.034},{"doc":127,"file":"view-the-lrs-hierarchy__doc127.md","s":3.373}]
```
-->

## Summary

Describes how to view properties of a centerline as a map layer or feature class in ArcGIS Pro. Details the centerline properties including centerline name, ID, and address fields. Explains steps to access these properties via the Contents pane for map layers and the Catalog pane for feature classes.

## Related documents

<!-- related:begin -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc136.md>) — similar text 0.86 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:136 -->
- [View Site Address Point Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-site-address-point-properties__doc133.md>) — similar text 0.88 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:133 -->
- [View LRS Event Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-lrs-event-properties__doc134.md>) — similar text 0.79 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:134 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-utility-network-feature-class-properties__doc67.md>) — similar text 0.74 · 2 title words · 2 filename words · same kind/surface <!-- rel:67 -->
- [View the LRS Hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc127.md>) — similar text 0.36 · 1 title word · same kind/surface/folder <!-- rel:127 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## View centerline properties
You can view the properties of a centerline as either a map layer or a feature class.

### Centerline properties
The following tables describe the centerline properties:

#### Centerline Name
The Centerline Name property appears at the top of the Location Referencing tab.

| Property | Description |
| --- | --- |
| Centerline Name | The name of the centerline feature class. |

#### Fields
You can view the following Fields properties for the centerline feature class:

| Property | Description |
| --- | --- |
| Centerline ID | The name of the feature class configured as the centerline ID. The unique ID for the centerline geometry. |

#### Address Fields
If the centerline feature class is configured as the Address Range feature class in an https://prodev.arcgis.com/en/pro-app/3.6/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.htm Address Data Management configuration, you can view the following Address Fields properties for the centerline feature class:

####  

| Property | Description |
| --- | --- |
| Left From Address | T he first address on the left side of a roadway. |
| Left To Address | T he last address on the left side of a roadway. |
| Right From Address | T he first address on the right side of a roadway. |
| Right To Address | T he last address on the right side of a roadway. |
| Road Name | T he name of a roadway. |

### View centerline properties by map layer
You can view the properties of a centerline map layer from the Contents pane:

- Open the Contents pane in ArcGIS Pro.
- Right-click the centerline layer with the properties you want to view, and click Properties.
- The Layer Properties dialog box appears with the selected networkcenterline layer name in the title bar.
- Note:
- The dialog box tabs that appear on the dialog box are specific to the selected layer type.
- Click the Location Referencing tab.
- Scroll down if the tab isn't visible in the list.
- The Location Referencing tab displays general properties for the selection at the top, with additional nodes below.
- Click the arrow for a node to expand or collapse its properties.
- If the value or field name is longer than the field, hover over the property to view its details, or resize the dialog box to view additional details.
- Tip:
- You can copy the read-only properties to the clipboard.
- Click OK to close the Layer Properties dialog box.

### View centerline properties by feature class
You can view the properties of an LRS intersection a centerline feature class from the Catalog pane:

- Open the Catalog pane in ArcGIS Pro.
- Expand the geodatabase connection and any relevant subfolders the feature dataset to browse to the feature class.
- Right-click the centerline feature class with the properties you want to view, and click Properties.
- The Feature Class Properties dialog box appears with the selected feature class name in the title bar.
- Note:
- The dialog box tabs that appear on the dialog box are specific to the selected layer type.
- Click the Location Referencing tab.
- Scroll down if the tab isn't visible in the list.
- The Location Referencing tab displays general properties for the selection at the top, with additional nodes below.
- Click the arrow for a node to expand or collapse its properties.
- If the value or field name is longer than the field, hover over the property to view its details, or resize the dialog box to view additional details.
- Tip:
- You can copy the read-only properties to the clipboard.
- Click OK to close the Feature Class Properties dialog box.
