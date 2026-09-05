# Dynamic Segmentation User Story for ArcGIS Pro

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [Dynamic_Segmentation_UserStory1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Dynamic_Segmentation_UserStory1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Dynamic Segmentation User Story for ArcGIS Pro"
source_file: "Dynamic_Segmentation_UserStory1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Dynamic_Segmentation_UserStory1.pdf"
doc_id: 653
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
keywords: ["dynamic segmentation", "events", "route selection", "attribute set", "event editing", "time slicing", "arcgis pro"]
tools: []
products: []
issues: []
related: [{"doc":362,"file":"experience-builder-dynamic-segmentation-widget__doc362.md","s":3.961},{"doc":394,"file":"dynamic-segmentation-table-consider-point-events-in-dynseg-table__doc394.md","s":3.585},{"doc":604,"file":"merge-coincident-option-in-dynseg-tool-in-pro__doc604.md","s":2.933},{"doc":649,"file":"rename-tool-for-arcgis-pro__doc649.md","s":2.89},{"doc":592,"file":"dynamic-segmentation-merge-option-test-plan__doc592.md","s":2.675}]
```
-->

## Summary

This document describes a user story for enabling dynamic segmentation of events within ArcGIS Pro. It outlines the workflow for LRS Editors to segment events dynamically, select routes, configure attribute sets, and edit event attributes in a temporary results table. Acceptance criteria, UI behavior, conflict prevention, and testing scenarios are included.

## Related documents

<!-- related:begin -->
- [Experience Builder Dynamic Segmentation widget](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/experience-builder-dynamic-segmentation-widget__doc362.md>) — similar text 0.21 · 2 title words · 2 filename words · same kind/folder <!-- rel:362 -->
- [Dynamic Segmentation Table: Consider Point Events in DynSeg Table](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/dynamic-segmentation-table-consider-point-events-in-dynseg-table__doc394.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:394 -->
- [Merge coincident option in DynSeg tool in Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-coincident-option-in-dynseg-tool-in-pro__doc604.md>) — similar text 0.15 · 1 title word · same kind/surface/folder <!-- rel:604 -->
- [Rename Tool for ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/rename-tool-for-arcgis-pro__doc649.md>) — similar text 0.21 · 1 title word · same kind/surface/folder <!-- rel:649 -->
- [Dynamic Segmentation Merge Option Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/dynamic-segmentation-merge-option-test-plan__doc592.md>) — similar text 0.06 · 2 title words · 2 filename words <!-- rel:592 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Apply dynamic segmentation](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/apply-dynamic-segmentation.html)
<!-- docs:end -->

---

Dynamic Segmentation LR tool in ArcGIS Pro

                                             791
                          Acceptance Criteria

As an LRS Editor, I want to be able to dynamically segment events in
ArcGIS Pro.

Persona
LRS Editor: This user is responsible for making edits to the LRS. The
edits they need to make come in from field crews/contractors in a
variety of formats (shapefiles, engineering drawing, fgdbs). The LRS
Editor is responsible for making the route and event edits based on
these documents. One workflow editors will utilize is to view the
results of dynamic segmentation of events and then edit the attribute
table. We supported this workflow in Event Editor and now want to
support it within ArcGIS Pro for users that will do their route and
event editing within a single application.

                                                                        792
                         Network1
   Route ID        From Date          To Date         Attribute
         R1        1/1/2000            Null

                                                      Ev1
   Event ID        Route ID       From M          To M        From Date      To Date     X
   1               R1             0               4           1/1/2000       Null
   2               R1             4               6           1/1/2000       Null

                                                      Ev2
   Event ID        Route ID       From M          To M        From Date      To Date     Y
   1               R1             0               2           1/1/2000       Null
   2               R1             2               5           1/1/2000       Null

Output
Segment       Route ID        From M          To M          From Date     To Date      Ev1.X   Ev2.Y
              R1              0               2             1/1/2000      Null
              R1              2               4             1/1/2000      Null
              R1              4               5             1/1/2000      Null
              R1              5               6             1/1/2000      Null                 NA

                                                                                                       793
                 Network1
Route ID   From Date       To Date          Attribute
     R1    1/1/2000            Null

                                                Ev1
Event ID   Route ID    From M           To M          From Date     To Date        X
1          R1          0                4             1/1/2000      12/31/2010
2          R1          4                6             1/1/2000      Null

                                                Ev2
Event ID   Route ID        From M           To M       From Date      To Date      Y
1          R1              0                2          1/1/2014       Null
2          R1              2                5          1/1/2000       Null

Output
Route ID   From M      To M           From Date          To Date           Ev1.X       Ev2.Y
R1         0           2              1/1/2000           12/31/2010                    NA
R1         2           4              1/1/2000           12/31/2010
R1         4           5              12/31/2010         Null
R1         5           6              12/31/2010         Null                          NA
R1         2           4              12/31/2010         1/1/2014          NA
R1         4           5              12/31/2010         1/1/2014
R1         5           6              12/31/2010         1/1/2014                      NA
R1         0           2              1/1/2014           Null              NA
R1         2           4              1/1/2014           Null              NA
R1         4           5              1/1/2014           Null
R1         5           6              1/1/2014           Null                          NA

                                                                                               794
Icon

1.     Get a new icon for Dynamic segmentation and place it in the Events section of the LR ribbon

Network

1.     List only the networks that are present in the map

Attribute Set

1.     List only the line attribute sets that are present in the Attribute Sets location folder
2.     Provide a button to ‘Configure Line Attribute Set’. This will act as a shortcut to create a line attribute set
       immediately.

Events

1.     List only the events that are part of the selected Attribute Set AND are registered with the selected
       Network.
2.     The results will show the attributes of these events

                                                                                                                        795
Select Routes

1.   The dynamic segmentation of events will be done only for the selected routes in the list
2.   If any routes are already selected for the chosen network, then clicking the ‘Use Selected Routes’ button
     will list them under the “Routes”
3.   The geometric feature selection tools should select ONLY the routes present in the selected Network
4.   No routes will be selected if the Network is turned off, not present in the map or not selectable
4.   If there are routes already selected and then the Select Routes tool is used, then wipe out the previous
     selection and use the results of the Select Routes tool.
5.   If there are routes already selected and then the Select Routes tool is used using the SHIFT or CNTRL keys,
     then use the results of the Select Routes tool and add them to the previous selection
6.   Highlight the selected routes with a selection color (same color used by Pro)
7.   RouteID/Route Name is used as the identifier
8.   Selecting one or multiple rows will flash the routes 3 times
9.   A selected route can be deleted from the list
10. If the ‘Clear Selection’ tool is used from the Pro ribbon, then the list will be cleared

                                                                                                                 796
Changing Values

1.    If there are routes already selected and then the Select Routes tool is used, then wipe out the previous
      selection and use the results of the Select Routes tool.
2.    If there are routes already selected and then the Select Routes tool is used using the SHIFT or CNTRL keys,
      then use the results of the Select Routes tool and add them to the previous selection.

Conflict Prevention

1.    Acquire event locks upon run

Run

1.    Run is enabled ONLY when a network is selected, an attribute set is selected, at least one event layers is
      listed and at least one route is selected.
2.    Do not clear the contents of the tool once its run
3.    Show animation when the tool is running, and the results are yet to be displayed
4.    Once the tool runs, provide a message at the top
5.    If the routes contain no events for dynamic segmentation, then provide a message at the top ‘No Matching
      Records’
6.    Do not allow another run of the tool until the previous run’s results are shown

                                                                                                                   797
Output - Table

1.   Upon a successful Run, open an attribute table at the bottom of the screen
2.   This table contains the results of the dynamic segmentation of the events
3.   Route ID, To Route ID (Spanning Events), From Measure, To Measure, From Date, To Date: These fields are
     permanent and un editable
4.   Next to the fields mentioned above are the non-lrs, non-editor tracking and non-system fields available in
     the event’s attribute table.
5.   These fields are editable
6.   The fields are named as <EventName.FieldName>
7.   By default, show fields from all the event layers from the attribute set but the user can filter them
8.   No filter is applied by default
9.   The results should consider time slicing of the routes and events
10. This is a temporary table; it does not show up in the TOC nor is saved with the project

Table – Row selection

1.   Selecting a row will highlight the section on the route in the map
2.   Right-clicking a row will provide this context-based menu

3.   Right-clicking a field name will provide this context-based menu

                                                                                                                  798
Editing - Table

1.   In addition to the normal fields, allow editing the fields that have coded value domains, range domains,
     attribute rules, contingent values, LUT attached.
2.   Once a field is edited, the edits can be saved using the ‘Save Edits’ tool in the Pro ribbon.

Table – Applying filter

1.   Show the selected event names as tags when the events are filtered
2.   Removing a tab will remove that event from the filter
3.   If more than one event is filtered, then show ‘Multiple Events’ in the Event Filter drop-down list
4.   Shift+ or Ctrl+ can be used to select multiple events

                                                                                                                799
Testing

1.   Attribute set with Spanning line events
2.   Attribute set with non-spanning line events
3.   Attribute set with Spanning and non-spanning line events
4.   Multiple events on multiple routes
5.   Events can have coded value domains, range domains, attribute rules, contingent values, LUT attached
6.   Consider Time-slicing

Documentation

1.   Create a new document for dynamic segmentation
2.   Place it in the Event Editing section of the doc

Automation

1.   No automation

Estimate

1.   Story Points

                                                                                                            800
