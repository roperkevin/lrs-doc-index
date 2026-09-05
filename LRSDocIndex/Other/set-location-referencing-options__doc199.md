# Set Location Referencing options

|   |   |
| --- | --- |
| **Kind** | Other · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Issue** | [ArcGISPro/ps-location-referencing#6463](https://devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/6463) |
| **Source** | [6463-SetLROptionsUpdate.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6463_Go%20to%20next%20measure%20upon%20run/6463-SetLROptionsUpdate.docx>) |
| **Edited** | 2025-03-10 21:20 by unknown |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Set Location Referencing options"
source_file: "6463-SetLROptionsUpdate.docx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/Pro35_Ent115/6463_Go%20to%20next%20measure%20upon%20run/6463-SetLROptionsUpdate.docx"
doc_id: 199
doc_kind: "Other"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: "2025-03-10T21:20:47.1527668Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["location referencing options", "route editing", "event editing", "conflict prevention", "dynamic segmentation", "attribute set", "replace events"]
tools: []
products: ["Roads & Highways", "Pipeline Referencing"]
issues: ["ArcGISPro/ps-location-referencing#6463"]
related: [{"doc":315,"file":"set-location-referencing-options__doc315.md","s":7.252},{"doc":307,"file":"set-location-referencing-options__doc307.md","s":6.709},{"doc":308,"file":"set-location-referencing-options__doc308.md","s":5.979},{"doc":341,"file":"reorganize-location-referencing-pro-options-test-plan__doc341.md","s":3.487},{"doc":340,"file":"reorganize-location-referencing-pro-options-test-plan__doc340.md","s":3.487}]
```
-->

## Summary

Instructions for configuring Location Referencing options in ArcGIS Pro, including settings for configuration, conflict prevention, route editing, event editing, and documentation preferences. Describes various check box options and folder location settings to customize behavior during route and event editing workflows.

## Related documents

<!-- related:begin -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-location-referencing-options__doc315.md>) — similar text 0.80 · 2 title words · 2 filename words · same kind/surface <!-- rel:315 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/set-location-referencing-options__doc307.md>) — similar text 0.77 · 2 title words · 2 filename words · same kind/surface <!-- rel:307 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Other/set-location-referencing-options__doc308.md>) — similar text 0.69 · 2 title words · 1 filename word · same kind/surface <!-- rel:308 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc341.md>) — similar text 0.35 · 1 title word · 1 filename word · same surface <!-- rel:341 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/reorganize-location-referencing-pro-options-test-plan__doc340.md>) — similar text 0.35 · 1 title word · 1 filename word · same surface <!-- rel:340 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

## Set Location Referencing options
To configure Location Referencing options in ArcGIS Pro, complete the following steps:

- Open the project where you want to set Location Referencing options.
- On the Location Referencing tab, in the Routes group or the Events group, click the Location Referencing Options launcher .
- The Options dialog box appears with the Location Referencing tab active.
- Tip:
- You can also access Location Referencing options by clicking Project > Options and clicking the Location Referencing tab on the Options dialog box.
- Configure any of the following options as often as needed:

| Option section | Option name | Description |
| --- | --- | --- |
| Configuration and Conflict Prevention | Set LRS Layers in maps to the current date and time when project is opened | Check this check box to set the current date and time for the current project and user if time is enabled for LRS data . When this check box is checked, the current date and time is set on maps in the project each time the project is launched. |
|  | Automatically reconcile prior to obtaining locks | Check this check box to configure automatic lock reconciliation for conflict prevention. Learn more about conflict prevention |
|  | Display measure along route during cursor movement up to this scale | Click the drop-down arrow and choose a scale for the display of routes and measures while moving the pointer on the map in a feature service. The default is 1:10,000. |
| Route Editing | Keep centerlines chosen and selected | Check this check box to keep centerlines in the Location Referencing pane chosen and selected on the map after route edits. When this check box is not checked, centerlines chosen in the Location Referencing pane are deselected, and selected features on the map are cleared. |
|  | Warn before allowing route edits that can create physical gaps | Uncheck this check box to disable the warning prompt that appears when a route edit will result in one or more physical gaps. |
| Event Editing | Retire edited events and create new events effective | Check this check box to retire events as of the date set in the text box following an update to an event’s attributes using the Attributes pane, attribute table, or Edit Vertices tool . When this check box is checked, the Retire edited events and create new events effective option in LRS Advanced Options will be checked by default. The default date is the current date. |
|  | Always use current system date | Check this check box to always use the current system date when retiring edited events and creating a new record in LRS Advanced Options . When this check box is checked, the text box in the Retire edited events and create new events effective option above is unavailable. |
|  | Merge coincident events that are edited in the attribute table | Check this check box to merge events that are coincident and edited to have identical attributes following an update to an event's attributes using the Attributes pane, attribute table, or Edit Vertices tool . When checked, the Merge coincident events that are edited in the table option in LRS Advanced Options is checked by default. |
|  | Automatically apply these options when editing in the attribute table and don't prompt me | Check this check box to automatically apply the options above without prompting the LRS Advanced Options pop-up when editing event attributes using the Attributes pane, attribute table, or Edit Vertices tool . To disable the LRS Advanced Options pop-up, check this check box and leave the check boxes above unchecked. |
|  | Don't allow override of event placement on dominant routes | Check this check box to automatically add events to the dominant routes without showing the route concurrency pane if the Add event to dominant route check box in the add event tools is checked. If the Add event to dominant route check box in the add event tools is unchecked, events are still added to the selected route. |
|  | Merge coincident events in the Dynamic Segmentation table | Check this check box to automatically merge coincident events following attribute updates in the Dynamic Segmentation table. When this check box is checked, events that are coincident and edited to have identical attributes are merged. Learn more about dynamic segmentation |
|  | Go to next measure upon run when using Add Line Event tools | Check this check box to automatically go the next measure upon running the Add Line Event or Add Multiple Line Events tools . When this check box is checked, the next edit within the Add Line Event T ools will begin at the To M easure end measure location of the p revious edit and use the same method as the To Method in the p revious edit . |
|  | Attribute Set Folder Location | Choose an alternate attribute set folder location, either by clicking the Browse button to choose a folder other than the default location, or by providing the folder path. |
|  | Replace Events Folder Location | Choose an alternate replace events folder location, either by clicking the Browse button to choose a folder other than the default location, or by providing the folder path. |
| Documentation | Pipeline Referencing | Set this preference to have Pipeline Referencing documentation load when context-sensitive help links are clicked. |
|  | Roads and Highways | Set this preference to have Roads and Highways documentation load when context-sensitive help links are clicked. |

- Click OK.

![image1.png](../media/doc800_image1.png) ![image2.png](../media/doc800_image2.png) ![image3.png](../media/doc800_image3.png) ![image4.png](../media/doc800_image4.png)
