# Dynamic Segmentation widget

| Field | Value |
| --- | --- |
| **Doc** | 118 · Other · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#24838](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/24838) |
| **Source** | [24838_DynSegWidget.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/24838_DynSegWidget.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2025-09-22 19:56 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · event layers · segmented event · pipeline referencing · roads and highways · straight line diagram · route attributes |
| **Tools** | Dynamic Segmentation widget · LRS Identify widget · Search By Route widget · Table widget |

## Summary

The Dynamic Segmentation widget summarizes multiple input event layers into a single segmented event layer, creating segments where attributes change along routes. It supports pipeline and roadway data management and visualization, displaying results in tables or straight line diagrams with interactive editing capabilities. The widget requires connection to a Map widget with LRS-enabled web maps and supports integration with other Experience Builder widgets for dynamic segmentation actions.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/29871-dynseg-widget.md>) — similar text 0.81 · 3 title words · 3 filename words · same kind/surface <!-- rel:57 s=9.537 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26160-dynseg-widget.md>) — similar text 0.91 · 3 title words · 3 filename words · same kind/surface <!-- rel:60 s=8.566 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26266-dynseg-widget.md>) — similar text 0.92 · 3 title words · same kind/surface/folder <!-- rel:151 s=7.517 -->
- [Dynamic Segmentation – Straight Line Diagram Support - ExB](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/20594-dynseg-sld-support-exb.md>) — similar text 0.23 · 2 title words · 2 filename words · same surface <!-- rel:346 s=3.882 -->
- [Add Point Event widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24791-add-point-event-widget.md>) — similar text 0.45 · 1 title word · same kind/surface <!-- rel:139 s=3.826 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)

_No page matched:_ [Dynamic Segmentation widget](https://www.google.com/search?q=%22Dynamic%20Segmentation%20widget%22+site%3Adoc.esri.com) · [LRS Identify widget](https://www.google.com/search?q=%22LRS%20Identify%20widget%22+site%3Adoc.esri.com) · [Search By Route widget](https://www.google.com/search?q=%22Search%20By%20Route%20widget%22+site%3Adoc.esri.com) · [Table widget](https://www.google.com/search?q=%22Table%20widget%22+site%3Adoc.esri.com)
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

#### Example of dynamic segmentation
Note:
The following is an example of dynamic segmentation for ArcGIS Roads and Highways.
https://pro.arcgis.com/en/pro-app/3.5/help/production/location-referencing-pipelines/apply-dynamic-segmentation.htm \hView a similar example for ArcGIS Pipeline Referencing
In the following diagram, two line event layers, Speed Limit and Functional Class, and a Point Event, P1, are associated with a single route, Route1. Each event layer has different values along the route measures indicated by the color changes.

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
- Mode—Choose a method of loading data.
  - Select Layers—Select a Map widget and load all layers from the web map.
    - Select a Map widget—Select a Map widget in the page that’s connected to a web map.
    - Load Layers—Load layers from the web map in the connected Map widget. To load layers, the Map widget must be connected to a web map with LRS layers.
    - Clear Layers—Remove all loaded layers from the widget.
    - Layers—After loading layers, you can click the down arrow to expand the list of layers. Click a layer to open the Layer Configuration panel.
    - Layer Configuration—Configure settings for individual layers.
      - Display field—Choose a display field for the event layer.
      - Route Identifier—Choose the default route identifier. For non-line networks, the default is route ID. For line networks, the default is route name.

-Interact with a Map widget—Connect the Dynamic Segmentation widget to a Map widget. Any web maps in the connected Map widget appear in the list. After connecting to a Map widget, you can click the down arrow next to the Select Layers button  to expand the list of layers. Click a layer to open the Layer Configuration panel.

  - Select Layers—Click the Select Layers button  to open the Select Layers panel. You can select or unselect layers from the list in the panel.
- Default Settings—Configure the following default settings for when the widget first loads.
  - Default dynamic segmentation result—Choose a default method for displaying results, either a table or a straight line diagram. You can switch between the two at run time.
  - Default Network—If you add more than one network layer, you can set a default network layer.
  - Default attribute set type—Choose whether to show results using a line attribute set or both line and point attribute sets.
  - Line aAttribute sSet—Choose a default line attribute set.
  - Point Attribute Set—Choose a default point attribute set.
  - Allow editing—Turn on this setting to allow users who have access to the data to edit data in the dynamic segmentation table and straight line diagram.
  - Merge coincident events—Turn on this setting to merge edited events that have exactly the same attributes as an existing event and are adjacent to or overlapping with that existing event in terms of measure values.
  - Diagram default scale—Choose a default scale for the straight line diagram. The unit is the network's unit. This setting appears when you choose straight line diagram as the default method for displaying results.
  - Table Highlight Color—Choose a color for the rows in the results table.
  - Map Highlight Color—Choose a color for displaying routes on the connected map.
  - Diagram default scale—Choose a default scale for the straight line diagram. The unit is the network's unit. This setting appears when you choose straight line diagram as the default method for displaying results.
  - Show statistics—Turn on this setting to show statistics in a pop-up window when double-clicking an event in a straight line diagram.

### Interaction options
You must use https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/action-triggers.htm#ESRI_SECTION1_441D594EF43743CEB307F0E9BB308AAF data actions in other widgets to launch the Dynamic Segmentation widget and populate associated values. The following widgets support the Dynamic Segmentation data action, which you can turn on in the Action tab of their settings.

- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/lrs-identify-widget.htm \hLRS Identify widget
- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/search-by-route-widget.htm \hSearch By Route widget
- https://doc.arcgis.com/en/experience-builder/11.5/configure-widgets/table-widget.htm \hTable widget

### Run dynamic segmentation

### Complete the following steps to run dynamic segmentation:

1. Start Experience Builder. Sign in to an ArcGIS Enterprise portal.

1. Add a Map widget. Connect it to a web map with LRS data published with the Linear Referencing capability enabled and, optionally, the Version Management capability enabled.

- Learn more about enabling these capabilities in ArcGIS Pro for Pipeline Referencing
- Learn more about enabling these capabilities in ArcGIS Pro for Roads and Highways

1. Add a Dynamic Segmentation widget. Connect it to the Map widget , and load LRS layers from the Map widget.

1. Publish the app.

1. Launch the app. If prompted, sign in to your ArcGIS Enterprise portal.

1. Open the Dynamic Segmentation widget.

1. Provide a route ID or name in the Route ID or Route Name text box.

1. If the network layer has a route name configured as an identifier, this setting is labeled Route Name.

1. Note:

1. You can also sSelect events to be dynamically segmented with either the LRS Identify widget, the Search By Route widget, or the Table widget. For more information, refer to the sections below.

1. Select a record from the search results.
The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the LRS Identify widget
To use the Dynamic Segmentation data action at run time with the LRS Identify widget, complete the following steps:

1. Identify a location on a route with the LRS Identify widget.

1. Click the Actions button at the top of the LRS Identify widget panel.

1. Click Dynamic Segmentation.

- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the Search By Route
To use the Dynamic Segmentation data action at run time with the Search By Route widget, complete the following steps:

1. Search for a route using one of the following measure options:

  - No measure—All the events present between the start and end of the route are dynamically segmented.
  - Single measure—All the events located at the searched measure location are dynamically segmented.
  - Multiple measures—All the events located between the smallest and largest searched measure locations are dynamically segmented.
  - Range of measures—All the events located between From Measure and To Measure are dynamically segmented.

1. Select a record from the search results.

1. Click the Actions button at the top of the Search By Route widget panel.

1. Click Dynamic Segmentation.

- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the Table widget
To use the Dynamic Segmentation data action at run time with the Table widget, complete the following steps:

1. Select a single route record in the table.

1. Click the Actions button at the top of the Table widget panel.

1. Click Dynamic Segmentation.

- The dynamic segmentation table or straight line diagram populates with results.

![Figure 1 — Run dynamic segmentation with the Table widget](../media/24838-dynseg-widget/fig-01-run-dynamic-segmentation-with-the-table.png)
