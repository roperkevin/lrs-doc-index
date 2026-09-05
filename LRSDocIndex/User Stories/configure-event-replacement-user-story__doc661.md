# Configure Event Replacement User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Product** | Roads & Highways · Pipeline Referencing |
| **Source** | [Event_Replacement_UserStory11.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Event_Replacement_UserStory11.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Configure Event Replacement User Story"
source_file: "Event_Replacement_UserStory11.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Event_Replacement_UserStory11.pdf"
doc_id: 661
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: ""
last_edited_by: ""
last_edited: ""
extracted: 2026-09-04
extraction_lane: plaintext
prompt_version: "v2.0.2"
keywords: ["event replacement", "pipe replacement", "event editing", "point event", "line event", "arcgis pro"]
tools: ["Event Editor"]
products: ["Roads & Highways", "Pipeline Referencing"]
issues: []
related: [{"doc":660,"file":"perform-event-replacement-user-story__doc660.md","s":4.512},{"doc":688,"file":"add-single-point-event-tool-in-arcgis-pro__doc688.md","s":3.533},{"doc":680,"file":"import-existing-attribute-sets-from-event-editor__doc680.md","s":3.196},{"doc":686,"file":"add-multiple-line-events-tool-in-arcgis-pro__doc686.md","s":3.191},{"doc":685,"file":"add-multiple-point-events-tool-in-arcgis-pro__doc685.md","s":3.191}]
```
-->

## Summary

Describes the user story and configuration process for Event Replacement within ArcGIS Pro. Covers the functionality to retire and recreate events during pipe replacement maintenance, user interface elements, configuration options, and testing considerations. Includes documentation and assignment details for development and product engineering.

## Related documents

<!-- related:begin -->
- [Perform Event Replacement User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/perform-event-replacement-user-story__doc660.md>) — similar text 0.30 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:660 -->
- [Add Single Point Event tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-single-point-event-tool-in-arcgis-pro__doc688.md>) — similar text 0.21 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:688 -->
- [Import Existing Attribute Sets from Event Editor](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/import-existing-attribute-sets-from-event-editor__doc680.md>) — similar text 0.18 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:680 -->
- [Add Multiple Line Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-line-events-tool-in-arcgis-pro__doc686.md>) — similar text 0.21 · 1 filename word · same kind/surface/folder <!-- rel:686 -->
- [Add Multiple Point Events tool in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-multiple-point-events-tool-in-arcgis-pro__doc685.md>) — similar text 0.21 · 1 filename word · same kind/surface/folder <!-- rel:685 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/event-editing-using-the-attribute-table.html)

_No page matched:_ [Event Editor](https://www.google.com/search?q=%22Event%20Editor%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

What is pipe replacement?
While performing maintenance tasks, sometimes a section of a pipe (maybe
damaged) is taken out of the ground and is then replaced by a new pipe. This
process is termed as "Pipe Replacement".

What is the effect on the data?
As a result of pipe replacement:
1. No route edits takes place
2. Some point and line events located in the replaced section are retired.
3. Some line events located in the replaced section are retired and recreated.
4. Some point and line events located in the replaced section are left untouched.
5. Points 2-3-4 are mutually exclusive.

                                                                                    1
         Configure
           Event
        Replacement

Add a new button “Configure Event
Replacement”

     Add a folder location for the Event
     Replacement in the LRS options

                                           2
                                                                                    Any event in this list will be
                                                                                    retired. Can contain point
All the line and point events available in the map                                  and line events.
service show up on this list.
                                                                                                                     2

    Do not touch any events left in this list when
    performing the event replacement operation.
                                                                                    Any event in list will be
                                                                                    retired and recreated. Only
                                                                                    line events allowed.

                                                                           1                                         3

                   Set as default for the project.

                              Moves all events back into the left panel.                 Configurations can be saved as an *.lrer file.

                                                                       Events can be dragged and dropped to the
                                                                       boxes in addition to using the arrow keys.
                                             Show an error when point events are
                                             moved from 1 to 2 OR 2
                                             to 3
Allow selection of multiple events
using ctrl+ and shift+                   2

                                     1   3
              Clicking on this icon exposes the
              list of the non-lrs fields present in
              that event layer.
                                                                                                       Default values from the database are shown by
                                                                                                       default. These can be overridden by the user.
All the fields are checked by default.

                                                      The required fields (Non-null, with no default
                                                      set) cannot be unchecked.
User Story
As an LRS Editor, I want so be able to configure a grouping of events layers in a single location, so
that I can perform event replacement in a single editing operation.

Persona
LRS Editor: This user is responsible for making edits to the LRS. The edits they need to make come
in from field crews/contractors in a variety of formats (shapefiles, engineering drawing, fgdbs). The
LRS Editor can also be responsible for editing events associated with the routes in the LRS. They
want to be able to replace multiple events by retiring some events and adding new events in a
single editing operation. This can be done in Event Editor, but we also need to support Event
Replacement within Pro.
Configure Event Replacement
• Support users being able to configure Event Replacement within ArcGIS Pro
• Add a button on the ribbon called “Configure Event Replacement” (work with graphics to get an icon) in the Events Section

                                                                                       Configure
                                                                                         Event
                                                                                      Replacement

• When the Event Replacements button on the ribbon is clicked, open the initial Event Replacement Configuration dialog.
• In the Event Replacement drop down, allow the user to select other Event Replacement configs or create a new one
• All LRS Event layers that are in the current service shown in the map should appear in the layers on the left-hand side (note if a
  layer is in a service, but is not part of the map, do not show it)
• Users should only have one LRS enabled service in the map. If they have more than one LRS enabled service in the map, select
  the first one to use for Event Replacement.
Configure Event Replacement                                                                         Default
• The image on the right shows the first time the Event Replacement wizard is used.
• There is no “Default” event replacement configuration to start with.
• When ‘Create New Event Replacement’ option is selected from the drop-down, name the
  Event Replacement as ‘Event Replacement 1’ and start the counter. The user can change the
  name at this time.                                                                                          2

• The user selected Default Event Replacement is for that map only. For another map, the
  Default Event Replacement can be different.
• If the contents from the panes are dragged to a location outside of the boxes, then show an
  error icon
• Do not allow duplication of Event Replacement names                                           1             3
• If no fields checked in a layer on 3 , then move that layer to 1
• The number of characters in the Event Replacement name to be limited to 100
•   When the layers in the Event Replacement are not present in the FS
    anymore. The tooltip says which layers are missing.
•   Do not allow these to be set as default

•   If the field already has a default value set up, then show that by default
•   The user can overwrite that value in this UI
•   Double click a field to change the default value
•   Single click on the field should show the red cross on the right that’ll remove the default value
•   Single click on a coded value domain field shows the listed values
•   Support Default Values, Coded Value Domains, Contingent Values and Subtypes. For fields with CVD
    and Subtypes, show a drop down of existing values available from the domain.
•   For range domains, allow the user to type a value and if it is outside the range, provide an error with
    a message about the acceptable range of values that could be stored for that field
•   Once a user makes a change to the existing default values for one or more fields in the Event
    Replacement, make the Save button active and don’t commit/save their changes until they click
    Save.
•   If a user attempts to close the Event Replacement UI with pending changes, prompt them if they
    want to save before closing by clicking OK and that they could lose their changes if they don’t .
•   For a newly created Event Replacement, allow the user to expand all the layers to show the editable fields
    within each layer (don’t show any system or LRS fields such as Editor Tracking or RouteID/Measure)
•   Denote required fields with some sort of graphic like that on the mockups
•   Support being able to drag one, or more if they use the shift or ctrl button to select multiple events
•   Once the user clicks Save, save the Event Replacement within our LRS Controller Dataset
•   If the user clicks Set as Default, make that config the default Event Replacement that appears in the future        2
    when Event Replacements are opened via the button on the ribbon (note each service will have their own
    default)
•   When a user reopens the Event Replacements via the button on the ribbon, query the LRS Controller Dataset
    to find all Event Replacements that utilize the layers in the service and show those in the Event Replacement
    drop down (make sure to honor the Default as well)
•   Make sure whatever is designed is 508 and i18n compliant

                                                                                                                    1   3
Testing
• Focus testing on APR (but do at least a few test scenarios with an RH environment to ensure it
  works correctly)
• Test on a variety of LRS Event types (point, line, spanning, stationing, with and without Route
  Name, with and without Referents)
• Test scenarios where a new Event Replacement is created, and existing Event Replacements are
  updated
• Test in both Light and Dark mode
Automation
No automation for this story as it’s all UI based
Documentation
• Create a new node in the Pro documentation for Event Editing
• Create a new conceptual topic that discusses the concept of Event Replacements
  (what they are, why they’re useful, etc.). Use the Event Editor topic(s) related to
  Event Replacements for guidance.
• Create a workflow topic that discusses how to configure a new Event
  Replacement using ArcGIS Pro
• Create a second workflow topic that discusses how to update a new Event
  Replacement using ArcGIS Pro (or combine with the first workflow topic if that
  makes more sense)
Assignment
Story Points:
Dev:
PE:
