# View Utility Network Feature Class Properties

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#7300](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/7300) |
| **Source** | [7300-apr-view-un-fc-properties.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7300_view_un_fc_properties/7300-apr-view-un-fc-properties.docx>) |
| **Edited** | 2026-02-24 23:41 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View Utility Network Feature Class Properties"
source_file: "7300-apr-view-un-fc-properties.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7300_view_un_fc_properties/7300-apr-view-un-fc-properties.docx"
doc_id: 67
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2026-02-24T23:41:42.7969825Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["utility network", "feature class properties", "pipeline device", "pipeline junction", "route id", "measure", "location referencing tab", "arcgis pro"]
tools: []
products: ["Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#7300"]
related: [{"doc":65,"file":"view-the-lrs-hierarchy__doc65.md","s":1004.405},{"doc":136,"file":"view-centerline-properties__doc136.md","s":6.909},{"doc":135,"file":"view-centerline-properties__doc135.md","s":6.034},{"doc":133,"file":"view-site-address-point-properties__doc133.md","s":5.7},{"doc":134,"file":"view-lrs-event-properties__doc134.md","s":4.896}]
```
-->

## Summary

Describes how to view properties of Pipeline Device and Pipeline Junction feature classes in a combined LRS and Utility Network deployment using ArcGIS Pro. Includes instructions for accessing these properties from the Contents pane and the Catalog pane, focusing on the Location Referencing tab and key fields such as Route ID and Measure.

## Related documents

<!-- related:begin -->
- [View the LRS hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc65.md>) — shared issue ArcGISPro/ps-location-referencing#7300 · similar text 0.28 · 1 title word · 2 filename words · same kind/surface/folder <!-- rel:65 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc136.md>) — similar text 0.81 · 2 title words · 3 filename words · same kind/surface <!-- rel:136 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc135.md>) — similar text 0.74 · 2 title words · 2 filename words · same kind/surface <!-- rel:135 -->
- [View Site Address Point Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-site-address-point-properties__doc133.md>) — similar text 0.78 · 2 title words · 2 filename words · same kind/surface <!-- rel:133 -->
- [View LRS Event Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-lrs-event-properties__doc134.md>) — similar text 0.62 · 2 title words · 2 filename words · same kind/surface <!-- rel:134 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Split a centerline by measure](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline-by-measure.html)
<!-- docs:end -->

---

## View utility network feature class properties
In a combined LRS and Utility Network deployment, you can view the properties of the Pipeline Device and Pipeline Junction feature classes. This is helpful to verify which fields are configured with a utility network.
Note:
Refer to the https://docdev.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-centerline-properties.html#BBB View centerlines properties topic for information about the properties of the Pipeline Line feature class.

### Utility network feature class properties
The tables below describe the properties of the Pipeline Device and Pipeline Junction feature classes:

#### Utility Network Feature Class Name
The Utility Network Feature Class Name property appears in the Location Referencing tab of the Layer Properties and Feature Class Properties dialog boxes.

| Property | Description |
| --- | --- |
| Utility Network Feature Class Name | The name of the utility network feature class. |

#### Fields
You can view the following Fields properties for the Pipeline Device and Pipeline Junction feature classes:

| Property | Description |
| --- | --- |
| Route ID | The field that contains the route ID attribute . |
| Measure | The field that contains the measure value for devices or junctions . |

### View the properties from the Contents pane
To view the properties of a Pipeline Device or Pipeline Junction map layer from the Contents pane, complete the following steps:

- Open the Contents pane in ArcGIS Pro.
- Right-click the Pipeline Device or Pipeline Junction layer, and click Properties.
- The Layer Properties dialog box appears with the selected map layer’s name in the title bar.
- Note:
- The tabs on the dialog box are specific to the selected layer type.
- Click the Location Referencing tab.
- Scroll down if the tab isn't visible in the list.
- The Location Referencing tab displays general properties for the selection at the top, with additional nodes below.
- Click the arrow for a node to expand or collapse its properties.
- If the value or field name is longer than the field, hover over the property to view its details, or resize the dialog box to view additional details.
- Tip:
- You can copy the read-only properties to the clipboard.
- Click OK to close the Layer Properties dialog box.

### View the properties from the Catalog pane
To view the properties of a Pipeline Device or Pipeline Junction feature class from the Catalog pane, complete the following steps:

- Open the Catalog pane in ArcGIS Pro.
- Expand the geodatabase connection and the feature dataset to browse to the feature class.
- Right-click the Pipeline Device or Pipeline Junction feature class, and click Properties.
- The Feature Class Properties dialog box appears with the selected feature class’s name in the title bar.
- Note:
- The tabs on the dialog box are specific to the selected feature class type.
- Click the Location Referencing tab.
- Scroll down if the tab isn't visible in the list.
- The Location Referencing tab displays general properties for the selection at the top, with additional nodes below.
- Click the arrow for a node to expand or collapse its properties.
- If the value or field name is longer than the field, hover over the property to view its details, or resize the dialog box to view additional details.
- Tip:
- You can copy the read-only properties to the clipboard.
- Click OK to close the Feature Class Properties dialog box.
