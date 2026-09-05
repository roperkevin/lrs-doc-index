# Location Referencing for transportation across the ArcGIS Platform

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways |
| **Source** | [RH_Intro_Full.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/RH_Intro_Full.pptx>) |
| **Edited** | 2020-07-08 17:12 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Location Referencing for transportation across the ArcGIS Platform"
source_file: "RH_Intro_Full.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/RH_Intro_Full.pptx"
doc_id: 787
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2020-07-08T17:12:22Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location referencing", "route editing", "event behaviors", "geoprocessing tools", "rest api", "event editing", "quality control", "address management"]
tools: ["Append Routes", "Generate Calibration Points", "Append Events", "Apply Event Behaviors", "Delete Routes", "Derive Event Measures", "Generate Events", "Generate Intersections", "Generate Routes", "Overlay Events", "Remove Overlapping Centerlines", "Translate Event Measures"]
products: ["Roads & Highways"]
issues: []
related: [{"doc":788,"file":"location-referencing-for-transportation-across-the-arcgis-platform__doc788.md","s":6.392},{"doc":785,"file":"arcgis-pipeline-referencing-an-introduction__doc785.md","s":5.709},{"doc":784,"file":"pipeline-referencing-across-the-arcgis-platform__doc784.md","s":5.254},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":3.815},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.587}]
```
-->

## Summary

Overview of location referencing capabilities across the ArcGIS platform including network and centerline management, route and event loading, geoprocessing tools, web services, and web app functionalities. Covers multi-LRM support, route editing tools, event behaviors, geoprocessing tools for LRS configuration and event overlay, REST API, event editing in web, event location methods, quality control checks, attribute sets, reporting, and address management.

## Related documents

<!-- related:begin -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-for-transportation-across-the-arcgis-platform__doc788.md>) — similar text 0.66 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:788 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc785.md>) — similar text 0.49 · 1 filename word · same kind/surface/folder <!-- rel:785 -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/pipeline-referencing-across-the-arcgis-platform__doc784.md>) — similar text 0.42 · 2 title words · same kind/folder <!-- rel:784 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.19 · same surface <!-- rel:115 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.12 · same kind/surface <!-- rel:39 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Manage address and roadway characteristic data together](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/manage-address-and-roadway-characteristic-data-together.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Intersections](https://www.google.com/search?q=%22Generate%20Intersections%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com)
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

![image4.png](../media/doc124_image4.png) ![image5.png](../media/doc124_image5.png) ![image6.png](../media/doc124_image6.png)

## Slide 2 — Building blocks of a location referencing system

![Diagram drawn from the slide's own shapes: 5 nodes, 10 connectors.](../media/doc124_slide2.svg)

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

![image4.png](../media/doc124_image4.png)

## Slide 3 — Multi-LRM Support

![Diagram drawn from the slide's own shapes: 7 nodes, 11 connectors.](../media/doc124_slide3.svg)

Route features are generated from centerline geometry and calibration point measures
The two routes above are derived from three centerline lines

![image4.png](../media/doc124_image4.png)

## Slide 4

![Diagram drawn from the slide's own shapes: 21 nodes, 22 connectors.](../media/doc124_slide4.svg)

Location Referencing Route Editing Tools

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

![image4.png](../media/doc124_image4.png)

## Slide 5 — Event Behaviors After route edits, measure behavior rules can be applied to events

![Measured route diagram drawn from the slide's own shapes, measures 0 to 10.](../media/doc124_slide5.svg)

Preserves geographic
location. Measures may change.

Preserves measures.
Geographic location may change.

Changes ownership to another route. Measures may change.

style.visibilitystyle.visibilitystyle.visibilitystyle.visibility

![image4.png](../media/doc124_image4.png)

## Slide 6 — Geoprocessing Tools

- Configuration
  - LRS
  - LRS Event
  - LRS Intersection
  - LRS Network
  - Remove LRS Entity
- Append Routes
- Generate Calibration Points
- Append Events
- Apply Event Behaviors
- Delete Routes
- Derive Event Measures
- Generate Events
- Generate Intersections
- Generate Routes
- Overlay Events
- Remove Overlapping Centerlines
- Translate Event Measures

Data Loading

![image4.png](../media/doc124_image4.png)

## Slide 7 — Geoprocessing Tools

- Configuration
  - LRS
  - LRS Event
  - LRS Intersection
  - LRS Network
  - Remove LRS Entity
- Append Routes
- Generate Calibration Points
- Append Events
- Apply Event Behaviors
- Delete Routes
- Derive Event Measures
- Generate Events
- Generate Intersections
- Generate Routes
- Overlay Events
- Remove Overlapping Centerlines
- Translate Event Measures

Transformations

![image4.png](../media/doc124_image4.png)

## Slide 8 — Geoprocessing Tools – Overlay Events

![Measured route diagram drawn from the slide's own shapes, measures 45 to 65.](../media/doc124_slide8.svg)

style.visibility

![image4.png](../media/doc124_image4.png)

## Slide 9 — Geoprocessing Tools – Overlay Events

![Measured route diagram drawn from the slide's own shapes, measures 45 to 65.](../media/doc124_slide9_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 2 row separators, 9 icons, 27 text rows. 17 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc124_slide9_fig2.svg)

![image4.png](../media/doc124_image4.png)

## Slide 10 — Geoprocessing Tools – Overlay Events

![Measured route diagram drawn from the slide's own shapes, measures 45 to 65.](../media/doc124_slide10_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 2 panels, 1 field, 2 row separators, 9 icons, 27 text rows. 17 of 27 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc124_slide10_fig2.svg)

![image4.png](../media/doc124_image4.png)

## Slide 11

Location Referencing in ArcGIS Enterprise
Provides a simple, open web interface to linear referencing services hosted by ArcGIS Enterprise.

Remove Overlapping Centerlines

Linear Referencing Service
Supports Esri’s Feature Services Architecture – feature service editing across the ArcGIS Platform including ArcGIS Pro and web apps

[figure: Generate Routes · Create Version · Derive Event Measures · Translate · Release Locks · Apply Edits · Geometry to Measure · Acquire locks · Generate Events · Append Routes · Concurrencies · Apply Event Behaviors · Measure to Geometry · Query Attribute Set · Delete Version · Locks · Check Events · Portal · Web Apps · Pro · APIs · Mobile]

![image4.png](../media/doc124_image4.png)

## Slide 12

![Route diagram vector-traced from the slide's pasted picture; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc124_slide12.svg)

Location Referencing REST API
http://esriurl.com/RHREST

http://esriurl.com/LRWIGET

- REST API developer guide
- Sample LRS-enabled services
- Sample web apps
- Web AppBuilder samples

![image4.png](../media/doc124_image4.png)

## Slide 13 — Event Editor: Event Editing in the web

- Editing
  - Lines and Points events
  - Event Attributes
  - Selection
  - Select by route, attribute, geometry, proximity
  - Single layer results or attribute sets
  - Quality Control
  - Gaps, overlaps, invalid measures
  - Data Reviewer batch checks

![image4.png](../media/doc124_image4.png)

## Slide 14 — Event Location Methods

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc124_slide14.svg)

Route and measure
Event:
1.27 miles

Event:
456+25.00

Stationing
Event:
300 feet from US Highway 10
Intersections
US Highway 10 crossing

Referent and offset

  - Intersections
  - Events
  - Features
Event:
45 feet from cell tower
Cell Tower location:
34.0547,117.1825

Coordinates and offset

![image4.png](../media/doc124_image4.png)

## Slide 15 — Event Quality Control Checks

![Diagram drawn from the slide's own shapes: 7 nodes, 8 connectors.](../media/doc124_slide15.svg)

Gaps

Invalid Measures

Overlaps

![image4.png](../media/doc124_image4.png) ![image24.png](../media/doc124_image24.png)

## Slide 16 — Attribute Sets

Collection of linear event attribute fields that can be edited as a logical group

style.visibilitystyle.visibility
![image4.png](../media/doc124_image4.png) ![image26.png](../media/doc124_image26.png)

## Slide 17 — Roadway Reporter

Reporting available across the enterprise from a web application

Mileage Report
Mileages for routes and events
Segment Report
Dynamically segment event layers into one record set
Road Log Report
Logging events that occur  in measure order when traversing a route
style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image4.png](../media/doc124_image4.png) ![image37.png](../media/doc124_image37.png) ![image38.png](../media/doc124_image38.png) ![image39.jpg](../media/doc124_image39.jpg)

## Slide 18 — Address Management

![Interface screenshot redrawn as a standardized wireframe: 37 buttons, 2 colour blocks, 28 icons, 47 text rows. 26 of 47 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc124_slide18.svg)

Managing address information using Roads and Highways

Editing

- Add/Edit Block Ranges
- Add/Edit Site Address Points
- Add Master Street Names
Quality Control

- Fishbone Diagrams
- Data Reviewer Batch Checks

![image4.png](../media/doc124_image4.png) ![image40.png](../media/doc124_image40.png)

## Slide 19 — Resources

![image4.png](../media/doc124_image4.png)
