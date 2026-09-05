# Create LRS Intersection Geoprocessing Tool User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing · Utility Network |
| **Source** | [Intersections_For_Pro_UserStories1.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Intersections_For_Pro_UserStories1.pptx>) |
| **Edited** | 2019-09-27 23:23 by Rahul Rakshit |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Create LRS Intersection Geoprocessing Tool User Story"
source_file: "Intersections_For_Pro_UserStories1.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Intersections_For_Pro_UserStories1.pptx"
doc_id: 882
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "Rahul Rakshit"
last_edited_by: "Rahul Rakshit"
last_edited: "2019-09-27T23:23:33Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["intersection", "feature class", "geoprocessing", "network", "polyline", "polygon", "location referencing"]
tools: ["Create LRS Intersection"]
products: ["Roads & Highways", "Pipeline Referencing", "Utility Network"]
issues: []
related: [{"doc":881,"file":"create-lrs-intersection-from-existing-feature-class-geoprocessing-tool__doc881.md","s":6.897},{"doc":878,"file":"modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md","s":4.618},{"doc":843,"file":"lrs-intersection-properties-user-story__doc843.md","s":2.967},{"doc":47,"file":"length-data-product-support-features-enhancement__doc47.md","s":2.761},{"doc":723,"file":"configure-route-priority-user-story__doc723.md","s":2.729}]
```
-->

## Summary

User story describing the need and requirements for a geoprocessing tool to generate intersection feature classes between a network and polyline or polygon feature classes. It includes functional requirements, constraints, supported data sources, and test scenarios for the tool within the Location Referencing framework.

## Related documents

<!-- related:begin -->
- [Create LRS Intersection From Existing Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-lrs-intersection-from-existing-feature-class-geoprocessing-tool__doc881.md>) — similar text 0.57 · 4 title words · 2 filename words · same kind/surface/folder <!-- rel:881 -->
- [Modify LRS Intersection Feature Class Geoprocessing Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/modify-lrs-intersection-feature-class-geoprocessing-tool__doc878.md>) — similar text 0.63 · 3 title words · same surface/folder <!-- rel:878 -->
- [LRS Intersection Properties User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/lrs-intersection-properties-user-story__doc843.md>) — similar text 0.11 · 1 title word · same kind/surface/folder <!-- rel:843 -->
- [Length Data Product Support Features Enhancement](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/length-data-product-support-features-enhancement__doc47.md>) — similar text 0.26 · same kind/surface/folder <!-- rel:47 -->
- [Configure Route Priority User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-route-priority-user-story__doc723.md>) — similar text 0.30 · same kind/surface/folder <!-- rel:723 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Create and modify LRS intersections](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/create-and-modify-lrs-intersections.html) · [View LRS intersection properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/view-lrs-intersection-properties.html) · [View utility network feature class properties](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/view-utility-network-feature-class-properties.html) · [LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)
<!-- docs:end -->

---

## Slide 1

Why we need them?
Intersection features can be used in Event Editor to provide measures based on intersection reference offset for creating new event records.

A location where a feature in the routes in the network cross another feature in either the network or the other FC in 3D space.
style.visibility
![image2.png](../media/doc32_image2.png)

## Slide 2

![image3.jpeg](../media/doc32_image3.jpeg) ![image4.jpeg](../media/doc32_image4.jpeg) ![image5.jpeg](../media/doc32_image5.jpeg)

## Slide 3

style.visibility
![image7.png](../media/doc32_image7.png)

## Slide 4

Create LRS Intersection Geoprocessing Tool
As an LRS maintainer, I need the ability to generate an intersection feature class between a network and any polyline or polygon FCs in order to support attribution of roadway/pipelines from the intersection locations.

## Slide 5

![Interface screenshot redrawn as a standardized wireframe: 4 panels, 7 fields, 3 row separators, 6 icons, 57 text rows. 46 of 57 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc32_slide5_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 4 panels, 7 fields, 3 row separators, 6 icons, 57 text rows. 46 of 57 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc32_slide5_fig2.svg)

![image8.png](../media/doc32_image8.png)

## Slide 6

![Diagram drawn from the slide's own shapes: 4 freeform paths.](../media/doc32_slide6_fig1.svg)
![Interface screenshot redrawn as a standardized wireframe: 5 panels, 8 fields, 1 row separator, 3 icons, 42 text rows. 32 of 42 text rows carry text transcribed from the screenshot (OCR, approximate); the rest render as placeholder bars; positions are approximate to the source image and colours are mapped to the corpus palette.](../media/doc32_slide6_fig2.svg)

style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image10.png](../media/doc32_image10.png)

## Slide 7

- Create an M and Z enabled point FC with the fields outlined in the table
- Create the FC within the feature dataset that houses the LRS CD
- The spatial reference, tolerance and resolution of the FC should be the same as that is defined for the LRS
- The FC should be empty
- The intersecting FC’s should be either line or polygon layers
- Do not allow same FC twice as intersecting layers
- The intersecting FC’s should reside in the same database as that of the network
- Tabbing should work
- Internationalization
- Do not allow creation of a duplicate FC
- Should work on DC and not in services
- Support traditional and branch versioning
- Only allow LR networks in the Network parameter
- Do not allow derived network
- In the field drop-downs, do not list editor tracking or globalID fields
- The ID field and the description field can be same for the inputs
- Place the tool in a new group named ‘LRS Intersection’ under Location Referencing Tools>Configuration toolbox
- Write* to the LRS controller dataset.
- We will have to make the controller dataset copiable. Another user story.
style.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibilitystyle.visibility
![image11.png](../media/doc32_image11.png)

## Slide 8

- SQL Server, Oracle and FGDB
- APR, UN, PoM and RH datasets
- Line, Non-Line and PoM Networks
- Intersecting layers = Parent Network
- Intersecting layers = Another Network
- Intersecting layer = Parent Network + Boundary layers
- The input for network is not a network layer
- PY: Global ID is provided in the ID field
- PY: Global ID is provided in the Description field
- PY: An editor tracking field is provided in the ID field
- PY: An editor tracking field is provided in the ID field
- Intersecting layer is a point layer
- PY: No intersecting layers are provided
- No ID AND/OR Description field chosen
- The user does not have the permissions to create a FC in the database
- Use the same FC twice as an intersecting layer
- The projection on the intersection layer does not match with that of the network
- The intersecting layer comes from a database that is not the network’s database
- Positive tests in Test Complete metadata PY harness
- Negative tests in PY harness

![image12.jpeg](../media/doc32_image12.jpeg) ![image13.png](../media/doc32_image13.png)

## Slide 9

- Get the error codes from the Dev and get them added to the excel
- Write GP Doc

![image15.jpeg](../media/doc32_image15.jpeg)

## Slide 10

![image16.png](../media/doc32_image16.png)
