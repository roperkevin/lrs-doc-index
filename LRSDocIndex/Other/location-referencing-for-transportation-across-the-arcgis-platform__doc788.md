# Location Referencing for transportation across the ArcGIS Platform

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_Intro.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/RH_Intro.pptx>) |
| **Edited** | 2020-07-08 17:14 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Location Referencing for transportation across the ArcGIS Platform"
source_file: "RH_Intro.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/RH_Intro.pptx"
doc_id: 788
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2020-07-08T17:14:39Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["route editing", "event behaviors", "overlay events", "event editing", "address management", "network management", "centerline", "geoprocessing tools"]
tools: ["Overlay Events", "Location Referencing Service", "Event Editor", "Roadway Reporter"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":787,"file":"location-referencing-for-transportation-across-the-arcgis-platform__doc787.md","s":6.392},{"doc":784,"file":"pipeline-referencing-across-the-arcgis-platform__doc784.md","s":3.771},{"doc":785,"file":"arcgis-pipeline-referencing-an-introduction__doc785.md","s":3.196},{"doc":885,"file":"arcgis-pipeline-referencing-an-introduction__doc885.md","s":2.955},{"doc":408,"file":"roads-and-highways-and-pipeline-referencing-enhancements__doc408.md","s":2.038}]
```
-->

## Summary

Overview of location referencing capabilities across the ArcGIS platform including network and centerline management, route and event loading, geoprocessing tools, and web services. Covers route editing tools, event behaviors, overlay events geoprocessing, event editing in web apps, reporting via Roadway Reporter, and address management using Roads and Highways.

## Related documents

<!-- related:begin -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-for-transportation-across-the-arcgis-platform__doc787.md>) — similar text 0.66 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:787 -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/pipeline-referencing-across-the-arcgis-platform__doc784.md>) — similar text 0.37 · 2 title words · same kind/folder <!-- rel:784 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc785.md>) — similar text 0.38 · same kind/surface/folder <!-- rel:785 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-pipeline-referencing-an-introduction__doc885.md>) — similar text 0.26 · 1 filename word · same kind/surface <!-- rel:885 -->
- [Roads and Highways and Pipeline Referencing Enhancements](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/roads-and-highways-and-pipeline-referencing-enhancements__doc408.md>) — similar text 0.10 · same kind/surface <!-- rel:408 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html) · [Manage Pipeline Referencing and a utility network together](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/manage-pipeline-referencing-and-a-utility-network-together.html) · [Merge centerlines](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-centerlines.html)

_No page matched:_ [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Location Referencing Service](https://www.google.com/search?q=%22Location%20Referencing%20Service%22+site%3Adoc.esri.com) · [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com) · [Roadway Reporter](https://www.google.com/search?q=%22Roadway%20Reporter%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Location Referencing for transportation across the ArcGIS Platform

Pro

- Network and Centerline Management
- Route and Event Loading
- Geoprocessing tools
- Data Reviewer and Workflow Manager included

Enterprise

- Location Referencing web services
- Developer API samples

Web Apps

- Line and point event editing
- Data queries
- Quality checks
- Reporting
- Address Management

## Slide 2 — Building blocks of a location referencing system

![Diagram drawn from the slide's own shapes: 5 nodes, 10 connectors.](../media/doc125_slide2.svg)

| Type | Description | Examples |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

Anchors the measures for routes

Linear characteristics of routes

Functional Class, IRI, Surface Type, Speed Limit

Point characteristics of routes

Signs, Bridge Locations, Crashes

Between Routes, Between Routes-Lines-Polygons

Network-Network, Network-County boundary

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

## Slide 3 — Multi-LRM Support

![Diagram drawn from the slide's own shapes: 7 nodes, 11 connectors.](../media/doc125_slide3.svg)

Route features are generated from centerline geometry and calibration point measures
The two routes above are derived from three centerline lines

## Slide 4

![Diagram drawn from the slide's own shapes: 21 nodes, 22 connectors.](../media/doc125_slide4.svg)

Location Referencing Route Editing Tools

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

## Slide 5 — Event Behaviors After route edits, measure behavior rules can be applied to events

![Measured route diagram drawn from the slide's own shapes, measures 0 to 10.](../media/doc125_slide5.svg)

Preserves geographic
location. Measures may change.

Preserves measures.
Geographic location may change.

Changes ownership to another route. Measures may change.

style.visibilitystyle.visibilitystyle.visibilitystyle.visibility

## Slide 6 — Geoprocessing Tools – Overlay Events

![Measured route diagram drawn from the slide's own shapes, measures 45 to 65.](../media/doc125_slide6_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 2 row separators, 9 icons, 27 text rows. 17 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc125_slide6_fig2.svg)

![image16.jpeg](../media/doc125_image16.jpeg)

## Slide 7

Location Referencing in ArcGIS Enterprise
Provides a simple, open web interface to linear referencing services hosted by ArcGIS Enterprise.

Remove Overlapping Centerlines

Linear Referencing Service
Supports Esri’s Feature Services Architecture – feature service editing across the ArcGIS Platform including ArcGIS Pro and web apps

[figure: Generate Routes · Create Version · Derive Event Measures · Translate · Release Locks · Apply Edits · Geometry to Measure · Acquire locks · Generate Events · Append Routes · Concurrencies · Apply Event Behaviors · Measure to Geometry · Query Attribute Set · Delete Version · Locks · Check Events · Portal · Web Apps · Pro · APIs · Mobile]

## Slide 8 — Event Editor: Event Editing in the web

- Editing
  - Lines and Points events
  - Event Attributes
  - Selection
  - Select by route, attribute, geometry, proximity
  - Single layer results or attribute sets
  - Quality Control
  - Gaps, overlaps, invalid measures
  - Data Reviewer batch checks

![image17.png](../media/doc125_image17.png)

## Slide 9 — Roadway Reporter

Reporting available across the enterprise from a web application

Mileage Report
Mileages for routes and events
Segment Report
Dynamically segment event layers into one record set
Road Log Report
Logging events that occur  in measure order when traversing a route
style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image20.png](../media/doc125_image20.png) ![image21.png](../media/doc125_image21.png) ![image22.png](../media/doc125_image22.png) ![image24.png](../media/doc125_image24.png) ![image25.png](../media/doc125_image25.png) ![image26.jpg](../media/doc125_image26.jpg)

## Slide 10 — Address Management

![Interface screenshot redrawn as a standardized wireframe: 37 buttons, 2 colour blocks, 28 icons, 47 text rows. 26 of 47 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc125_slide10.svg)

Managing address information using Roads and Highways

Editing

- Add/Edit Block Ranges
- Add/Edit Site Address Points
- Add Master Street Names
Quality Control

- Fishbone Diagrams
- Data Reviewer Batch Checks

![image27.png](../media/doc125_image27.png)
