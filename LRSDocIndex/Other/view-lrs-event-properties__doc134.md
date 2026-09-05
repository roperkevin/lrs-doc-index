# View LRS Event Properties

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_6383_ViewEventProperties.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6383_ViewEventProperties.docx>) |
| **Edited** | 2025-08-25 22:00 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "View LRS Event Properties"
source_file: "RH_6383_ViewEventProperties.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/6383_6949_LRShierarchy/RH_6383_ViewEventProperties.docx"
doc_id: 134
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-08-25T22:00:30.2208929Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["event properties", "event fields", "referent fields", "tolerance", "resolution", "address fields", "map layer", "feature class"]
tools: ["Modify LRS Event"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":135,"file":"view-centerline-properties__doc135.md","s":7.227},{"doc":133,"file":"view-site-address-point-properties__doc133.md","s":7.008},{"doc":136,"file":"view-centerline-properties__doc136.md","s":6.599},{"doc":67,"file":"view-utility-network-feature-class-properties__doc67.md","s":4.896},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.571}]
```
-->

## Summary

Describes how to view properties of LRS events as map layers or feature classes in ArcGIS Pro. Details the event properties including name, type, tolerances, event fields, referent fields, event behavior rules, and address fields. Explains how to access these properties through the Contents pane and Catalog pane in ArcGIS Pro.

## Related documents

<!-- related:begin -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc135.md>) — similar text 0.79 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:135 -->
- [View Site Address Point Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-site-address-point-properties__doc133.md>) — similar text 0.72 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:133 -->
- [View Centerline Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-centerline-properties__doc136.md>) — similar text 0.70 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:136 -->
- [View Utility Network Feature Class Properties](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/view-utility-network-feature-class-properties__doc67.md>) — similar text 0.62 · 2 title words · 2 filename words · same kind/surface <!-- rel:67 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.19 · same kind/surface <!-- rel:39 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-events.html) · [View LRS event properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-event-properties.html) · [Tolerance and resolution settings for the LRS](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/tolerance-and-resolution-settings-for-the-lrs.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html)
<!-- docs:end -->

---

## View LRS event properties
You can view the properties of an LRS event as either a map layer or a feature class.
To modify existing LRS event properties, use the Modify LRS Event geoprocessing tool.

### LRS event properties
The following tables describe the LRS event properties:

#### Name and feature class
Event name and event feature class properties appear at the top of the Location Referencing tab.

| Property | Description |
| --- | --- |
| Event Name | The name of the selected event. |
| Event Feature Class | The feature class from which the LRS event was created. |
| Event Type | The data type of the selected event: linear or point. |
| Parent Network | The LRS Network in which the event is located. |

Learn more about tolerance and resolution settings for the LRS

#### Tolerance and resolution
You can view the following Tolerance and Resolution properties:

| Property | Description |
| --- | --- |
| Measure Precision | The specified number of decimal places included in the measure. |
| XY Tolerance | The x,y tolerance set for the network feature class. |
| M Tolerance | The m-tolerance set for the network feature class. |
| Z Tolerance | The z-tolerance set for the network feature class. |
| XY Resolution | The x,y resolution set for the network feature class. |
| M Resolution | The m-resolution set for the network feature class. |
| Z Resolution | The z-resolution set for the events feature class. |

#### Event fields
You can view the following Event Fields properties for the events feature class:
Learn more about the events data model

| Property | Description |
| --- | --- |
| Event Id | The unique ID for each event record. |
| From Route Name | The name of the route from which the From measure is derived. |
| From Route Id | The unique ID of the route from which the From measure is derived. |
| From Measure | The measure on the route where the beginning of the event is located. |
| To Route Name | The name of the route from which the To measure is derived. |
| To Route Id | The unique ID of the route from which the To measure is derived. |
| To Measure | The measure on the route where the end of the event is located. |
| From Date | The date the event became active on the route. |
| To Date | The date the event was retired on the route. |
| Location Error | The location error for the event. |
| Supports Spanning Routes | Indicates whether the event was registered with span routes enabled. |

#### Referent fields
You can view the following Referent Fields properties:

| Property | Description |
| --- | --- |
| From Referent Method (linear events) | The method of referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| From Referent Location (linear events) | The location of the offsetting feature. This can be an x,y coordinate, feature or event ID, or intersection ID. |
| From Referent Offset (linear events) | The offset measure. This is saved in the unit of measure configured when configuring offset fields. |
| To Referent Method (linear events) | The method of referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| To Referent Location (linear events) | The method of referencing the offset feature. This can be x,y coordinates, stationing, length, LRS Network, event, intersection, or other point feature classes. |
| To Referent Offset (linear events) | The offset measure. This is saved in the unit of measure configured when configuring offset fields. |
| Offset Units | The unit of measure for offsets in the LRS Network in which the event resides. |

#### Event behavior rules
You can view the following Event Behavior Rules configured for the selected LRS Network:
The event behavior rules are configured and applied to each of the activity types (calibrate, retire, extend, reassign, and realign) using the Apply Event Behaviors geoprocessing tool.

#### Address Fields
If an LRS line event feature class is configured as the Address Range feature class in an https://prodev.arcgis.com/en/pro-app/3.6/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.htm Address Data Management configuration, you can view the following Address Fields properties for the line event feature class:

| Property | Description |
| --- | --- |
| Left From Address | T he first address on the left side of a roadway. |
| Left To Address | T he last address on the left side of a roadway. |
| Right From Address | T he first address on the right side of a roadway. |
| Right To Address | T he last address on the right side of a roadway. |
| Road Name | T he name of a roadway. |

### View event layer properties by map layer
You can view the properties of an LRS event map layer from the Contents pane:

- Open the Contents pane in ArcGIS Pro.
- Right-click the event layer with the properties you want to view, and click Properties.
- The Layer Properties dialog box appears with the selected networkevent layer name in the title bar.
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

### View event layer properties by feature class
You can view the properties of an LRS event feature class from the Catalog pane:

- Open the Catalog pane in ArcGIS Pro.
- Expand the geodatabase connection and any relevant subfolders the feature dataset to browse to the feature class.
- Right-click the event feature class with the properties you want to view, and click Properties.
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
