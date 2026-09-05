# Pipeline Referencing Across the ArcGIS Platform

|   |   |
| --- | --- |
| **Kind** | Other · Enterprise |
| **Release** | — |
| **Product** | Pipeline Referencing · Utility Network |
| **Source** | [UC2020_APR_Short.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/UC2020_APR_Short.pptx>) |
| **Edited** | 2020-07-09 15:56 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Pipeline Referencing Across the ArcGIS Platform"
source_file: "UC2020_APR_Short.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/UC2020_APR_Short.pptx"
doc_id: 784
doc_kind: "Other"
surface: "Enterprise"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2020-07-09T15:56:14Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["pipeline referencing", "network", "centerline", "route editing", "event editing", "geoprocessing tools", "dynamic segmentation", "utility network", "calibration point", "event behaviors", "event location methods"]
tools: ["Append Routes", "Generate Calibration Points", "Append Events", "Apply Event Behaviors", "Delete Routes", "Derive Event Measures", "Generate Events", "Generate Routes", "Overlay Events", "Remove Overlapping Centerlines", "Translate Event Measures", "Update Measures From LRS", "Remove LRS Entity", "Configure Utility Network Feature Class"]
products: ["Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":785,"file":"arcgis-pipeline-referencing-an-introduction__doc785.md","s":6.527},{"doc":787,"file":"location-referencing-for-transportation-across-the-arcgis-platform__doc787.md","s":5.254},{"doc":115,"file":"regression-testing-task-list-v1__doc115.md","s":4.012},{"doc":39,"file":"location-referencing-gp-error-messages__doc39.md","s":3.935},{"doc":788,"file":"location-referencing-for-transportation-across-the-arcgis-platform__doc788.md","s":3.771}]
```
-->

## Summary

Overview of pipeline referencing capabilities across ArcGIS Pro, ArcGIS Enterprise, and web applications. Covers information models, types of networks, route editing tools, geoprocessing tools, event types and behaviors, event location methods, event editing in the web, and integration with Utility Network. Describes server features, dynamic segmentation, and combined information models for pipeline referencing and utility networks.

## Related documents

<!-- related:begin -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/arcgis-pipeline-referencing-an-introduction__doc785.md>) — similar text 0.62 · 1 title word · 1 filename word · same kind/folder <!-- rel:785 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-for-transportation-across-the-arcgis-platform__doc787.md>) — similar text 0.42 · 2 title words · same kind/folder <!-- rel:787 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1__doc115.md>) — similar text 0.19 <!-- rel:115 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-gp-error-messages__doc39.md>) — similar text 0.11 · same kind <!-- rel:39 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/location-referencing-for-transportation-across-the-arcgis-platform__doc788.md>) — similar text 0.37 · 2 title words · same kind/folder <!-- rel:788 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Split a centerline by point](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/split-a-centerline.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-event-behavior.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com) · [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com) +2
<!-- docs:end -->

---

## Slide 1 — Pipeline Referencing Across the ArcGIS Platform

![Diagram drawn from the slide's own shapes: 4 nodes, 4 connectors.](../media/doc129_slide1.svg)

ArcGIS Pro
ArcGIS Enterprise
Web Applications

- Pipeline Referencing extension is part of the ArcGIS Pro install
- Linear referencing capability for server is part of the ArcGIS Enterprise install
- Network and centerline
   management

- LRS configuration
- Route and event loading
- Geoprocessing tools
- Includes Workflow Manager
   & Data Reviewer for Desktop

- LRS web services
- Developer API samples
- Event editing
- Data queries
- Integrates with Data
   Reviewer for Server

![image4.png](../media/doc129_image4.png) ![image5.png](../media/doc129_image5.png) ![image6.png](../media/doc129_image6.png)

## Slide 2 — Pipeline Referencing – Information Model

![Diagram drawn from the slide's own shapes: 9 nodes (Route, Network), 7 connectors.](../media/doc129_slide2.svg)

m:n relationship
          routes and centerlines

Locks m at locations
M & Z enabled polyline

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

![image4.png](../media/doc129_image4.png) ![image8.png](../media/doc129_image8.png)

## Slide 3 — Pipeline Referencing – Types of Networks

![Diagram drawn from the slide's own shapes: 10 nodes (Continuous Network, Line Network, a.k.a.,, “Engineering Station Network”), 2 connectors.](../media/doc129_slide3.svg)

“Engineering Station Network”
style.visibility

![image4.png](../media/doc129_image4.png)

## Slide 4 — Pipeline Referencing – Types of Networks

![Diagram drawn from the slide's own shapes: 14 nodes (Continuous Network, Derived Network, Line Network, a.k.a.,, “Engineering Station Network”), 3 connectors.](../media/doc129_slide4.svg)

“Engineering Station Network”

![image4.png](../media/doc129_image4.png)

## Slide 5 — Location Referencing Route Editing Tools

![Measured route diagram drawn from the slide's own shapes.](../media/doc129_slide5.svg)

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility

![image4.png](../media/doc129_image4.png) ![image9.png](../media/doc129_image9.png) ![image10.png](../media/doc129_image10.png)

## Slide 6 — Geoprocessing Tools

- Configuration
  - LRS
  - LRS Event
  - LRS Intersection
  - LRS Network
  - Remove LRS Entity
  - Configure Utility Network Feature Class
- Append Routes
- Generate Calibration Points
- Append Events
- Apply Event Behaviors
- Delete Routes
- Derive Event Measures
- Generate Events
- Generate Routes
- Overlay Events
- Remove Overlapping Centerlines
- Translate Event Measures
- Update Measures From LRS

Data Loading

LRS Configuration

Transformations

![image4.png](../media/doc129_image4.png)

### Notes

Add intersection tools, Update measures from LRS + other UN tools , new tools mark with*

## Slide 7 — Pipeline Referencing – Types of Events

![Measured route diagram drawn from the slide's own shapes.](../media/doc129_slide7.svg)

style.visibilitystyle.visibility

![image4.png](../media/doc129_image4.png) ![image12.png](../media/doc129_image12.png)

## Slide 8 — Event Behaviors After route edits, measure behavior rules can be applied to events

![Measured route diagram drawn from the slide's own shapes, measures 0 to 0.](../media/doc129_slide8.svg)

Preserves geographic
location. Measures may change.

Event gets retired.

Preserves measures.
Geographic location may change.

style.visibilitystyle.visibilitystyle.visibility

![image4.png](../media/doc129_image4.png)

## Slide 9 — Event Location Methods

![Diagram drawn from the slide's own shapes: 2 nodes, 5 connectors.](../media/doc129_slide9.svg)

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
45 feet from Wellhead
Wellhead location:
34.0547,117.1825

Coordinates and offset
style.visibilitystyle.visibilitystyle.visibility
![image4.png](../media/doc129_image4.png)

## Slide 10 — Event Editor: Event Editing in the web

- Editing
  - Lines and Points events
  - Event Attributes
  - Selection
  - Select by route, attribute, geometry, proximity
  - Single layer results or attribute sets
  - Quality Control
  - Gaps, overlaps, invalid measures
  - Data Reviewer batch checks

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image4.png](../media/doc129_image4.png) ![image14.png](../media/doc129_image14.png) ![image16.png](../media/doc129_image16.png)

## Slide 11 — Pipeline Referencing in ArcGIS Enterprise

Pipeline Referencing Server
Linear Referencing Service Features

- Network editing
- Event editing
- Coordinate to measures
- Measure to coordinate
- Measure translation
- Dynamic Segmentation
- Check events (gaps, overlaps, invalid measures)

[figure: Desktop · Web · Connected Mobile · LRS Web Services]

![image4.png](../media/doc129_image4.png)

## Slide 12 — Combining Pipeline Referencing and Utility Network is the solution

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
[figure: Gathering · Transmission · Distribution · Linear Referencing · Geometric Network]

![image4.png](../media/doc129_image4.png)

## Slide 13 — Combining Pipeline Referencing and Utility Network is the solution

Utility Network and Pipeline Referencing

[figure: Gathering · Transmission · Distribution · UPDM 2019]

![image4.png](../media/doc129_image4.png)

## Slide 14 — Integrating both information models

Utility Network

| Assembly |
| --- |
| Device |
| Junction |
| Pipeline |
| Structure Boundary |
| Structure Junction |
| Structure Line |

Pipeline Referencing

| Calibration Point |
| --- |
| Centerline |
| Centerline Sequence |
| Redline |

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image4.png](../media/doc129_image4.png)
