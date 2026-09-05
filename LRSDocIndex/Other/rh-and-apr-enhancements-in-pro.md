# Roads and Highways and Pipeline Referencing Enhancements in ArcGIS Pro

| Field | Value |
| --- | --- |
| **Doc** | 304 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [What.sNewPro.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5872_whats_new/What.sNewPro.docx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-09-25 23:38 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | roads and highways · pipeline referencing · dynamic segmentation · point event · line event · route dominance · event merging · event retirement · process edits · overlay events · address block range · lrs data product · geoprocessing |
| **Tools** | Dynamic Segmentation · Add Point Events · Add Line Events · Process Edits · Overlay Events · Generate LRS Data Products |

## Summary

This document describes enhancements to ArcGIS Pro tools for Roads and Highways and Pipeline Referencing. It covers updates to dynamic segmentation supporting point and line events, options for placing events on dominant routes using route dominance rules, advanced table editing for event merging and retirement, a new Process Edits tool for post route editing geoprocessing, and capabilities for creating LRS reporting data products. It also details enhancements to the Overlay Events geoprocessing tool including support for point events and address block range updates.

## Related documents

<!-- related:begin -->
- [Roads and Highways and Pipeline Referencing Enhancements in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-enhancements-in-exb.md>) — similar text 0.19 · 4 title words · 1 filename word · same kind/folder <!-- rel:305 s=4.91 -->
- [Roads and Highways and Pipeline Referencing Enhancements](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/5671-rh-and-apr-enhancements.md>) — similar text 0.20 · 4 title words · 2 filename words · same kind/surface <!-- rel:408 s=4.872 -->
- [What’s New in ArcGIS Roads and Highways and ArcGIS Pipeline Referencing: November 2025](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-and-arcgis-apr-november-2025.md>) — similar text 0.20 · 3 title words · same kind/surface <!-- rel:112 s=4.564 -->
- [Pipeline Referencing and Roads and Highways Enhancements in Location Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-and-rh-enhancements-in-lr.md>) — similar text 0.17 · 4 title words · 1 filename word · same kind/surface <!-- rel:58 s=4.273 -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-11-x-exb-widgets.md>) — similar text 0.16 · 3 title words · 1 filename word · same kind <!-- rel:397 s=3.852 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Event behavior for route retirement](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-retirement.html) · [LRS data products](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/lrs-data-products.html)

_No page matched:_ [Add Point Events](https://www.google.com/search?q=%22Add%20Point%20Events%22+site%3Adoc.esri.com) · [Add Line Events](https://www.google.com/search?q=%22Add%20Line%20Events%22+site%3Adoc.esri.com) · [Process Edits](https://www.google.com/search?q=%22Process%20Edits%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Generate LRS Data Products](https://www.google.com/search?q=%22Generate%20LRS%20Data%20Products%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### Roads and Highways
The following enhancements has been made addedwere added to the ArcGIS Roads and Highways tools:

- The Dynamic Segmentation tool in ArcGIS Pro now supports LRS pPoint eEvents.  The results in the table are separated into point and line records, allowing users you to edit both LRS pPoint and LRS lLine eEvents in the output.
- The Add Point Events and Add Line Events tools have been enhanced withinclude an option to place events onto the primary/dominant route.  When enabled in the tool, the route dominance rules will be utilizedare used to place events onto the primary route when there is a concurrency of two or more routes along the measure(s) the event(s) are being placed.
- Advanced table editing options are now available when editing LRS eEvents in the Pro attribute table.  These options allow for events to be merged with adjacent events and retired on a specific date when attributes are edited in the attribute table.  These options can be configured within the Location Referencing section of Pro options in a project.
- A new tool calledYou can use the Process Edits found on the Location Referencing ribbon in Pro.  This tool will executeto run four common post route editing geoprocessing tools:, Apply Event Behaviors, Generate Intersections, Generate Routes, and Derive Event Measures.  The tool is optimized to only update events and intersections impacted by LRS route edits, can be run within or outside an edit session, and supports undo and redo using the tools in Pro.
- A new experience to support creating data products using LRS data in support of reporting.  Capabilities within ArcGIS Pro and geoprocessing are used to author configurations of linear referenced data that can be regularly fed into a geoprocessing tool to create reporting data products for use in the ArcGIS Pro reporting experience or other commercial applications such as PowerBI and Crystal Reports.

### Geoprocessing
Enhanced tools:

- The Overlay Events geoprocessing tool has been enhanced to support the following:Overlay Events:
- pPoint events:.  The tool now supportsUsing LRS pPoint Eevents as input layers to the tool  point event layers as inputs is supported.and will be T included in the dynamic segmentation output produced by the output includes point event layers.tool.
- The Overlay Events geoprocessing tool has also been enhanced to support uUpdatinges to address block range information stored on centerlines when used as an input to the tool in a combined ArcGIS Roads and Highways and Address Data Management solution deployment.   If a centerline is split in the output of the tool, the address block range information is updated based on the proportional length along the centerline that where the split took place.
Suggestion for second bullet point above: When the centerline layer is part of an Address Data Management solution and is used as an input to the tool, address block range information stored on the centerline layer is updated. If a centerline is split in the output, the address block range information is updated based on the proportional length along the centerline where the split took place.

- New tools:
- The new Generate LRS Data Products— geoprocessing tool supports the creationCreates of LRS reporting data products.  The tool allows the user to utilizeyou to You can use a template with the type ofyour preferred report type. Trt desired you want and the LRS eEvents that will be transformed then when based on the selectiinong of the routes and intersecting features, such as municipal boundaries, to create the data product.
Suggestion for bullet point above: You can use a template with your preferred report type to create LRS data products. LRS events that are used to create the data product are transformed based on selected routes and intersecting features (such as municipal boundaries).

### Pipeline Referencing
The following enhancements ts haswere addedve been made added to the ArcGIS Pipeline Referencing tools:

- A new tool calledYou can use the Process Edits found on the Location Referencing ribbon in Pro.  This tool will executeto run four common post route editing geoprocessing tools:, Apply Event Behaviors, Generate Intersections, Generate Routes, and Derive Event Measures.  The tool is optimized to only update events and intersections impacted by LRS route edits, can be run within or outside an edit session, and supports undo and redo using the tools in Pro.
- The Dynamic Segmentation tool in ArcGIS Pro now supports LRS pPoint Eevents.  The results in the table are separated into point and line records, allowing users you to edit both LRS Ppoint and LRS lLine eEvents in the output.
- The Add Point Event and Add Line Event tools include an option to place events onto the primary/dominant route.  When enabled in the tool, the route dominance rules are used to place events onto the primary route when there is a concurrency of two or more routes along the measures the events.
- Advanced table editing options are now available when editing LRS Eevents in the Pro attribute table.  These options allow for events to be merged with adjacent events and retired on a specific date when attributes are edited in the attribute table.  These options can be configured within the Location Referencing section of Pro options in a project.
- A new experience to support creating data products using LRS data in support of reporting.  Capabilities within ArcGIS Pro and geoprocessing are used to author configurations of linear referenced data that can be regularly fed into a geoprocessing tool to create reporting data products for use in the ArcGIS Pro reporting experience or other commercial applications such as PowerBI and Crystal Reports.
- The Add Point Event and Add Line Event tools include an option to place events onto the primary/dominant route.  When enabled in the tool, the route dominance rules are used to place events onto the primary route when there is a concurrency of two or more routes along the measures the events.
