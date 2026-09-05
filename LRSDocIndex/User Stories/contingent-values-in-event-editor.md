# Contingent Values in Event Editor User Story

| Field | Value |
| --- | --- |
| **Doc** | 674 · User Story · Enterprise |
| **Product** | Pipeline Referencing |
| **Release** | — |
| **Issues** | — |
| **Source** | [ContingentValuesinEE.pptx](<https://esriis.sharepoint.com/sites/LocationReferencing/Shared%20Documents/General/ContingentValuesinEE.pptx>) |
| **People** | author William Isley · PE — · dev — |
| **Edited** | 2022-03-24 23:23 by Nathan Easley |
| **Extracted** | 2026-09-04 · lane xmlstrip · format 3.0 · prompt v2.0.2 |
| **Keywords** | contingent values · event editor · attribute rules · domain values · event attributes · validation · attribute grid |
| **Tools** | Add Point Events · Add Line Events · Event Replacement · Event Attribute Table · Attribute Set Table · Split Events · Merge Events |

## Summary

This document describes a user story for supporting contingent values in the Event Editor tools and widgets. It outlines the need for attribute grids and tables to honor contingent values configured for LRS events, ensuring attribute integrity according to business rules. The document also includes testing criteria and documentation update instructions related to contingent values.

## Related documents

<!-- related:begin -->
- [Event Editor Stationing Method User Story](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/event-editor-stationing-method.md>) — similar text 0.20 · 2 title words · same kind/surface/folder <!-- rel:682 s=3.774 -->
- [Allow Locks to Transfer between Users in REST and Editing Tools](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/allow-locks-to-transfer-between-users-in-rest-and-editing.md>) — similar text 0.10 · same kind/folder <!-- rel:827 s=3.45 -->
- [Add Line Event to Dominant Route in ArcGIS Pro](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/add-line-event-to-dominant-route-in-pro.md>) — similar text 0.11 · 1 title word · same kind/folder <!-- rel:370 s=3.125 -->
- [Global Check for Unprocessed Edit Log Records Before Allowing Event Edit Within a Version](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/User Stories/global-check-for-unprocessed-edit-log-records-before.md>) — similar text 0.10 · 1 title word · same kind/folder <!-- rel:573 s=2.88 -->
- [Support Core Editing Grid for LRS Route Editing Tools: Test Plan](<https://esriis.sharepoint.com/sites/lrsworkspace/LRS Doc Index/Test Plans/4250-support-core-editing-grid-for-lrs-route-editing-tools-v3.md>) — similar text 0.25 <!-- rel:654 s=2.683 -->
<!-- related:end -->

<!-- docs:begin -->
## Esri documentation

[Event editing using the attribute table](https://doc.esri.com/en/arcgis-pro/latest/help/production/location-referencing-pipelines/event-editing-using-the-attribute-table.html) · [Merge events](https://doc.esri.com/en/arcgis-pro/latest/help/production/roads-highways/merge-events.html)

_No page matched:_ [Add Point Events](https://www.google.com/search?q=%22Add%20Point%20Events%22+site%3Adoc.esri.com) · [Add Line Events](https://www.google.com/search?q=%22Add%20Line%20Events%22+site%3Adoc.esri.com) · [Event Replacement](https://www.google.com/search?q=%22Event%20Replacement%22+site%3Adoc.esri.com) · [Attribute Set Table](https://www.google.com/search?q=%22Attribute%20Set%20Table%22+site%3Adoc.esri.com) · [Split Events](https://www.google.com/search?q=%22Split%20Events%22+site%3Adoc.esri.com)
<!-- docs:end -->

---

## Story
### Contingent Values in EE <!-- slide 1 -->
User Story

### User Story <!-- slide 2 -->
As an event editor, I need to be able to utilize contingent values for my events, so that I can ensure the attributes for events have the correct values that align with my organization’s business rules.

Persona
Event editors are responsible for making edits to event data.  These users may be responsible for a subset of events (like safety or pavement related events) or responsible for all the LRS events in the gdb.  Many organizations are going to adopt attribute rules for their data to ensure integrity of attributes.  Included in these attribute rules are going to be contingent values.  We should support contingent values throughout event editor in the tools/widgets where users can edit event attributes.

## Acceptance Criteria
### Contingent Values in Event Editor <!-- slide 3 -->
- In the attribute grids/tables within Event Editor, we should support contingent values that are configured for any LRS events
- When a contingent value is in place, we should honor those values within our attribute grids/table.  When a domain is selected for one field, utilize the contingent value to determine the list of eligible domain values for other fields that are impacted by the contingent value.
- An example contingent value could be for a coating event.  If a user selects a certain domain value for the material field, then only some of the values for the domain for the coating type field would be available.  Depending on the coating type value selected, only specific domain values from the pipe diameter field would be available.  For more information about contingent values, see https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/contingent-values.htm.
- We should support this for active contingent values; for retired contingent values, we should continue to show the domain following the rules outlined in the help topic in the point above.
- Do this in the following tools/widgets in Event Editor:
  - Add Point Events
  - Add Line Events
  - Event Replacement
  - Event Attribute Table
  - Attribute Set Table
  - Split Events
  - Merge Events

## Testing
<!-- slide 4 -->
- Test in all the widgets/tools in EE outlined in the acceptance criteria
- Ask Jason Schroeder from the solutions team for a copy of the APR only UPDM model/sample data as he has contingent values configured on that model
- Test with both active and retired contingent values
- Have at least one test case where there is a validation attribute rule that would prevent the edit from being committed (contingent values should still drive the domains in the grid/table, but the operation should fail with an attribute rule error message like we already do today)

## Documentation
<!-- slide 5 -->
Update the existing note about domain and subtype support to also mention contingent values are supported for each of the widgets/tools.  See the note in step 14 of https://enterprise.arcgis.com/en/roads-highways/latest/event-editor/adding-linear-events-by-route-and-measure.htm and step 3 of https://enterprise.arcgis.com/en/roads-highways/latest/event-editor/editing-events-in-the-selection-table.htm as an example.

## Assignment
<!-- slide 6 -->
Story Points:
Dev:
PE:
