# Merge Events User Story

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [MergeEvents_UserStory1.pdf](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MergeEvents_UserStory1.pdf>) |
| **Edited** | unknown by unknown |
| **Extracted** | 2026-09-04 · lane `plaintext` |

<!-- metadata
```yaml
title: "Merge Events User Story"
source_file: "MergeEvents_UserStory1.pdf"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/MergeEvents_UserStory1.pdf"
doc_id: 675
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
keywords: ["merge events", "line event", "route", "event attributes", "event selection", "event merging", "validation"]
tools: ["Merge Events"]
products: []
issues: []
related: [{"doc":466,"file":"merge-events-in-experience-builder__doc466.md","s":5.379},{"doc":647,"file":"merge-events-pro-test-plan__doc647.md","s":5.151},{"doc":437,"file":"merge-events-widget-test-plan__doc437.md","s":4.407},{"doc":484,"file":"add-line-events-user-story-for-experience-builder__doc484.md","s":2.903},{"doc":480,"file":"user-story-add-line-event-multiple__doc480.md","s":2.666}]
```
-->

## Summary

Describes the Merge Events tool functionality for line events in the Linear Referencing System. Covers event selection, validation rules, attribute handling, and merging logic including handling of spanning and non-spanning line events. Includes error conditions and examples illustrating merging scenarios with route and date validations.

## Related documents

<!-- related:begin -->
- [Merge Events in Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/merge-events-in-experience-builder__doc466.md>) — similar text 0.65 · 2 title words · 2 filename words · same kind/folder <!-- rel:466 -->
- [Merge Events Pro Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/merge-events-pro-test-plan__doc647.md>) — similar text 0.61 · 2 title words · 2 filename words · same surface <!-- rel:647 -->
- [Merge Events Widget Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/merge-events-widget-test-plan__doc437.md>) — similar text 0.59 · 2 title words · 1 filename word <!-- rel:437 -->
- [Add Line Events User Story for Experience Builder](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-events-user-story-for-experience-builder__doc484.md>) — similar text 0.17 · 1 title word · 1 filename word · same kind/folder <!-- rel:484 -->
- [User Story Add Line Event (Multiple)](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/user-story-add-line-event-multiple__doc480.md>) — similar text 0.16 · 1 filename word · same kind/folder <!-- rel:480 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html) · [Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html)
<!-- docs:end -->

---

Merge Events

               766
           Merge Events

General

1. Add a button in the Events section of the LR Ribbon
2. Clicking the button will open the Merge Events tool in the pane
3. Only support data from FS
4. Works only for line events
5. For non-spanning line events, the events should be on the same route
6. For spanning line events, the events should be on the same line

Event

1. Show only the line event layers available in the map

Event Selector

1. As soon a valid event is chosen above, change the pointer to a rectangle
  feature selector
2. As soon as the user draws a rectangle to select events to merge:
...Highlight the events on the map
…...Show the Events to Merge section below with a list of events that are
selected
3. The drop down will show the same options that are available in the choose
CL tool i.e., rectangle, polygon, lasso etc.
4. Allow to select only from the event selected above
5. If the box is drawn on events that do not belong to the same route/line,
then show an error at the top:
….The selected events are not on the same route
……The selected events are not on the same Line
In this case keep the selection intact but do not allow to merge
6. If the box is drawn on a single event, then show an error at the top:
…. Select at least 2 events to merge
In this case keep the selection intact but do not allow to merge

                                                                              767
           Merge Events
Events to Merge

1. Show the list of events selected
2. The OID field for the event will be used as the identifier
3. The events are sorted by the order of increasing calibration along a
  route/line.
4. Allow to remove an event from the list (delete key)
5. Keep this link synched with the selection on the map that means updating
  the list dynamically when the selection changes on the map/attribute table
  for that event layer
6. Update the selection graphic if events are added/removed from the list
7. Do not allow to select multiple events from the list
8. Selecting an event will result in using its attributes for the resultant merged
  event
7. Write (Preserve) along that event in the list
8. Flash the ‘Preserve’ event 3 times
9. The first event in the list will be selected by default
10.If events are already selected for the chosen event layer prior to opening
  the tool, then upon the selection of that event layer at the top, populate
  this section with the list of already selected events.
11.If events are selected using this pane and the event’s attribute table is
  opened, then the attribute table should show the same selection
12.Show a vertical scroll after 5 rows

From Date

1. Populate with today’s date as default
2. Can be edited by the user
3. Provide a checkbox to choose the route’s start date – Valid only for non-
  spanning line events

To Date

1. Populate Null as default
2. Can be edited by the user
3. Provide a checkbox to choose the route’s end date – Valid only for non-
  spanning line events
                                                                                 768
          Merge Events

Merged Event Attributes

1. The event id is populated using the event id of the ‘preserve’ event
2. From and To Route names are provided if the event spans routes and route
  name field is configured for the network
3. Route name is provided for the non-spanning line event, where route name
  field is configured for the network
4. Route ID is provided for the non-spanning line event, where no route name
  field is configured for the network
5. From measure = From measure of the first event in the increasing order of
  calibration of the route/line
6. To measure = To measure of the last event in the increasing order of
  calibration of the route/line
7. Event ID, Route Name/Route ID fields are non editable
8. Validate the From Measure with the From Route upon running the tool
9. Validate the To Measure with the To Route upon running the tool
10. Subtypes, Range Domain, Coded Value Domains, Contingent values,
  Attribute rules, Non nullable fields
11. Provide helpful error messages upon validation. E.g., if the entered value is
  out of range for a field, then provide the range in the error message.
12.Denote required fields
13. Do not show OID, Shape, Shape_Length, Loc_Error, Referent, Global ID,
  Editor tracking fields

                                                                               769
           Merge Events

Merge

1. Retire all the events by populating their To Date with the From Date from
  this form and create a new event with the Event ID of the preserved event
  and the dates, measures, route IDs/names and attributes from this form
2. Time slice the resulting event based on the dates provided in this form and
  the dates of the route/routes (spanning)
3. If the merging events are not co-incident, then fill the gap while creating the
  event
4. Do not allow merging with a single event
5. Validate the Merged event attributes
6. Apply conflict prevention
7. Maintain the referent info for the from and to referents
8. Once the merged event is created successfully, collapse form to its initial
  state and provide a message at the top of the pane
9. Once the merged event is created successfully, refresh the layer on the map
  and flash the merged event 3 times

                                                                                 770
                                   1. Simple merge

             RouteA          RouteB             RouteC       RouteD

           RouteID    From Date       To Date      From Measure   To Measure
           RouteA     1/1/2000        Null         0              10

           RouteB     1/1/2000        Null         100            200

           RouteC     1/1/2000        Null         0.23           1.65

           RouteD     1/1/2000        Null         10             12

EventID   From Date   To Date     From Route       From Measure   To Route     To Measure   Attribute
Event1    1/1/2000    Null        RouteA           0              RouteB       150          X

Event2    1/1/2000    Null        RouteB           150            RouteD       12           Y

             RouteA          RouteB             RouteC       RouteD

EventID   From Date   To Date     From Route       From Measure   To Route     To Measure   Attribute
Event1    1/1/2000    Null        RouteA           0              RouteD       12           X

                                                                                                 771
                        1. Merging overlapping events

             RouteA          RouteB             RouteC       RouteD

           RouteID    From Date       To Date      From Measure   To Measure
           RouteA     1/1/2000        Null         0              10

           RouteB     1/1/2000        Null         100            200

           RouteC     1/1/2000        Null         0.23           1.65

           RouteD     1/1/2000        Null         10             12

EventID   From Date   To Date     From Route       From Measure   To Route     To Measure   Attribute
Event1    1/1/2000    Null        RouteA           0              RouteB       150          X

Event2    1/1/2000    Null        RouteB           100            RouteD       12           Y

             RouteA          RouteB             RouteC       RouteD

EventID   From Date   To Date     From Route      From Measure    To Route     To Measure   Attribute
Event1    1/1/2000    Null        RouteA          0               RouteD       12           X

                                                                                                 772
                                   1. Different Dates

              RouteA          RouteB             RouteC       RouteD

             RouteID   From Date       To Date      From Measure   To Measure
             RouteA    1/1/2000        Null         0              10

             RouteB    1/1/2000        Null         100            200

             RouteC    1/1/2010        Null         0.23           1.65

             RouteD    1/1/2010        Null         10             12

 EventID   From Date   To Date     From Route       From Measure   To Route     To Measure   Attribute
 Event1    1/1/2000    Null        RouteA           0              RouteB       200          X

 Event2    1/1/2010    Null        RouteC           0.23           RouteD       12           Y

              RouteA          RouteB             RouteC       RouteD

EventID    From Date   To Date     From Route      From Measure    To Route     To Measure   Attribute
Event1     1/1/2000    Null        RouteA          0               RouteD       12           X

Error
 The To Route does not exist in the selected time frame.

                                                                                                  773
                                  1. Different Dates - 2

              RouteA          RouteB             RouteC          RouteD

             RouteID   From Date       To Date      From Measure         To Measure
             RouteA    1/1/2000        Null         0                    10

             RouteB    1/1/2000        Null         100                  200

             RouteC    1/1/2010        Null         10                   20

             RouteD    1/1/2010        Null         10                   12

 EventID   From Date   To Date         From Route         From Measure         To Route      To Measure   Attribute
 Event1    1/1/2010    12/31/2020      RouteA             0                    RouteC        15           X

 Event2    1/1/2010    Null            RouteC             15                   RouteD        12           Y

              RouteA          RouteB             RouteC          RouteD

EventID    From Date   To Date     From Route      From Measure      To Route           To Measure    Attribute
Event2     1/1/2010    Null        RouteA          0                 RouteD             12            Y

Error
 The From Route does not exist in the selected time frame.

                                                                                                              774
                                       1. Not co-incident

                RouteA             RouteB             RouteC            RouteD

              RouteID      From Date        To Date      From Measure           To Measure
              RouteA       1/1/2000         Null         0                      10

              RouteB       1/1/2000         Null         100                    200

              RouteC       1/1/2000         Null         10                     20

              RouteD       1/1/2000         Null         10                     12

 EventID    From Date     To Date           From Route           From Measure         To Route    To Measure       Attribute
 Event1     1/1/2000      Null              RouteA               0                    RouteB      200              X

 Event2     1/1/2000      Null              RouteC               15                   RouteD      12               Y

                RouteA             RouteB             RouteC            RouteD

EventID    From Date     To Date        From Route           From Measure        To Route        To Measure    Attribute
Event2     1/1/2000      Null           RouteA               0                   RouteD          12            Y

                                                                                                                       775
