# ArcGIS Pro Assistant (Beta) Documentation

| Field | Value |
| --- | --- |
| **Doc** | 82 · Other · Pro |
| **Product** | — |
| **Release** | 3.6 |
| **Issues** | — |
| **Source** | [ai_assistant_beta_doc_pro36.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/7069_7064_7081_7067_RouteEditing_AI_Assistant/ai_assistant_beta_doc_pro36.pdf>) |
| **People** | author — · PE — · dev — |
| **Edited** | — |
| **Extracted** | 2026-09-04 · lane plaintext · format 3.0 · prompt v2.0.2 |
| **Keywords** | arcgis pro assistant · arcgis pro · arcpy code · graph query · query layer · arcgis pro actions · python code generation |
| **Tools** | ArcGIS Pro Assistant |

## Summary

Documentation for the ArcGIS Pro Assistant (Beta) describing its five functional modes: ArcGIS Pro Help, ArcGIS Pro Actions, ArcPy Code, Graph Query, and Query Layer. It explains how to access and use the assistant, perform actions, generate Python code, create graph queries, and create query layers within ArcGIS Pro 3.6.

## Related documents

<!-- related:begin -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-04.md>) — similar text 0.65 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:55 s=6.088 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/perform-an-action-with-the-pro-assistant-beta-2026-03.md>) — similar text 0.63 · 3 title words · 1 filename word · same kind/surface/folder <!-- rel:62 s=6.013 -->
- [Perform an action with the ArcGIS Pro Assistant (Beta)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/perform-an-action-with-the-pro-assistant-beta-rh-apr.md>) — similar text 0.59 · 3 title words · 1 filename word · same kind/surface <!-- rel:907 s=5.232 -->
- [Reverse routes](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/reverse-routes.md>) — similar text 0.10 · same kind/surface/folder <!-- rel:72 s=2.568 -->
- [Pro 3.4 and 11.4 User Acceptance Issues and Documentation Updates](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Schedules/504-pro-3-4-and-11-4-user-acceptance-issues-and-documentation.md>) — similar text 0.06 · 2 title words · 1 filename word · same surface <!-- rel:194 s=2.462 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [ArcGIS Pro Assistant](https://www.google.com/search?q=%22ArcGIS%20Pro%20Assistant%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

ArcGIS Pro Assistant (Beta)
     documentation

                    Copyright © 1995-2025 Esri. All rights reserved.
ArcGIS Pro Assistant (Beta) documentation

Table of Contents
ArcGIS Pro Assistant (Beta) Documentation          . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   3
Use the ArcGIS Pro Assistant (Beta) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .          4
Ask the ArcGIS Pro Assistant (Beta) for help       . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   7
Perform an action with the ArcGIS Pro Assistant (Beta) . . . . . . . . . . . . . . . . . . . . . . . . .       9
Generate Python and ArcPy code (Beta) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
Create a graph query with the ArcGIS Pro Assistant (Beta)      . . . . . . . . . . . . . . . . . . . . . . . 13
Create a query layer with the ArcGIS Pro Assistant (Beta) . . . . . . . . . . . . . . . . . . . . . . . . 14

Copyright © 1995-2025 Esri. All rights reserved.                                                               2
ArcGIS Pro Assistant (Beta) documentation

ArcGIS Pro Assistant (Beta) Documentation
This document includes the Help content for the ArcGIS Pro Assistant (Beta) release. There are five functional modes to test in this release: ArcGIS Pro Help, ArcGIS Pro Actions, ArcPy Code, Graph Query, and Query Layer.

Copyright © 1995-2025 Esri. All rights reserved.                                                                   3
ArcGIS Pro Assistant (Beta) documentation

Use the ArcGIS Pro Assistant (Beta)
The ArcGIS Pro Assistant can enhance productivity by helping you complete GIS tasks efficiently. It is embedded in
ArcGIS Pro and uses artificial intelligence to answer your questions, perform actions, generate queries, and generate
Python code for ArcPy.
The ArcGIS Pro Assistant (Beta) includes the following modes:
• ArcGIS Pro Help—The assistant answers ArcGIS Pro help documentation questions in a conversational manner.
• ArcGIS Pro Actions—If corresponding AI-assisted actions are available, the assistant performs the actions upon request.
• ArcPy Code—The assistant generates Python code snippets that use the ArcPy Python site package.
• Graph Query—The assistant generates openCypher queries for a given knowledge graph schema. These queries can then be used in knowledge graph workflows.
• Query Layer—The assistant creates query layers by generating SQL queries for a specified database connection and table schemas.

Access and use the ArcGIS Pro Assistant
To access and use the assistant, complete the following steps:
1. Ensure that ArcGIS Pro 3.6 is installed, including the following application features listed in the AI Models section on the ArcGIS Pro Setup installation dialog box: Semantic Search and Tool Suggestions.
   If ArcGIS Pro 3.6 is already installed, you can modify the set up to add these application features if necessary.
2. Install the ArcGIS Pro Assistant 3.6 (Beta) by downloading and running the setup provided on the ArcGIS Pro
   Assistant Early Adopter site.
3. Once installation is complete, start ArcGIS Pro and sign in to an ArcGIS organization that allows the use of beta features and allows the use of the Assistant.
4. In an open ArcGIS Pro project, click the Help tab on the ribbon, and in the Assistant group, click Assistant (Beta) to open the Assistant (Beta) pane.
5. Click OK to dismiss the Notice, if necessary.
6. Choose from the following modes to work with the assistant:

                                 Type a question in the window at the bottom of the pane to begin a help conversation.
       Help
                                 Learn how to explore the documentation with the assistant

       ArcGIS Pro                Click the ArcGIS Pro Actions card to perform an action using the assistant.
       Actions                   Learn how to perform actions with the assistant
                                 Click the ArcPy Code card to type prompts to create Python code snippets that use the
       ArcPy Code
                                 ArcPy Python site package.
                                 Click the Graph Query card to select a knowledge graph and ask natural language
       Graph Query               questions about it.
                                 Learn how to create graph queries with the assistant

Copyright © 1995-2025 Esri. All rights reserved.                                                                         4
ArcGIS Pro Assistant (Beta) documentation

                                 Click the Query Layer card to select database tables and ask natural language questions
       Query Layer               about them.
                                 Learn how to create a query layer with the assistant

7. Continue your conversation by typing follow-up questions to the responses you receive.

Conversations
The questions you type are collected together in conversations. The assistant assumes that all questions in a conversation are related to each other, all in reference to a single workflow, for example. The assistant uses this context to provide relevant responses within a conversation. To shift to a new context or workflow, click     to begin a new conversation.

      Tip:
• To copy a question to the clipboard, hover over the question in the scrollable area of the pane and click Copy
  Question .
• To copy a response to the clipboard, hover over the response and click Copy Response              .

The drop-down menu at the top of the Assistant (Beta) pane shows the current conversation. Type a new prompt in the box at the bottom of the pane to continue working in the current conversation. If additional conversations are present, select them from the menu to read the history of the conversation and begin working within its context. The title of the conversation is the text of the first question in the conversation. From this drop-down menu, you can change the title of a conversation and delete any conversations you no longer need. There is no limit to the number of stored conversations.

Each conversation is automatically saved and stored in your conversation history, persisted locally on your computer. They are stored as .json files in your user profile at \AppData\Local\ESRI\ArcGISPro\Assistant\
Sessions.Conversations are saved whether or not you save the current project, and they persist across your ArcGIS
Pro sessions and projects.

    Caution:
During the beta phase, your questions, prompts, enabled functions, along with the generated outputs and responses are collected to help improve product performance and reliability. Do not enter production, private, or sensitive data or information into the assistant.
Learn more about privacy at Esri.

Feedback
You can provide feedback for the responses you receive from the assistant. Hover over a response and click either the Good Response or Poor Response button. Add your comments, agree to the privacy statement, and click
Submit.

Copyright © 1995-2025 Esri. All rights reserved.                                                                           5
ArcGIS Pro Assistant (Beta) documentation

Your feedback improves the quality of responses and the overall experience of using the assistant.

Related topics
Ask the ArcGIS Pro Assistant (Beta) for help
Perform an action with the ArcGIS Pro Assistant (Beta)
Generate Python and ArcPy code (Beta)
Create a graph query with the ArcGIS Pro Assistant (Beta)
Create a query layer with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.                                                     6
ArcGIS Pro Assistant (Beta) documentation

Ask the ArcGIS Pro Assistant (Beta) for help
You can ask the ArcGIS Pro Assistant (Beta) questions about the features and capabilities of ArcGIS Pro 3.6. The assistant can provide information about this software version only. It cannot provide information from other resources such as Esri Community posts or Esri Technical Support content.
You can ask for definitions of terms, explanations of concepts, and guidance on accomplishing workflows or resolving problems. Prompts do not always need to be formed as questions. For example, you can use questions, phrases, or statements such as the following:
• What is a pour point?
• Spatial interpolation.
• How do I change the feature selection color?
• How can I make ArcGIS Pro run faster?
• I don't see a pop-up when I click a feature.
Questions should be phrased in natural, conversational language. Spelling and grammar do not need to be perfect.
Short questions are more effective than long ones, both in terms of response time and answer quality.
The assistant can’t answer questions that are outside the scope of its knowledge, that it does not understand, or that cross its ethical guidelines. If the assistant replies that it cannot help you, you can try rephrasing the question. If that doesn't work, you can provide feedback.

Start a conversation
When the Assistant (Beta) pane is open in ArcGIS Pro, you can ask the assistant a question.
To start a conversation with the assistant, complete the following steps:
1. In the Assistant (Beta) pane, click the menu button             , and click ArcGIS Pro Help   .
2. In the box at the bottom of the pane, type a question or prompt in natural conversational language and click
   Ask the question .
The answer appears in the pane with one or more links to relevant documentation. In some cases, the assistant may ask you to clarify the question. If follow up questions are returned, you can click on any of them to ask them within the current conversation.

            Tip:
To cancel a question, click Cancel            in the window. The question and the cancellation message remain in the conversation history.

3. Optionally, continue the conversation by asking another related question.
   Alternatively, click New conversation to change the subject.

         Note:
Subsequent questions are part of the same conversation until you start a new conversation. During a conversation, the assistant uses the context from previous questions to influence its answers to later questions.
Changing the subject within a conversation may lead to incorrect or confusing answers. It also makes it harder for you to keep track of your conversation history.

Copyright © 1995-2025 Esri. All rights reserved.                                                                            7
ArcGIS Pro Assistant (Beta) documentation

Related topics
Use the ArcGIS Pro Assistant (Beta)
Perform an action with the ArcGIS Pro Assistant (Beta)
Generate Python and ArcPy code (Beta)
Create a graph query with the ArcGIS Pro Assistant (Beta)
Create a query layer with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.            8
ArcGIS Pro Assistant (Beta) documentation

Perform an action with the ArcGIS Pro Assistant (Beta)
The ArcGIS Pro Assistant (Beta) can perform actions in an ArcGIS Pro session, such as styling a layer, zooming to content, or selecting features based on an attribute. The assistant is designed to increase productivity by enabling a more efficient way to use the tools necessary for your current task.
The actions available to the assistant are a limited subset of the capabilities of ArcGIS Pro. More actions will be supported in future releases. Some actions, such as zooming to a layer, are applied immediately. For requests that require running a geoprocessing tool, the assistant opens the tool with preset parameters from your current session. The assistant may ask for additional input or clarification.

      Tip:
The assistant can answer questions about its capabilities. Ask the assistant to outline the available actions that it can perform.

Categories of available actions you can use include, but are not limited to, the following:

 Categories of
Description actions
                            Find items in the project including maps, layouts, feature classes, layer files, layer packages,
Search                    tables, datasets, models, scripts, folders, databases, toolboxes by using the name, partial name, type, or metadata elements.
  Data
                            Manage data, including modifying data in database and geodatabase workspaces.
  management
                            Manage items in the Contents pane of the current map, including reordering, grouping,
Contents ungrouping, removing, and deleting layers or tables.
  Basemaps                  Set or remove the basemap for a map or scene.
                            List, open, close, and create maps and scenes in a project. Make a map or scene the active view
Maps                      in a project, change the viewing mode of a map or scene, and update map and scene properties including the name and reference scale.
  Add data                  Add data, layers, and standalone tables to the map.
                            Get or set the camera's position and height in a scene, get the map scale, zoom and pan to
Navigation                layers and navigates to coordinates. Zoom to, pan to, or flash selections. Zoom and pan to bookmarks, create, rename, and update bookmarks. Enable and disable view linking.
                            Select and unselect features and records in layers and tables in the active map, and report
Selection selection count. Identify layers by selection state.
  Geoprocessing             Open and run geoprocessing tools.
Manage layers in the active map, including finding and renaming layers, and querying and changing layer properties, including visibility, transparency, definition queries, symbol scaling,
Layers scale ranges, time extent, selectability, editability, and more. Open the Fields view and gets field descriptions. Expand and collapse group and non-group layers.
                            Enhance data quality and integrity for accurate spatial analysis and visualization by automating
Data data validation workflows, identifying attribute and geometry errors, and validating spatial validation relationships.
Categories of available actions

Copyright © 1995-2025 Esri. All rights reserved.                                                                                 9
ArcGIS Pro Assistant (Beta) documentation

 Categories of
Description actions
                            Filter data using SQL definition queries on a layer, including creating, updating, setting,
Data filtering changing, retrieving, and removing active definition queries.
                            Update the appearance of a feature layer by setting layer symbology (simple, single symbol,
Feature graduated color, graduated symbol, unique value, proportional, dot density, heat map) and visualization adjusting symbology and visual variable properties.
                            Set, update, or create renderers for raster or imagery layers. Create and update colorizer types
Raster                    rgb, stretch, colormap, classify, unique value, vector field, discrete color, shaded relief. Update visualization             the properties of existing colorizers including raster band, classes, classification method, normalization, fields, color ramps, and color schemes.
  Styles                    Find style items within project styles.
                            Use the World Geocoder to find addresses or points of interest, and convert between
Geocoding addresses, points of interest, and geographic coordinates.
                            Open, activate, refresh table panes, and switches the table pane mode. Set or toggle table
Tables properties and manages the state of fields, rows, columns.
Create layouts based on a paper size or template, rename or remove layouts, and list layout templates. Query and update layouts, including getting and setting the size of the page,
Layouts getting and setting the size and position of elements, finding elements by type, removing elements, printing and exporting a layout.
  Export                    Export a map from the project.
Knowledge                 Work with knowledge graphs or knowledge graph services by querying and selecting data in graph                     the investigation view of a knowledge graph service.
  Portal
                            Managing current portals.
  management

   Note:
You can build custom actions for the assistant using ArcGIS Pro SDK.

To perform an action using the assistant, complete the following steps:
1. In the Assistant (Beta) pane, click the ArcGIS Pro Actions card, or click the menu button                , and click ArcGIS
   Pro Actions .
2. In the box at the bottom of the pane, type a question or prompt in natural conversational language to ask the assistant to perform an action and click Ask the question .
For example, type zoom to the cities layer or zoom to cities, or, if you have a map layer of census data, type symbolize the census layer.

    The assistant responds by performing the action or if necessary, asks for clarification or more information.
3. Clarify your request or verify that the action was performed correctly.

Keep the following in mind when performing actions with the assistant:
• As the conversation with the assistant continues, previous context is considered. This means that you can refine or supplement a request for action without explaining it again. For example, if your initial request was apply

Copyright © 1995-2025 Esri. All rights reserved.                                                                                  10
ArcGIS Pro Assistant (Beta) documentation

graduated color to counties using a field with population info, your follow-up request could be change the number of classes to 10. You don't need to specify the field again in this example.

• When you know the tool or action you want, precise terminology achieves better results. For example, type open the buffer tool.

• In long-running conversations, if you start to see unexpected, incorrect, or unhelpful responses from the assistant, consider starting a new conversation.

Related topics
Ask the ArcGIS Pro Assistant (Beta) for help
Generate Python and ArcPy code (Beta)
Create a graph query with the ArcGIS Pro Assistant (Beta)
Create a query layer with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.                                                                    11
ArcGIS Pro Assistant (Beta) documentation

Generate Python and ArcPy code (Beta)
Use the ArcPy Code mode of the ArcGIS Pro Assistant (Beta) to generate Python code snippets that use the ArcPy
Python site package.
When you provide natural language prompts to describe the actions you want to perform, the Assistant returns a
Python code snippet that can be copied for use in an ArcGIS Notebooks, the Python window, a script editor, or other Python interface.

Generate ArcPy code
To generate code snippets from a natural language request, complete the following steps:
1. In the Assistant (Beta) pane, click the ArcPy Code card, or click the menu button          , and click ArcPy Code   .
2. Using natural language, type a prompt into the text box at the bottom of the Assistant pane to describe the actions you want to perform.
3. Press Enter on your keyboard, or click Ask the question            to submit the prompt.
    The prompt and the response provided by the Assistant are recorded in the Assistant pane.
4. Optionally, click the Copy Code button          to copy the Python code provided by the Assistant and paste it into a
   Python code interface.
The code snippets generated by the assistant typically must be updated to use specific dataset paths, variable names, parameter settings, and so on, before being run. Review the ArcPy function reference or ArcGIS Pro geoprocessing tool reference for more information.

   Note:
The ArcPy Assistant is not trained to generate code using the ArcGIS API for Python.

Known limitations (beta)
The code generated currently provides limited responses for the following ArcPy modules:
• arcpy.mp—For map and project automation

• arcpy.sharing—For sharing web maps, layers, and tools

These areas are under active development.

Related topics
Use the ArcGIS Pro Assistant (Beta)
Ask the ArcGIS Pro Assistant (Beta) for help
Python in ArcGIS Pro
Create a script tool
ArcGIS Pro Python reference
Use tools in Python
Perform an action with the ArcGIS Pro Assistant (Beta)
Create a graph query with the ArcGIS Pro Assistant (Beta)
Create a query layer with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.                                                                           12
ArcGIS Pro Assistant (Beta) documentation

Create a graph query with the ArcGIS Pro Assistant (Beta)
Use the ArcGIS Pro Assistant (Beta) to generate openCypher queries for a specified knowledge graph schema by asking questions in natural, conversational language. The resulting queries can be used in knowledge graph workflows.
To query a knowledge graph using the assistant, complete the following steps:
1. In the Assistant (Beta) pane, click the Graph Query card, or click the menu button   , and click Graph Query
   .
2. From the Data Connection drop-down menu, select the knowledge graph to query.
3. Type a question in the window in conversational language to get information about the knowledge graph in the form of a graph query.
4. Once a query is generated, expand the Explanation heading to see the reasoning used to generate the graph query.
5. Click the Add to current investigation button to add the query to the currently active investigation, where you can also run the query.
6. Continue your conversation by typing follow-up questions.

Related topics
Use the ArcGIS Pro Assistant (Beta)
Ask the ArcGIS Pro Assistant (Beta) for help
Perform an action with the ArcGIS Pro Assistant (Beta)
Generate Python and ArcPy code (Beta)
Create a query layer with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.                                                                  13
ArcGIS Pro Assistant (Beta) documentation

Create a query layer with the ArcGIS Pro Assistant (Beta)
You can create query layers by connecting to a database and using the ArcGIS Pro Assistant(Beta) to ask natural language questions about it. The assistant does not work with file geodatabases, because query layers are not supported on file geodatabases. The assistant generates SQL queries for a specified database connection and table schemas that can be added to a map as a query layer.
To create query layers using the assistant, complete the following steps:
1. In the Assistant (Beta) pane, click the Query Layer card, or click the menu button     , and click Query Layer   .
2. Select a database and one or more tables to set the data context for your conversation.
The Share feedback and schema for invalid queries check box is checked by default. If an invalid query is generated, the Query Layer Assistant Feedback dialog box opens. The query is recorded automatically—you don't need to paste it into the feedback box. Click Submit to submit the invalid query for review. Uncheck the check box if you don't want to share feedback.
3. Type a question in the window in conversational language to get information about the selected tables.
   When a valid query is generated, the SQL statement displays, and options to add the query as a layer appear.
4. Add a query layer by doing one of the following:
   • Click Add to Current Map to add the query as a layer in the current map.
     • Click Add to New Map                   to add the query as a layer in a new map.
5. Optionally, expand the Explanation section to understand how the SQL query was generated.

            Tip:
Click the Edit Query button to open the Edit Query Layer dialog box. This allows you to modify a query—for example, to change a field name or a value—without asking another question.

Related topics
Use the ArcGIS Pro Assistant (Beta)
Ask the ArcGIS Pro Assistant (Beta) for help
Perform an action with the ArcGIS Pro Assistant (Beta)
Generate Python and ArcPy code (Beta)
Create a graph query with the ArcGIS Pro Assistant (Beta)

Copyright © 1995-2025 Esri. All rights reserved.                                                                    14
