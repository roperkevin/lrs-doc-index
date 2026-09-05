# Dynamic Segmentation widget

|   |   |
| --- | --- |
| **Kind** | Other · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#26266](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/26266) |
| **Source** | [26266_SLDInteractwithMap_V1.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/26266_SLDInteractwithMap_V1.docx>) |
| **Edited** | 2025-07-30 14:15 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Dynamic Segmentation widget"
source_file: "26266_SLDInteractwithMap_V1.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/26266_SLDInteractwithMap_V1.docx"
doc_id: 151
doc_kind: "Other"
surface: "Experience Builder"
doc_revision: "V1"
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-07-30T14:15:09.8738894Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["dynamic segmentation", "event layers", "straight line diagram", "pipeline referencing", "roads and highways", "experience builder", "lrs"]
tools: ["Dynamic Segmentation"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#26266"]
related: [{"doc":118,"file":"dynamic-segmentation-widget__doc118.md","s":7.517},{"doc":60,"file":"dynamic-segmentation-widget__doc60.md","s":6.919},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":6.747},{"doc":139,"file":"add-point-event-widget__doc139.md","s":3.594},{"doc":138,"file":"add-line-event-widget__doc138.md","s":3.507}]
```
-->

## Summary

Describes the Dynamic Segmentation widget which summarizes multiple input event layers into a single segmented event layer, displaying results in a table or straight line diagram. It supports pipeline and roadway data analysis, requires connection to a Map widget with LRS-enabled web maps, and integrates with other widgets for dynamic segmentation data actions.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc118.md>) — similar text 0.92 · 3 title words · same kind/surface/folder <!-- rel:118 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc60.md>) — similar text 0.89 · 3 title words · same kind/surface <!-- rel:60 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.81 · 3 title words · same kind/surface <!-- rel:57 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-point-event-widget__doc139.md>) — similar text 0.42 · 1 title word · same kind/surface <!-- rel:139 -->
- [Add Line Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/add-line-event-widget__doc138.md>) — similar text 0.39 · 1 title word · same kind/surface <!-- rel:138 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Dynamic Segmentation widget
The Dynamic Segmentation widget takes multiple input event layers and summarizes them into a single segmented event layer. The tool creates new records, known as segments, at any measure along the event where any of the attributes from any of the input event layers change. You can view the results of a dynamic segmentation in either a table or a straight line diagram, which graphs the input and output event layers. You can use this widget to manage and visualize pipeline data with ArcGIS Pipeline Referencing and roadways data with ArcGIS Roads and Highways.

### Examples for Pipeline Referencing
Use this widget to support app design requirements such as the following:

- You want to analyze pipeline conditions and allocate funds for pipeline maintenance.
- You need users to perform a cross event check to verify the accuracy of event data along a route.
- You want to check for gaps in your data and fill them.

### Examples for Roads and Highways
Use this widget to support app design requirements such as the following:

- You want to analyze road conditions using variables like traffic and jurisdiction to determine how to allocate maintenance funds.
- You need users to perform cross check events to verify the accuracy of Highway Performance Monitoring System (HPMS) data along a route.
- You want to check for gaps in your data and fill them.

### Usage notes
This widget requires connection to a Map widget. To dynamically segment events, the Map widget must be connected to a web map data source with an LRS published with the Linear Referencing and Version Management capabilities enabled.
To create an LRS and publish a feature service with the Linear Referencing and Version Management capabilities enabled, follow the steps in ArcGIS Pro documentation:

- Pipeline Referencing—Create an LRS and share an LRS as web layers
- Roads and Highways—Create an LRS and share an LRS as web layers
To use the Dynamic Segmentation widget with linear referencing services published with ArcGIS Enterprise, you must be signed in with an ArcGIS Enterprise account.
When you include this widget in an app, you can display results in a table or in a straight line diagram.
When you display results in a table, you can interact with the table in the following ways:

- Double-click a cell in the table to edit its value.
- Note:
- A line event's business fields are editable when Type = Line in the table. A point event's business fields are editable when Type = Point.
- Click Save to save changes. Edits affect individual event layers.
A straight line diagram is a graphical representation of event locations and their characteristics along routes. Like the table, the diagram is interactive and editable. Edits affect individual event layers.
When you display results in a straight line diagram, you can interact with the diagram in the following ways:

- Use the navigation buttons to change the scale and extent represented by the diagram.
- Click the name of a layer to hide it from the diagram. You can click a hidden layer to return it to the active list.
- Hover the pointer over an event to display a tooltip that lists event attributes.
- Click an event to highlight it on the map and see attributes and statistics in a pop-up window. Some attributes are editable.
- Hover the pointer over the measure bar to display a tooltip that lists exact measure values.
- Click a measure value to display a pop-up window that lists attributes of all events that exist at that measure.
- Click Map Interact to toggle synchronization between the Map Widget and Straight Line Diagram. When enabled, navigating within the Map will cause the SLD to update accordingly to the view of the route shown in the map and navigating within the SLD will cause the Map to update accordingly to the view of the route shown in the SLD.
Note:

- When the Map Interact is enabled, double clicking along the SLD’s scale bar will cause the map to zoom to the measure’s location.

#### Example of dynamic segmentation
Note:
The following is an example of dynamic segmentation for ArcGIS Roads and Highways.
https://pro.arcgis.com/en/pro-app/3.5/help/production/location-referencing-pipelines/apply-dynamic-segmentation.htm \hView a similar example for ArcGIS Pipeline Referencing
In the following diagram, two line event layers, Speed Limit and Functional Class, and a Point Event, P1, are associated with a single route, Route1. Each event layer has different values along the route measures indicated by the color changes.
A straight line diagram displays dynamically segmented event layers.
A straight line diagram displays dynamically segmented event layers.
The route is calibrated from left to right between measures 0 and 8. The three events are present on the route and have the input and output properties described in the subsections below.

##### Input
The following tables show the first event's measures and values:

##### Input (Speed Limit)

| Route ID | Event ID | From Measure | To Measure | From Date | To Date | Speed Limit |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | Event1 | 0 | 4 | 1/1/2000 | <Null> | 65 |
| Route1 | Event2 | 4 | 8 | 1/1/2000 | <Null> | 40 |

##### Input (Functional Class)

| Route ID | Event ID | From Measure | To Measure | From Date | To Date | Functional Class |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | Event1 | 0 | 6.7 | 1/1/2000 | <Null> | Interstate |
| Route1 | Event2 | 6.7 | 8 | 1/1/2000 | <Null> | US Highway |

##### Input (Point1)

| Route ID | Event ID | Measure | From Date | To Date | Code |
| --- | --- | --- | --- | --- | --- |
| Route1 | Event1 | 5 | 1/1/2000 | <Null> | P1 |

##### Output
The output feature class and accompanying attribute table are dynamically created using data from constituent linear events. The attribute table is editable, and the edits go through to the individual event layers.
Moving in the direction of calibration of the route (from left to right), the first segment in the events is caused by the Speed Limit, 65, which starts at measure 0 and ends at measure 4. The second segment is caused by the Speed Limit, 40, which starts at measure 4 and ends at measure 5 due to the presence of the Point Event, P1. The third segment is caused by the Point Event, P1, at measure 5. The fourth segment between measures 5 and 6.7 contains the Speed Limit, 40, and the Functional Class, Interstate. The final segment between measures 6.7 and 8 containing the Speed Limit, 40, and the Functional Class, US Highway.
The following table shows the dynamic segmentation output:

##### Output (Dynamic Segmentation)

| Route ID | Type | Section | From Measure | To Measure | From Date | To Date | Speed Limit | Functional Class | Code |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Route1 | Line | 1 | 0 | 4 | 1/1/2000 | <Null> | 65 | Interstate |  |
| Route1 | Line | 2 | 4 | 5 | 1/1/2000 | <Null> | 40 | Interstate |  |
| Route1 | Point | 3 | 5 | 5 | 1/1/2000 | <Null> | 40 | Interstate | P1 |
| Route1 | Line | 4 | 5 | 6.7 | 1/1/2000 | <Null> | 40 | Interstate |  |
| Route1 | Line | 5 | 6.7 | 8 | 1/1/2000 | <Null> | 40 | US Highway |  |

### Settings
The Dynamic Segmentation widget includes the following settings:

- Select Map—Select a Map widget.
- Load Layers—Load layers from the web maps in the connected Map widget. To load layers, the Map widget must be connected to a web map with LRS layers.
- Clear Layers—Remove all loaded layers from the widget.
- Default Settings—Configure the following default settings for when the widget first loads.
  - Default dynamic segmentation result—Choose a default method for displaying results, either a table or a straight line diagram. Users can switch between the two at run time.
  - Default attribute set type—Choose whether to show results using a line attribute set or both line and point attribute sets.
  - Line Attribute Set—Choose a default line attribute set.
  - Point Attribute Set—Choose a default point attribute set.
  - Merge coincident events – Turn on this setting to automatically merge edited events that are attribute-exact and overlap.
- Diagram default scale—Choose a default scale for the straight line diagram. The unit is the network's unit. This setting appears when you choose straight line diagram as the default method for displaying results.
  - Table Highlight Color—Choose a color for the rows in the results table.
  - Map Highlight Color—Choose a color for displaying routes on the connected map.
  - Diagram default scale—Choose a default scale for the straight line diagram. The unit is the network's unit. This setting appears when you choose straight line diagram as the default method for displaying results.
  - Show Sstatistics—Turn on this setting to show statistics for the selected event record in a pop-up window when the user selects the double-clicking an event in a straight line diagram. This setting appears when you choose straight line diagram as the default method for displaying results.

### Interaction options
You must use data actions in other widgets to launch the Dynamic Segmentation widget and populate associated values. The following widgets support the Dynamic Segmentation data action, which you can turn on in the Action tab of their settings.

- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/lrs-identify-widget.htm \hLRS Identify widget
- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/search-by-route-widget.htm \hSearch By Route widget
- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/table-widget.htm \hTable widget

### Run dynamic segmentation
Complete the following steps to run dynamic segmentation:

- Start Experience Builder. Sign in to an ArcGIS Enterprise portal.
- Add a Map widget. Connect it to a web map with LRS data published with the Linear Referencing capability enabled and, optionally, the Version Management capability enabled.
- Learn more about enabling these capabilities in ArcGIS Pro for Pipeline Referencing
- Learn more about enabling these capabilities in ArcGIS Pro for Roads and Highways
- Add a Dynamic Segmentation widget. Connect it to the Map widget, and load LRS layers from the Map widget.
- Publish the app.
- Launch the app. If prompted, sign in to your ArcGIS Enterprise portal.
- Select events to be dynamically segmented with either the LRS Identify widget, Search By Route widget, or Table widget.

#### Run dynamic segmentation with the LRS Identify widget
To use the Dynamic Segmentation data action at run time with the LRS Identify widget, complete the following steps:

- Identify a location on a route with the LRS Identify widget.
- Click the Actions button at the top of the LRS Identify widget panel.
- Click Dynamic Segmentation.
- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the Search By Route widget
To use the Dynamic Segmentation data action at run time with the Search By Route widget, complete the following steps:

- Search for a route using one of the following measure options:
  - No measure—All the events present between the start and end of the route are dynamically segmented.
  - Single measure—All the events located at the searched measure location are dynamically segmented.
  - Multiple measures—All the events located between the smallest and largest searched measure locations are dynamically segmented.
  - Range of measures—All the events located between From Measure and To Measurethe start measure and the end measure are dynamically segmented.
- Select a record from the search results.
- Click the Actions button at the top of the Search By Route widget panel.
- Click Dynamic Segmentation.
- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the Table widget
To use the Dynamic Segmentation data action at run time with the Table widget, complete the following steps:

- Select a single route record in the table.
- Click the Actions button at the top of the Table widget panel.
- Click Dynamic Segmentation.
- The dynamic segmentation table or straight line diagram populates with results.
