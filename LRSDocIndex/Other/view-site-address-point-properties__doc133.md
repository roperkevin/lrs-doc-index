# View Site Address Point Properties

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_6949_ViewSiteAddressPointProperties.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6949_ViewSiteAddressPointProperties.docx>) |
| **Edited** | 2025-08-25 22:04 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View Site Address Point Properties"
source_file: "RH_6949_ViewSiteAddressPointProperties.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6949_ViewSiteAddressPointProperties.docx"
doc_id: 133
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-08-25T22:04:38.0871594Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["site address point", "address fields", "feature class", "map layer", "location referencing"]
tools: []
products: ["Roads & Highways"]
issues: []
related: [{"doc":135,"file":"view-centerline-properties__doc135.md","s":7.811},{"doc":136,"file":"view-centerline-properties__doc136.md","s":7.057},{"doc":134,"file":"view-lrs-event-properties__doc134.md","s":7.008},{"doc":67,"file":"view-utility-network-feature-class-properties__doc67.md","s":5.7},{"doc":127,"file":"view-the-lrs-hierarchy__doc127.md","s":3.597}]
```
-->

## Summary

Describes how to view properties of site address points in a combined LRS and Address Data Management dataset. Explains viewing properties via map layer and feature class in ArcGIS Pro, including details on the Location Referencing tab and address fields.

## Related documents

<!-- related:begin -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc135.md>) — similar text 0.88 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:135 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc136.md>) — similar text 0.83 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:136 -->
- [View LRS Event Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-lrs-event-properties__doc134.md>) — similar text 0.72 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:134 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-utility-network-feature-class-properties__doc67.md>) — similar text 0.78 · 2 title words · 2 filename words · same kind/surface <!-- rel:67 -->
- [View the LRS Hierarchy](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-the-lrs-hierarchy__doc127.md>) — similar text 0.36 · 1 title word · same kind/surface/folder <!-- rel:127 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[View site address point properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-site-address-point-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)
<!-- docs:end -->

---

## View site address point properties
If you have a combined LRS and Address Data Management dataset, you can view the properties of a site address point as either a map layer or a feature class.

### Site address point properties
The following tables describe the site address point properties:

#### Site Address Name
The Site Address Name property appears at the top of the Location Referencing tab.

| Property | Description |
| --- | --- |
| Site Address Name | The name of the site address point feature class. |

#### Address Fields
You can view the following Address Fields properties for the centerline site address point feature class:

| Property | Description |
| --- | --- |
| Address Number | The site address number. |
| Road Name | The name of the roadway. |

#### View site address point properties by map layer
You can view the properties of a site address point map layer from the Contents pane:

- Open the Contents pane in ArcGIS Pro.
- Right-click the site address point layer with the properties you want to view and click Properties.
- The Layer Properties dialog box appears with the selected site address point layer name in the title bar.
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

### View site address point properties by feature class
You can view the properties of a site address point feature class from the Catalog pane:

- Open the Catalog pane in ArcGIS Pro.
- Expand the geodatabase connection and the feature dataset to browse to the feature class.
- Right-click the site address point feature class with the properties you want to view and click Properties.
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
