# Roads and Highways and Pipeline Referencing Enhancements in Experience Builder

| Field | Value |
| --- | --- |
| **Doc** | 305 · Other · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [What.sNewEnterprise.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5872_whats_new/What.sNewEnterprise.docx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2024-09-23 17:12 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · experience builder · roads and highways · pipeline referencing · point event · line event · contingent value · lrs templates |
| **Tools** | Dynamic Segmentation · LRS Search by Route · Add Point Event · Add Line Event · Merge Events · Split Event · Query Attribute Set |

## Summary

This document describes enhancements to ArcGIS Roads and Highways and Pipeline Referencing tools within ArcGIS Experience Builder. It highlights the introduction of a new Dynamic Segmentation widget for segmenting and editing point and line events, updates to LRS templates for improved user experience, enhancements to the LRS Search by Route widget to support line networks and derived network fields, and the addition of contingent value support in several LRS widgets. It also notes updates to Linear Referencing REST operations to support point event layers.

## Related documents

<!-- related:begin -->
- [Roads and Highways and Pipeline Referencing 11.x Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/rh-and-apr-11-x-exb-widgets.md>) — similar text 0.20 · 5 title words · 2 filename words · same kind/surface <!-- rel:397 s=6.72 -->
- [Roads and Highways and Pipeline Referencing Enhancements in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/rh-and-apr-enhancements-in-pro.md>) — similar text 0.19 · 4 title words · 1 filename word · same kind/folder <!-- rel:304 s=4.941 -->
- [ArcGIS Roads and Highways Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/667-arcgis-rh-exb-widgets.md>) — similar text 0.17 · 4 title words · same kind/surface <!-- rel:398 s=4.439 -->
- [What's new in ArcGIS Roads and Highways 12.1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/whats-new-in-arcgis-rh-12-1.md>) — similar text 0.24 · 2 title words · 1 filename word · same kind/surface <!-- rel:56 s=3.898 -->
- [ArcGIS Pipeline Referencing Experience Builder Widgets](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/667-arcgis-apr-exb-widgets.md>) — similar text 0.15 · 3 title words · same kind/surface <!-- rel:399 s=3.842 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Create a template for an LRS length data product](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-a-template-for-an-lrs-length-data-product.html)

_No page matched:_ [LRS Search by Route](https://www.google.com/search?q=%22LRS%20Search%20by%20Route%22+site%3Adoc.esri.com) · [Add Point Event](https://www.google.com/search?q=%22Add%20Point%20Event%22+site%3Adoc.esri.com) · [Add Line Event](https://www.google.com/search?q=%22Add%20Line%20Event%22+site%3Adoc.esri.com) · [Split Event](https://www.google.com/search?q=%22Split%20Event%22+site%3Adoc.esri.com) · [Query Attribute Set](https://www.google.com/search?q=%22Query%20Attribute%20Set%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

### Roads and Highways
The following enhancements hasve been made to the ArcGIS Roads and Highways tools widgets in ArcGIS Experience Builder:

- A new Dynamic Segmentation- Experience Builder widget.  This widget allows user to dynamically sSegment point and line events dynamically and make edits to business attributes within a table.  Users You can also visualize the data in a sStraight l-Line dDiagram view to visualize point and line events graphically.  Users You can view, edit, and perform basic statistical analysis on events in a straight line diagramthis view.
- LRS templates-The Dynamic Segmentation widget has been incorporated in the templates for viewing and event editing.
- The LRS Search by Route- widget in Experience Builder has been enhanced to support sSearching for lines when the input network is a line network.  Other enhancements to the widget You can also include derived network fields being included in the results when searching on a line network.
- Contingent values are now  supported is now available in the following LRS Roads and Highways widgets: Add Point Event, Add Line Event, Merge Events, and Split Event.
The Dynamic Segmentation widget is included in the LRS templates.

- In addition, the LRS templates for viewing and event editing have been updated for a better out of the box user experience and to incorporate the new Dynamic Segmentation widget.
In Linear Referencing REST operations, the Query Attribute Set operationendpoint has been updated to support LRS pPoint Eevent layers s as inputs layers to the tool. Point event layers and will beisare included in the dynamic segmentation output produced by the tool.this operation.

### Pipeline Referencing
The following enhancements has been made to the Pipeline Referencing tools in Experience Builder:

- A new Dynamic Segmentation Experience Builder widget.  This widget allows user to dynamically segment point and line events and make edits to business attributes within a table.  Users can also visualize the data in a Straight-Line Diagram view to visualize point and line events graphically.  Users can view, edit, and perform basic statistical analysis on events in this view.
- The LRS Search widget in Experience Builder has been enhanced to support searching for lines when the input network is a line network.  Other enhancements to the widget include derived network fields being included in the results when searching on a line network.
- Contingent value support is now available in the following LRS widgets: Add Point, Add Line, Merge Events, and Split Event.
In addition, the LRS templates for viewing and event editing have been updated for a better out of the box user experience and to incorporate the new Dynamic Segmentation widget.
In Linear Referencing REST operations, the Query Attribute Set endpoint has been updated to support LRS Point Events as input layers to the tool and will be included in the dynamic segmentation output produced by the tool.
