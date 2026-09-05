# Set Location Referencing options

| Field | Value |
| --- | --- |
| **Doc** | 307 · Other · Pro |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [SetLROptions_RH_V2.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5942_SetLocationReferencingOptions/SetLROptions_RH_V2.docx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2024-09-10 21:42 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | location referencing options · route editing · event editing · conflict prevention · dynamic segmentation · attribute set · replace events · pipeline referencing · roads and highways |
| **Tools** | — |

## Summary

Instructions for configuring Location Referencing options in ArcGIS Pro, including settings for route editing, event editing, conflict prevention, and documentation preferences. Describes how to access and adjust various options to control behavior such as lock reconciliation, event retirement, merging coincident events, and folder locations for attribute sets and replace events.

## Related documents

<!-- related:begin -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-lr-options-rh-apr-v2-2024-08.md>) — similar text 0.85 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:315 s=7.795 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6463-set-lr-options.md>) — similar text 0.77 · 2 title words · 2 filename words · same kind/surface <!-- rel:199 s=7.031 -->
- [Set Location Referencing options](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/set-lr-options-rh-apr-2024-09.md>) — similar text 0.71 · 2 title words · 1 filename word · same kind/surface <!-- rel:308 s=5.38 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5826-reorganize-lr-pro-options-rh-apr-v2-2024-08.md>) — similar text 0.36 · 1 title word · 1 filename word · same surface <!-- rel:340 s=3.731 -->
- [Reorganize Location Referencing Pro Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5826-reorganize-lr-pro-options-rh-apr-v2-2024-08-2.md>) — similar text 0.36 · 1 title word · 1 filename word · same surface <!-- rel:341 s=3.73 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html) · [Set Location Referencing options](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/set-location-referencing-options.html) · [Conflict prevention](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/conflict-prevention.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/apply-dynamic-segmentation.html) · [3D in Pipeline Referencing](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/3d-in-pipeline-referencing.html) · [3D in Roads and Highways](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/3d-in-roads-and-highways.html)
<!-- docs:end -->

---

## Set Location Referencing options
Complete the following steps to configure Location Referencing options in ArcGIS Pro:

1. Open the project where you want to set Location Referencing options.

1. On the Location Referencing tab, in the Routes group or the Events group, click the Location Referencing Options launcher .

- The Options dialog box appears with the Location Referencing tab active.
- Tip:
- You can also access Location Referencing options by clicking Project > Options and clicking the Location Referencing tab on the Options dialog box.

1. Configure any of the following options as often as needed:

| Option Section | Option Name | Option Description |
| --- | --- | --- |
| Configuration and Conflict Prevention | Set LRS Layers in maps to the current date and time when project is opened | Check th is e check box to set the current date and time for the current project and user if time is enabled for LRS data . When this check box is checked, the current date and time is set on maps in the project each time the project is launched. |
|  | Automatically reconcile prior to obtaining locks | Check th is e check box to configure automatic lock reconciliation for conflict prevention.<br>Learn more about conflict prevention |
|  | Display measure along route during cursor movement up to this scale | Click th is e drop-down arrow and choose a scale for the display of routes and measures while moving the pointer on the map in a feature service. The default is 1:10,000. |
| Route Editing | Keep centerlines chosen and selected | Check th is e check box to keep centerlines in the Location Referencing pane chosen as well as selected on the map after route edits. When this check box is not checked, centerlines chosen in the Location Referencing pane are deselected and selected features on the map are cleared. |
|  | Warn before allowing route edits that can create physical gaps | Uncheck th is e check box to disable the warning prompt that appears when a route edit will result in one or more physical gaps. |
| Event Editing | Retire edited events and create new events effective | Check th is e check box to retire events as of the date in the text box following an update to an event’s attributes using either the Attributes p P ane, a A ttribute t T able, or the Edit Vertices tool Modify Vertices . When this check box is checked, the Retire edited events and create new events effective option within the LRS Advanced LRS Options will be checked by default. The default date is today’s the current date. |
|  | Always use current system date | Check th is e check box to always use the current system date when retiring edited events and creating a new record within the LRS Advanced Options . When this check box is checked, the text box in the Retire edited events and create new events effective<br>above option above will be gr e a yed out. |
|  | Merge coincident events th at are edited in the attribute table | Check this check box to merge attribute-exact , coincident events following an update to an event’s attributes using either the Attributes P p ane, A a ttribute T t able, or the Modify Edit Vertices tool . When checked, the Merge coincident events that are edited in the table option within the LRS Advanced LRS Options will be checked by default. |
|  | Automatically apply these options when editing in the attribute table and don’t prompt me | Check this check box to automatically apply the above options without prompting the LRS Advanced Options pop-up when editing event attributes using either the Attributes p P ane, A a ttribute T t able, or the Modify Edit Vertices too l .<br>To disable the LRS Advanced Options pop-up, check this check box option while leaving the above options check boxes unchecked. |
|  | Don’t allow override of event placement on dominant routes | Check th is e check box to automatically add events to the dominant routes without showing the route concurrency pane, if the Add event to dominant route check box in the add event tools is checked. If the Add event to dominant route check box in the add event tools is unchecked, events will still be added to the selected route. |
|  | Merge coincident events in the Dynamic Segmentation table | Check th is e check box to automatically merge coincident events following attribute updates within the Dynamic Segmentation table. When this check box is checked, events that are coincident and edited to have identical attributes will merge.<br>Learn more about dynamic segmentation |
|  | Attribute Set Folder Location | Choose an alternate attribute set folder location using th is e text box, either by clicking the Browse button to choose a folder other than the default location, or by entering the folder path in th is e text box. |
|  | Replace Events Folder Location | Choose an alternate replace events folder location using th is e text box, either by clicking the Browse button to choose a folder other than the default location, or by entering the folder path in th is e text box. |
| Documentation | Pipeline Referencing | Setting this preference causes the preferred solution Pipeline Referencing documentation to load when context-sensitive help links are clicked. |
|  | Roads and Highways | Setting this preference causes the preferred solution Roads and Highways documentation to load when context-sensitive help links are clicked. |

1. Click OK.

![Figure 1 — Set Location Referencing options](../media/set-lr-options-rh-apr-v2-2024-09/fig-01-set-location-referencing-options.png)
![Figure 2 — Set Location Referencing options](../media/set-lr-options-rh-apr-v2-2024-09/fig-02-set-location-referencing-options.png)
![Figure 3 — Set Location Referencing options](../media/set-lr-options-rh-apr-v2-2024-09/fig-03-set-location-referencing-options.png)
