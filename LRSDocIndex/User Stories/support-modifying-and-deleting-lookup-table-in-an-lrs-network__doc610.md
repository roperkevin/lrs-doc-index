# Support Modifying and Deleting Lookup Table in an LRS Network

|   |   |
| --- | --- |
| **Kind** | User Story · Pro |
| **Release** | — |
| **Source** | [SupportModifying&DeletingLookupTable.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportModifying%26DeletingLookupTable.pptx>) |
| **Edited** | 2022-09-28 01:13 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane `xmlstrip` |

<!-- metadata
```yaml
title: "Support Modifying and Deleting Lookup Table in an LRS Network"
source_file: "SupportModifying&DeletingLookupTable.pptx"
source_url: "https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/SupportModifying%26DeletingLookupTable.pptx"
doc_id: 610
doc_kind: "User Story"
surface: "Pro"
doc_revision: ""
target_release: ""
pe: ""
dev: ""
author: "William Isley"
last_edited_by: "Nathan Easley"
last_edited: "2022-09-28T01:13:28Z"
extracted: 2026-09-04
extraction_lane: xmlstrip
prompt_version: "v2.0.2"
keywords: ["lookup table", "lrs network", "configure lookup table", "route editing", "create route"]
tools: ["Configure Lookup Table"]
products: []
issues: []
related: [{"doc":877,"file":"remove-lrs-entity-to-support-intersections__doc877.md","s":3.174},{"doc":704,"file":"support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md","s":2.968},{"doc":266,"file":"support-events-spanning-routes-in-update-measures-from-lrs__doc266.md","s":2.878},{"doc":70,"file":"configure-and-modify-route-id-padding-and-lookup-table-settings__doc70.md","s":2.729},{"doc":569,"file":"migrate-lrs-to-new-gdb-tool__doc569.md","s":2.546}]
```
-->

## Summary

This document describes a user story for enabling LRS administrators to update or remove the lookup table configured with an LRS Network. It details requirements for modifying the lookup table via the Configure Lookup Table geoprocessing tool and removing it with a new UI option. Testing, automation, and documentation updates are also outlined to support these capabilities.

## Related documents

<!-- related:begin -->
- [Remove LRS Entity To Support Intersections](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/remove-lrs-entity-to-support-intersections__doc877.md>) — similar text 0.13 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:877 -->
- [Support populating Route Name in Update Measures from LRS tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/support-populating-route-name-in-update-measures-from-lrs-tool__doc704.md>) — similar text 0.19 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:704 -->
- [Support Events Spanning Routes in Update Measures from LRS](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS%20Doc%20Index/User%20Stories/support-events-spanning-routes-in-update-measures-from-lrs__doc266.md>) — similar text 0.16 · 1 title word · 1 filename word · same kind/surface/folder <!-- rel:266 -->
- [Configure and Modify Route ID Padding and Lookup Table Settings](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Other/configure-and-modify-route-id-padding-and-lookup-table-settings__doc70.md>) — similar text 0.19 · 2 title words · same surface <!-- rel:70 -->
- [Migrate LRS to New GDB Tool](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/migrate-lrs-to-new-gdb-tool__doc569.md>) — similar text 0.16 · same kind/surface/folder <!-- rel:569 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[LRS network](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/what-is-an-lrs-network.html) · [Create a route](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/create-a-new-route.html)

_No page matched:_ [Configure Lookup Table](https://www.google.com/search?q=%22Configure%20Lookup%20Table%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Slide 1 — Support modifying and deleting the lookup table in an LRS Network

## Slide 2 — User Story

As an LRS administrator, I need to be able to update or remove the lookup table configured with my LRS Network, so I can point to a new updated table in the gdb or remove it if my organization decides to no longer use one.

Persona
LRS Administrator: This user is responsible for the initial configuration and ongoing changes to the configuration of the LRS.  This can include configuring the lookup table for an LRS Network.  Over time, there could be an updated lookup table provided to the organization or the organization could decide to stop using a lookup table.  Currently there isn’t a way to either update the lookup table or remove it all together from the LRS Network.  This story would allow users to do either option.

## Slide 3 — Modify lookup table

Support being able to update the table used as a lookup table for an LRS Network
In the Configure Lookup Table GP tool, when a user selects an LRS Network, if a lookup table is configured, we should populate the Lookup Table parameter with the current location
Allow users to navigate to another table within the LRS gdb to serve as the new lookup table
All other requirements for the lookup table exist with this updated lookup table (must have a Field the Lookup Table is applied to, a Lookup Key, meets field length and type requirements, etc.)
When the tool is executed with the new lookup table, we should update the lookup table in the metadata in the controller dataset

## Slide 4 — Remove lookup table

Support being able to remove a lookup table for an LRS Network
In the Configure Lookup Table GP tool, when a user selects an LRS Network, if a lookup table is configured, we should populate the Lookup Table parameter with the current location
Add a checkbox at the bottom on the UI called “Remove Existing Lookup Table”
This is an optional parameter that would only appear once the LRS Network is selected and an existing lookup table is in place
When checked, we should clear the parameters other than the LRS Network feature class
When the tool is executed, we should remove the lookup table from being associated with the LRS in the metadata of our controller dataset and no longer require/utilize it in LRS route editing tools such as Create Route

## Slide 5 — Testing

Test updating the lookup table to a new table
Test removing the lookup table
In both scenarios, verify the new lookup table/no lookup table is utilized in Create Route, Realign Route, and Reassign Route
Test with GP UI, python inline, python stand alone, and model builder

## Slide 6 — Automation

Update existing python tests for this tool by adding scenarios to update and remove the lookup table

## Slide 7 — Documentation

Update the existing documentation for the tool to discuss how to update/delete the lookup table

## Slide 8 — Assignment

Story Points:
Dev:
PE:
