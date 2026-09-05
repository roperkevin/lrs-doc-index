# Branch Version Editing widget

|   |   |
| --- | --- |
| **Kind** | Other · Experience Builder |
| **Release** | — |
| **Issue** | [Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29868](https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/29868) |
| **Source** | [29868_BranchVersionEditingWidget.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/29868_BranchVersionEditingWidget.docx>) |
| **Edited** | 2026-03-13 18:29 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Branch Version Editing widget"
source_file: "29868_BranchVersionEditingWidget.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro37_Ent121/29868_BranchVersionEditingWidget.docx"
doc_id: 61
doc_kind: "Other"
surface: "Experience Builder"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2026-03-13T18:29:22.2624635Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["branch version", "versioned editing", "edit toolbar", "reconcile", "post edits", "edit session", "map widget"]
tools: ["Branch Version Editing widget"]
products: []
issues: ["Beijing-R-D-Center/ExperienceBuilder-Web-Extensions#29868"]
related: [{"doc":101,"file":"experience-builder-branch-versioning-widget__doc101.md","s":5.632},{"doc":64,"file":"lrs-controller-widget__doc64.md","s":4.816},{"doc":157,"file":"advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md","s":4.076},{"doc":57,"file":"dynamic-segmentation-widget__doc57.md","s":3.921},{"doc":60,"file":"dynamic-segmentation-widget__doc60.md","s":3.721}]
```
-->

## Summary

Describes the Branch Version Editing widget that enables users to edit branch versioned datasets, manage branch versions, and streamline editing workflows within an app. It supports versioned editing operations such as save, discard, undo, redo, reconcile, and post changes. The document details usage scenarios, required connections, functionalities, and configurable settings for the widget.

## Related documents

<!-- related:begin -->
- [Experience Builder Branch Versioning widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-branch-versioning-widget__doc101.md>) — similar text 0.38 · 2 title words · 3 filename words · same surface <!-- rel:101 -->
- [LRS Controller Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/lrs-controller-widget__doc64.md>) — similar text 0.60 · 1 title word · 1 filename word · same kind/surface <!-- rel:64 -->
- [Advanced Versioning Capabilities in LRS Configuration Widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/advanced-versioning-capabilities-in-lrs-configuration-widget__doc157.md>) — similar text 0.34 · 1 title word · 1 filename word · same surface <!-- rel:157 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc57.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:57 -->
- [Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/dynamic-segmentation-widget__doc60.md>) — similar text 0.22 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:60 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

_No page matched:_ [Branch Version Editing widget](https://www.google.com/search?q=%22Branch%20Version%20Editing%20widget%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Branch Version Editing widget
The Branch Version Editing widget allows end users to edit branch versioned datasets, manage branch versions, and streamline editing workflows in an app. This widget also supports versioned editing with options to save, discard, undo, and redo changes, as well as the ability to reconcile and post data after editing.

### Examples
Use this widget to support app design requirements such as the following:

- You want to allow end users to switch to a named version for versioned editing.
- You want to allow end users to save, discard, undo, or redo edits.
- You want to allow end users to reconcile and post edits.

### Usage notes
This widget requires connection to a Map widget that must be connected to a web map data source with the Version Management capability enabled.
The following functionalities are supported:

- Switch to a named version.
- Create a named version.
- Delete a named version.
- Modify an existing named version.
- Change the Owner of a version.
- Save or discard edits.
- Undo or redo edits.
- Reconcile a named version with the default version.
- Post changes to the default version after a reconcile operation.
When using this widget, consider the following:

- The edit toolbar, which by default consists of the Save, Discard, Undo, Redo, Reconcile, and Post buttons, is available only during an edit session when editing data in a named version. Edits made in the default version do not initiate an edit session.
- The edit toolbar can be used in conjunction with other widgets in the app. For example, you can edit attributes in the Table widget, save the edits, and post the edits to the default version.
- To perform a reconcile or post operation, the end user must be assigned a license for the ArcGIS Advanced Editing user type extension.
- The Post button is only enabled in the edit toolbar after performing a reconcile operation.

### Settings
The Branch Version Editing widget includes the following settings:

- Select a Map widget—Connect the Branch Version Editing widget to a Map widget. Any Map widgets added to the app appear in a list.
- Default Versions—Configure settings related to the version to load at run time, as well as the ability to manage versions and enable edit sessions.
Note:
The label above the drop-down menu is based on the name of the data source. Click the drop-down menu to specify the version to load at run time.
Caution:
The version you set to load at run time only loads if the widget is open when the app loads, or if the version is set using a URL parameter. If you add the Branch Version Editing widget to a Widget Controller, you must set the Branch Version Editing widget to open when the app loads in the Widget Controller's settings.

  - Manage Versions Enabled—Turn on this setting to make the Manage versions button (icon) available in the widget panel at run time.
  - Edit Sessions Enabled—Turn on this setting to enable edit sessions and to make the edit toolbar available in the widget panel at run time.
- Edit Toolbar Settings— These settings appear if the Edit Sessions Enabled setting is turned on. Configure settings to include or remove specific functionalities in the edit toolbar.
  - Save Enabled—Turn on this setting to make the Save button available in the edit toolbar. If this setting is turned off, any edits will be immediately saved.
  - Discard Enabled—Turn on this setting to make the Discard button available in the edit toolbar.
  - Undo Enabled—Turn on this setting to make the Undo button available in the edit toolbar.
  - Redo Enabled—Turn on this setting to make the Redo button available in the edit toolbar.
  - Reconcile Enabled—Turn on this setting to make the Reconcile button available in the edit toolbar.
  - Post Enabled—Turn on this setting to make the Post button available in the edit toolbar.
  - Show dialog on save—Check this check box to display a warning dialog box before saving edits.
  - Show dialog on discard—Check this check box to display a warning dialog box before discarding edits.
- Edit Toolbar Display— These settings appear if the Edit Sessions Enabled setting is turned on. Configure settings related to the display of the edit toolbar.
  - Scale—Change the scale of the edit toolbar.
  - Display Type—Choose between the Docked and Floating options for the edit toolbar.
  - Dock Position—This setting appears if you have a docked edit toolbar. The edit toolbar can be placed at the top, bottom, left, or right of the widget panel.
  - Layout Type—This setting appears if you have a floating edit toolbar. The edit toolbar can be horizontal or vertical.
  - Default Position—These settings appear if you have a floating edit toolbar. Define where the edit toolbar appears on the page by width, height, and location. You can specify height and width values in pixels (px) or percent (%). You can use the nine-panel grid to position the edit toolbar to one of the anchor points on the page. You can also set x and y offsets.
