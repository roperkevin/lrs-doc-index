# Perform an action with the ArcGIS Pro Assistant (Beta)

| Field | Value |
| --- | --- |
| **Doc** | 907 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI_assistant_LRS_route_editing - 38-122.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro38_Ent122/AI_assistant_LRS_route_editing%20-%2038-122.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2026-08-27 18:46 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lrs route editing · route creation · route reversal · route realignment · route retirement · arcgis pro assistant · feature service · complex processing mode |
| **Tools** | ArcGIS Pro Assistant |

## Summary

Describes the capabilities and usage of the ArcGIS Pro Assistant (Beta) for performing various actions within an ArcGIS Pro session, including LRS route editing operations such as route creation, reversal, realignment, and retirement. Provides sample prompts, results, and synonyms for LRS route editing commands.

## Related documents

<!-- related:begin -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-04.md>) — similar text 0.91 · 5 title words · 3 filename words · same kind/surface <!-- rel:55 s=9.742 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-03.md>) — similar text 0.93 · 5 title words · 3 filename words · same kind/surface <!-- rel:62 s=9.735 -->
- [ArcGIS Pro Assistant (Beta) Documentation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/pro-assistant-beta-documentation.md>) — similar text 0.58 · 3 title words · 1 filename word · same kind/surface <!-- rel:82 s=5.219 -->
- [ArcGIS Pro AI Assistant : Realign Route Subsequent panes – Test plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/pro-ai-assistant-realign-route-subsequent-panes.md>) — similar text 0.20 · 2 title words · 1 filename word · same surface <!-- rel:50 s=3.374 -->
- [Pro AI Assistant Realign Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/pro-ai-assistant-realign-route-user-story__doc102.md>) — similar text 0.17 · 2 title words · 2 filename words · same surface <!-- rel:102 s=3.156 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route reversal](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-behavior-for-route-reversal.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/realign-routes.html) · [Retire routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/retire-routes.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/edit-feature-services.html)

_No page matched:_ [ArcGIS Pro Assistant](https://www.google.com/search?q=%22ArcGIS%20Pro%20Assistant%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

Perform an action with the ArcGIS Pro Assistant (Beta)

The ArcGIS Pro Assistant (Beta) can perform actions in an ArcGIS Pro session, such as styling a layer, zooming to content, or selecting features based on an attribute. The assistant is designed to increase productivity by enabling a more efficient way to use the tools necessary for your current task.

The actions available to the assistant are a limited subset of the capabilities of ArcGIS Pro. More actions will be supported in future releases. Some actions, such as zooming to a layer, are applied immediately. For requests that require running a geoprocessing tool, the assistant opens the tool with preset parameters from your current session. The assistant may ask for additional input or clarification.

### Tip:
The assistant can answer questions about its capabilities. Ask the assistant to outline the available actions that it can perform.

Categories of available actions you can use include, but are not limited to, the following:

| Categories of<br>actions | Description |
| --- | --- |
| Search | Find items in the project including maps, layouts, feature classes, layer files, layer packages,tables , datasets, models, scripts, folders, databases , and toolboxes by using the name, partial name, type, or metadata elements. |
| Data<br>management | Manage data, including modifying data in databases and geodatabase workspaces. |
| Contents | Manage items in the Contents pane of the current map, including reordering, grouping, ungrouping, removing, and deleting layers or tables. |
| Basemaps | Set or remove the basemap for a map or scene. |
| Maps | List, open, close, and create maps and scenes in a project. Make a map or scene the active view in a project, change the viewing mode of a map or scene, and update map and scene properties including the name and reference scale. |
| Add data | Add data, layers, and standalone tables to the map. |
| Navigation | Get or set the camera's position and height in a scene, get the map scale, zoom and pan to layers and navigates to coordinates. Zoom to, pan to , or flash selections. Zoom and pan to bookmarks, create, rename, and update bookmarks. Enable and disable view linking. |
| Selection | Select and unselect features and records in layers and tables in the active map, and report selection count. Identify layers by selection state. |
| Geoprocessing | Open and run geoprocessing tools. |
| Layers | Manage layers in the active map, including finding and renaming layers, and querying and changing layer properties, including visibility, transparency, definition queries, symbol scaling, scale ranges, time extent, selectability , editability, and more. Open the Fields view and gets field descriptions. Expand and collapse group and non-group layers. |
| Data<br>validation | Enhance data quality and integrity for accurate spatial analysis and visualization by automating data validation workflows, identifying attribute and geometry errors, and validating spatial relationships. |
| Data filtering | Filter data using SQL definition queries on a layer, including creating, updating, setting, changing, retrieving, and removing active definition queries. |
| Feature<br>visualization | Update the appearance of a feature layer by setting layer symbology (simple, single symbol, graduated color, graduated symbol, unique value, proportional, dot density, heat map) and adjusting symbology and visual variable properties. |
| Raster<br>visualization | Set, update, or create renderers for raster or imagery layers. Create and update colorizer types rgb , stretch, colormap, classify, unique value, vector field, discrete color, shaded relief. Update the properties of existing colorizers including raster band, classes, classification method , normalization, fields, color ramps, and color schemes. |
| Styles | Find style items within project styles. |
| Geocoding | Use the World Geocoder to find addresses or points of interest, and convert between addresses, points of interest, and geographic coordinates. |
| Tables | Open, activate, refresh table panes, and switches the table pane mode. Set or toggle table properties and manages the state of fields, rows, columns. |
| Layouts | Create layouts based on a paper size or template, rename or remove layouts, and list layout templates. Query and update layouts, including getting and setting the size of the page, getting and setting the size and position of elements, finding elements by type, removing elements, printing and exporting a layout. |
| Export | Export a map from the project. |
| Knowledge<br>graph | Work with knowledge graphs or knowledge graph services by querying and selecting data in the investigation view of a knowledge graph service. |
| Portal<br>management | Managing current portals. |
| L inear Referencing System (LRS) route editing | Perform route editing in a n LRS that is published as a feature service . Supported operations include route creation, reversal , and realignment . |

### Note:
You can build custom actions for the assistant using ArcGIS Pro SDK.

To perform an action using the assistant, complete the following steps:
1. In the Assistant (Beta) pane, click the ArcGIS Pro Actions card, or click the menu button, and click ArcGIS Pro Actions.

2. In the box at the bottom of the pane, type a question or prompt in natural conversational language to ask the assistant to perform an action and click Ask the question.

For example, type zoom to the cities layer or zoom to cities, or, if you have a map layer of census data, type symbolize the census layer.

The assistant responds by performing the action or if necessary, asks for clarification or more information.

3. Clarify your request or verify that the action was performed correctly.

Perform LRS route editing with the ArcGIS Pro Assistant (Beta)
You can use the ArcGIS Pro Assistant (Beta) to perform LRS route editing.

Learn more about ArcGIS Pipeline Referencing
Learn more about ArcGIS Roads and Highways

The following requirements apply:
• The Location Referencing license must be authorized.
  Learn more about authorizing and managing extension licenses in ArcGIS Pro
• Only data from a feature service (published from branch versioned data) is supported.
• The processing mode must be set to Complex.

The following table shows sample prompts and results for each LRS route editing type:

| LRS route editing operation | Sample prompt | Result |
| --- | --- | --- |
| Route creation | Create a route. | If only one LRS Network is found on the map, you are asked to provide a route ID or route name.<br>If multiple LRS Networks are found on the map, you are asked to specify an LRS Network.<br>If the LRS Network is configured with a multifield route ID , you are asked to provide a field name and the attributes for each field that is part of the multifield route ID. |
| Route creation | Create a route R1 in the all roads network using centerlines with object ID 102 and 103. The start measure is 0 and the end measure 0.8 . The effective date is 1/1/2010. | The Create Route pane is populated. |
| Route reversal | Reverse a route . | You are asked to provide a route ID or route name. |
| Route reversal | Reverse route R1 from 1/1/2010 in the county log network. | The Reverse Route pane is populated. |
| Route realignment | Realign route R1 in the county log network. | If the centerlines are selected on the map and touch the route , the Realign Route pane is populated. |
| Route realignment | Realign route R1. The source from measure is 0 and the source to measure is 0.882. Use centerlines 102, 103, and 104. The network is LineNetwork , and the effective date is 01/10/2000 in LineA . Recalibrate downstream and reassign to abandoned routes. | The Realign Route pane is populated. |
| Route realignment | Realign a route in the Engineering Network. The source<br>from measure is 949.46 and the source to measure is 3847.665. The target from measure is 949.46 and the target to measure is 9079.625. Use centerline 2902 valid on 01/ 01/2010. Use 'L7_Abandon'as the abandoned line name and<br>use 'R34_Abandon' for the abandoned route name. Do not recalibrate downstream, and use 'NewRouteR1000' as the<br>name for the new realigned route. | You are presented with the populated first page of the Realign Route pane.<br>After you click Run , the subsequent pages of the Realign Route pane are also populated. |
| Route reassignment |  |  |
| Route reassignment |  |  |
| Route extension |  |  |
| Route extension |  |  |
| Route retirement | Retire a route . | If only one LRS Network is found on the map, you are asked to provide a route ID or route name.<br>If multiple LRS Networks are found on the map, you are asked to specify an LRS Network. |
| Route reitirement retirement | On 01/01/2010, retire route R1 from measures 0 to 2 in the county log network and recalibrate downstream. | The Retire Route pane is populated. |

Note:
If a message about locks appears in the Assistant (Beta) pane, it means that https://doctopia.esri.com/builds/pro/kyl10700-lrc-route-editing/en/help/data/linear-referencing/conflict-prevention.html conflict prevention (link to doc) is enabled.

The following table includes synonyms that you can use when performing LRS route editing with the ArcGIS Pro Assistant (Beta):

| LRS ter ms | Synonyms | When to use |
| --- | --- | --- |
| R oute | R oadway, road, highway, datum | A ny LRS route editing operation |
| Measure | Tie-in, connection point, station, stationing | Any LRS route editing operation |
| C reat e | B uild, form , produce , make, add | Route creation |
| R everse | F lip, change direction , change orientation, flip calibration direction, invert , swap | Route reversal |
| R ealign | R eroute, reposition, reshape, reconstruct, reorient | Route realignment |
| Reassign |  | Route reassignment |
| Extend |  | Route extension |
| Retire | Discontinue, Decommission, D eactivate, take out of service, retirement | Route retirement |
