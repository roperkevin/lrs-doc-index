# ArcGIS Pipeline Referencing: An Introduction

| Field | Value |
| --- | --- |
| **Doc** | 785 · Other · Pro |
| **Product** | Pipeline Referencing · Utility Network |
| **Release** | — |
| **Issues** | — |
| **Source** | [UC2020_APR_Full.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/UC%202020%20prep%20for%20RH/UC2020_APR_Full.pptx>) |
| **People** | author — · PE Johum Khushk · dev Nathan Easley |
| **Edited** | 2020-07-09 15:10 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | pipeline referencing · event editing · route editing · utility network integration · geoprocessing tools · rest api · calibration points · dynamic segmentation |
| **Tools** | Append Routes · Generate Calibration Points · Append Events · Apply Event Behaviors · Delete Routes · Derive Event Measures · Generate Events · Generate Routes · Overlay Events · Remove Overlapping Centerlines · Translate Event Measures · Update Measures From LRS |

## Summary

This document introduces ArcGIS Pipeline Referencing, covering its information model, integration with ArcGIS Pro and ArcGIS Enterprise, event editing capabilities, utility network integration, and geoprocessing tools. It includes descriptions of pipeline referencing networks, event behaviors, route editing tools, REST API features, and a roadmap for future developments. The document also highlights demo scenarios and tool configurations relevant to pipeline referencing workflows.

## Related documents

<!-- related:begin -->
- [Pipeline Referencing Across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/apr-across-the-arcgis-platform.md>) — similar text 0.62 · 1 title word · 1 filename word · same kind/folder <!-- rel:784 s=6.527 -->
- [Location Referencing for transportation across the ArcGIS Platform](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lr-for-transportation-across-the-arcgis-platform-rh-2020-07.md>) — similar text 0.49 · 1 filename word · same kind/surface/folder <!-- rel:787 s=5.709 -->
- [ArcGIS Pipeline Referencing: An Introduction](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/arcgis-apr-an-introduction-rh-apr-un.md>) — similar text 0.33 · 2 title words · 1 filename word · same kind/surface <!-- rel:885 s=4.536 -->
- [Regression Testing Task List V1](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/regression-testing-task-list-v1.md>) — similar text 0.21 · same surface <!-- rel:115 s=4.094 -->
- [Location Referencing GP Error Messages](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/3147-lr-gp-error-messages.md>) — similar text 0.12 · same kind/surface <!-- rel:39 s=3.634 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)

_No page matched:_ [Append Routes](https://www.google.com/search?q=%22Append%20Routes%22+site%3Adoc.esri.com) · [Generate Calibration Points](https://www.google.com/search?q=%22Generate%20Calibration%20Points%22+site%3Adoc.esri.com) · [Append Events](https://www.google.com/search?q=%22Append%20Events%22+site%3Adoc.esri.com) · [Apply Event Behaviors](https://www.google.com/search?q=%22Apply%20Event%20Behaviors%22+site%3Adoc.esri.com) · [Delete Routes](https://www.google.com/search?q=%22Delete%20Routes%22+site%3Adoc.esri.com) · [Derive Event Measures](https://www.google.com/search?q=%22Derive%20Event%20Measures%22+site%3Adoc.esri.com) · [Generate Events](https://www.google.com/search?q=%22Generate%20Events%22+site%3Adoc.esri.com) · [Generate Routes](https://www.google.com/search?q=%22Generate%20Routes%22+site%3Adoc.esri.com) · [Overlay Events](https://www.google.com/search?q=%22Overlay%20Events%22+site%3Adoc.esri.com) · [Remove Overlapping Centerlines](https://www.google.com/search?q=%22Remove%20Overlapping%20Centerlines%22+site%3Adoc.esri.com) · [Translate Event Measures](https://www.google.com/search?q=%22Translate%20Event%20Measures%22+site%3Adoc.esri.com) · [Update Measures From LRS](https://www.google.com/search?q=%22Update%20Measures%20From%20LRS%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — ArcGIS Pipeline Referencing

2020 ESRI USER CONFERENCE
Johum Khushk | Nathan Easley
An Introduction

![Figure 1 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-01-slide-01-arcgis-pipeline-referencing.png)
![Figure 2 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-02-slide-01-arcgis-pipeline-referencing.png)
![Figure 3 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-03-slide-01-arcgis-pipeline-referencing.png)

## Slide 2 — Pipeline Referencing Across the ArcGIS Platform

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

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)
![Figure 5 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-05-slide-02-pipeline-referencing-across-the-arcgis.png)
![Figure 6 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-06-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 7 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-07-slide-02-pipeline-referencing-across-the-arcgis.svg)

## Slide 3 — Agenda

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 8 — Agenda](../media/arcgis-apr-an-introduction-apr-un/fig-08-slide-03-agenda.svg)

## Slide 4 — Pipeline Referencing – Information Model

m:n relationship
          routes and centerlines

Locks m at locations
M & Z enabled polyline

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
[figure: Centerline Sequence · 0 · 50 · Route1 · Route · Calibration Points · Network · Geometry and Location · Centerline · Route2 · Route3 · Events · Characteristics, assets · 15 · 25 · 40]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 9 — Pipeline Referencing – Information Model](../media/arcgis-apr-an-introduction-apr-un/fig-09-slide-04-pipeline-referencing-information-model.svg)

## Slide 5 — Pipeline Referencing – Types of Networks

“Engineering Station Network”
style.visibility
[figure: 0 · 50 · Route1 · Route2 · Continuous Network · Line Network, a.k.a., · Line1 · 55 · 105]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 10 — Pipeline Referencing – Types of Networks](../media/arcgis-apr-an-introduction-apr-un/fig-10-slide-05-pipeline-referencing-types-of-networks.svg)

## Slide 6 — Pipeline Referencing – Types of Networks

“Engineering Station Network”

[figure: 0 · 50 · Route1 · Route2 · Continuous Network · Derived Network · 100 · Line1 · Line Network, a.k.a., · 55 · 105]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 11 — Pipeline Referencing – Types of Networks](../media/arcgis-apr-an-introduction-apr-un/fig-11-slide-06-pipeline-referencing-types-of-networks.svg)

## Slide 7 — Pipeline Referencing – Types of Events

style.visibilitystyle.visibility
[figure: Point · Route1 · 0 · 10 · Line · Spanning Routes · 5 · Route2 · 2 · 7]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)
![Figure 12 — Pipeline Referencing – Types of Events](../media/arcgis-apr-an-introduction-apr-un/fig-12-slide-07-pipeline-referencing-types-of-events.png)

![Figure 13 — Pipeline Referencing – Types of Events](../media/arcgis-apr-an-introduction-apr-un/fig-13-slide-07-pipeline-referencing-types-of-events.svg)

## Slide 8 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 14 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-14-slide-08-arcgis-pipeline-referencing.svg)

## Slide 9 — Location Referencing Route Editing Tools

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

## Slide 10 — Location Referencing Route Editing Tools

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
[figure: Reassign - Split · Reassign - Merge · Realign - Abandon · Realign - Retire · Create · Extend · Retire · Cartorealign]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 15 — Location Referencing Route Editing Tools](../media/arcgis-apr-an-introduction-apr-un/fig-15-slide-10-location-referencing-route-editing-tools.svg)

## Slide 11 — Demo: Route Editing

### Notes

(Daily build of 2.6) Create a route , realignment with abondenment (double equation point), time slider.

## Slide 12 — Event Behaviors After route edits, measure behavior rules can be applied to events

Preserves geographic
location. Measures may change.

Event gets retired.

Preserves measures.
Geographic location may change.

style.visibilitystyle.visibilitystyle.visibility
[figure: Stay Put · 0 · 15 · Retire · Move · Before Editing · 10 · Centerline · Event · Route]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 16 — Event Behaviors After route edits, measure behavior rules can be applied to events](../media/arcgis-apr-an-introduction-apr-un/fig-16-slide-12-event-behaviors-after-route-edits.svg)

## Slide 13 — Demo: Event Behaviors

Using Extend Route

## Slide 14 — Geoprocessing Tools

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

LRS Configuration

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

### Notes

Add intersection tools, Update measures from LRS + other UN tools , new tools mark with*

## Slide 15 — Geoprocessing Tools

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

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

### Notes

Add intersection tools, Update measures from LRS + other UN tools , new tools mark with*

## Slide 16 — Geoprocessing Tools

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

Transformations

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

### Notes

Add intersection tools, Update measures from LRS + other UN tools , new tools mark with*

## Slide 17 — Geoprocessing Tools – Overlay Events

style.visibility
[figure: Inputs · Route · Coating · Corrosion · Insulation · Class Location · Class 1 · Class 2]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 17 — Geoprocessing Tools – Overlay Events](../media/arcgis-apr-an-introduction-apr-un/fig-17-slide-17-geoprocessing-tools-overlay-events.svg)

## Slide 18 — Geoprocessing Tools – Overlay Events

[figure: Inputs · Route · Coating · Corrosion · Insulation · Class Location · Class 1 · Class 2]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 18 — Geoprocessing Tools – Overlay Events](../media/arcgis-apr-an-introduction-apr-un/fig-18-slide-18-geoprocessing-tools-overlay-events.svg)

## Slide 19 — Geoprocessing Tools – Overlay Events

[figure: Inputs · Route · Coating · Corrosion · Insulation · Class Location · Class 1 · Class 2 · Output]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 19 — Geoprocessing Tools – Overlay Events](../media/arcgis-apr-an-introduction-apr-un/fig-19-slide-19-geoprocessing-tools-overlay-events.svg)

## Slide 20 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network  Integration
The Road Ahead
Q&A

![Figure 20 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-20-slide-20-arcgis-pipeline-referencing.svg)

## Slide 21 — Pipeline Referencing in ArcGIS Enterprise

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

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 21 — Pipeline Referencing in ArcGIS Enterprise](../media/arcgis-apr-an-introduction-apr-un/fig-21-slide-21-pipeline-referencing-in-arcgis.svg)

## Slide 22 — Location Referencing REST API

http://esriurl.com/LREST

http://esriurl.com/LRWIGET

- REST API developer guide
- Sample LRS-enabled services
- Sample web apps
- Web AppBuilder samples

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

## Slide 23 — Demo: Location Referencing REST API

### Notes

Two Sample web apps (<2min)

## Slide 24 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 22 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-22-slide-24-arcgis-pipeline-referencing.svg)

## Slide 25 — Event Editor: Event Editing in the web

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
![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)
![Figure 23 — Event Editor: Event Editing in the web](../media/arcgis-apr-an-introduction-apr-un/fig-23-slide-25-event-editor-event-editing-in-the-web.png)
![Figure 24 — Event Editor: Event Editing in the web](../media/arcgis-apr-an-introduction-apr-un/fig-24-slide-25-event-editor-event-editing-in-the-web.png)

## Slide 26 — Event Location Methods

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
![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 25 — Event Location Methods](../media/arcgis-apr-an-introduction-apr-un/fig-25-slide-26-event-location-methods.svg)

## Slide 27 — Demo: Event Editor

### Notes

Attribute sets, Add events,  Event Replacement, Return attribute sets.

## Slide 28 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 26 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-26-slide-28-arcgis-pipeline-referencing.svg)

## Slide 29 — Combining Pipeline Referencing and Utility Network is the solution

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
[figure: Gathering · Transmission · Distribution · Linear Referencing · Geometric Network]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 27 — Combining Pipeline Referencing and Utility Network is the solution](../media/arcgis-apr-an-introduction-apr-un/fig-27-slide-29-combining-pipeline-referencing.svg)

## Slide 30 — Combining Pipeline Referencing and Utility Network is the solution

Utility Network and Pipeline Referencing

[figure: Gathering · Transmission · Distribution · UPDM 2019]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 28 — Combining Pipeline Referencing and Utility Network is the solution](../media/arcgis-apr-an-introduction-apr-un/fig-28-slide-30-combining-pipeline-referencing.svg)

## Slide 31 — Integrating both information models

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
![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 29 — Integrating both information models](../media/arcgis-apr-an-introduction-apr-un/fig-29-slide-31-integrating-both-information-models.svg)

## Slide 32 — ArcGIS Pipeline Referencing: Integration with Utility Network

## Slide 33 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 30 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-30-slide-33-arcgis-pipeline-referencing.svg)

## Slide 34 — Road Map

- Product releases, dates, and availability are estimates and are subject to change

Event Editing in ArcGIS Pro
Field Data Collection with Linear Referencing
style.visibilitystyle.visibilitystyle.visibilitystyle.visibility
[figure: Near Term · Vertical Pipe Support · Medium Term · Long Term]

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

![Figure 31 — Road Map](../media/arcgis-apr-an-introduction-apr-un/fig-31-slide-34-road-map.svg)

## Slide 35 — Resources

![Figure 4 — Pipeline Referencing Across the ArcGIS Platform](../media/arcgis-apr-an-introduction-apr-un/fig-04-slide-02-pipeline-referencing-across-the-arcgis.png)

### Notes

Make sure links work

## Slide 36 — ArcGIS Pipeline Referencing: An Introduction

Information Model
ArcGIS Pro
ArcGIS Enterprise
Event Editor
Utility Network Integration
The Road Ahead
Q&A

![Figure 12 — Pipeline Referencing – Types of Events](../media/arcgis-apr-an-introduction-apr-un/fig-12-slide-07-pipeline-referencing-types-of-events.png)

![Figure 32 — ArcGIS Pipeline Referencing: An Introduction](../media/arcgis-apr-an-introduction-apr-un/fig-32-slide-36-arcgis-pipeline-referencing.svg)

## Slide 37

Copyright © 2020 Esri. All rights reserved.

![Figure 2 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-02-slide-01-arcgis-pipeline-referencing.png)
![Figure 3 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-03-slide-01-arcgis-pipeline-referencing.png)
![Figure 1 — ArcGIS Pipeline Referencing](../media/arcgis-apr-an-introduction-apr-un/fig-01-slide-01-arcgis-pipeline-referencing.png)
