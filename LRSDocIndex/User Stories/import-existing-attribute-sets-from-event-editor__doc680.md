# Import Existing Attribute Sets from Event Editor

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Pipeline Referencing |
| **Source** | [ImportExistingAttributeSetsEventEditor.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ImportExistingAttributeSetsEventEditor.pptx>) |
| **Edited** | 2022-02-05 00:21 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Import Existing Attribute Sets from Event Editor"
source_file: "ImportExistingAttributeSetsEventEditor.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ImportExistingAttributeSetsEventEditor.pptx"
doc_id: 680
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-02-05T00:21:06Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["attribute set", "event editor", "arcgis pro", "rhas format", "controller dataset", "line attribute set", "event editing"]
tools: []
products: ["Pipeline Referencing"]
issues: []
related: [{"doc":689,"file":"managing-attribute-sets-user-story__doc689.md","s":4.687},{"doc":676,"file":"delete-attribute-sets-user-story__doc676.md","s":4.39},{"doc":562,"file":"migrate-attribute-sets-to-map-cim-service-test-plan__doc562.md","s":3.875},{"doc":661,"file":"configure-event-replacement-user-story__doc661.md","s":3.196},{"doc":686,"file":"add-multiple-line-events-tool-in-arcgis-pro__doc686.md","s":2.959}]
```
-->

## Summary

This user story describes the need for LRS Editors to import attribute sets created in Event Editor into ArcGIS Pro to enable event edits in both applications without duplication. It covers converting old .rhas format attribute sets to a new format stored in the LRS controller dataset, displaying only line attribute sets, and updating the Event Editor UI to remove deprecated options. Testing scenarios ensure proper conversion and display of attribute sets between Event Editor and Pro. Documentation updates include instructions on attribute set conversion and deprecation notices.

## Related documents

<!-- related:begin -->
- [Managing Attribute Sets User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/managing-attribute-sets-user-story__doc689.md>) — similar text 0.17 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:689 -->
- [Delete Attribute Sets User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/delete-attribute-sets-user-story__doc676.md>) — similar text 0.26 · 2 title words · 2 filename words · same kind/folder <!-- rel:676 -->
- [Migrate Attribute Sets to Map CIM/Service – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/migrate-attribute-sets-to-map-cim-service-test-plan__doc562.md>) — similar text 0.28 · 2 title words · 2 filename words · same surface <!-- rel:562 -->
- [Configure Event Replacement User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/configure-event-replacement-user-story__doc661.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:661 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-arcgis-pro__doc686.md>) — similar text 0.18 · 1 filename word · same kind/surface/folder <!-- rel:686 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

## Slide 1 — Import Existing Attribute Sets from Event Editor

User Story

## Slide 2 — User Story

As an LRS Editor, I want attribute sets previously created in Event Editor to be available in ArcGIS Pro, so that I can make event edits in either application without having to create a new/duplicate attribute set.

Persona
LRS Editor: This user is responsible for making edits to the LRS.  The edits they need to make come in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs).  The LRS Editor can also be responsible for editing events associated with the routes in the LRS.  Many of these users already have attribute sets that were created in Event Editor.  Now that we support attribute sets for event editing in Pro, they want a way for those existing attribute sets to be automatically imported to the new format so they can use them in both Event Editor and Pro.

## Slide 3 — Importing/Displaying/Configuring Attribute Sets

Converting existing Attribute Sets
Support converting attribute sets created in the old format (.rhas) into the new format that is stored in the LRS controller dataset
When a user launches Event Editor using a web map with a Pro published service, look for any attribute sets in the .rhas format stored locally on their machine.  If any are found, automatically convert them into the new attribute set format and store in the controller dataset.
When a user launches Event Editor using a web map with a Pro published service, look for any attribute sets in the .rhas format stored on the Event Editor folder on the web server.  If any are found, automatically convert them into the new attribute set format and store in the controller dataset.
If a user uses the import button on the Attribute Set configuration UI in Event Editor and selects a .rhas file, convert the .rhas file into the new format and store in the controller dataset.
For any .rhas Attribute Sets that are imported to the controller dataset, store a designation whether it was imported locally from a machine or from the Event Editor application folder on the web server (this info will be necessary when we create a script/tool to delete attribute sets)
If any of the Attribute Sets from the scenarios above already exist in the controller dataset, don’t duplicate them, just show the one in the controller dataset
Displaying new attribute set type
Ensure that when Event Editor is launched using a web map with a Pro published service that any attribute sets that are stored in the controller dataset that should be displayed show up in the available attribute set drop down (note only line attribute sets should appear)
Only Line Attribute Sets should appear in the attribute set list
Creating new/updating existing attribute sets for Pro published services
When Event Editor is launched using a web map with a Pro published service and a user opens the configure attribute sets dialog, don’t show the default settings button as we don’t support this configuration for attribute sets any longer (remove it from the UI when a web map backed by a Pro published service is being used)
If a user clicks the New Attribute Set button, do not show the default settings step and simply allow them to name the attribute set (look at the Group Name popup and consider using it with a new name)
Remove the New Group button from the list of buttons on the top of the UI
When a user adds a layer/field to a newly created attribute set, don’t prompt them to create a group
Deprecate the Export attribute set button

## Slide 4 — Testing

Test the following scenarios and verify the attribute sets are converted and stored in the controller dataset (by opening Pro):

  - Existing .rhas file in the EE folder
  - Existing .rhas file in the local directory of the machine
  - Existing .rhas file imported via attribute set UI
Verify attribute sets created in Pro appear in Event Editor
In the Attribute Set UI, verify the following:

  - The default settings, new group, and export button don’t appear
  - When new attribute sets are created, there is no prompt for default setting or to create a group when the first layer/field is added
  - Pro created attribute sets appear with the correct layers configured
  - Former .rhas attribute sets appear with the correct layers configured
  - Layers/fields are able to added/removed
  - All other buttons (copy, expand, etc.) still work correctly

## Slide 5 — Automation

No automation

## Slide 6 — Documentation

Update the https://enterprise.arcgis.com/en/roads-highways/latest/event-editor/configuring-attribute-sets.htm (and the pipeline referencing version as well) topic by updating the steps to create and modify attribute sets.
Update screenshots as well
Add a section that discusses how old .rhas are converted to the new format as well as how attribute sets created in Pro will appear in Event Editor (and vice versa)
Make sure to document that this is the behavior for services published using ArcGIS Pro (should we continue to mention behavior for ArcMap or remove it all together?)
Add a deprecation notice for the Import Attribute Set button that it will be deprecated in 2 releases

## Slide 7 — Assignment

Story Points:
Dev:
PE:
