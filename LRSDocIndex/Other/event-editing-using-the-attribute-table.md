# Event Editing Using the Attribute Table

| Field | Value |
| --- | --- |
| **Doc** | 318 · Other · Pro |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [EventEditingUsingtheAttributeTable_V2.docx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Doc%20Reviews/5983_Advanced_Table_Editing_Options/EventEditingUsingtheAttributeTable_V2.docx>) · rev V2 |
| **People** | author Mac Christmas · PE — · dev — |
| **Edited** | 2024-09-04 00:49 by unknown |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | event editing · attribute table · location error · event measures · spanning events · time slicing · referent offset |
| **Tools** | — |

## Summary

Describes how to edit events in a feature service by updating records in an event layer's attribute table. Covers scenarios including editing event measures, handling location errors, editing spanning events, time slicing events, and editing events with referent offsets. Explains the impact of edits on event attributes and location error statuses.

## Related documents

<!-- related:begin -->
- [Event Editing Using Feature Edits](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/event-editing-using-feature-edits.md>) — similar text 0.66 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:319 s=6.861 -->
- [Advanced Table Editing Options in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/advanced-table-editing-options-in-pro.md>) — similar text 0.15 · 2 title words · 2 filename words · same surface <!-- rel:369 s=3.32 -->
- [Conflict Prevention for Event Editing in Pro – Core Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/conflict-prevention-for-event-editing-in-pro-core-tools-v4.md>) — similar text 0.09 · 2 title words · 2 filename words · same surface <!-- rel:670 s=3.222 -->
- [Advanced Editing Options Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/5765-advanced-editing-options.md>) — similar text 0.14 · 1 title word · 2 filename words · same surface <!-- rel:336 s=3.032 -->
- [Replace Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/replace-events-rh.md>) — similar text 0.33 · same kind/surface <!-- rel:123 s=2.752 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Location errors](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/location-errors.html) · [Configure continuous measure networks and events to update with an engineering network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/configure-continuous-measure-networks-and-events-to-update-with-an-engineering-network.html) · [Storing referent and offset information for event location](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/storing-referent-and-offset-information-for-event-location.html)

_No page matched:_ [enabled referent fields](https://www.google.com/search?q=%22enabled%20referent%20fields%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Event editing using the attribute table
You can edit an event in a feature service by updating its record in an event layer’s attribute table.
Attribute table edits can be done to correct errors, reflect changes to measures on an associated route, or update the value of a unique event attribute, such as direction or pressure. For example, you can make an edit to reflect a change of direction in the flow of liquid in a pipe or a change in the pressure rating in a pipe segment that occurs on a specific date.
After edits are made to the attribute table row, the system-provided Location Error value is updated to indicate the status.
Note:
Right-click the event layer in which you want to edit an event, andevent and choose Attribute Table to open its attribute table in the ArcGIS Pro subpanel. To edit an event record, click in its row and update the values for the event.
If a message regarding acquiring locks or reconciling appears, conflict prevention is enabled.
Events that have stationing and referents configured are supported in ArcGIS Pro. When editing a referent or stationing event in the attribute table, you can provide the values for the stationing or referent columns; however, the event is drawn based only on the values provided in the measure fields.
Note:
After editing an event’s attributes, you can retire the existing event and and create a new event with a From Date as of the specified retire date including the updated event attributes. You also have the option to merge any coincident linear events. For more information, see the event editing options in the Location Referencing Pro Project options.

### Location errors
Location errors allow you to determine data quality issues with LRS events. When an event is defined accurately using the attribute table or any other method, the result is a No Error value for the location error field.
Note:
You can also review a complete list of location errors.
Any of the following statuses indicate a problem that must be resolved.

| Location error | Description |
| --- | --- |
| Different From Route And To Route Line IDs | The starting route and the ending route have different line IDs. This is applicable to events associated with line networks. |
| Invalid Dates | The event's start date is before the event's end date.<br>Note:<br>When you edit an event's start date to be after its end date using the attribute table, they are automatically swapped. |
| Invalid Route Line ID | The route's line ID is invalid. This is applicable to events associated with line networks. |
| Invalid Route Line Order | The route's line order is invalid. This is applicable to events associated with line networks. |
| Invalid Location Route ID | The route location's route ID is invalid (NULL, empty, or invalid value). |
| Invalid Location Measure | At least one of the route location's measure values is invalid. |
| Invalid Route ID | The route location's route ID is invalid (NULL, empty, or invalid value). |
| Measure Extent Out Of Route Measure Range | The route location's shape doesn't exist on the route (the route has no m-values or the route location's measures don't exist on the route). |
| Multiple Route Locations Found | More than one point location was found. Measures may not be unique along the routes. |
| Null Extent | The start measure is equal to the end measure. |
|  |  |
| Parent Event Not Found | The route location's shape was not found because the starting measure and the ending measure are outside the route measures. |
| Partial Match For The From Measure and To Measure | The entire route location's shape was not found. The starting measure and the ending measure are outside the route measure range. |
| Partial Match For The From Measure | The start measure is outside the route measure range. |
| Partial Match For The To Measure | The end measure is outside the route measure range. |
| Reversed Line Order | The starting route does not have a lower line order than the ending route. This is applicable to events associated with line networks. |
| Route Measures Null | The route does not have m-values or the m-values are null. |
| Route Not Found | The route does not exist in the time slice in which the event is active. |
| Route Shape Empty | The route does not have a shape or the shape is empty. |
| Route Not M Aware | The route is not an m-aware polyline. |

### Scenarios for editing line events using the attribute table
The scenarios below detail the results of editing nonspanning event values in the event layer's attribute table.

#### Edit event measures
The following diagram shows the route and its associated event before the edit:
The following table details the route attributes. Valid measures for an event on Route1 must be between 0 and 20, and valid dates must fall on or after 1/1/2000.

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |

The following table details the event before editing using the attribute table:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2005 | <Null> | 10 | 20 | No Error | 800 |

The following diagram shows changing the from measure of the event:
The following table details the event after the measure has changed from 10 to 5, which causes a change in its shape:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2005 | <Null> | 5 | 20 | No Error | 800 |

#### Edit event measures resulting in a location error
The following diagram shows the route and its associated event before the edit:
The following table details the route attributes. Valid measures for an event on Route1 must be between 0 and 20, and valid dates must fall on or after 1/1/2000.

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |

The following table details the event before editing using the attribute table:

| Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 10 | 20 | No Error | 800 |

The following diagram shows the change to the event measures. The to measure was updated to 30, which does not exist on Route1, which results in a Partial Match for To Measure error.
The following table provides an example of the system-provided Partial Match For To Measure value in the Location Error field. The event shape still ends at the end of the route's actual to measure of 20 since 30 is not found.

| Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- |
| Route1 | 1/1/2000 | <Null> | 10 | 30 | Partial Match for To Measure | 800 |

### Scenarios for editing spanning events using the attribute table
The scenarios below detail the results of editing spanning event values in the layer's attribute table.

#### Edit spanning event measures
The following diagram shows the routes and their associated event before the edit:
The following table details the route attributes. Valid measures for an event on LineA must fall between 0 on Route1 and 40 on Route 3, and valid dates must fall on or after 1/1/2000.

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |
| Route2 | 1/1/2000 | <Null> |
| Route3 | 1/1/2000 | <Null> |

The following table details the event before editing using the attribute table. Event1 is a spanning event that has measures from 5 on Route1 to 35 on Route3.

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route3 | 1/1/2000 | <Null> | 5 | 35 | No Error | 800 |

The following diagram shows the routes after the line event (Event1) is updated. The Event1 from measure changed from 5 to 0 on 1/1/2005.
The following table details the event after the measure has changed from 5 to 0 for Route1, which causes a change in its shape. Additionally, the MAOP Design value for the event record has been updated from 800 to 810.

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route3 | 1/1/2005 | <Null> | 0 | 35 | No Error | 810 |

#### Edit spanning event measures resulting in a location error
The following diagram shows the routes and their associated event before the edit:
The following table details the route attributes. Valid measures for an event on LineA must fall between 0 on Route1 and 40 on Route 3, and valid dates must fall on or after 1/1/2000.

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | <Null> |
| Route2 | 1/1/2000 | <Null> |
| Route3 | 1/1/2000 | <Null> |

The following table details the event before editing using the attribute table. Event1 is a spanning event that has measures from 5 on Route1 to 35 on Route3.

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route3 | 1/1/2000 | <Null> | 5 | 35 | No Error | 800 |

During the edit, the Event1 to measure is correctly edited from 35 to 40 on Route3; however, the To Route ID value is inadvertently deleted, which results in an Invalid Location Route ID error for the system-provided Location Error field.
The following diagram shows the routes after the event shape is no longer generated due to the transcription error in the attribute table row:
The following table shows the missing To Route ID value and the To Measure value, which is null:

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 |  | 1/1/2000 | <Null> | 5 | <Null> | Invalid Location Route ID | 800 |

In such cases, review the attribute table and restore any missing or incorrect values to generate the event shape. In this case, reinstate the To Route ID and re-enter the cleared to measure value of 40.

| Event ID | From Route ID | To Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | Route3 | 1/1/2000 | <Null> | 5 | 40 | No Error | 800 |

The following diagram shows the event measure edit after the To Route ID value and the To Measure (40) are restored:

### Time slice an event using the attribute table
Depending on the type of edit made to an event, changes to the event's from and to dates may be required to reflect a real-world change that occurs on a specific date. You can update the from and to dates by either using an existing event record or adding an event record using the same event ID and route ID with different dates to represent a specific time range. Representing changes to an event in this manner is known as time slicing and ensures that event changes are accurately stored for each point in time.
The scenario below details a route that has two time slices and an associated line event whose dates only cover one of the route's time slices. The first route time slice has dates from 1/1/2000 to 12/31/2010, and the second route time slice has dates from 1/1/2012 to <Null>. The event record dates are from 1/1/2000 to 12/31/2010.
The following table details the route attributes, including time slices:

| Route ID | From Date | To Date |
| --- | --- | --- |
| Route1 | 1/1/2000 | 12/31/2010 |
| Route1 | 1/1/2012 | <Null> |

The following table details the event before the edit:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | 12/31/2010 | 10 | 20 | No Error | 800 |

In this case, the explicit to date of Event1 is updated to match both route time slices by changing its To Date to <Null> to match the To Date of the latest time slice of the route.
The following diagram shows the route and the updated event record after the edit:
The following table details the event after the edit. Event1 now has three time slices. The original time slice retains its date range from 1/1/2000 to 12/31/2010, which matches the first time slice of the route. The second time slice has dates from 12/31/2010 to 1/1/2012, but the route doesn't exist between those dates, which results in a Route Not Found error in that time slice. The third time slice has dates from 1/1/2012 to <Null> that match the latest route time slice.

| Event ID | Route ID | From Date | To Date | From Measure | To Measure | Location Error | MAOP Design |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | 12/31/2010 | 10 | 20 | No Error | 800 |
| Event1 | Route1 | 12/31/2010 | 1/1/2012 | 10 | 20 | Route Not Found | 800 |
| Event1 | Route1 | 1/1/2012 | <Null> | 10 | 20 | No Error | 800 |

### Referent offset and event editing using the attribute table
The Pipeline Referencing events data model supports the configuration of referent event fields and their enablement using the Enable Referent Fields tool. Once referent fields are configured and enabled in a layer, referent locations are populated and persisted in that layer when events are added or edited.
When a line event is edited using the attribute table in a referent-enabled layer, the parent LRS Network is used as the FromRefMethod and ToRefMethod values by default, and the route is used as the FromRefLocation and ToRefLocation values. The from and to measures of the line event are used as the FromRefOffset and ToRefOffset values.
If either measure of a line event is updated, the corresponding offset value updates to reflect the new measure.
The example below demonstrates the impact of editing event records in the attribute table.

#### Before event editing with referents
In this example, Event1 is a line event record in a referent-enabled layer. PointEventLayer1 refers to a point event layer as its FromRefMethod and ToRefMethod values and uses a point event in that layer, Point1, as its FromRefLocation and ToRefLocation values.
The following diagram shows the route and its associated events:
The following table provides details about the event referent fields before editing using the attribute table:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| PointEventLayer1 | Point1 | 5 | PointEventLayer1 | Point1 | 15 |

The following table provides details about the default event fields before the edit:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 10 | 20 |

#### After event editing with referents
The following diagram shows the route and its associated events after the edit:
The following table provides details about the event referent fields after the edit:

| FromRefMethod | FromRefLocation | FromRefOffset | ToRefMethod | ToRefLocation | To Ref Offset |
| --- | --- | --- | --- | --- | --- |
| PipeSeriesNetwork | Route1 | 5 | PipeSeriesNetwork | Route1 | 15 |

The following table provides details about the default event fields after the edit:

| Event ID | Route ID | From Date | To Date | From Measure | To Measure |
| --- | --- | --- | --- | --- | --- |
| Event1 | Route1 | 1/1/2000 | <Null> | 5 | 15 |
