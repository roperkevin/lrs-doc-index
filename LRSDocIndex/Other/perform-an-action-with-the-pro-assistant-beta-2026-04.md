# Perform an action with the ArcGIS Pro Assistant (Beta)

| Field | Value |
| --- | --- |
| **Doc** | 55 · Other · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [AI_assistant_LRS_route_editing_Ayan.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7069_7064_7081_7067_RouteEditing_AI_Assistant/AI_assistant_LRS_route_editing_Ayan.docx>) |
| **People** | author Kyle Chin · PE — · dev — |
| **Edited** | 2026-04-08 22:35 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | arcgis pro assistant · lrs route editing · route creation · route reversal · route realignment · feature service · location referencing license |
| **Tools** | ArcGIS Pro Assistant |

## Summary

Describes the capabilities and usage of the ArcGIS Pro Assistant (Beta) for performing various actions within an ArcGIS Pro session, including LRS route editing. Covers categories of actions available, sample prompts for LRS route editing operations, and synonyms for terms used in LRS editing.

## Related documents

<!-- related:begin -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-03.md>) — similar text 0.96 · 5 title words · 3 filename words · same kind/surface/folder <!-- rel:62 s=11.319 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/perform-an-action-with-the-pro-assistant-beta-rh-apr.md>) — similar text 0.91 · 5 title words · 3 filename words · same kind/surface <!-- rel:907 s=9.641 -->
- [ArcGIS Pro Assistant (Beta) Documentation](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/pro-assistant-beta-documentation.md>) — similar text 0.65 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:82 s=6.088 -->
- [Pro AI Assistant Reverse Route User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/pro-ai-assistant-reverse-route.md>) — similar text 0.14 · 2 title words · 2 filename words · same surface <!-- rel:109 s=3.755 -->
- [Reverse routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/reverse-routes.md>) — similar text 0.16 · 1 filename word · same kind/surface/folder <!-- rel:72 s=3.656 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event behavior for route reversal](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-behavior-for-route-reversal.html) · [Realign routes](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/realign-routes.html) · [Edit feature services](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/edit-feature-services.html)

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
| Search | Find items in the project including maps, layouts, feature classes, layer files, layer packages,tables, datasets, models, scripts, folders, databases, and toolboxes by using the name, partial name, type, or metadata elements. |
| Data<br>management | Manage data, including modifying data in databases and geodatabase workspaces. |
| Contents | Manage items in the Contents pane of the current map, including reordering, grouping, ungrouping, removing, and deleting layers or tables. |
| Basemaps | Set or remove the basemap for a map or scene. |
| Maps | List, open, close, and create maps and scenes in a project. Make a map or scene the active view in a project, change the viewing mode of a map or scene, and update map and scene properties including the name and reference scale. |
| Add data | Add data, layers, and standalone tables to the map. |
| Navigation | Get or set the camera's position and height in a scene, get the map scale, zoom and pan to layers and navigates to coordinates. Zoom to, pan to, or flash selections. Zoom and pan to bookmarks, create, rename, and update bookmarks. Enable and disable view linking. |
| Selection | Select and unselect features and records in layers and tables in the active map, and report selection count. Identify layers by selection state. |
| Geoprocessing | Open and run geoprocessing tools. |
| Layers | Manage layers in the active map, including finding and renaming layers, and querying and changing layer properties, including visibility, transparency, definition queries, symbol scaling, scale ranges, time extent, selectability, editability, and more. Open the Fields view and gets field descriptions. Expand and collapse group and non-group layers. |
| Data<br>validation | Enhance data quality and integrity for accurate spatial analysis and visualization by automating data validation workflows, identifying attribute and geometry errors, and validating spatial relationships. |
| Data filtering | Filter data using SQL definition queries on a layer, including creating, updating, setting, changing, retrieving, and removing active definition queries. |
| Feature<br>visualization | Update the appearance of a feature layer by setting layer symbology (simple, single symbol, graduated color, graduated symbol, unique value, proportional, dot density, heat map) and adjusting symbology and visual variable properties. |
| Raster<br>visualization | Set, update, or create renderers for raster or imagery layers. Create and update colorizer types rgb, stretch, colormap, classify, unique value, vector field, discrete color, shaded relief. Update the properties of existing colorizers including raster band, classes, classification method, normalization, fields, color ramps, and color schemes. |
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

The following are the requirements to perform LRS route editing with the ArcGIS Pro Assistant (Beta):

- The Location Referencing license must be authorized.
- Only data from a feature service (published from branch versioned data) is supported.

The following table shows sample prompts and results for each LRS route editing type:

| LRS route editing operation | Sample prompt | Result |
| --- | --- | --- |
| Route creation | Create a route. | If only one LRS Network is found on the map, you are asked to provide a route ID or route name.<br>If multiple LRS Networks are found on the map, you are asked to specify an LRS Network. |
| Route creation | Create a route R1 in the all roads network using centerlines with object ID 102 and 103. The start measure is 0 and the end measure 0.8. The effective date is 1/1/2010. | The Create Route pane is populated. |
| Route reversal | Reverse a route. | You are asked to provide a route ID or route name. |
| Route reversal | Reverse route R1 from 1/1/2010 in the county log network. | The Reverse Route pane is populated. |
| Route realignment | Realign route R1 in the county log network. | If the centerlines are selected on the map, the Realign Route pane is populated. |
| Route realignment | Realign route R1. The source from measure is 0 and the source to measure is 0.882. Use centerlines 102, 103, and 104. The network is LineNetwork, and the effective date is 01/10/2000 in LineA. Recalibrate downstream and reassign to abandoned routes. | The Realign Route pane is populated. |

The following table includes synonyms that you can use when performing LRS route editing with the ArcGIS Pro Assistant (Beta):

| LRS ter ms | Synonyms | When to use |
| --- | --- | --- |
| R oute | R oadway, road, highway, datum | A ny LRS route editing operation |
| Measure | Tie-in, connection point, station, stationing | Any LRS route editing operation |
| C reat e | B uild, form, produce, make, add , construct | Route creation |
| R everse | F lip, change direction , invert | Route reversal |
| Realign | R eroute, reposition, reshape, reconstruct, reorient | Route realignment |

Keep the following in mind when performing actions with the assistant:

- As the conversation with the assistant continues, previous context is considered. This means that you can refine or supplement a request for action without explaining it again. For example, if your initial request was apply graduated color to counties using a field with population info, your follow-up request could be change the number of classes to 10. You don't need to specify the field again in this example.
- When you know the tool or action you want, precise terminology achieves better results. For example, type open the buffer tool.
