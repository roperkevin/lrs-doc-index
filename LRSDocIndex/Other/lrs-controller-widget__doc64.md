# LRS Controller Widget

|   |   |
| --- | --- |
| **Kind** | Other · Experience Builder |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#26748](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/26748) |
| **Source** | [26748_LRSControllerWidget.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/26748_LRSControllerWidget.docx>) |
| **Edited** | 2026-02-28 22:45 by Kyle Chin |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "LRS Controller Widget"
source_file: "26748_LRSControllerWidget.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro36_Ent12/26748_LRSControllerWidget.docx"
doc_id: 64
doc_kind: "Other"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: "Kyle Chin"
last_edited: "2026-02-28T22:45:16Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lrs controller", "branch version management", "date filtering", "versioned editing", "experience builder", "editing workflow"]
tools: ["LRS Controller"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#26748"]
related: [{"doc":61,"file":"branch-version-editing-widget__doc61.md","s":4.816},{"doc":905,"file":"lrs-identify-widget__doc905.md","s":3.825},{"doc":101,"file":"experience-builder-branch-versioning-widget__doc101.md","s":3.783},{"doc":118,"file":"dynamic-segmentation-widget__doc118.md","s":3.737},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":3.684}]
```
-->

## Summary

The LRS Controller widget enables filtering data by date, managing branch versions, and streamlining editing workflows within ArcGIS Experience Builder. It supports versioned editing functions such as creating, deleting, reconciling, and posting named versions, and organizes other widgets in a toolbar. The widget requires connection to a Map widget with an LRS-enabled web map and offers configurable display, action, date, and version settings.

## Related documents

<!-- related:begin -->
- [Branch Version Editing widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/branch-version-editing-widget__doc61.md>) — similar text 0.60 · 1 title word · 1 filename word · same kind/surface <!-- rel:61 -->
- [LRS Identify widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-identify-widget__doc905.md>) — similar text 0.41 · 1 title word · 1 filename word · same kind/surface <!-- rel:905 -->
- [Experience Builder Branch Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-branch-versioning-widget__doc101.md>) — similar text 0.38 · 1 title word · 1 filename word · same surface <!-- rel:101 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc118.md>) — similar text 0.33 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:118 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.34 · 1 title word · 1 filename word · same kind/surface <!-- rel:57 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [LRS Controller](https://www.google.com/search?q=%22LRS%20Controller%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## LRS Controller widget
The LRS Controller widget allows end users to filter data by date, manage branch versions, streamline editing workflows, and organize other widgets in a toolbar.
Note:
All Location Referencing widgets support express mode. When you create an app in express mode, all Location Referencing widgets are automatically configured based on the web map added to the Map widget. Any modifications made in the Map widget, such as changing the web map, will instantly be reflected in the Location Referencing widgets. Express mode allows you to efficiently set up Location Referencing widgets within ArcGIS Experience Builder, streamlining the deployment process for apps that contain Location Referencing widgets.
Learn more about express mode

### Examples
Use this widget to support app design requirements such as the following:

- You want to view LRS data for a specific date.
- You want to switch to a named version for versioned editing.
- You want to save, discard, undo, or redo edits.
- You want to reconcile and post edits.
- You want to organize widgets in a toolbar-like controller.

### Usage notes
This widget requires connection to a Map widget that must be connected to a web map data source with an LRS published with the Linear Referencing and Version Management capabilities enabled.
To create an LRS and publish a feature service with the Linear Referencing and Version Management capabilities enabled, follow the steps in the ArcGIS Pro documentation:

- Pipeline Referencing—Create an LRS and share an LRS as web layers
- Roads and Highways—Create an LRS and share an LRS as web layers

Warning:
To avoid conflicts and unexpected behavior, do not use this widget concurrently with the Timeline or Branch Version Management widgets.
When using the Date button to filter data by date, consider the following:

- You can filter data for today’s date or for a custom date.
- Only data that is active on the specified date will be visible on the map.
- The specified date will be applied to all widgets in the app.

The following branch version management functionalities are supported:

- Switch to a named version.
- Create a named version.
- Delete a named version.
- Reconcile and post a named version.
- Save or discard edits.
- Undo or redo edits.

When using this widget while editing branch versioned data, consider the following:

- The Save, Discard, Undo, Redo, and Reconcile and Post buttons are only available when using a named version.
- The Save, Discard, Undo, Redo, and Reconcile and Post buttons can be used in conjunction with other widgets in the app. For example, you can edit attributes in the Table widget, save the edits, and post the edits to the default version.

### Settings
The LRS Controller widget includes the following settings:

- Mode—Choose a method of loading data.
  - Select Layers—Select a Map widget and load all layers from the web. You can remove individual layers.
    - Load Layers—Load layers from the web maps in the connected Map widget. To load layers, the Map widget must be connected to a web map with LRS layers.
    - Clear Layers—Remove all loaded layers from the widget.
  - Interact with a Map widget—Connect the LRS Controller widget to a Map widget. Any web maps in the connected Map widget appear in a list. You can click the Select Layers button  to open the Select Layers panel, where you can check or uncheck layers from a list.
- Layout Settings—Configure settings related to how the widget will be displayed.
  - Display Type—Choose between Docked or Floating.
  - Scale—You can set the scale of the widget to Small, Medium, or Large.
  - Dock Side—If Display Type is set to Docked, you can choose to dock the widget to the left, right, top, or bottom of the app.
  - Overlay—If the LRS Controller widget is docked to the left or right, Tturn on this setting to overlay another widget’s content panel over the main panel.
  - Disable Expand/Collapse—Turn on this setting to remove the expand/collapse button on the widget.
  - Expanded by Default—Choose whether the widget’s toolbar is expanded at run time.
- Action Settings—Configure settings to include or remove specific buttons on the widget.
  - Show Date—Turn on this setting to display the Date button at run time.
  - Show Version—Turn on this setting to include the Version button at run time.
  - Show Reconcile/Post—Turn on this setting to include the Reconcile and Post button at run time.
  - Show Save/Discard—Turn on this setting to include the Save and Discard buttons at run time.
  - Show Undo/Redo—Turn on this setting to include the Undo and Redo buttons at run time. This setting is not available if the Show Save/Discard setting is turned off.
- Date Settings—Configure settings related to the date.
  - Default to current date—Turn on this setting to set the default date to today’s date at run time. If this setting is turned off, you can set the default date to a differentcustom date.
  - Default to custom date—This setting is available if the Default to current date setting is turned off. You can set the default date to a custom date at run time.
- Version Settings—Configure settings related to branch version management.
  - Default Version— Choose which version to load on start for the selected data source.
  - Create Version—Turn on this setting to allow end users to create a new named version.
  - Delete Version—Turn on this setting to allow end users to delete an existing named version.

### Perform an end-to-end editing workflow with the LRS Controller widget
To perform an end-to-end editing workflow with the LRS Controller widget, complete the following steps:

- Start Experience Builder.
- Add the LRS Controller widget to the canvas.
- Add a Map widget to the canvas. Connect it to a web map with LRS data published with the Linear Referencing and Version Management capabilities enabled.
- Connect the LRS Controller widget to the Map widget.
- Add other widgets that have editing capabilities to the LRS Controller widget.
- Publish the app.
- Launch the app. If prompted, sign in to your ArcGIS Enterprise portal.
- Optionally, on the LRS Controller widget, click the Date button to filter data by date.
- Complete the following steps to create a new named version:
- On the LRS Controller widget, click Version > Create Version.
The Create Version dialog box appears.

- Provide a name for the new version in the Name text box.
- Optionally, provide a desriptiondescription for the version in the Description text box.
- Click Public, Protected, or Private to set the access level for the version.
- Public—Any user can access the version. Any user who has been granted read/write (update, insert, and delete) permissions on datasets can modify datasets in the version
- Protected—Any user can access the version, but only the owner or the geodatabase administrator can edit the version and the datasets in it.
- Private—Only the owner or the geodatabase administrator can access the version and modify it and the versioned data.
- Optionally, check the Switch to new version check box to switch to the version after it is created.
- Click Create.

Note:
Instead of creating a new named version, you can switch to an existing named version listed under the Version button’s content panel.

- Edit data using other widgets.

Note:
The Save, Discard, Undo, Redo, and Reconcile and Post buttons are available when editing data with a named version.

11. On the LRS Controller widget, click the Save button after verifying that the edits made are correct.
12. Click Reconcile and Post > Reconcile to reconcile your named version with the default version.
13. Click Reconcile and Post > Post to post your edits to the default version.

Need to discuss bullet point in user story PPT:
“Add a note to the other LRS widgets topics to alert them that the settings in this widget will apply to those widgets when it’s present in the application” - need an example of this

When changing time – inputting dates changes filters
Versioning

Save/discard/undo/redo apply to non-LRS widgets- does this include reconcile/post as well? PPT mentions “these settings can only be applied to LRS widgets in the app”

![image1.png](../media/doc887_image1.png)
