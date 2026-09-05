# Overlay Events (Location Referencing)

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Issue** | [ArcGISPro/ps-location-referencing#5647](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/5647) |
| **Source** | [5647_OverlayEventsGP.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5647_OverlayEventsGP.docx>) |
| **Edited** | 2024-02-27 22:20 by Ignacia Galvan |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Overlay Events (Location Referencing)"
source_file: "5647_OverlayEventsGP.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5647_OverlayEventsGP.docx"
doc_id: 422
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Ignacia Galvan"
last_edited: "2024-02-27T22:20:32Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["overlay events", "dynamic segmentation", "linear event", "location referencing", "network fields", "gas utility network", "pipeline feature"]
tools: ["Overlay Events"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: ["ArcGISPro/ps-location-referencing#5647"]
related: [{"doc":366,"file":"pro-3-3-and-11-3-iteration-issue-tracking__doc366.md","s":1001.371},{"doc":251,"file":"overlay-events-location-referencing__doc251.md","s":6.474},{"doc":75,"file":"overlay-events-location-referencing__doc75.md","s":5.921},{"doc":131,"file":"overlay-events-location-referencing__doc131.md","s":5.634},{"doc":66,"file":"overlay-events-location-referencing__doc66.md","s":4.971}]
```
-->

## Summary

Describes the Overlay Events tool which overlays one or more linear event feature layers onto a target network and outputs a dynamically segmented feature class or table. It supports line events registered with an ArcGIS Location Referencing network, multiple linear referencing methods, temporal segmentation, and inclusion of network fields in the output. The tool also supports Gas Utility Network Configuration pipeline feature layers and physically gapped routes and events.

## Related documents

<!-- related:begin -->
- [Pro 3.3 and 11.3 Iteration Issue Tracking](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/pro-3-3-and-11-3-iteration-issue-tracking__doc366.md>) — shared issue ArcGISPro/ps-location-referencing#5647 · similar text 0.01 · same surface/folder <!-- rel:366 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc251.md>) — similar text 0.60 · 2 title words · 2 filename words · same kind/surface <!-- rel:251 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc75.md>) — similar text 0.56 · 2 title words · 2 filename words · same kind/surface <!-- rel:75 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc131.md>) — similar text 0.51 · 2 title words · 2 filename words · same kind/surface <!-- rel:131 -->
- [Overlay Events (Location Referencing)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/overlay-events-location-referencing__doc66.md>) — similar text 0.51 · 2 title words · 2 filename words · same kind/surface <!-- rel:66 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Overlay Events (Location Referencing)

### Summary
Overlays one or more linear event feature layers onto a target network and outputs a feature class or table that represents the dynamic segmentation of the inputs.

### Usage

- All input Event Layers values must be line events.
- The Event Layers parameter can only include linear event feature classes registered with an ArcGIS Location Referencing network.
- Note:
- The centerline layer can be input in the Event Layers parameter to dynamically segment events when the centerline layer is part of an Address Data Management or a Utility Network configuration.
- The centerline direction is honored in the outputs when the centerline layer is part of an Address Data Management configuration.
- If the input events use different linear referencing methods (LRM), they will be translated using the LRM of the target network.
- This tool supports selection sets.
- This tool supports definition filters.
- This tool supports input Event Layers values that are configured to contain events that span multiple routes. The output will still dynamically segment at the route level of the target network using the Network Fields parameter value.
- This tool supports temporal segmentation (time slicing). This will occur by default and can be overridden by creating a time-based definition query or applying a selection set to the inputs.
- This tool supports the inclusion of one or more fields from the network feature class in the output using the Network Fields parameter.
- The output can be saved as either a table or a feature class.
- If the output is saved as a table or feature class, the output will have the following indexes and fields:

| Index | Field |
| --- | --- |
| Route_ID | Route_ID |
| Rid_Dates_Me | Route_ID From_Date To_Date From_Measure To_Measure |

- This tool supports the Gas Utility Network Configuration pipeline feature layer as an input event layer if this feature class has been configured for use with an LRS using the Configure Utility Network Feature Class tool.
- If more than one LRS Network exists in the Gas Utility Network Configuration, the measures for the input event layers will match the measures shown in the second column of the following table:

| If the LRS with the Utility Network Configuration contains | The measures in the PipelineLine feature class belong to |
| --- | --- |
| Line network, nonline network | Line network |
| Line network | Line network |
| More than one line network | Line network that has the derived network |
| More than one line network with no derived network | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| More than one line network with derived networks | Line network that has the lowest number in the coded-value domain, dLRSNetworks |
| One nonline network | Nonline network |
| More than one nonline network | Network that has the lowest number in the coded-value domain, dLRSNetworks |

- This tool supports physically gapped routes and events as input routes and input events, respectively.
- Only one event per layer can be on a route segment. For example, for the layer named Speed Limit, only one event record in that layer can be on that segment. A segment can have multiple events, each in its own event layer. Use the ArcGIS Data Reviewer Invalid Event Measures check to identify and resolve issues with event data.

### Environments
Current Workspace

### Licensing information

- Basic: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Standard: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
- Advanced: Requires ArcGIS Location Referencing (ArcGIS Pipeline Referencing or ArcGIS Roads and Highways)
