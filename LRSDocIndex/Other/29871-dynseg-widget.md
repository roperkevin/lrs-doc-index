# Dynamic Segmentation widget

| Field | Value |
| --- | --- |
| **Doc** | 57 · Other · Experience Builder |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29871](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/29871) |
| **Source** | [29871_DynSegWidget_OI.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/29871_DynSegWidget_OI.docx>) |
| **People** | author — · PE — · dev — |
| **Edited** | 2026-03-31 21:39 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | dynamic segmentation · event layers · straight line diagram · pipeline referencing · roads and highways · location referencing · oriented imagery |
| **Tools** | Dynamic Segmentation widget · Oriented Imagery Viewer widget · LRS Identify widget · Search By Route widget · Table widget |

## Summary

The Dynamic Segmentation widget summarizes multiple input event layers into a single segmented table or straight line diagram, allowing visualization and management of pipeline and roadway data. It supports integration with the Oriented Imagery Viewer widget and works with ArcGIS Pipeline Referencing and Roads and Highways data. The widget requires connection to a Map widget with LRS data published with Linear Referencing and Version Management capabilities enabled.

## Related documents

<!-- related:begin -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/24838-dynseg-widget.md>) — similar text 0.81 · 3 title words · 3 filename words · same kind/surface <!-- rel:118 s=9.537 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26160-dynseg-widget.md>) — similar text 0.88 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:60 s=8.983 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/26266-dynseg-widget.md>) — similar text 0.81 · 3 title words · same kind/surface <!-- rel:151 s=6.747 -->
- [LRS Identify widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-identify-widget.md>) — similar text 0.45 · 1 title word · 1 filename word · same kind/surface <!-- rel:905 s=4.467 -->
- [Dynamic Segmentation widget integration with Oriented Imagery](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynseg-widget-integration-with-oriented-imagery.md>) — similar text 0.34 · 3 title words · 1 filename word · same surface <!-- rel:76 s=4.458 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html)

_No page matched:_ [Dynamic Segmentation widget](https://www.google.com/search?q=%22Dynamic%20Segmentation%20widget%22+site%3Adoc.esri.com) · [Oriented Imagery Viewer widget](https://www.google.com/search?q=%22Oriented%20Imagery%20Viewer%20widget%22+site%3Adoc.esri.com) · [LRS Identify widget](https://www.google.com/search?q=%22LRS%20Identify%20widget%22+site%3Adoc.esri.com) · [Search By Route widget](https://www.google.com/search?q=%22Search%20By%20Route%20widget%22+site%3Adoc.esri.com) · [Table widget](https://www.google.com/search?q=%22Table%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Dynamic Segmentation widget
The Dynamic Segmentation widget takes multiple input event layers and summarizes them into a single segmented table. The tool creates new records, known as segments, at any measure along the event where any of the attributes from any of the input event layers change. You can view the results of a dynamic segmentation in either a table or a straight line diagram (SLD). An SLD graphs the input and output event layers. You can use this widget to manage and visualize pipeline data with ArcGIS Pipeline Referencing and roadways data with ArcGIS Roads and Highways.
Note:
All Location Referencing widgets support express mode. When you create an app in express mode, all Location Referencing widgets are automatically configured based on the web map added to the Map widget. Any modifications made in the Map widget, such as changing the web map, will instantly be reflected in the Location Referencing widgets. Express mode allows you to efficiently set up Location Referencing widgets within ArcGIS Experience Builder, streamlining the deployment process for apps that contain Location Referencing widgets.
https://doc.arcgis.com/en/experience-builder/12.0/build-apps/express-mode.htm \hLearn more about express mode

### Examples for Pipeline Referencing
Use this widget to support app design requirements such as the following:

- You want to analyze pipeline conditions and allocate funds for pipeline maintenance.
- You need users to perform a cross-event check to verify the accuracy of event data along a route.
- You want to check for gaps in your data and fill them.

### Examples for Roads and Highways
Use this widget to support app design requirements such as the following:

- You want to analyze road conditions using variables like traffic and jurisdiction to determine how to allocate maintenance funds.
- You need users to perform a cross-event check to verify the accuracy of Highway Performance Monitoring System (HPMS) data along a route.
- You want to check for gaps in your data and fill them.

### Usage notes
This widget requires connection to a Map widget. To dynamically segment events, the Map widget must be connected to a web map data source with an LRS published with the Linear Referencing and Version Management capabilities enabled.
To create an LRS and publish a feature service with the Linear Referencing and Version Management capabilities enabled, follow the steps in ArcGIS Pro documentation:

- Pipeline Referencing—Create an LRS and share an LRS as web layers
- Roads and Highways—Create an LRS and share an LRS as web layers
To use the Dynamic Segmentation widget with feature services published with ArcGIS Enterprise, you must sign in with an ArcGIS Enterprise account.
When you include this widget in an app, you can display results in a table or in a straight line diagram.
When you display results in a table, you can interact with the table in the following ways:

- Double-click a cell in the table to edit its value.
- Note:
- A line event's user-managed fields are editable when Type = Line in the table. A point event's user-managed fields are editable when Type = Point.
- Click Save to save changes. Edits affect individual event layers.
A straight line diagram is a graphical representation of event locations and their characteristics along routes. Like the table, the diagram is interactive and the attributes are editable. Edits affect individual event layers.
When you display results in a straight line diagram, you can interact with the diagram in the following ways:

- Use the navigation buttons to change the scale and extent represented by the diagram.
- Click the name of a layer to hide it from the diagram. You can click a hidden layer to return it to the active list.
- Hover the pointer over an event to display a tooltip that lists event attributes.
- Click an event to highlight it on the map and see attributes and statistics in a pop-up window. Some attributes are editable.
- Hover the pointer over the measure bar to display a tooltip that lists exact measure values.
- Click a measure value to display a pop-up window that lists attributes of all events that exist at that measure.
- Click the Map Interact button to turn off or turn on synchronization between the Map widget and the straight line diagram. When enabled, navigating within the map will update the SLD, and vice versa.
- Note:
- When Map Interact is enabled, double-clicking along the SLD’s scale bar will cause the map to zoom to the measure’s location.
If you experience poor performance or failures when using this widget, increase the heap size at the service level.

#### Integration with the Oriented Imagery Viewer widget
You can integrate the Dynamic Segmentation widget with the https://doc.arcgis.com/en/experience-builder/12.0/configure-widgets/oriented-imagery-viewer-widget.htm Oriented Imagery Viewer widget to get a comprehensive understanding of the routes and events at a particular location. The following are the requirements for this integration:

- The Oriented Imagery Viewer widget must be present in the app.
- The Map widget must be connected to a web map that contains an LRS and at least one oriented imagery layer.
- The straight line diagram supports only one oriented imagery layer at a time.
When you perform the integration, you can interact with the straight line diagram in the following ways:

- Click on a location in the oriented imagery layer of the SLD, and a red cross appears in the SLD, on the map, and on the Oriented Imagery Viewer widget panel. In the SLD, the circle marker for the current image is highlighted in red.
- Alternatively, you can cClick on a particular location alongon the selected route oin the map, and the SLD highlights the location is marked with a red cross in the SLD. Tand the appropriate image is updated in the viewerOriented Imagery Viewer widget panel is updated with the corresponding image.
- When you click on another location, the red cross’s position is synchronized across the SLD, the map, and the Oriented Imagery Viewer widget panel.
- In the SLD, the horizontal bar underneath the circle markers represents the coverage footprint for the images. If the horizontal bar is not displayed, it means there are no images available for that location.
- Double-click a location in the SLD to zoom in on both the SLD and the map.

#### Example of dynamic segmentation
Note:
The following is an example of dynamic segmentation for ArcGIS Roads and Highways.
https://pro.arcgis.com/en/pro-app/3.6/help/production/location-referencing-pipelines/apply-dynamic-segmentation.htm \hView a similar example for ArcGIS Pipeline Referencing
In the following diagram, two line event layers, Speed Limit and Functional Class, and a point event layer are associated with a single route. Each event layer has different values along the route measures indicated by the color changes.
A straight line diagram displays dynamically segmented event layers.
The route is calibrated from left to right between measures 0 and 8. The three events are present on the route and have the input and output properties described in the subsections below.

##### Input
The following tables show the events' attributes:

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

##### Input (Point Event)

| Route ID | Event ID | Measure | From Date | To Date | Code |
| --- | --- | --- | --- | --- | --- |
| Route1 | Event1 | 5 | 1/1/2000 | <Null> | P1 |

##### Output
The output feature class and accompanying attribute table are dynamically created using data from constituent line events. The attribute table is editable, and the edits go through to the individual event layers.
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

- Mode—Choose a method of loading data.
  - Select Layers—Select a Map widget and load all layers from the web map.
    - Select a Map widget—Select a Map widget in the page that's connected to a web map.
    - Load layers—Load layers from the web map in the connected Map widget. To load layers, the Map widget must be connected to a web map that contains LRS layers.
    - Clear layers—Remove all loaded layers from the widget.
    - Layers—After loading layers, you can click the down arrow to expand the list of layers. Click a layer to open the Layer Configuration panel.
    - Layer Configuration—Configure settings for individual layers.
      - LRS Network layers:
        - Route Identifier—Choose the default route identifier. For non-line networks, the default is route ID. For line networks, the default is route name.
      - LRS event layers:
        - Display field—Choose a display field for the event layer.
  - Interact with a Map widget—Connect the Dynamic Segmentation widget to a Map widget. Any web maps in the connected Map widget appear in the list. After connecting to a Map widget, you can click the down arrow next to the Select Layers button  to expand the list of layers. Click a layer to open the Layer Configuration panel.
    - Layer Configuration—Configure settings for individual layers. Review the settings available in the Layer Configuration panel.
    - Select Layers—Click the Select Layers button  to open the Select Layers panel. You can select or unselect layers from the list in the panel.
- Default settings—Configure the following default settings for when the widget first loads.
  - Default dynamic segmentation result—Choose a default method for displaying results, either a table or a straight line diagram. You can switch between the two at run time.
  - Default Network—If you add more than one network layer, you can set a default network layer.
  - Note:
  - When using the Route ID or Route Name text box to search for routes to be included in the dynamic segmentation, only route features within the Default Network parameter value can be queried. To query other LRS Networks, use data actions.
  - Default attribute set type—Choose whether to show results using a line attribute set or both line and point attribute sets.
  - Line attribute set—Choose a default line attribute set.
  - Point attribute set—Choose a default point attribute set.
  - Allow editing—Turn on this setting to allow users who have access to the data to edit data in the dynamic segmentation table and straight line diagram.
  - Merge coincident events—Turn on this setting to automatically merge edited events that have exactly the same attributes as an existing event and are adjacent to or overlapping with that existing event in terms of measure values.
  - Table highlight color—Choose a color for the rows in the results table.
  - Map highlight color—Choose a color for displaying routes on the connected map.
  - Diagram default scale—Choose a default scale for the straight line diagram. The unit is the network's unit.
  - Show statistics—Turn on this setting to show statistics in a pop-up window when double-clicking an event in a straight line diagram.
- Oriented Imagery Settings—These settings appear if at least one Oriented Imagery Viewer widget is present in the app. Configure settings related to the integration with the Oriented Imagery Viewer widget
  - Oriented Imagery Widget—Choose an Oriented Imagery Viewer widget to integrate with the Dynamic Segmentation widget. The default option is None.
  - Search Tolerance—Specify the maximum allowable distance an image in an oriented imagery layer can deviate from a route and still be included in the straight line diagram. The default value is 50 feet.

### Interaction options
The following widgets support the Dynamic Segmentation data action, which you can turn on in the Action tab of their settings.

- https://doc.arcgis.com/en/experience-builder/12.0/configure-widgets/lrs-identify-widget.htm \hLRS Identify widget
- https://doc.arcgis.com/en/experience-builder/12.0/configure-widgets/search-by-route-widget.htm \hSearch By Route widget
- https://doc.arcgis.com/en/experience-builder/12.0/configure-widgets/table-widget.htm \hTable widget

### Run dynamic segmentation

### Complete the following steps to run dynamic segmentation:

1. Start Experience Builder. Sign in to an ArcGIS Enterprise portal.

1. Add a Map widget. Connect it to a web map with LRS data published with the Linear Referencing and Version Management capabilities enabled.

- Learn more about enabling these capabilities in ArcGIS Pro for Pipeline Referencing
- Learn more about enabling these capabilities in ArcGIS Pro for Roads and Highways

1. Add a Dynamic Segmentation widget. Connect it to the Map widget, and load LRS layers from the Map widget.

1. Publish the app.

1. Launch the app. If prompted, sign in to your ArcGIS Enterprise portal.

1. Open the Dynamic Segmentation widget.

1. Provide a route ID or name in the Route ID or Route Name text box.

- If the network layer has a route name configured as an identifier, this setting is labeled Route Name.
- Note:
- You can also select events to be dynamically segmented with the LRS Identify widget, the Search By Route widget, or the Table widget. For more information, refer to the sections below.

1. Select a record from the search results.

- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the LRS Identify widget
To use the Dynamic Segmentation data action at run time with the LRS Identify widget, complete the following steps:

1. Identify a location on a route with the LRS Identify widget.

1. Click the Actions button at the top of the LRS Identify widget panel.

1. Click Dynamic Segmentation.

- The dynamic segmentation table or straight line diagram populates with results.

#### Run dynamic segmentation with the Search By Route widget
To use the Dynamic Segmentation data action at run time with the Search By Route widget, complete the following steps:

1. Search for a route using one of the following measure options:

  - No measure—All the events present between the start and end of the route are dynamically segmented.
  - Single measure—All the events located at the searched measure location are dynamically segmented.
  - Multiple measures—All the events located between the smallest and largest searched measure locations are dynamically segmented.
  - Range of measures—All the events located between the start measure and the end measure are dynamically segmented.

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

![Figure 1 — Run dynamic segmentation with the Table widget](../media/29871-dynseg-widget/fig-01-run-dynamic-segmentation-with-the-table.png)
