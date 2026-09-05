# Support Modifying and Deleting Lookup Table in an LRS Network

| Field | Value |
| --- | --- |
| **Doc** | 610 · User Story · Pro |
| **Product** | — |
| **Release** | — |
| **Issues** | — |
| **Source** | [SupportModifying&DeletingLookupTable.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportModifying%26DeletingLookupTable.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-09-28 01:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | lookup table · lrs network · configure lookup table · route editing · create route |
| **Tools** | Configure Lookup Table |

## Summary

This document describes a user story for enabling LRS administrators to update or remove the lookup table configured with an LRS Network. It details requirements for modifying the lookup table via the Configure Lookup Table geoprocessing tool and removing it with a new UI option. Testing, automation, and documentation updates are also outlined to support these capabilities.

## Related documents

<!-- related:begin -->
- [Remove LRS Entity To Support Intersections](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/remove-lrs-entity-to-support-intersections.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:877 s=3.174 -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:704 s=2.968 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:266 s=2.878 -->
- [Configure and Modify Route ID Padding and Lookup Table Settings](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/6344-configure-and-modify-route-id-padding-and-lookup-table.md>) — similar text 0.19 · 2 title words · same surface <!-- rel:70 s=2.729 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:569 s=2.546 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html)

_No page matched:_ [Configure Lookup Table](https://www.google.com/search?q=%22Configure%20Lookup%20Table%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Support modifying and deleting the lookup table in an LRS Network <!-- slide 1 -->

### User Story <!-- slide 2 -->
As an LRS administrator, I need to be able to update or remove the lookup table configured with my LRS Network, so I can point to a new updated table in the gdb or remove it if my organization decides to no longer use one.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  This can include configuring the lookup table for an LRS Network.  Over time, there could be an updated lookup table provided to the organization or the organization could decide to stop using a lookup table.  Currently there isn’t a way to either update the lookup table or remove it all together from the LRS Network.  This story would allow users to do either option.

## Acceptance Criteria
### Modify lookup table <!-- slide 3 -->
- Support being able to update the table used as a lookup table for an LRS Network
- In the Configure Lookup Table GP tool, when a user selects an LRS Network, if a lookup table is configured, we should populate the Lookup Table parameter with the current location
- Allow users to navigate to another table within the LRS gdb to serve as the new lookup table
- All other requirements for the lookup table exist with this updated lookup table (must have a Field the Lookup Table is applied to, a Lookup Key, meets field length and type requirements, etc.)
- When the tool is executed with the new lookup table, we should update the lookup table in the metadata in the controller dataset

### Remove lookup table <!-- slide 4 -->
- Support being able to remove a lookup table for an LRS Network
- In the Configure Lookup Table GP tool, when a user selects an LRS Network, if a lookup table is configured, we should populate the Lookup Table parameter with the current location
- Add a checkbox at the bottom on the UI called “Remove Existing Lookup Table”
- This is an optional parameter that would only appear once the LRS Network is selected and an existing lookup table is in place
- When checked, we should clear the parameters other than the LRS Network feature class
- When the tool is executed, we should remove the lookup table from being associated with the LRS in the metadata of our controller dataset and no longer require/utilize it in LRS route editing tools such as Create Route

## Testing
<!-- slide 5 -->
- Test updating the lookup table to a new table
- Test removing the lookup table
- In both scenarios, verify the new lookup table/no lookup table is utilized in Create Route, Realign Route, and Reassign Route
- Test with GP UI, python inline, python stand alone, and model builder

## Automation
<!-- slide 6 -->
Update existing python tests for this tool by adding scenarios to update and remove the lookup table

## Documentation
<!-- slide 7 -->
Update the existing documentation for the tool to discuss how to update/delete the lookup table

## Assignment
<!-- slide 8 -->
Story Points:
Dev:
PE:
