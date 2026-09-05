# Support updating External Event configuration

| Field | Value |
| --- | --- |
| **Doc** | 744 · User Story · Pro |
| **Product** | Roads & Highways |
| **Release** | — |
| **Issues** | — |
| **Source** | [Support updating External Event configuration.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/Support%20updating%20External%20Event%20configuration.pptx>) |
| **People** | author Nathan Easley · PE — · dev — |
| **Edited** | 2020-12-16 00:03 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | external event · event configuration · relocate events · geoprocessing tool · event behaviors · oracle · sql server |
| **Tools** | Configure External Event |

## Summary

Describes the need for LRS external system data owners to configure and update event data stored outside the LRS geodatabase. Covers the ability to update existing External Event configurations using the Configure External Event geoprocessing tool, including handling events registered with ArcMap and branch versioning. Includes testing scenarios for positive and negative cases and documentation updates.

## Related documents

<!-- related:begin -->
- [Support adding External Event to Pro map/local scene](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-adding-external-event-to-pro-map-local-scene.md>) — similar text 0.64 · 3 title words · 3 filename words · same kind/surface/folder <!-- rel:745 s=6.905 -->
- [Create External Event with No Connection File](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/create-external-event-with-no-connection-file.md>) — similar text 0.23 · 2 title words · 2 filename words · same kind/surface/folder <!-- rel:288 s=4.725 -->
- [Configure External Events](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/Design%20Spikes/configure-external-events.md>) — similar text 0.37 · 1 title word · 1 filename word · same surface/folder <!-- rel:811 s=4.178 -->
- [External system integration with ArcGIS Pipeline Referencing](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/external-system-integration-with-arcgis-apr.md>) — similar text 0.30 · 1 title word · 1 filename word · same kind/surface <!-- rel:242 s=3.991 -->
- [Support External Event Configuration Without Connection File – Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/6159-support-external-event-configuration-without-connection-file.md>) — similar text 0.20 · 4 title words · 1 filename word · same surface <!-- rel:275 s=3.85 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[External event registration](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/external-event-registration.html) · [Event behavior](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/what-is-event-behavior.html)

_No page matched:_ [Configure External Event](https://www.google.com/search?q=%22Configure%20External%20Event%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support updating External Event configuration <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As a LRS external system data owner, I need the ability to configure my event data stored outside the LRS gdb with the LRS, so that the LRS can access my data when providing updates based on LRS edits.

Persona

- LRS external system data owners are typically IT or other managers that work in different departments within a DOT (and pipeline operator) than the LRS editors/group.  These may be members of groups such as safety, road inventory, planning, bridge, or pavement that manage data that needs to be linear referenced but can’t be moved into the same geodatabase as the LRS.  Instead, they store/manage their event attribute data (either spatial or non spatial) in databases that are outside of the LRS geodatabase.  In order to keep their LRS attributes (route and measure) up to date with the authoritative LRS for the organization (Roads and Highways gdb), they need to be able to periodically request updates based on the LRS edits that have taken place.  This sync process is completed via the Relocate Events tool.

## Acceptance Criteria
### Configure External Event with LRS <!-- slide 3 -->
- Support being able to update the configuration for an existing External Event via the Configure External Event gp tool
- When a user chooses the existing event feature class/table (in the external database) and the network in the tool, we should check to see if the event has already been created
- If the event does not exist in the LRS, follow the same pattern from the original Configure External Event user story
- If the event already exists in the LRS, then populate all the other parameters for the tool with the existing mapped fields/configuration
- This should also include any events that were registered with ArcMap and brought over when the LRS gdb is changed to branch versioning and has the LRS controller dataset added

## Testing
<!-- slide 4 -->
- Negative
  - No read access to the existing event
  - Event is not registered with the LRS
  - Event is registered with a different network in the LRS
- Positive
  - Existing event that has fields changed
  - Existing event that has event behaviors changed
- Verify existing external events from ArcMap can have the configuration updated
- Test with Oracle and SQL Server for the input event

## Documentation
<!-- slide 5 -->
- Update the existing Configure External Event gp tool to mention the tool can be used to update the configuration for an existing External Event

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
